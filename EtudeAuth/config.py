from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Настройки базы данных
    DB_HOST: str
    DB_PORT: str
    DB_NAME: str
    DB_USER: str
    DB_PASS: str

    # Секретные ключи
    SECRET: str  # Для подписи JWT-токенов
    VERIFY_TOKEN_SECRET: str  # Для проверки токенов

    # Настройки JWT
    JWT_ACCESS_TTL: int = 3600  # Время жизни access токена (в секундах)
    JWT_REFRESH_TTL: int = 2592000  # Время жизни refresh токена (30 дней)

    # Разрешенные домены для CORS
    ORIGINS: List[str] = ['*']

    # Зарегистрированные клиенты OAuth (в продакшене должны храниться в БД)
    OAUTH_CLIENTS: dict = {
        "etude_backend_client": {
            "client_id": "etude_backend_client",
            "client_secret": "etude_backend_secret",
            "redirect_uris": ["http://localhost:8080/api/auth/callback", "https://localhost:7124/api/auth/callback"],
            "allowed_scopes": ["profile", "documents", "write"]
        }
    }

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()