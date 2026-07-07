"""
Database configuration and session management
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase
from typing import Generator

from app.config import settings


class Base(DeclarativeBase):
    """Declarative base for all models"""
    pass


# Create database engine
_database_url_lower = settings.database_url.lower()
_is_sqlite = _database_url_lower.startswith("sqlite")
_is_supabase = "supabase.co" in _database_url_lower
_has_sslmode = "sslmode=" in _database_url_lower

_engine_kwargs = dict(
    echo=settings.database_echo,
    pool_pre_ping=True,
)

# SQLite doesn't support pool_size/max_overflow with its default pool
if not _is_sqlite:
    _engine_kwargs.update(
        pool_size=10,
        max_overflow=20,
        pool_recycle=3600,  # recycle connections after 1 hour
    )
    if _is_supabase and not _has_sslmode:
        _engine_kwargs["connect_args"] = {"sslmode": "require"}
else:
    _engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(settings.database_url, **_engine_kwargs)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency function to get database session.
    Yields a session and ensures it's closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db() -> None:
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)
