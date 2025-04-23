from fastapi import FastAPI, Depends, Security, HTTPException, status, Request, Form, Cookie, Header
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List, Dict, Annotated
from datetime import datetime, timedelta
import json
import uuid
from urllib.parse import urlencode
# from jose import jwt, JWTError
import jwt
from db import get_async_session, User, OAuthClient, AuthorizationCode, RefreshToken, AuthToken
from oauth2 import create_access_token, create_refresh_token, validate_token, revoke_token
from config import settings
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
app = FastAPI(title="EtudeAuth - Система документооборота OAuth")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

# Настраиваем CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Настраиваем шаблоны
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

# Временное хранилище кодов авторизации (в продакшене использовать Redis)
# auth_codes = {}

async def get_user(email: str, db: AsyncSession):
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user:
        return None
    if user.disabled:
        return None

    return user

async def get_current_user(
        security_scopes: SecurityScopes,
        token: Annotated[str, Depends(oauth2_scheme)],
        db: Annotated[AsyncSession, Depends(get_async_session)]
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_data = validate_token(token, security_scopes)

    if token_data is None:
        raise credentials_exception

    user = await get_user(email=token_data.sub, db=db)

    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: Annotated[User, Security(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Аутентификация пользователя (пример - в продакшене использовать БД)
async def authenticate_user(db: AsyncSession, email: str, password: str):
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user:
        return False
    if user.disabled:
        return False

    # В реальном приложении здесь должна быть проверка хеша пароля
    # Для примера можно добавить такую проверку:
    # import hashlib
    # hashed_input = hashlib.sha256(password.encode()).hexdigest()
    # if user.hashed_password != hashed_input:
    #    return False

    return user


# Проверка клиента OAuth
async def validate_client(db: AsyncSession, client_id: str, redirect_uri: str):
    stmt = select(OAuthClient).where(OAuthClient.client_id == client_id)
    result = await db.execute(stmt)
    client = result.scalars().first()

    if not client:
        return False
    if redirect_uri not in client.redirect_uris.split(","):
        return False
    return client


# Главная страница
@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


# Эндпоинт авторизации с лучшей обработкой ошибок
@app.get("/oauth/authorize", response_class=HTMLResponse)
async def authorize(
        request: Request,
        response_type: Optional[str] = None,
        client_id: Optional[str] = None,
        redirect_uri: Optional[str] = None,
        scope: str = "profile",
        state: Optional[str] = None,
        db: AsyncSession = Depends(get_async_session)
):
    # Проверка необходимых параметров
    if not response_type:
        return templates.TemplateResponse(
            "login.html",
            {
                "request": request,
                "error": "Отсутствует обязательный параметр response_type",
                "client_id": client_id or "",
                "redirect_uri": redirect_uri or "",
                "state": state or "",
                "scope": scope,
                "client_name": "Неизвестное приложение",
                "scopes": scope.split()
            }
        )

    if not client_id:
        return templates.TemplateResponse(
            "login.html",
            {
                "request": request,
                "error": "Отсутствует обязательный параметр client_id",
                "client_id": "",
                "redirect_uri": redirect_uri or "",
                "state": state or "",
                "scope": scope,
                "client_name": "Неизвестное приложение",
                "scopes": scope.split()
            }
        )

    if not redirect_uri:
        return templates.TemplateResponse(
            "login.html",
            {
                "request": request,
                "error": "Отсутствует обязательный параметр redirect_uri",
                "client_id": client_id,
                "redirect_uri": "",
                "state": state or "",
                "scope": scope,
                "client_name": "Неизвестное приложение",
                "scopes": scope.split()
            }
        )

    # Проверяем, что клиент зарегистрирован
    if client_id not in settings.OAUTH_CLIENTS:
        return templates.TemplateResponse(
            "login.html",
            {
                "request": request,
                "error": "Недействительный client_id",
                "client_id": client_id,
                "redirect_uri": redirect_uri,
                "state": state or "",
                "scope": scope,
                "client_name": "Неизвестное приложение",
                "scopes": scope.split()
            }
        )

    client = settings.OAUTH_CLIENTS[client_id]

    # Проверяем redirect_uri
    if redirect_uri not in client["redirect_uris"]:
        return templates.TemplateResponse(
            "login.html",
            {
                "request": request,
                "error": "Недействительный redirect_uri",
                "client_id": client_id,
                "redirect_uri": redirect_uri,
                "state": state or "",
                "scope": scope,
                "client_name": client["name"] if "name" in client else client_id,
                "scopes": scope.split()
            }
        )

    # Проверяем, что используется code flow
    if response_type != "code":
        return templates.TemplateResponse(
            "login.html",
            {
                "request": request,
                "error": "Поддерживается только flow authorization_code",
                "client_id": client_id,
                "redirect_uri": redirect_uri,
                "state": state or "",
                "scope": scope,
                "client_name": client["name"] if "name" in client else client_id,
                "scopes": scope.split()
            }
        )

    # Разбиваем scope на отдельные разрешения
    scopes = scope.split()

    # Проверяем, что запрашиваемые scopes разрешены для клиента
    invalid_scopes = [s for s in scopes if s not in client["allowed_scopes"]]
    if invalid_scopes:
        return templates.TemplateResponse(
            "login.html",
            {
                "request": request,
                "error": f"Scope(s) '{', '.join(invalid_scopes)}' не разрешены для данного клиента",
                "client_id": client_id,
                "redirect_uri": redirect_uri,
                "state": state or "",
                "scope": scope,
                "client_name": client["name"] if "name" in client else client_id,
                "scopes": scopes
            }
        )

    # Отображаем страницу авторизации
    return templates.TemplateResponse(
        "login.html",
        {
            "request": request,
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "state": state if state else "",
            "scope": scope,
            "client_name": client["name"] if "name" in client else client_id,
            "scopes": scopes,
            "error": None
        }
    )


# Исправленная функция login с правильным запросом к базе данных
@app.post("/oauth/login")
async def login(
        request: Request,
        email: Optional[str] = Form(None),
        password: Optional[str] = Form(None),
        client_id: str = Form(...),
        redirect_uri: str = Form(...),
        scope: str = Form("profile"),
        state: Optional[str] = Form(None),
        db: AsyncSession = Depends(get_async_session)
):
    # Проверка наличия обязательных полей
    if not email or not password:
        return templates.TemplateResponse(
            "login.html",
            {
                "request": request,
                "client_id": client_id,
                "redirect_uri": redirect_uri,
                "state": state if state else "",
                "scope": scope,
                "error": "Введите email и пароль",
                "client_name": settings.OAUTH_CLIENTS[client_id]["name"] if "name" in settings.OAUTH_CLIENTS[
                    client_id] else client_id,
                "scopes": scope.split()
            },
            status_code=400
        )

    try:
        # Проверяем, что клиент существует
        if client_id not in settings.OAUTH_CLIENTS:
            return templates.TemplateResponse(
                "login.html",
                {
                    "request": request,
                    "client_id": client_id,
                    "redirect_uri": redirect_uri,
                    "state": state if state else "",
                    "scope": scope,
                    "error": "Недействительный client_id",
                    "client_name": "Неизвестное приложение",
                    "scopes": scope.split()
                },
                status_code=400
            )

        # Аутентификация пользователя
        # Исправленный запрос к базе данных
        stmt = select(User).where(User.email == email)
        result = await db.execute(stmt)
        user = result.scalars().first()

        if not user:
            return templates.TemplateResponse(
                "login.html",
                {
                    "request": request,
                    "client_id": client_id,
                    "redirect_uri": redirect_uri,
                    "state": state if state else "",
                    "scope": scope,
                    "error": "Пользователь с таким email не найден",
                    "client_name": settings.OAUTH_CLIENTS[client_id]["name"] if "name" in settings.OAUTH_CLIENTS[
                        client_id] else client_id,
                    "scopes": scope.split()
                },
                status_code=400
            )

        # Простая проверка пароля (исправлено преобразование типов)
        import hashlib
        hashed_input = hashlib.sha256(password.encode()).hexdigest()

        if user.hashed_password != hashed_input:
            return templates.TemplateResponse(
                "login.html",
                {
                    "request": request,
                    "client_id": client_id,
                    "redirect_uri": redirect_uri,
                    "state": state if state else "",
                    "scope": scope,
                    "error": "Неверный пароль",
                    "client_name": settings.OAUTH_CLIENTS[client_id]["name"] if "name" in settings.OAUTH_CLIENTS[
                        client_id] else client_id,
                    "scopes": scope.split()
                },
                status_code=400
            )

        if user.disabled:
            return templates.TemplateResponse(
                "login.html",
                {
                    "request": request,
                    "client_id": client_id,
                    "redirect_uri": redirect_uri,
                    "state": state if state else "",
                    "scope": scope,
                    "error": "Аккаунт отключен",
                    "client_name": settings.OAUTH_CLIENTS[client_id]["name"] if "name" in settings.OAUTH_CLIENTS[
                        client_id] else client_id,
                    "scopes": scope.split()
                },
                status_code=400
            )

        # Генерируем код авторизации
        code = str(uuid.uuid4())

        # Сохраняем код в временное хранилище (в продакшене использовать Redis/БД)
        auth_code = AuthToken(
            code=code,
            email=email,
            client_id=client_id,
            scopes=scope.split(),
            redirect_uri=redirect_uri,
            expires_at=datetime.utcnow() + timedelta(minutes=10)
        )
        db.add(auth_code)
        await db.commit()

        # auth_codes[code] = {
        #     "email": email,
        #     "client_id": client_id,
        #     "scopes": scope.split(),
        #     "redirect_uri": redirect_uri,
        #     "expires_at": datetime.utcnow() + timedelta(minutes=10)  # код действителен 10 минут
        # }

        # Создаем параметры для редиректа
        params = {"code": code}
        if state:
            params["state"] = state

        # Формируем URL для редиректа
        redirect_url = f"{redirect_uri}?{urlencode(params)}"

        # Перенаправляем на redirect_uri с кодом авторизации
        return RedirectResponse(url=redirect_url, status_code=303)

    except Exception as e:
        # Логирование ошибки
        print(f"Error during login: {str(e)}")

        # Отображаем пользователю страницу с ошибкой
        return templates.TemplateResponse(
            "login.html",
            {
                "request": request,
                "client_id": client_id,
                "redirect_uri": redirect_uri,
                "state": state if state else "",
                "scope": scope,
                "error": "Произошла ошибка при авторизации. Пожалуйста, попробуйте снова позже.",
                "client_name": settings.OAUTH_CLIENTS[client_id][
                    "name"] if client_id in settings.OAUTH_CLIENTS and "name" in settings.OAUTH_CLIENTS[
                    client_id] else client_id,
                "scopes": scope.split()
            },
            status_code=500
        )


# Обмен кода авторизации на токены
@app.post("/oauth/token")
async def token(
        grant_type: str = Form(...),
        client_id: str = Form(...),
        client_secret: str = Form(...),
        code: Optional[str] = Form(None),
        redirect_uri: Optional[str] = Form(None),
        refresh_token: Optional[str] = Form(None),
        db: AsyncSession = Depends(get_async_session)
):
    # Проверяем клиента
    if client_id not in settings.OAUTH_CLIENTS or settings.OAUTH_CLIENTS[client_id]["client_secret"] != client_secret:
        return JSONResponse(
            content={"error": "invalid_client", "error_description": "Invalid client credentials"},
            status_code=401
        )

    if grant_type == "authorization_code":
        # Проверяем код авторизации
        stmt = select(AuthToken).where(AuthToken.code == code)
        result = await db.execute(stmt)
        res_code = result.scalars().first()

        if code != res_code.code:
            return JSONResponse(
                content={"error": "invalid_grant", "error_description": "Invalid authorization code"},
                status_code=400
            )


        stmt = select(AuthToken).where(AuthToken.code == code)
        result = await db.execute(stmt)
        code_data = result.scalars().first()

        # Проверяем время жизни кода
        if datetime.utcnow() > code_data.expires_at:
            #del auth_codes[code]  # Удаляем просроченный код
            return JSONResponse(
                content={"error": "invalid_grant", "error_description": "Authorization code expired"},
                status_code=400
            )

        # Проверяем redirect_uri
        if code_data.redirect_uri != redirect_uri:
            return JSONResponse(
                content={"error": "invalid_grant", "error_description": "Redirect URI mismatch"},
                status_code=400
            )

        # Проверяем client_id
        if code_data.client_id != client_id:
            return JSONResponse(
                content={"error": "invalid_grant", "error_description": "Client ID mismatch"},
                status_code=400
            )

        # Создаем токены
        access_token_data = {
            "sub": code_data.email,
            "scopes": code_data.scopes,
            "client_id": client_id
        }

        access_token = create_access_token(access_token_data)
        refresh_token_value = create_refresh_token(access_token_data)

        # Сохраняем refresh token в БД
        db_refresh_token = RefreshToken(
            token=refresh_token_value,
            email=code_data.email,
            scopes=",".join(code_data.scopes),
            client_id=client_id
        )
        db.add(db_refresh_token)
        await db.commit()

        # Удаляем использованный код авторизации
        #del auth_codes[code]

        # Возвращаем токены
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": settings.JWT_ACCESS_TTL,
            "refresh_token": refresh_token_value,
            "scope": " ".join(code_data.scopes)
        }

    elif grant_type == "refresh_token":
        # Проверяем refresh token - исправленный код
        stmt = select(RefreshToken).where(RefreshToken.token == refresh_token)
        result = await db.execute(stmt)
        refresh_token_obj = result.scalars().first()

        if not refresh_token_obj:
            return JSONResponse(
                content={"error": "invalid_grant", "error_description": "Invalid refresh token"},
                status_code=400
            )

        # Проверяем client_id
        if refresh_token_obj.client_id != client_id:
            return JSONResponse(
                content={"error": "invalid_grant", "error_description": "Client ID mismatch"},
                status_code=400
            )

        # Создаем новый access token
        access_token_data = {
            "sub": refresh_token_obj.email,
            "scopes": refresh_token_obj.scopes.split(","),
            "client_id": client_id
        }

        new_access_token = create_access_token(access_token_data)

        # Возвращаем новый access token
        return {
            "access_token": new_access_token,
            "token_type": "bearer",
            "expires_in": settings.JWT_ACCESS_TTL,
            "scope": refresh_token_obj.scopes
        }

    else:
        return JSONResponse(
            content={"error": "unsupported_grant_type", "error_description": "Unsupported grant type"},
            status_code=400
        )


# Эндпоинт для проверки токена
@app.post("/api/token/validate")
async def validate_token_endpoint(
        token: str = Form(...),
        required_scopes: Optional[str] = Form(None),
        db: AsyncSession = Depends(get_async_session)
):
    # Проверяем токен
    token_data = validate_token(token, required_scopes.split() if required_scopes else None)
    if not token_data:
        return JSONResponse(
            content={"valid": False, "reason": "Invalid token"},
            status_code=200
        )

    # Получаем информацию о пользователе - исправленный запрос
    stmt = select(User).where(User.email == token_data.sub)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user or user.disabled:
        return JSONResponse(
            content={"valid": False, "reason": "User not found or disabled"},
            status_code=200
        )

    # Возвращаем информацию о валидности токена
    return JSONResponse(
        content={
            "valid": True,
            "user": {
                "email": user.email,
                "full_name": user.full_name
            },
            "scopes": token_data.scopes,
            "expires_at": token_data.exp.timestamp() if token_data.exp else None
        },
        status_code=200
    )


# Эндпоинт для отзыва токена
@app.post("/oauth/revoke")
async def revoke_token_endpoint(
        token: str = Form(...),
        client_id: str = Form(...),
        client_secret: str = Form(...),
        db: AsyncSession = Depends(get_async_session)
):
    # Проверяем клиента
    if client_id not in settings.OAUTH_CLIENTS or settings.OAUTH_CLIENTS[client_id]["client_secret"] != client_secret:
        return JSONResponse(
            content={"error": "invalid_client", "error_description": "Invalid client credentials"},
            status_code=401
        )

    # Отзываем токен
    if revoke_token(token):
        return JSONResponse(content={"success": True}, status_code=200)
    else:
        return JSONResponse(content={"success": False}, status_code=400)


# Исправленный код для получения информации о пользователе
@app.get("/api/user/me")
async def get_user_info(
        request: Request,
        current_user: Annotated[User, Security(get_current_active_user, scopes=["profile"])],
        db: AsyncSession = Depends(get_async_session)
):
    # Возвращаем информацию о пользователе
    return {
        "email": current_user.email,
        "full_name": current_user.full_name,
        "scopes": ["profile"],
    }


# API для получения списка документов
# API для получения списка документов - исправленный код
@app.get("/api/documents")
async def get_documents(
        request: Request,
        db: AsyncSession = Depends(get_async_session),
        authorization: Optional[str] = Header(None)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"}
        )

    try:
        auth_parts = authorization.split(" ")
        if len(auth_parts) < 2:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization format",
                headers={"WWW-Authenticate": "Bearer"}
            )
        token = auth_parts[1]
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization format",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token_data = validate_token(token, ["documents"])

    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # В реальном приложении здесь был бы запрос к БД
    # Для демонстрации возвращаем фиктивные данные
    return [
        {
            "id": 1,
            "title": "Квартальный отчет",
            "created_at": datetime.utcnow() - timedelta(days=5),
            "type": "report"
        },
        {
            "id": 2,
            "title": "Техническое задание",
            "created_at": datetime.utcnow() - timedelta(days=2),
            "type": "task"
        }
    ]


# API для получения конкретного документа
@app.get("/api/documents/{document_id}")
async def get_document(
        document_id: int,
        request: Request,
        db: AsyncSession = Depends(get_async_session),
        authorization: Optional[str] = Header(None)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"}
        )

    try:
        auth_parts = authorization.split(" ")
        if len(auth_parts) < 2:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization format",
                headers={"WWW-Authenticate": "Bearer"}
            )
        token = auth_parts[1]
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization format",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token_data = validate_token(token, ["documents"])

    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # В реальном приложении здесь был бы запрос к БД
    # Для демонстрации возвращаем фиктивные данные
    if document_id == 1:
        return {
            "id": 1,
            "title": "Квартальный отчет",
            "content": "Содержание квартального отчета...",
            "created_at": datetime.utcnow() - timedelta(days=5),
            "type": "report"
        }
    elif document_id == 2:
        return {
            "id": 2,
            "title": "Техническое задание",
            "content": "Содержание технического задания...",
            "created_at": datetime.utcnow() - timedelta(days=2),
            "type": "task"
        }
    else:
        raise HTTPException(status_code=404, detail="Document not found")


# API для создания документа
@app.post("/api/documents")
async def create_document(
        request: Request,
        title: str = Form(...),
        content: str = Form(...),
        db: AsyncSession = Depends(get_async_session),
        authorization: Optional[str] = Header(None)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header",
            headers={"WWW-Authenticate": "Bearer"}
        )

    try:
        auth_parts = authorization.split(" ")
        if len(auth_parts) < 2:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authorization format",
                headers={"WWW-Authenticate": "Bearer"}
            )
        token = auth_parts[1]
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization format",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token_data = validate_token(token, ["documents", "write"])

    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token or insufficient permissions",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Получаем пользователя из БД
    stmt = select(User).where(User.email == token_data.sub)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # В реальном приложении здесь был бы запрос к БД для сохранения документа
    # Для демонстрации создаем новый документ
    new_document = {
        "id": 3,
        "title": title,
        "content": content,
        "created_at": datetime.utcnow(),
        "type": "document",
        "owner_id": user.id
    }

    # Здесь в реальном приложении вы сохранили бы документ в БД
    # document = Document(
    #     title=title,
    #     content=content,
    #     type="document",
    #     owner_id=user.id
    # )
    # db.add(document)
    # await db.commit()
    # await db.refresh(document)

    return new_document


# Модель для запроса регистрации
@app.get("/register", response_class=HTMLResponse)
async def register_form(request: Request):
    """Отображает форму регистрации нового пользователя"""
    return templates.TemplateResponse(
        "register.html",
        {
            "request": request,
            "error": None
        }
    )


# Исправленный код регистрации пользователя
@app.post("/register")
async def register(
        request: Request,
        email: str = Form(...),
        full_name: str = Form(...),
        password: str = Form(...),
        password_confirm: str = Form(...),
        db: AsyncSession = Depends(get_async_session)
):
    """Регистрирует нового пользователя в системе"""
    # Проверяем, совпадают ли пароли
    if password != password_confirm:
        return templates.TemplateResponse(
            "register.html",
            {
                "request": request,
                "error": "Пароли не совпадают",
                "email": email,
                "full_name": full_name
            },
            status_code=400
        )

    # Проверяем, что пользователь с таким email не существует
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    existing_user = result.scalars().first()

    if existing_user:
        return templates.TemplateResponse(
            "register.html",
            {
                "request": request,
                "error": "Пользователь с таким email уже существует",
                "email": email,
                "full_name": full_name
            },
            status_code=400
        )

    try:
        # В реальном приложении нужно хешировать пароль
        # Для примера используем простой хеш
        import hashlib
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        # Создаем нового пользователя
        new_user = User(
            email=email,
            full_name=full_name,
            hashed_password=hashed_password,
            disabled=False,
            created_at=datetime.utcnow()
        )

        db.add(new_user)
        await db.commit()

        # Переадресуем на страницу успешной регистрации
        return templates.TemplateResponse(
            "register_success.html",
            {"request": request, "email": email}
        )
    except Exception as e:
        await db.rollback()
        return templates.TemplateResponse(
            "register.html",
            {
                "request": request,
                "error": f"Ошибка при регистрации: {str(e)}",
                "email": email,
                "full_name": full_name
            },
            status_code=500
        )

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)