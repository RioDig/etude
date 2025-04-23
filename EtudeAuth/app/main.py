from fastapi import FastAPI, Depends, HTTPException, status, Request, Form
from fastapi.security import OAuth2AuthorizationCodeBearer
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from models import UserInDB, User, Document
from typing import List, Optional, Dict
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
import uuid
import uvicorn

from urllib.parse import urlencode

from db import get_async_session, User, OAuthClient, AuthorizationCode, RefreshToken
from oauth2 import create_access_token, create_refresh_token, validate_token, TokenData

auth_app = FastAPI(title="Document Management System OAuth Service")

# Настраиваем CORS
auth_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене заменить на конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Настраиваем шаблоны
templates = Jinja2Templates(directory="templates")

# Настраиваем статические файлы
auth_app.mount("/static", StaticFiles(directory="static"), name="static")

# Настройки безопасности
SECRET_KEY = "your_secret_key_here"  # В продакшене использовать переменные окружения
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Хэширование паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Схема OAuth2
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl="/oauth/authorize",
    tokenUrl="/oauth/token"
)

fake_documents_db = [
    {
        "id": 1,
        "title": "Квартальный отчет",
        "content": "Содержание квартального отчета...",
        "created_at": datetime.now() - timedelta(days=5),
        "owner_email": "user@example.com"
    },
    {
        "id": 2,
        "title": "Техническое задание",
        "content": "Содержание технического задания...",
        "created_at": datetime.now() - timedelta(days=2),
        "owner_email": "admin@example.com"
    }
]

# Получение сессии базы данных
def get_db():
    db = get_async_session()
    try:
        yield db
    finally:
        db.close()

# Функции безопасности
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db, email: str):
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db, email: str, password: str):
    user = get_user(db, email)
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

def validate_client(db, client_id: str, redirect_uri: str):
    client = db.query(OAuthClient).filter(OAuthClient.client_id == client_id).first()
    if not client or redirect_uri not in client.redirect_uris.split(","):
        return False
    return True

def generate_auth_code(db, client_id: str, email: str, scopes: List[str], redirect_uri: str):
    code = str(uuid.uuid4())
    auth_code = AuthorizationCode(
        code=code,
        client_id=client_id,
        email=email,
        scopes=",".join(scopes),
        redirect_uri=redirect_uri
    )
    db.add(auth_code)
    db.commit()
    return code

def get_current_active_user(token: str = Depends(oauth2_scheme), db: get_async_session = Depends(get_db)):
    try:
        payload = validate_token(token)
        user = get_user(db, email=payload.email)
        if user is None or user.disabled:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user")
        return user
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

# Эндпоинты OAuth

@auth_app.get("/oauth/authorize", response_class=HTMLResponse)
async def authorize(
        request: Request,
        response_type: str,
        client_id: str,
        redirect_uri: str,
        scope: str = "profile",
        state: Optional[str] = None,
        db: get_async_session = Depends(get_db)
):
    if not validate_client(db, client_id, redirect_uri):
        return HTMLResponse(content="Invalid client or redirect URI", status_code=400)

    if response_type != "code":
        return HTMLResponse(content="Only authorization code flow is supported", status_code=400)

    scopes = scope.split()
    client = db.query(OAuthClient).filter(OAuthClient.client_id == client_id).first()

    return templates.TemplateResponse(
        "login.html",
        {
            "request": request,
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "state": state if state else "",
            "scope": scope,
            "client_name": client.name,
            "scopes": scopes
        }
    )

@auth_app.post("/oauth/login")
async def process_login(
        email: str = Form(...),
        password: str = Form(...),
        client_id: str = Form(...),
        redirect_uri: str = Form(...),
        scope: str = Form("profile"),
        state: Optional[str] = Form(None),
        db: get_async_session = Depends(get_db)
):
    user = authenticate_user(db, email, password)
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
                "client_name": db.query(OAuthClient).filter(OAuthClient.client_id == client_id).first().name,
                "scopes": scope.split()
            },
            status_code=400
        )

    scopes = scope.split()
    auth_code = generate_auth_code(db, client_id, email, scopes, redirect_uri)

    params = {"code": auth_code}
    if state:
        params["state"] = state

    redirect_url = f"{redirect_uri}?{urlencode(params)}"
    return RedirectResponse(url=redirect_url, status_code=303)

@auth_app.post("/oauth/token")
async def token_endpoint(
        grant_type: str = Form(...),
        client_id: str = Form(...),
        client_secret: str = Form(...),
        code: Optional[str] = Form(None),
        redirect_uri: Optional[str] = Form(None),
        refresh_token: Optional[str] = Form(None),
        db: get_async_session = Depends(get_db)
):
    # Проверка клиента
    client = db.query(OAuthClient).filter(OAuthClient.client_id == client_id).first()
    if not client or client.client_secret != client_secret:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid client credentials",
        )

    if grant_type == "authorization_code":
        auth_code = db.query(AuthorizationCode).filter(AuthorizationCode.code == code).first()
        if not auth_code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid authorization code",
            )

        if auth_code.redirect_uri != redirect_uri or auth_code.client_id != client_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid redirect_uri or client_id",
            )

        if (datetime.utcnow() - auth_code.created_at).total_seconds() > 600:
            db.delete(auth_code)
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Authorization code expired",
            )

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": auth_code.email, "scopes": auth_code.scopes.split(",")},
            expires_delta=access_token_expires
        )

        refresh_token_value = create_refresh_token(
            data={"sub": auth_code.email, "scopes": auth_code.scopes.split(",")}
        )

        refresh_token_obj = RefreshToken(
            token=refresh_token_value,
            email=auth_code.email,
            scopes=auth_code.scopes,
            client_id=client_id
        )
        db.add(refresh_token_obj)
        db.delete(auth_code)
        db.commit()

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "refresh_token": refresh_token_value,
            "scope": auth_code.scopes
        }

    elif grant_type == "refresh_token":
        refresh_token_obj = db.query(RefreshToken).filter(RefreshToken.token == refresh_token).first()
        if not refresh_token_obj:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid refresh token",
            )

        if refresh_token_obj.client_id != client_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid client for this refresh token",
            )

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        new_access_token = create_access_token(
            data={"sub": refresh_token_obj.email, "scopes": refresh_token_obj.scopes.split(",")},
            expires_delta=access_token_expires
        )

        return {
            "access_token": new_access_token,
            "token_type": "bearer",
            "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "scope": refresh_token_obj.scopes
        }

    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported grant type",
        )

# API эндпоинты для работы с документами

@auth_app.get("/api/documents", response_model=List[Document])
async def get_documents(current_user: User = Depends(get_current_active_user)):
    # Фильтруем документы для текущего пользователя
    user_docs = [Document(**doc) for doc in fake_documents_db if doc["owner_email"] == current_user.email]
    return user_docs


@auth_app.get("/api/documents/{document_id}", response_model=Document)
async def get_document(document_id: int, current_user: User = Depends(get_current_active_user)):
    for doc in fake_documents_db:
        if doc["id"] == document_id:
            if doc["owner_email"] == current_user.email:
                return Document(**doc)
            raise HTTPException(status_code=403, detail="Not authorized to access this document")
    raise HTTPException(status_code=404, detail="Document not found")


@auth_app.post("/api/documents", response_model=Document)
async def create_document(
        title: str = Form(...),
        content: str = Form(...),
        current_user: User = Depends(get_current_active_user)
):
    # Создаем новый документ
    new_id = max([doc["id"] for doc in fake_documents_db]) + 1 if fake_documents_db else 1
    new_doc = {
        "id": new_id,
        "title": title,
        "content": content,
        "created_at": datetime.now(),
        "owner_email": current_user.email
    }
    fake_documents_db.append(new_doc)
    return Document(**new_doc)


# Эндпоинт проверки токена для внешних сервисов
@auth_app.post("/api/token/validate")
async def validate_token(
    token: str = Form(...),
    required_scopes: Optional[List[str]] = Form(None),
    db: get_async_session = Depends(get_db)
):
    token_data = validate_token(token)
    if token_data is None:
        return JSONResponse(content={"valid": False, "reason": "Invalid token"}, status_code=200)

    # Проверка scopes, если они требуются
    if required_scopes:
        missing_scopes = [scope for scope in required_scopes if scope not in token_data.scopes]
        if missing_scopes:
            return JSONResponse(
                content={
                    "valid": False,
                    "reason": f"Missing required scopes: {', '.join(missing_scopes)}"
                },
                status_code=200
            )

    user = get_user(db, email=token_data.email)
    if user is None or user.disabled:
        return JSONResponse(content={"valid": False, "reason": "User not found or disabled"}, status_code=200)

    return JSONResponse(
        content={
            "valid": True,
            "user": {
                "email": user.email,
                "full_name": user.full_name,
            },
            "scopes": token_data.scopes
        },
        status_code=200
    )


# Получение информации о текущем пользователе
@auth_app.get("/api/user/me", response_model=User)
async def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    return current_user


# Маршрут для главной страницы
@auth_app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

if __name__ == "__main__":
    uvicorn.run("main:auth_app", host="0.0.0.0", port=8000, reload=True)