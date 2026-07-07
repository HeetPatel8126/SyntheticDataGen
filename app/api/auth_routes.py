"""
Authentication Routes
Endpoints for user registration, login, and token management
"""

import logging
import time
from collections import defaultdict
from threading import Lock

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.api.auth import (
    UserCreate,
    UserLogin,
    UserResponse,
    Token,
    RefreshTokenRequest,
    get_user_by_email,
    create_user,
    authenticate_user,
    update_last_login,
    create_access_token,
    create_refresh_token,
    decode_token,
    decode_token_raw,
    blacklist_token,
    get_user_by_id,
    get_current_user,
    user_to_response,
    verify_password,
    get_password_hash,
    validate_password_strength,
    oauth2_scheme,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])

# ---------------------------------------------------------------------------
# Brute-force login protection  (Issue #6)
# ---------------------------------------------------------------------------
_MAX_LOGIN_ATTEMPTS = 5
_LOCKOUT_SECONDS = 15 * 60  # 15 minutes

_login_attempts: dict[str, list[float]] = defaultdict(list)
_login_lock = Lock()


def _check_login_rate(email: str) -> None:
    """Raise 429 if the email has exceeded the login attempt limit."""
    email_lower = email.lower()
    now = time.monotonic()
    with _login_lock:
        # Purge old entries
        _login_attempts[email_lower] = [
            ts for ts in _login_attempts[email_lower]
            if now - ts < _LOCKOUT_SECONDS
        ]
        if len(_login_attempts[email_lower]) >= _MAX_LOGIN_ATTEMPTS:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many login attempts. Please try again later.",
            )


def _record_failed_login(email: str) -> None:
    email_lower = email.lower()
    with _login_lock:
        _login_attempts[email_lower].append(time.monotonic())


def _clear_login_attempts(email: str) -> None:
    email_lower = email.lower()
    with _login_lock:
        _login_attempts.pop(email_lower, None)


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account.
    
    - **email**: Valid email address (must be unique)
    - **password**: Password (min 6 characters)
    - **full_name**: Optional full name
    """
    # Check if email already exists
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate password strength
    validate_password_strength(user_data.password)
    
    # Create user
    user = create_user(db, user_data)
    update_last_login(db, user)
    
    # Generate tokens
    token_data = {"sub": str(user.id), "email": user.email}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_to_response(user)
    )


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and password.
    
    Returns access and refresh tokens.
    """
    _check_login_rate(user_data.email)

    user = authenticate_user(db, user_data.email, user_data.password)
    if not user:
        _record_failed_login(user_data.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    
    _clear_login_attempts(user_data.email)
    update_last_login(db, user)
    
    # Generate tokens
    token_data = {"sub": str(user.id), "email": user.email}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_to_response(user)
    )


@router.post("/login/form", response_model=Token)
async def login_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    OAuth2 compatible login endpoint (for Swagger UI).
    Uses username field as email.
    """
    _check_login_rate(form_data.username)

    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        _record_failed_login(form_data.username)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    
    _clear_login_attempts(form_data.username)
    update_last_login(db, user)
    
    # Generate tokens
    token_data = {"sub": str(user.id), "email": user.email}
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_to_response(user)
    )


@router.post("/refresh", response_model=Token)
async def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """
    Refresh access token using refresh token.
    
    Returns new access and refresh tokens.
    """
    token_data = decode_token(request.refresh_token, expected_type="refresh")
    if not token_data or not token_data.user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = get_user_by_id(db, token_data.user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated"
        )
    
    # Generate new tokens
    new_token_data = {"sub": str(user.id), "email": user.email}
    access_token = create_access_token(new_token_data)
    new_refresh_token = create_refresh_token(new_token_data)
    
    return Token(
        access_token=access_token,
        refresh_token=new_refresh_token,
        user=user_to_response(user)
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """
    Get current authenticated user's information.
    
    Requires valid access token in Authorization header.
    """
    return user_to_response(current_user)


class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    data: UpdateProfileRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile.
    """
    if data.full_name is not None:
        current_user.full_name = data.full_name
    if data.email is not None:
        # Check if email already taken
        existing = get_user_by_email(db, data.email)
        if existing and existing.id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already in use"
            )
        current_user.email = data.email
    db.commit()
    db.refresh(current_user)
    
    return user_to_response(current_user)


@router.post("/change-password")
async def change_password(
    data: ChangePasswordRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change user's password. Requires current password verification.
    """
    if not verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    validate_password_strength(data.new_password)
    current_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}


@router.post("/logout")
async def logout(
    current_user=Depends(get_current_user),
    token: Optional[str] = Depends(oauth2_scheme),
):
    """
    Logout current user.

    Blacklists the current access token's JTI so it cannot be reused.
    """
    if token:
        payload = decode_token_raw(token)
        if payload and payload.get("jti"):
            blacklist_token(payload["jti"])
    return {"message": "Successfully logged out"}
