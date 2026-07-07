"""
API Authentication with JWT
Secure JWT-based authentication for user management
"""

import re
import uuid as _uuid
from datetime import datetime, timedelta, timezone
from threading import Lock
from typing import Optional, Set
from uuid import UUID

from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.models import User

# Password hashing - using bcrypt with truncation handling
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)


def _truncate_password(password: str) -> str:
    """Truncate password to 72 bytes for bcrypt compatibility"""
    return password.encode('utf-8')[:72].decode('utf-8', errors='ignore')

# ---------------------------------------------------------------------------
# Token blacklist (in-memory; swap to Redis for multi-process deployments)
# ---------------------------------------------------------------------------
_blacklisted_jtis: Set[str] = set()
_blacklist_lock = Lock()


def blacklist_token(jti: str) -> None:
    """Add a token's JTI to the blacklist so it is rejected on future use."""
    with _blacklist_lock:
        _blacklisted_jtis.add(jti)


def _is_blacklisted(jti: str) -> bool:
    with _blacklist_lock:
        return jti in _blacklisted_jtis


# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


# ============================================
# Pydantic Schemas
# ============================================

class UserCreate(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Schema for user response (excludes sensitive data)"""
    id: str
    email: str
    full_name: Optional[str]
    is_active: bool
    is_verified: bool
    total_records_generated: int
    storage_used: int
    created_at: Optional[str]
    last_login: Optional[str]

    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    """Schema for token payload data"""
    user_id: Optional[str] = None
    email: Optional[str] = None


class RefreshTokenRequest(BaseModel):
    """Schema for refresh token request"""
    refresh_token: str


# ============================================
# Password Validation
# ============================================

def validate_password_strength(password: str) -> None:
    """
    Validate password meets strength requirements.
    Raises HTTPException if password is too weak.
    """
    errors = []
    if len(password) < settings.min_password_length:
        errors.append(f"Password must be at least {settings.min_password_length} characters")
    if settings.require_password_uppercase and not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    if settings.require_password_digit and not re.search(r'\d', password):
        errors.append("Password must contain at least one digit")
    if errors:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="; ".join(errors)
        )


# ============================================
# Helper Functions
# ============================================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    truncated = _truncate_password(plain_password)
    return pwd_context.verify(truncated, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate password hash"""
    truncated = _truncate_password(password)
    return pwd_context.hash(truncated)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token with a unique JTI for revocation support."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({"exp": expire, "type": "access", "jti": str(_uuid.uuid4())})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token with a unique JTI for revocation support."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    to_encode.update({"exp": expire, "type": "refresh", "jti": str(_uuid.uuid4())})
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_token(token: str, expected_type: str = "access") -> Optional[TokenData]:
    """
    Decode and validate JWT token.

    Args:
        token: The raw JWT string.
        expected_type: Must be ``"access"`` or ``"refresh"``.
            Tokens whose ``type`` claim does not match are rejected.
    """
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])

        # --- Type enforcement (Issue #4) ---
        token_type = payload.get("type")
        if token_type != expected_type:
            return None

        # --- Blacklist check (Issue #5) ---
        jti = payload.get("jti")
        if jti and _is_blacklisted(jti):
            return None

        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        if user_id is None:
            return None
        return TokenData(user_id=user_id, email=email)
    except JWTError:
        return None


def decode_token_raw(token: str) -> Optional[dict]:
    """Decode a JWT and return the raw payload dict (for blacklisting on logout)."""
    try:
        return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except JWTError:
        return None


# ============================================
# Database Functions
# ============================================

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email address"""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    """Get user by ID"""
    try:
        return db.query(User).filter(User.id == UUID(user_id)).first()
    except ValueError:
        return None


def create_user(db: Session, user: UserCreate) -> User:
    """Create a new user"""
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate user with email and password"""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def update_last_login(db: Session, user: User) -> None:
    """Update user's last login timestamp"""
    user.last_login = datetime.now(timezone.utc)
    db.commit()


# ============================================
# Dependency Functions
# ============================================

async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token.
    Raises HTTPException if not authenticated.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not token:
        raise credentials_exception
    
    token_data = decode_token(token)
    if token_data is None or token_data.user_id is None:
        raise credentials_exception
    
    user = get_user_by_id(db, token_data.user_id)
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    
    return user


async def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get current user if authenticated, otherwise return None.
    Does not raise exception if not authenticated.
    """
    if not token:
        return None
    
    token_data = decode_token(token)
    if token_data is None or token_data.user_id is None:
        return None
    
    user = get_user_by_id(db, token_data.user_id)
    if user is None or not user.is_active:
        return None
    
    return user


def user_to_response(user: User) -> UserResponse:
    """Convert User model to UserResponse schema"""
    return UserResponse(
        id=str(user.id),
        email=user.email,
        full_name=user.full_name,
        is_active=user.is_active,
        is_verified=user.is_verified,
        total_records_generated=user.total_records_generated,
        storage_used=user.storage_used,
        created_at=user.created_at.isoformat() if user.created_at else None,
        last_login=user.last_login.isoformat() if user.last_login else None,
    )


# ============================================
# Legacy API Key Authentication (for backward compatibility)
# ============================================

from fastapi.security import APIKeyHeader

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


async def verify_api_key(
    api_key: Optional[str] = Depends(api_key_header),
    token: Optional[str] = Depends(oauth2_scheme),
) -> bool:
    """
    Verify API key or JWT token for authentication.
    At least one valid credential is required.
    """
    # Accept valid API key
    if api_key and api_key == settings.api_key:
        return True
    
    # Accept valid JWT token
    if token:
        token_data = decode_token(token)
        if token_data and token_data.user_id:
            return True
    
    # Neither valid API key nor valid JWT
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Valid API key or Bearer token required",
        headers={"WWW-Authenticate": "Bearer"},
    )


async def get_current_user_id(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[str]:
    """
    Get current user ID from JWT token if available.
    Returns None if not authenticated (for anonymous access).
    """
    if not token:
        return None
    
    token_data = decode_token(token)
    if token_data is None or token_data.user_id is None:
        return None
    
    return token_data.user_id
