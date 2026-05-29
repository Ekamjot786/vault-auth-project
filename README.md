# VAULT — Django + MySQL + React Auth System

A full-stack authentication system with Sign Up, Sign In, and Change Password.

---

## Project Structure

```
auth_project/
├── backend/                  # Django REST API
│   ├── accounts/             # Auth app (models, views, serializers, urls)
│   ├── config/               # Django settings, root urls, wsgi
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
└── frontend/                 # React SPA
    ├── public/
    │   └── index.html
    └── src/
        ├── context/AuthContext.jsx
        ├── services/api.js
        ├── components/ProtectedRoute.jsx
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── Dashboard.jsx
        ├── App.jsx
        ├── index.js
        └── index.css
```

---

## API Endpoints

| Method | URL                          | Auth     | Description         |
|--------|------------------------------|----------|---------------------|
| POST   | `/api/auth/register/`        | Public   | Sign up             |
| POST   | `/api/auth/login/`           | Public   | Sign in → JWT       |
| POST   | `/api/auth/logout/`          | Required | Invalidate token    |
| GET    | `/api/auth/profile/`         | Required | Get user info       |
| PUT    | `/api/auth/change-password/` | Required | Change password     |
| POST   | `/api/auth/token/refresh/`   | Public   | Refresh access JWT  |

---

## Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8.0+

---

### 1. MySQL Database

```sql
-- Open MySQL prompt and run:
CREATE DATABASE auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'vault_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON auth_db.* TO 'vault_user'@'localhost';
FLUSH PRIVILEGES;
```

---

### 2. Django Backend

```bash
cd auth_project/backend

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — set DB_USER, DB_PASSWORD, DB_NAME, SECRET_KEY

# Run migrations
python manage.py makemigrations accounts
python manage.py migrate

# (Optional) Create superuser for Django admin
python manage.py createsuperuser

# Start development server
python manage.py runserver        # Runs on http://localhost:8000
```

---

### 3. React Frontend

```bash
cd auth_project/frontend

# Install dependencies
npm install

# Start dev server
npm start                          # Runs on http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## Environment Variables (backend/.env)

```
SECRET_KEY=your-secret-key-here
DEBUG=True

DB_NAME=auth_db
DB_USER=vault_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=3306
```

---

## Features

- **JWT Authentication** — access tokens (1h) + refresh tokens (7d)
- **Auto token refresh** — Axios interceptor silently refreshes on 401
- **Custom User model** — extensible, uses username + email
- **Protected routes** — React Router guards unauthenticated access
- **Password validation** — Django's built-in validators
- **CORS configured** — allows React dev server

---

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | Django 4.2, Django REST Framework   |
| Auth     | djangorestframework-simplejwt (JWT) |
| Database | MySQL 8 via mysqlclient             |
| Frontend | React 18, React Router 6            |
| HTTP     | Axios with interceptors             |
