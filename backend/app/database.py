import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

load_dotenv(Path(__file__).resolve().parents[1] / ".env")

database_url = os.getenv("DATABASE_URL")
if not database_url:
    raise RuntimeError("Set DATABASE_URL in backend/.env before starting the app.")

engine = create_engine(database_url, pool_pre_ping=True, connect_args={"connect_timeout": 5})
SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    with SessionLocal() as session:
        yield session
