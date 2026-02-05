"""
Authentication Routes
Endpoints for user registration, login, and token management
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

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
    get_user_by_id,
    get_current_user,
    user_to_response,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


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
    
    # Validate password
    if len(user_data.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters"
        )
    
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
    user = authenticate_user(db, user_data.email, user_data.password)
    if not user:
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
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
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
    token_data = decode_token(request.refresh_token)
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


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    full_name: str = None,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile.
    """
    if full_name is not None:
        current_user.full_name = full_name
        db.commit()
        db.refresh(current_user)
    
    return user_to_response(current_user)


@router.post("/logout")
async def logout(current_user = Depends(get_current_user)):
    """
    Logout current user.
    
    Note: With JWT, logout is handled client-side by removing tokens.
    This endpoint is for logging purposes and future token blacklisting.
    """
    return {"message": "Successfully logged out"}
