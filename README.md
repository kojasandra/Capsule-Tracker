# Capsule Tracker

A small app for managing coffee capsules, stock, prices, ratings, and tasting
notes. You can add, view, edit, delete, search, and filter capsules by brand.

## Requirements

Python 3.11+, Node.js 22.12+ (or Node 24), and Docker Desktop running.

## Environment settings

Create `.env` in the project root (`capsule-tracker/.env`) for PostgreSQL:

```dotenv
POSTGRES_DB=capsule_tracker
POSTGRES_USER=capsule_user
POSTGRES_PASSWORD=
```

Create `backend/.env` for FastAPI, using the same database name, user, and password:

```dotenv
DATABASE_URL=
FRONTEND_ORIGIN=http://localhost:5173
```


## Start the database

```powershell
docker compose up -d
```

Wait until `docker compose ps` shows PostgreSQL as healthy.

## Start the backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate.bat
pip install -r requirements-lock.txt
alembic upgrade head
uvicorn app.main:app --reload
```

## Start the frontend

Open a second terminal from the `capsule-tracker` folder:

```powershell
cd frontend
npm.cmd ci
npm.cmd run dev
```
