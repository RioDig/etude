# FastAPI OAuth Service

## Структура проекта

```
EtudeAuth/
├── app/
│   ├── main.py              # Основной файл приложения
│   ├── oauth2.py            # Вспомогательные функции для OAuth
│   ├── models.py            # Pydantic модели (опционально)
│   ├── static/              # Статические файлы (CSS, JS)
│   │   └── styles.css
│   └── templates/           # HTML шаблоны
│       ├── index.html       # Главная страница
│       └── login.html       # Страница авторизации
├── requirements.txt         # Зависимости проекта
├── .env                     # Файл с переменными окружения (не добавлять в git)
└── README.md                # Документация проекта
```

## Установка и запуск

1. Клонируйте репозиторий или создайте структуру проекта как показано выше.

2. Создайте виртуальное окружение Python:
   ```
   python -m venv venv
   ```

3. Активируйте виртуальное окружение:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`

4. Установите зависимости:
   ```
   pip install -r requirements.txt
   ```

5. Создайте файл `.env` со следующими переменными:
   ```
   SECRET_KEY=your_secret_key_here
   DEBUG=True
   ```

6. Запустите приложение:
   ```
   cd app
   uvicorn main:app --reload --port 8000
   ```

7. Откройте браузер и перейдите по адресу `http://localhost:8000/`

## Зависимости проекта (requirements.txt)

```
fastapi==0.104.0
uvicorn==0.23.2
python-jose==3.3.0
pydantic==2.4.2
passlib==1.7.4
python-multipart==0.0.6
jinja2==3.1.2
python-dotenv==1.0.0
bcrypt==4.0.1
```

## Интеграция с существующим проектом

### Со стороны C# бэкенда

1. Добавьте поддержку OAuth клиента для взаимодействия с FastAPI OAuth сервером.
2. Когда пользователю нужно авторизоваться, перенаправьте его на `/oauth/authorize` с необходимыми параметрами.
3. Создайте эндпоинт обратного вызова для получения кода авторизации.
4. Обменяйте код на токены доступа через POST запрос к `/oauth/token`.
5. Сохраните полученные токены в вашей базе данных и сгенерируйте свой внутренний токен, который будет связан с сохраненным OAuth токеном.

### Со стороны React фронтенда

1. Добавьте компонент авторизации, который будет перенаправлять пользователя на OAuth сервер.
2. После успешной авторизации и перенаправления обратно, получите токен от C# бэкенда.
3. Используйте полученный токен для дальнейших запросов к API.

## Примеры использования OAuth

### Запрос авторизации

```
GET /oauth/authorize?response_type=code&client_id=client123&redirect_uri=http://localhost:5000/callback&scope=profile documents
```

### Обмен кода на токены

```
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
client_id=client123&
client_secret=secret123&
code=YOUR_AUTH_CODE&
redirect_uri=http://localhost:5000/callback
```

### Проверка токена

```
POST /api/token/validate
Content-Type: application/x-www-form-urlencoded

token=YOUR_ACCESS_TOKEN&
required_scopes=profile,documents
```

## Безопасность

- В продакшене обязательно используйте HTTPS
- Храните секретные ключи в переменных окружения
- Регулярно обновляйте зависимости для устранения уязвимостей
- Используйте безопасные методы хеширования паролей
- Ограничьте время жизни токенов