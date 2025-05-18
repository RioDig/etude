import asyncio
import hashlib

from fastapi import FastAPI, Depends, Security, HTTPException, status, Request, Form,Header, BackgroundTasks
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional, List, Annotated
from datetime import datetime, timedelta
import uuid
from uuid import UUID
from urllib.parse import urlencode
from db import get_async_session, User, OAuthClient, RefreshToken, AuthToken, Document, \
    Company, Department
from models import CompanyInDB, CompanyCreate, CompanyWithDepartments, CompanyUpdate, UserResponse, UserInDB, \
    DepartmentWithEmployees, DepartmentInDB, DepartmentUpdate, DepartmentCreate, UserUpdate, UserCreate, DocumentInDB, \
    DocumentCreate, DocumentResponse, DocumentUpdate, TokenResponse, EmailLoginRequest, OrganizationStructure
from oauth2 import create_access_token, create_refresh_token, validate_token, revoke_token
from config import settings
from fastapi.security import OAuth2PasswordBearer
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

async def get_user(email: str, db: AsyncSession):
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user:
        return None

    return user


async def get_current_user(
        token: str = Depends(oauth2_scheme),
        db: AsyncSession = Depends(get_async_session)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    # Вызываем validate_token без указания scopes
    token_data = validate_token(token)

    if token_data is None:
        raise credentials_exception

    user = await get_user(email=token_data.sub, db=db)

    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(
        current_user: User = Depends(get_current_user),
):
    # Удаляем проверку на disabled, так как мы решили убрать это поле
    return current_user

# Аутентификация пользователя (пример - в продакшене использовать БД)
async def authenticate_user(db: AsyncSession, email: str, password: str):
    stmt = select(User).where(User.email == email)
    result = await db.execute(stmt)
    user = result.scalars().first()

    if not user:
        return False

    hashed_input = hashlib.sha256(password.encode()).hexdigest()
    if user.hashed_password != hashed_input:
        return False

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


# Эндпоинт авторизации
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
    # Логирование для отладки
    print(f"OAuth authorize request: client_id={client_id}, redirect_uri={redirect_uri}, scope={scope}, state={state}")
    
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

    # Отображаем страницу авторизации с явной передачей state
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


# Обработка формы входа с сохранением state
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
    # Логирование для отладки
    print(f"OAuth login form submitted: client_id={client_id}, redirect_uri={redirect_uri}, scope={scope}, state={state}")
    
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

        # Создаем параметры для редиректа
        params = {"code": code}
        if state:
            params["state"] = state
            print(f"Including state in redirect params: {state}")

        # Формируем URL для редиректа
        redirect_url = f"{redirect_uri}?{urlencode(params)}"
        print(f"Redirecting to: {redirect_url}")

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

        if not res_code or code != res_code.code:
            return JSONResponse(
                content={"error": "invalid_grant", "error_description": "Invalid authorization code"},
                status_code=400
            )

        stmt = select(AuthToken).where(AuthToken.code == code)
        result = await db.execute(stmt)
        code_data = result.scalars().first()

        # Проверяем время жизни кода
        if datetime.utcnow() > code_data.expires_at:
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


    # Возвращаем информацию о валидности токена
    return JSONResponse(
        content={
            "valid": True,
            "user": {
                "email": user.email,
                "full_name": f"{user.surname}" + f"{user.name}" + f"{user.patronymic}"
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


# Получение информации о пользователе
@app.get("/api/user/me")
async def get_user_info(
        request: Request,
        current_user: Annotated[User, Security(get_current_active_user, scopes=["profile"])],
        db: AsyncSession = Depends(get_async_session)
):
    # Возвращаем информацию о пользователе
    return {
        "id": current_user.id,
        "name": current_user.name,
        "surname": current_user.surname,
        "patronymic": current_user.patronymic,
        "org_email": current_user.email,
        "position": current_user.position,
    }


# API для получения списка документов
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
        name: str = Form(...),
        surname: str = Form(...),
        patronymic: str = Form(...),
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
                "name": name,
                "surname": surname,
                "patronymic": patronymic,
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
                "name": name,
                "surname": surname,
                "patronymic": patronymic,
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
            org_email= email,
            hashed_password=hashed_password,
            name = name,
            surname = surname,
            patronymic = patronymic,
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
                "name": name,
                "surname": surname,
                "patronymic": patronymic,
            },
            status_code=500
        )


AUTO_APPROVAL_TIME = 300  # 5 минут


# Функция фонового задания для автоматического согласования документов
async def auto_approve_document(document_id: int, db: AsyncSession  = Depends(get_async_session)):
    await asyncio.sleep(AUTO_APPROVAL_TIME)

    document = await db.get(Document, document_id)
    if document and not document.isApproval:
        document.isApproval = True
        db.add(document)
        await db.commit()


# CRUD для Company
@app.post("/api/companies/", response_model=CompanyInDB, status_code=status.HTTP_201_CREATED)
async def create_company(company: CompanyCreate, db: AsyncSession = Depends(get_async_session)):
    db_company = Company(**company.model_dump())
    db.add(db_company)
    await db.commit()
    await db.refresh(db_company)
    return db_company


@app.get("/api/companies/", response_model=List[CompanyInDB])
async def read_companies(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_async_session)):
    companies = await db.execute(select(Company).offset(skip).limit(limit))
    companies = companies.scalars().all()
    return companies


@app.get("/api/companies/{company_id}", response_model=CompanyWithDepartments)
async def read_company(company_id: int, db: AsyncSession = Depends(get_async_session)):
    company = await db.execute(select(Company).filter(Company.id == company_id))
    company = company.scalars().first()
    if company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@app.put("/api/companies/{company_id}", response_model=CompanyInDB)
async def update_company(company_id: int, company: CompanyUpdate, db: AsyncSession = Depends(get_async_session)):
    db_company = await db.execute(select(Company).filter(Company.id == company_id))
    db_company = db_company.scalars().first()
    if db_company is None:
        raise HTTPException(status_code=404, detail="Company not found")

    update_data = company.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_company, key, value)

    db.add(db_company)
    await db.commit()
    await db.refresh(db_company)
    return db_company


@app.delete("/api/companies/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_company(company_id: int, db: AsyncSession = Depends(get_async_session)):
    db_company = await db.execute(select(Company).filter(Company.id == company_id))
    db_company = db_company.scalars().first()
    if db_company is None:
        raise HTTPException(status_code=404, detail="Company not found")

    await db.delete(db_company)
    await db.commit()
    return None


# CRUD для Department
@app.post("/api/departments/", response_model=DepartmentInDB, status_code=status.HTTP_201_CREATED)
async def create_department(
        department: DepartmentCreate,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_async_session)
):
    # Проверяем, существует ли компания
    company_query = select(Company).where(Company.id == department.company_id)
    result = await db.execute(company_query)
    company = result.scalars().first()

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company with id {department.company_id} not found"
        )

    db_department = Department(**department.model_dump())
    db.add(db_department)
    await db.commit()
    await db.refresh(db_department)
    return db_department


@app.get("/api/departments/", response_model=List[DepartmentInDB])
async def read_departments(
        current_user: User = Depends(get_current_active_user),
        skip: int = 0,
        limit: int = 100,
        company_id: Optional[int] = None,
        db: AsyncSession = Depends(get_async_session)
):
    query = select(Department)

    # Фильтрация по компании, если указан company_id
    if company_id:
        query = query.where(Department.company_id == company_id)

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    departments = result.scalars().all()
    return departments


@app.get("/api/departments/{department_id}", response_model=DepartmentWithEmployees)
async def read_department(
        department_id: int,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_async_session)
):
    # Запрос департамента с присоединением данных о компании и сотрудниках
    query = select(Department).where(Department.id == department_id)
    result = await db.execute(query)
    department = result.scalars().first()

    if department is None:
        raise HTTPException(status_code=404, detail="Department not found")

    # Получаем компанию
    company_query = select(Company).where(Company.id == department.company_id)
    company_result = await db.execute(company_query)
    company = company_result.scalars().first()

    # Получаем сотрудников
    employees_query = select(User).where(User.department_id == department_id)
    employees_result = await db.execute(employees_query)
    employees = employees_result.scalars().all()

    # Формируем ответ
    response = DepartmentWithEmployees(
        id=department.id,
        name=department.name,
        company_id=department.company_id,
        company=company,
        employees=employees
    )

    return response


@app.put("/api/departments/{department_id}", response_model=DepartmentInDB)
async def update_department(
        department_id: int,
        department: DepartmentUpdate,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_async_session)
):
    # Проверяем существование департамента
    department_query = select(Department).where(Department.id == department_id)
    result = await db.execute(department_query)
    db_department = result.scalars().first()

    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")

    # Проверяем существование компании, если она указана
    if department.company_id is not None:
        company_query = select(Company).where(Company.id == department.company_id)
        company_result = await db.execute(company_query)
        company = company_result.scalars().first()

        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Company with id {department.company_id} not found"
            )

    # Обновляем поля департамента
    update_data = department.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_department, key, value)

    db.add(db_department)
    await db.commit()
    await db.refresh(db_department)
    return db_department


@app.delete("/api/departments/{department_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_department(
        department_id: int,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_async_session)
):
    # Проверяем существование департамента
    department_query = select(Department).where(Department.id == department_id)
    result = await db.execute(department_query)
    db_department = result.scalars().first()

    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")

    # Проверяем, есть ли в департаменте сотрудники
    employees_query = select(User).where(User.department_id == department_id)
    employees_result = await db.execute(employees_query)
    employees = employees_result.scalars().all()

    if employees:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete department with existing employees. Reassign employees first."
        )

    await db.delete(db_department)
    await db.commit()
    return None


# CRUD для User
@app.post("/api/users/", response_model=UserInDB, status_code=status.HTTP_201_CREATED)
async def create_user(
        user: UserCreate,
        db: AsyncSession = Depends(get_async_session)
):
    # Проверяем, существует ли пользователь с таким email
    user_query = select(User).where(User.org_email == user.org_email)
    user_result = await db.execute(user_query)
    existing_user = user_result.scalars().first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User with email {user.org_email} already exists"
        )

    # Проверяем существование департамента, если он указан
    if user.department_id:
        department_query = select(Department).where(Department.id == user.department_id)
        department_result = await db.execute(department_query)
        department = department_result.scalars().first()

        if not department:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Department with id {user.department_id} not found"
            )

    # Хэшируем пароль перед сохранением
    import hashlib
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()

    # Создаем пользователя
    db_user = User(
        org_email=user.org_email,
        email=user.org_email,  # Дублируем для совместимости
        name=user.name,
        surname=user.surname,
        patronymic=user.patronymic,
        position=user.position,
        hashed_password=hashed_password,
        EtudeID=user.EtudeID,
        department_id=user.department_id
    )

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


@app.get("/api/users/", response_model=List[UserResponse])
async def read_users(
        current_user: User = Depends(get_current_active_user),
        skip: int = 0,
        limit: int = 100,
        department_id: Optional[int] = None,
        db: AsyncSession = Depends(get_async_session)
):
    query = select(User)

    # Фильтрация по департаменту, если указан department_id
    if department_id:
        query = query.where(User.department_id == department_id)

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    users = result.scalars().all()

    # Получаем имена департаментов для каждого пользователя
    user_responses = []
    for user in users:
        user_dict = UserInDB.model_validate(user).model_dump()

        # Добавляем имя департамента, если пользователь привязан к департаменту
        if user.department_id:
            department_query = select(Department).where(Department.id == user.department_id)
            department_result = await db.execute(department_query)
            department = department_result.scalars().first()

            if department:
                user_dict["department_name"] = department.name

        user_responses.append(UserResponse(**user_dict))

    return user_responses


@app.get("/api/users/{user_id}", response_model=UserResponse)
async def read_user(
        user_id: UUID,
        db: AsyncSession = Depends(get_async_session)
):
    user_query = select(User).where(User.id == user_id)
    result = await db.execute(user_query)
    user = result.scalars().first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Создаем базовый ответ
    user_dict = {
        "id": user.id,
        "org_email": user.org_email,
        "name": user.name,
        "surname": user.surname,
        "patronymic": user.patronymic,
        "position": user.position,
        "EtudeID": user.EtudeID,
        "department_id": user.department_id
    }
    user_model = UserInDB(**user_dict)
    user_dict = user_model.model_dump()


    # Добавляем имя департамента, если пользователь привязан к департаменту
    if user.department_id:
        department_query = select(Department).where(Department.id == user.department_id)
        department_result = await db.execute(department_query)
        department = department_result.scalars().first()

        if department:
            user_dict["department_name"] = department.name

    return UserResponse(**user_dict)


@app.put("/api/users/{user_id}", response_model=UserResponse)
async def update_user(
        user_id: uuid.UUID,
        user: UserUpdate,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_async_session)
):
    # Проверяем существование пользователя
    user_query = select(User).where(User.id == user_id)
    result = await db.execute(user_query)
    db_user = result.scalars().first()

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Проверяем существование департамента, если он указан
    if user.department_id is not None:
        department_query = select(Department).where(Department.id == user.department_id)
        department_result = await db.execute(department_query)
        department = department_result.scalars().first()

        if not department and user.department_id is not None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Department with id {user.department_id} not found"
            )

    # Обновляем поля пользователя
    update_data = user.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)

    # Создаем ответ с информацией о департаменте
    user_dict = UserInDB.model_validate(user).model_dump()

    if db_user.department_id:
        department_query = select(Department).where(Department.id == db_user.department_id)
        department_result = await db.execute(department_query)
        department = department_result.scalars().first()

        if department:
            user_dict["department_name"] = department.name

    return UserResponse(**user_dict)


@app.delete("/api/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
        user_id: uuid.UUID,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_async_session)
):
    # Проверяем существование пользователя
    user_query = select(User).where(User.id == user_id)
    result = await db.execute(user_query)
    db_user = result.scalars().first()

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Проверяем, не пытается ли пользователь удалить сам себя
    if db_user.id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Users cannot delete their own accounts"
        )

    # Проверяем, есть ли документы, связанные с пользователем
    documents_query = select(Document).where(Document.owner_id == user_id)
    documents_result = await db.execute(documents_query)
    documents = documents_result.scalars().all()

    if documents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete user with existing documents. Reassign or delete documents first."
        )

    await db.delete(db_user)
    await db.commit()
    return None


# Дополнительный метод для поиска пользователей по email
@app.get("/api/users/email/{email}", response_model=UserResponse)
async def get_user_by_email(
        email: str,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_async_session)
):
    user_query = select(User).where(User.org_email == email)
    result = await db.execute(user_query)
    user = result.scalars().first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Создаем базовый ответ
    user_dict = UserInDB.model_validate(user).model_dump()

    # Добавляем имя департамента, если пользователь привязан к департаменту
    if user.department_id:
        department_query = select(Department).where(Department.id == user.department_id)
        department_result = await db.execute(department_query)
        department = department_result.scalars().first()

        if department:
            user_dict["department_name"] = department.name

    return UserResponse(**user_dict)


# Поиск пользователя по EtudeID
@app.get("/api/users/etude/{etude_id}", response_model=UserResponse)
async def get_user_by_etude_id(
        etude_id: int,
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_async_session)
):
    user_query = select(User).where(User.EtudeID == etude_id)
    result = await db.execute(user_query)
    user = result.scalars().first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Создаем базовый ответ
    user_dict = UserInDB.model_validate(user).model_dump()

    # Добавляем имя департамента, если пользователь привязан к департаменту
    if user.department_id:
        department_query = select(Department).where(Department.id == user.department_id)
        department_result = await db.execute(department_query)
        department = department_result.scalars().first()

        if department:
            user_dict["department_name"] = department.name

    return UserResponse(**user_dict)

# CRUD для Document
@app.post("/api/documents/", response_model=DocumentInDB, status_code=status.HTTP_201_CREATED)
async def create_document(
        document: DocumentCreate,
        background_tasks: BackgroundTasks,
        db: AsyncSession = Depends(get_async_session)
):
    db_document = Document(**document.model_dump())
    db.add(db_document)
    await db.commit()
    await db.refresh(db_document)

    # Запускаем фоновую задачу для автоматического согласования
    background_tasks.add_task(auto_approve_document, db_document.id, db)

    return db_document


@app.get("/api/documents/", response_model=List[DocumentInDB])
async def read_documents(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_async_session)):
    documents = await db.execute(select(Document).offset(skip).limit(limit))
    documents = documents.scalars().all()
    return documents


@app.get("/api/documents/{document_id}", response_model=DocumentResponse)
async def read_document(document_id: int, db: AsyncSession = Depends(get_async_session)):
    document = await db.execute(select(Document).filter(Document.id == document_id))
    document = document.scalars().first()
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


@app.put("/api/documents/{document_id}", response_model=DocumentInDB)
async def update_document(document_id: int, document: DocumentUpdate, db: AsyncSession = Depends(get_async_session)):
    db_document = await db.execute(select(Document).filter(Document.id == document_id))
    db_document = db_document.scalars().first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")

    update_data = document.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_document, key, value)

    db.add(db_document)
    await db.commit()
    await db.refresh(db_document)
    return db_document


@app.delete("/api/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(document_id: int, db: AsyncSession = Depends(get_async_session)):
    db_document = await db.execute(select(Document).filter(Document.id == document_id))
    db_document = db_document.scalars().first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")

    await db.delete(db_document)
    await db.commit()
    return None


# Дополнительный эндпоинт для управления согласованием документов
@app.put("/api/documents/{document_id}/approve", response_model=DocumentInDB)
async def approve_document(document_id: int, db: AsyncSession = Depends(get_async_session)):
    db_document = await db.execute(select(Document).filter(Document.id == document_id))
    db_document = db_document.scalars().first()
    if db_document is None:
        raise HTTPException(status_code=404, detail="Document not found")

    db_document.isApproval = True
    db.add(db_document)
    await db.commit()
    await db.refresh(db_document)
    return db_document


# Дополнительный эндпоинт для получения документов, ожидающих согласования
@app.get("/api/documents/pending/", response_model=List[DocumentInDB])
async def read_pending_documents(db: AsyncSession = Depends(get_async_session)):
    documents = await db.execute(select(Document).filter(Document.isApproval == False))
    documents = documents.scalars().all()
    return documents


# Эндпоинт для поиска документов по EtudeDocID
@app.get("/api/documents/etude/{etude_doc_id}", response_model=DocumentInDB)
async def read_document_by_etude_id(etude_doc_id: str, db: AsyncSession = Depends(get_async_session)):
    document = await db.execute(select(Document).filter(Document.EtudeDocID == etude_doc_id))
    document = document.scalars().first()
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document


# авторизации по email и паролю
@app.post("/api/auth/email-login", response_model=TokenResponse)
async def login_with_email(
        login_data: EmailLoginRequest,
        db: AsyncSession = Depends(get_async_session)
):
    # Проверяем, существует ли пользователь с таким email
    user_query = select(User).where(User.org_email == login_data.email)
    result = await db.execute(user_query)
    user = result.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Хешируем введенный пароль и сравниваем с сохраненным хешем
    hashed_password = hashlib.sha256(login_data.password.encode()).hexdigest()
    if user.hashed_password != hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Создаем данные для токена
    token_data = {
        "sub": user.email,  # Используем email как идентификатор пользователя для совместимости
        "user_id": user.id,
        "name": user.name,
        "surname": user.surname
    }

    # Создаем токены доступа и обновления
    access_token = create_access_token(token_data)
    refresh_token_value = create_refresh_token(token_data)

    # Получаем существующий client_id из базы данных
    client_query = select(OAuthClient).order_by(OAuthClient.id).limit(1)
    client_result = await db.execute(client_query)
    client = client_result.scalars().first()

    if not client:
        # Если клиентов нет, создаем нового клиента
        client = OAuthClient(
            client_id="etude_backend_client",
            client_secret="etude_backend_secret",
            name="Etude Backend",
            redirect_uris="http://localhost:8080/api/auth/callback",
            allowed_scopes="profile documents"
        )
        db.add(client)
        await db.commit()
        await db.refresh(client)

    # Сохраняем refresh токен в базе данных с существующим client_id
    db_refresh_token = RefreshToken(
        token=refresh_token_value,
        user_id=user.id,
        email=user.email,
        scopes="profile documents",
        client_id=client.client_id,  # Используем client_id из существующего клиента
        expires_at=datetime.utcnow() + timedelta(days=30),
        created_at=datetime.utcnow(),
        revoked=False
    )

    db.add(db_refresh_token)
    await db.commit()

    # Возвращаем токены
    return TokenResponse(
        access_token=access_token,
        token_type="Bearer",
        expires_in=3600,
        refresh_token=refresh_token_value
    )


@app.get("/api/organization/structure", response_model=OrganizationStructure)
async def get_organization_structure(
        db: AsyncSession = Depends(get_async_session)
):
    # Получаем компанию
    company_query = select(Company).order_by(Company.name)
    company_result = await db.execute(company_query)
    company = company_result.scalars().first()

    if not company:
        raise HTTPException(status_code=404, detail="Компания не найдена")

    # Создаем структуру ответа
    structure = {"company": {"name": company.name, "departments": []}}

    # Получаем все департаменты
    departments_query = select(Department).where(Department.company_id == company.id).order_by(Department.name)
    departments_result = await db.execute(departments_query)
    departments = departments_result.scalars().all()

    # Для каждого департамента
    for department in departments:
        # Получаем руководителя (is_leader = True)
        manager_query = select(User).where(
            (User.department_id == department.id) &
            (User.is_leader == True)
        )
        manager_result = await db.execute(manager_query)
        manager = manager_result.scalars().first()

        if not manager:
            # Если руководитель не найден, пропускаем департамент
            continue

        # Получаем всех сотрудников департамента, кроме руководителя
        employees_query = select(User).where(
            (User.department_id == department.id) &
            (User.is_leader == False)
        ).order_by(User.surname, User.name)
        employees_result = await db.execute(employees_query)
        employees = employees_result.scalars().all()

        # Создаем объект департамента
        dept_structure = {
            "name": department.name,
            "manager": {
                "name": f"{manager.surname} {manager.name} {manager.patronymic if manager.patronymic else ''}".strip(),
                "position": manager.position,
                "email": manager.org_email,
                "is_leader": True,
                "department_name": department.name
            },
            "employees": []
        }

        # Добавляем сотрудников
        for employee in employees:
            dept_structure["employees"].append({
                "name": f"{employee.surname} {employee.name} {employee.patronymic if employee.patronymic else ''}".strip(),
                "position": employee.position,
                "email": employee.org_email,
                "is_leader": False,
                "department_name": department.name
            })

        structure["company"]["departments"].append(dept_structure)

    return structure


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)