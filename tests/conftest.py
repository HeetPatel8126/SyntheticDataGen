"""
Pytest Configuration and Fixtures
"""

import os
import sys
import pytest
from typing import Generator
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.database import Base, get_db
from app.config import settings


# Test database URL (use SQLite for testing)
TEST_DATABASE_URL = "sqlite:///./test.db"

# Create test engine
test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# Create test session factory
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db() -> Generator[Session, None, None]:
    """Override database dependency for testing"""
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    """Set up test database before all tests"""
    # Create all tables
    Base.metadata.create_all(bind=test_engine)
    yield
    # Drop all tables after tests
    Base.metadata.drop_all(bind=test_engine)
    # Remove test database file
    if os.path.exists("./test.db"):
        os.remove("./test.db")


@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    """Get a test database session"""
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestSessionLocal(bind=connection)
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """Get a test client with database session override"""
    def override_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


@pytest.fixture
def api_headers() -> dict:
    """Get API headers with authentication"""
    return {
        "X-API-Key": settings.api_key,
        "Content-Type": "application/json"
    }


@pytest.fixture
def test_storage_path(tmp_path):
    """Create a temporary storage path for tests"""
    storage = tmp_path / "generated_data"
    storage.mkdir()
    return storage
