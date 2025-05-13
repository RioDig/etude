import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, ARRAY, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from sqlalchemy.sql import func
from datetime import datetime, timedelta

from config import settings

Base = declarative_base()

# Создаем асинхронное подключение к PostgreSQL
engine = create_async_engine(
    f"postgresql+psycopg://{settings.DB_USER}:{settings.DB_PASS}@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}",
    echo=False
)

# Создаем асинхронную фабрику сессий
async_session_factory = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Функция для получения асинхронной сессии
async def get_async_session():
    async with async_session_factory() as session:
        yield session


# Модель пользователя
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    org_email = Column(String, unique=True, index=True)
    name = Column(String)
    surname = Column(String)
    patronymic = Column(String, nullable=True)
    position = Column(String)
    hashed_password = Column(String)
    EtudeID = Column(Integer, nullable=True)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id"), nullable=True)
    is_leader = Column(Boolean, default=False, nullable=False)

    # Отношения
    department = relationship("Department", back_populates="employees")
    tokens = relationship("RefreshToken", back_populates="user")
    documents = relationship("Document", back_populates="owner")


# Модель для OAuth клиентов
class OAuthClient(Base):
    __tablename__ = "oauth_clients"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(String, unique=True, index=True)
    client_secret = Column(String)
    name = Column(String)
    redirect_uris = Column(String)  # Разделенные запятой URI для редиректа
    allowed_scopes = Column(String)  # Разделенные запятой разрешенные scopes
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())


# Модель для кодов авторизации
class AuthorizationCode(Base):
    __tablename__ = "authorization_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    client_id = Column(String, ForeignKey("oauth_clients.client_id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    email = Column(String)
    scopes = Column(String)  # Разделенные запятой scopes
    redirect_uri = Column(String)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=func.now())

    # Отношения
    client = relationship("OAuthClient")
    user = relationship("User")


# Модель для refresh токенов
class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String, unique=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    email = Column(String)
    scopes = Column(String)  # Разделенные запятой scopes
    client_id = Column(String, ForeignKey("oauth_clients.client_id"))
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=func.now())
    revoked = Column(Boolean, default=False)

    # Отношения
    user = relationship("User", back_populates="tokens")
    client = relationship("OAuthClient")


# Модель для документов
class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    EtudeDocID = Column(String, unique=True, index=True)  # UUID из EtudeBackend
    coordinating = Column(JSON)  # Словарь с ID пользователей для согласования {EtudeAuthID: EtudeBackendID}
    isApproval = Column(Boolean, default=False)  # Статус согласования
    DocInfo = Column(JSON)  # Вся информация о документе в JSON
    created_at = Column(DateTime, default=func.now())  # Дата и время создания документа
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    # Отношения
    owner = relationship("User", back_populates="documents")

class AuthToken(Base):
    __tablename__ = "auth_tokens"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String)
    email = Column(String)
    scopes = Column(ARRAY(String))
    client_id = Column(String)
    redirect_uri = Column(String)
    expires_at = Column(DateTime)


# модели для структуры организации

class Company(Base):
    __tablename__ = "companies"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    name = Column(String, unique=True, index=True)

    # Отношения
    departments = relationship("Department", back_populates="company")


class Department(Base):
    __tablename__ = "departments"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    name = Column(String, index=True)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"))

    # Отношения
    company = relationship("Company", back_populates="departments")
    employees = relationship("User", back_populates="department")

# Функция для инициализации базы данных
async def init_db():
    async with engine.begin() as conn:
        # Создаем таблицы, если их нет
        await conn.run_sync(Base.metadata.create_all)


# Если запускаем файл напрямую, инициализируем БД
if __name__ == "__main__":
    import asyncio

    asyncio.run(init_db())