# import_organization.py
import json
import asyncio
import hashlib
import uuid
import sys

# Исправление для Windows
if sys.platform.startswith('win'):
    import asyncio

    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
from db import Base, User, Department, Company

# Конфигурация базы данных - настройте URL в соответствии с вашей системой
DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:6432/postgres"

# Создаем асинхронный движок
engine = create_async_engine(DATABASE_URL)

# Создаем асинхронную фабрику сессий
async_session_factory = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)


async def reset_database():
    """Сбрасывает схему базы данных и создает ее заново"""
    async with engine.begin() as conn:
        # Удаляем все существующие таблицы
        await conn.run_sync(Base.metadata.drop_all)
        # Создаем таблицы заново
        await conn.run_sync(Base.metadata.create_all)
    print("База данных инициализирована")


async def import_organization_data():
    """Импортирует данные из JSON в базу данных"""
    # Загрузка данных из JSON файла
    try:
        with open('organization_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Ошибка: Файл organization_data.json не найден!")
        return
    except json.JSONDecodeError:
        print("Ошибка: Некорректный формат JSON в файле organization_data.json!")
        return

    print("Данные из JSON файла успешно загружены, начинаем импорт в базу данных...")

    # Создаем асинхронную сессию
    async with async_session_factory() as session:
        try:
            # Проверяем уникальность email перед импортом
            emails = [user["email"] for user in data["users"]]
            unique_emails = set(emails)
            if len(emails) != len(unique_emails):
                print(f"ПРЕДУПРЕЖДЕНИЕ: В данных есть повторяющиеся email-адреса!")
                duplicates = []
                email_counts = {}
                for email in emails:
                    email_counts[email] = email_counts.get(email, 0) + 1

                for email, count in email_counts.items():
                    if count > 1:
                        duplicates.append(f"{email} ({count} раз)")

                print(f"Дубликаты: {', '.join(duplicates)}")
                return

            # Импортируем компанию
            company_data = data["company"]
            company = Company(
                id=uuid.UUID(company_data["id"]),
                name=company_data["name"]
            )
            session.add(company)
            print(f"Компания добавлена: {company.name}")

            # Импортируем отделы
            print("Импортируем отделы...")
            departments = {}
            for dept_data in data["departments"]:
                department = Department(
                    id=uuid.UUID(dept_data["id"]),
                    name=dept_data["name"],
                    company_id=uuid.UUID(dept_data["company_id"])
                )
                session.add(department)
                departments[dept_data["id"]] = department

            # Первая фиксация для создания отделов
            await session.flush()

            # Импортируем пользователей
            print("Импортируем пользователей...")
            for index, user_data in enumerate(data["users"]):
                try:
                    user = User(
                        id=uuid.UUID(user_data["id"]),
                        email=user_data["email"],
                        org_email=user_data["org_email"],
                        name=user_data["name"],
                        surname=user_data["surname"],
                        patronymic=user_data["patronymic"],
                        position=user_data["position"],
                        hashed_password=user_data["hashed_password"],
                        EtudeID=user_data["EtudeID"],
                        department_id=uuid.UUID(user_data["department_id"]) if user_data["department_id"] else None,
                        is_leader=user_data["is_leader"]
                    )
                    session.add(user)

                    # Фиксируем каждого пользователя отдельно, чтобы продолжить в случае ошибки
                    if index % 10 == 9:  # Фиксируем по блокам для производительности
                        await session.flush()
                        print(f"Импортировано {index + 1} пользователей...")

                except IntegrityError as e:
                    await session.rollback()
                    print(f"Ошибка при импорте пользователя {user_data['email']}: {str(e)}")
                    # Продолжаем импорт, пропуская проблемного пользователя
                    continue

            # Сохраняем все изменения
            await session.commit()
            print("Данные успешно импортированы в базу данных!")

        except Exception as e:
            await session.rollback()
            print(f"Ошибка при импорте данных: {str(e)}")
            raise


async def main():
    """Основная функция для выполнения всего процесса"""
    print("Начинаем процесс импорта организационной структуры...")
    # Сначала сбрасываем базу данных
    await reset_database()
    # Затем импортируем данные
    await import_organization_data()
    print("Процесс импорта завершен.")


# Запускаем все в одном цикле событий
if __name__ == "__main__":
    asyncio.run(main())