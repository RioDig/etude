from fastapi import FastAPI, Depends, HTTPException, status, Request, Form, Cookie, Header
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional, List, Dict
from datetime import datetime, timedelta
import json
import uuid
from urllib.parse import urlencode

from db import get_async_session, User, OAuthClient, AuthorizationCode, RefreshToken
from oauth2 import create_access_token, create_refresh_token, validate_token, revoke_token
from config import settings

app = FastAPI(title="EtudeAuth - Система документооборота OAuth")

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
auth_codes = {}


# Аутентификация пользователя (пример - в продакшене использовать БД)
async def authenticate_user(db: AsyncSession, email: str, password: str):
    user = await db.query(User).filter(User.email == email).first()
    if not user:
        return False
    if user.disabled:
        return False
    # В реальном приложении здесь должна быть проверка хеша пароля
    return user


# Проверка клиента OAuth
async def validate_client(db: AsyncSession, client_id: str, redirect_uri: str):
    client = await db.query(OAuthClient).filter(OAuthClient.client_id == client_id).first()
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
        response_type: str,
        client_id: str,
        redirect_uri: str,
        scope: str = "profile",
        state: Optional[str] = None,
        db: AsyncSession = Depends(get_async_session)
):
    # Проверяем, что клиент зарегистрирован
    if client_id not in settings.OAUTH_CLIENTS:
        print()
        return HTMLResponse(content="Недействительный client_id", status_code=400)

    client = settings.OAUTH_CLIENTS[client_id]

    # Проверяем redirect_uri
    if redirect_uri not in client["redirect_uris"]:
        return HTMLResponse(content="Недействительный redirect_uri", status_code=400)

    # Проверяем, что используется code flow
    if response_type != "code":
        return HTMLResponse(content="Поддерживается только flow authorization_code", status_code=400)

    # Разбиваем scope на отдельные разрешения
    scopes = scope.split()

    # Проверяем, что запрашиваемые scopes разрешены для клиента
    for s in scopes:
        if s not in client["allowed_scopes"]:
            return HTMLResponse(content=f"Scope '{s}' не разрешен для данного клиента", status_code=400)

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


# Обработка формы входа
@app.post("/oauth/login")
async def login(
        email: str = Form(...),
        password: str = Form(...),
        client_id: str = Form(...),
        redirect_uri: str = Form(...),
        scope: str = Form("profile"),
        state: Optional[str] = Form(None),
        db: AsyncSession = Depends(get_async_session)
):
    # Аутентифицируем пользователя
    user = await authenticate_user(db, email, password)
    if not user:
        return templates.TemplateResponse(
            "login.html",
            {
                "request": Request,
                "client_id": client_id,
                "redirect_uri": redirect_uri,
                "state": state if state else "",
                "scope": scope,
                "error": "Неверный email или пароль",
                "client_name": settings.OAUTH_CLIENTS[client_id]["name"] if "name" in settings.OAUTH_CLIENTS[
                    client_id] else client_id,
                "scopes": scope.split()
            },
            status_code=400
        )

    # Генерируем код авторизации
    code = str(uuid.uuid4())

    # Сохраняем код в временное хранилище (в продакшене использовать Redis/БД)
    auth_codes[code] = {
        "email": email,
        "client_id": client_id,
        "scopes": scope.split(),
        "redirect_uri": redirect_uri,
        "expires_at": datetime.utcnow() + timedelta(minutes=10)  # код действителен 10 минут
    }

    # Создаем параметры для редиректа
    params = {"code": code}
    if state:
        params["state"] = state

    # Формируем URL для редиректа
    redirect_url = f"{redirect_uri}?{urlencode(params)}"

    # Перенаправляем на redirect_uri с кодом авторизации
    return RedirectResponse(url=redirect_url, status_code=303)


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
        if code not in auth_codes:
            return JSONResponse(
                content={"error": "invalid_grant", "error_description": "Invalid authorization code"},
                status_code=400
            )

        code_data = auth_codes[code]

        # Проверяем время жизни кода
        if datetime.utcnow() > code_data["expires_at"]:
            del auth_codes[code]  # Удаляем просроченный код
            return JSONResponse(
                content={"error": "invalid_grant", "error_description": "Authorization code expired"},
                status_code=400
            )

        # Проверяем redirect_uri
        if code_data["redirect_uri"] != redirect_uri:
            return JSONResponse(
                content={"error": "invalid_grant", "error_description": "Redirect URI mismatch"},
                status_code=400
            )

        # Проверяем client_id
        if code_data["client_id"] != client_id:
            return JSONResponse(
                content={"error": "invalid_grant", "error_description": "Client ID mismatch"},
                status_code=400
            )

        # Создаем токены
        access_token_data = {
            "sub": code_data["email"],
            "scopes": code_data["scopes"],
            "client_id": client_id
        }

        access_token = create_access_token(access_token_data)
        refresh_token_value = create_refresh_token(access_token_data)

        # Сохраняем refresh token в БД
        db_refresh_token = RefreshToken(
            token=refresh_token_value,
            email=code_data["email"],
            scopes=",".join(code_data["scopes"]),
            client_id=client_id
        )
        db.add(db_refresh_token)
        await db.commit()

        # Удаляем использованный код авторизации
        del auth_codes[code]

        # Возвращаем токены
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": settings.JWT_ACCESS_TTL,
            "refresh_token": refresh_token_value,
            "scope": " ".join(code_data["scopes"])
        }

    elif grant_type == "refresh_token":
        # Проверяем refresh token
        refresh_token_obj = await db.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()
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

    # Получаем информацию о пользователе
    user = await db.query(User).filter(User.email == token_data.sub).first()
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


# Получение информации о пользователе
@app.get("/api/user/me")
async def get_user_info(
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

    token = authorization.split(" ")[1]
    token_data = validate_token(token, ["profile"])

    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Получаем информацию о пользователе
    user = await db.query(User).filter(User.email == token_data.sub).first()
    if not user or user.disabled:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or disabled",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # Возвращаем информацию о пользователе
    return {
        "email": user.email,
        "full_name": user.full_name,
        "scopes": token_data.scopes
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

    token = authorization.split(" ")[1]
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

    token = authorization.split(" ")[1]
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

    token = authorization.split(" ")[1]
    token_data = validate_token(token, ["documents", "write"])

    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token or insufficient permissions",
            headers={"WWW-Authenticate": "Bearer"}
        )

    # В реальном приложении здесь был бы запрос к БД для сохранения документа
    # Для демонстрации возвращаем фиктивные данные
    return {
        "id": 3,
        "title": title,
        "content": content,
        "created_at": datetime.utcnow(),
        "type": "document"
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)