from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import jwt, JWTError
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta

# Настройки OAuth
OAUTH2_SCHEME = OAuth2AuthorizationCodeBearer(
    authorizationUrl="oauth/authorize",
    tokenUrl="oauth/token"
)

# Секретный ключ (в продакшене использовать переменные окружения)
SECRET_KEY = "your_oauth_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Зарегистрированные клиенты (в реальности это бы хранилось в БД)
CLIENTS = {
    "client123": {
        "client_secret": "secret123",
        "redirect_uris": ["http://localhost:3000/callback", "https://yourbackend.com/api/oauth/callback"],
        "allowed_scopes": ["read", "write", "documents"]
    }
}


# Модели данных
class TokenData(BaseModel):
    username: Optional[str] = None
    scopes: list = None


class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    refresh_token: Optional[str] = None
    scope: Optional[str] = None


# Коды авторизации (в реальности хранились бы в Redis/БД с ограниченным временем жизни)
AUTH_CODES = {}


def create_auth_code(username: str, client_id: str, scopes: list, redirect_uri: str):
    """Создать код авторизации для OAuth"""
    code = f"{username}_{client_id}_{datetime.utcnow().timestamp()}"
    AUTH_CODES[code] = {
        "username": username,
        "client_id": client_id,
        "scopes": scopes,
        "redirect_uri": redirect_uri,
        "created_at": datetime.utcnow()
    }
    # В реальном приложении код должен быть случайным и безопасным
    return code


def verify_auth_code(code: str, client_id: str, redirect_uri: str):
    """Проверить код авторизации"""
    if code not in AUTH_CODES:
        return None

    code_data = AUTH_CODES[code]

    # Проверяем client_id и redirect_uri
    if code_data["client_id"] != client_id or code_data["redirect_uri"] != redirect_uri:
        return None

    # Проверяем время жизни кода (обычно 10 минут)
    if (datetime.utcnow() - code_data["created_at"]).total_seconds() > 600:
        return None

    # Удаляем использованный код
    auth_data = AUTH_CODES.pop(code)
    return auth_data


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Создать JWT токен доступа"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict):
    """Создать токен обновления (refresh token)"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=30)  # обычно refresh token живёт дольше
    to_encode.update({"exp": expire, "refresh": True})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def validate_token(token: str, required_scopes: list = None):
    """Валидировать токен и проверить наличие нужных scopes"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            return None

        token_scopes = payload.get("scopes", [])
        token_data = TokenData(username=username, scopes=token_scopes)

        # Проверка scopes
        if required_scopes:
            for scope in required_scopes:
                if scope not in token_data.scopes:
                    return None

        return token_data
    except JWTError:
        return None


# Зависимость для проверки токена
async def get_current_user(token: str = Depends(OAUTH2_SCHEME)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token_data = validate_token(token)
    if token_data is None:
        raise credentials_exception

    return token_data