from fastapi import HTTPException, status
from jose import jwt, JWTError
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timedelta
import uuid
from config import settings


# Модели данных
class TokenData(BaseModel):
    sub: Optional[str] = None  # email пользователя
    scopes: List[str] = []
    client_id: Optional[str] = None
    exp: Optional[datetime] = None
    jti: Optional[str] = None  # уникальный ID токена


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    refresh_token: Optional[str] = None
    scope: Optional[str] = None


# Токены, которые были отозваны (в продакшн должны храниться в Redis/БД)
REVOKED_TOKENS = set()


def create_jwt_token(data: dict, expires_delta: Optional[timedelta] = None, token_type: str = "access"):
    """Создает JWT токен с указанными данными и сроком жизни"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    elif token_type == "access":
        expire = datetime.utcnow() + timedelta(seconds=settings.JWT_ACCESS_TTL)
    else:
        expire = datetime.utcnow() + timedelta(seconds=settings.JWT_REFRESH_TTL)

    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),  # время создания токена
        "jti": str(uuid.uuid4()),  # уникальный ID токена
        "type": token_type
    })

    # Выбираем секретный ключ в зависимости от типа токена
    secret_key = settings.SECRET

    return jwt.encode(to_encode, secret_key, algorithm="HS256")


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Создает JWT access токен"""
    return create_jwt_token(data, expires_delta, "access")


def create_refresh_token(data: dict):
    """Создает JWT refresh токен"""
    return create_jwt_token(data, None, "refresh")


def decode_token(token: str):
    """Декодирует JWT токен и проверяет его на валидность"""
    try:
        payload = jwt.decode(token, settings.SECRET, algorithms=["HS256"])

        # Проверяем, не был ли токен отозван
        if payload.get("jti") in REVOKED_TOKENS:
            return None

        return payload
    except JWTError:
        return None


def validate_token(token: str, required_scopes: List[str] = None):
    """Проверяет валидность токена и наличие необходимых scope"""
    payload = decode_token(token)
    if not payload:
        return None

    # Проверяем тип токена
    if payload.get("type") != "access":
        return None

    # Проверяем срок действия
    if datetime.fromtimestamp(payload.get("exp")) < datetime.utcnow():
        return None

    # Получаем данные из токена
    email = payload.get("sub")
    if not email:
        return None

    scopes = payload.get("scopes", [])

    # Проверяем наличие необходимых scopes
    if required_scopes:
        for scope in required_scopes:
            if scope not in scopes:
                return None

    return TokenData(
        sub=email,
        scopes=scopes,
        client_id=payload.get("client_id"),
        exp=datetime.fromtimestamp(payload.get("exp")),
        jti=payload.get("jti")
    )


def revoke_token(token: str):
    """Отзывает токен, добавляя его в список отозванных"""
    payload = decode_token(token)
    if payload and payload.get("jti"):
        REVOKED_TOKENS.add(payload.get("jti"))
        return True
    return False