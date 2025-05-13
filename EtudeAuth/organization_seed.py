# organization_seed.py
import json
import uuid
import hashlib
import random
from faker import Faker

# Инициализируем Faker для генерации случайных данных
fake_ru = Faker('ru_RU')  # Для русских имен и текста

# Набор уже использованных email-адресов для проверки уникальности
used_emails = set()


# Функция для транслитерации русских имен для email
def transliterate(name):
    # Словарь для транслитерации
    translit_dict = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
        'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
        'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D', 'Е': 'E', 'Ё': 'E',
        'Ж': 'Zh', 'З': 'Z', 'И': 'I', 'Й': 'Y', 'К': 'K', 'Л': 'L', 'М': 'M',
        'Н': 'N', 'О': 'O', 'П': 'P', 'Р': 'R', 'С': 'S', 'Т': 'T', 'У': 'U',
        'Ф': 'F', 'Х': 'Kh', 'Ц': 'Ts', 'Ч': 'Ch', 'Ш': 'Sh', 'Щ': 'Sch', 'Ъ': '',
        'Ы': 'Y', 'Ь': '', 'Э': 'E', 'Ю': 'Yu', 'Я': 'Ya'
    }

    result = ''
    for char in name:
        result += translit_dict.get(char, char)

    return result


# Функция для преобразования названия отдела в родительный падеж
def department_to_genitive(name):
    """Преобразует название отдела в родительный падеж"""
    # Словарь окончаний и их форм в родительном падеже
    replacements = {
        "Отдел": "Отдела",
        "Бухгалтерия": "Бухгалтерии",
        "Администрация": "Администрации",
        "Служба": "Службы",
        "отдел": "отдела",
        "бухгалтерия": "бухгалтерии",
        "администрация": "администрации",
        "служба": "службы"
    }

    # Обработка сложных названий
    for word, genitive in replacements.items():
        if name.endswith(word):
            # Заменяем только окончание
            prefix = name[:-len(word)]
            return prefix + genitive

    # Специальные случаи
    special_cases = {
        "ИТ Отдел": "ИТ Отдела",
        "Отдел разработки": "Отдела разработки",
        "Отдел продаж": "Отдела продаж",
        "Отдел маркетинга": "Отдела маркетинга",
        "Отдел кадров": "Отдела кадров",
        "Юридический отдел": "Юридического отдела",
        "Служба безопасности": "Службы безопасности",
        "Отдел логистики": "Отдела логистики"
    }

    if name in special_cases:
        return special_cases[name]

    # Если нет в специальных случаях, добавляем стандартное окончание
    return name + "а"


# Создаем структуру организации
def generate_organization_structure():
    # Создаем компанию на русском языке
    company = {
        "id": str(uuid.uuid4()),
        "name": "ООО Технопрогресс"
    }

    # Создаем отделы на русском языке
    departments = [
        {"id": str(uuid.uuid4()), "name": "ИТ Отдел", "company_id": company["id"]},
        {"id": str(uuid.uuid4()), "name": "Бухгалтерия", "company_id": company["id"]},
        {"id": str(uuid.uuid4()), "name": "Отдел разработки", "company_id": company["id"]},
        {"id": str(uuid.uuid4()), "name": "Отдел продаж", "company_id": company["id"]},
        {"id": str(uuid.uuid4()), "name": "Отдел маркетинга", "company_id": company["id"]},
        {"id": str(uuid.uuid4()), "name": "Отдел кадров", "company_id": company["id"]},
        {"id": str(uuid.uuid4()), "name": "Юридический отдел", "company_id": company["id"]},
        {"id": str(uuid.uuid4()), "name": "Служба безопасности", "company_id": company["id"]},
        {"id": str(uuid.uuid4()), "name": "Администрация", "company_id": company["id"]},
        {"id": str(uuid.uuid4()), "name": "Отдел логистики", "company_id": company["id"]}
    ]

    # Создаем пользователей
    users = []

    # Пароль "test" хэшированный с SHA-256
    hashed_password = hashlib.sha256("test".encode()).hexdigest()

    # Случайное распределение пользователей по отделам
    users_per_department = {}
    for department in departments:
        # Выделяем по 10 пользователей на каждый отдел
        users_per_department[department["id"]] = 10

    user_id = 0
    # Создаем домен компании для email
    company_domain = "techprogress.com"

    for department in departments:
        department_id = department["id"]
        department_count = users_per_department[department_id]

        # Преобразуем название отдела в slug для email (транслитерация)
        department_slug = transliterate(department["name"].lower()).replace(' ', '_')

        # Создаем пользователей для отдела
        for i in range(department_count):
            user_id += 1

            # Первый пользователь в отделе - руководитель
            is_leader = (i == 0)

            # Генерируем данные пользователя
            gender = 'male' if random.random() > 0.4 else 'female'  # 60% мужчин, 40% женщин

            if gender == 'male':
                first_name = fake_ru.first_name_male()
                last_name = fake_ru.last_name_male()
                middle_name = fake_ru.middle_name_male()

                # Должности на русском
                position_options = [
                    "Менеджер", "Специалист", "Аналитик", "Инженер",
                    "Программист", "Консультант", "Старший разработчик",
                    "Технический руководитель", "Системный администратор"
                ]
                position = random.choice(position_options)

                if is_leader:
                    # Преобразуем название отдела в родительный падеж
                    department_genitive = department_to_genitive(department['name'])
                    position = f"Руководитель {department_genitive}"
            else:
                first_name = fake_ru.first_name_female()
                last_name = fake_ru.last_name_female()
                middle_name = fake_ru.middle_name_female()

                # Должности на русском
                position_options = [
                    "Менеджер", "Специалист", "Аналитик", "Инженер",
                    "Программист", "Консультант", "HR Специалист",
                    "Контент-менеджер", "Бухгалтер", "Дизайнер"
                ]
                position = random.choice(position_options)

                if is_leader:
                    # Преобразуем название отдела в родительный падеж
                    department_genitive = department_to_genitive(department['name'])
                    position = f"Руководитель {department_genitive}"

            # Создаем email с английскими буквами и гарантируем уникальность
            first_name_latin = transliterate(first_name).lower()
            last_name_latin = transliterate(last_name).lower()

            # Создаем базовый email
            if is_leader:
                base_email = f"head.{department_slug}@{company_domain}"
            else:
                base_email = f"{first_name_latin}.{last_name_latin}@{company_domain}"

            # Проверяем и гарантируем уникальность email
            email = base_email
            counter = 1
            while email in used_emails:
                if is_leader:
                    # Для руководителей добавляем номер департамента
                    email = f"head.{department_slug}{counter}@{company_domain}"
                else:
                    # Для обычных сотрудников добавляем числовой суффикс
                    email = f"{first_name_latin}.{last_name_latin}{counter}@{company_domain}"
                counter += 1

            # Добавляем email в список использованных
            used_emails.add(email)

            user = {
                "id": str(uuid.uuid4()),
                "email": email,
                "org_email": email,
                "name": first_name,
                "surname": last_name,
                "patronymic": middle_name,
                "position": position,
                "hashed_password": hashed_password,
                "EtudeID": None,
                "department_id": department_id,
                "is_leader": is_leader
            }

            users.append(user)

    # Проверяем, что все email-адреса уникальны
    email_set = set()
    duplicates = []
    for user in users:
        email = user["email"]
        if email in email_set:
            duplicates.append(email)
        email_set.add(email)

    if duplicates:
        print(f"ВНИМАНИЕ: Обнаружены дубликаты email-адресов: {duplicates}")
    else:
        print(f"Проверка успешна: все {len(users)} email-адресов уникальны")

    # Формируем итоговую структуру
    organization_data = {
        "company": company,
        "departments": departments,
        "users": users
    }

    return organization_data


# Генерируем структуру организации
organization = generate_organization_structure()

# Сохраняем в JSON файл
with open('organization_data.json', 'w', encoding='utf-8') as f:
    json.dump(organization, f, ensure_ascii=False, indent=4)

print(f"Файл organization_data.json создан успешно с {len(organization['users'])} пользователями")