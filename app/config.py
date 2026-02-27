"""
Synthetic Data Generation Platform
Configuration settings using Pydantic Settings
"""

import secrets
from functools import lru_cache
from typing import Optional, List
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator


def _generate_fallback_secret() -> str:
    """Generate a random secret for development only."""
    return secrets.token_urlsafe(48)


class Settings(BaseSettings):
    """Application configuration settings"""
    
    # Application Settings
    app_name: str = Field(default="Synthetic Data Generator")
    app_env: str = Field(default="production")
    debug: bool = Field(default=False)
    secret_key: str = Field(default_factory=_generate_fallback_secret)
    
    # JWT Authentication
    jwt_secret_key: str = Field(default_factory=_generate_fallback_secret)
    jwt_algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=30)
    refresh_token_expire_days: int = Field(default=7)
    
    # API Settings
    api_host: str = Field(default="0.0.0.0")
    api_port: int = Field(default=8000)
    api_prefix: str = Field(default="/api")
    
    # CORS Settings
    cors_origins: List[str] = Field(default=["http://localhost:3000", "http://localhost:3001"])
    
    # Database Configuration
    database_url: str = Field(default="sqlite:///./synthetic_data.db")
    database_echo: bool = Field(default=False)
    
    # Redis Configuration
    redis_url: str = Field(default="redis://localhost:6379/0")
    
    # Celery Configuration
    celery_broker_url: str = Field(default="redis://localhost:6379/0")
    celery_result_backend: str = Field(default="redis://localhost:6379/0")
    
    # File Storage
    storage_path: str = Field(default="./generated_data")
    max_file_age_days: int = Field(default=7)
    max_upload_size_mb: int = Field(default=50)
    model_storage_path: str = Field(default="./fitted_models")
    
    # AI / Gemini
    gemini_api_key: Optional[str] = Field(default=None)
    
    # API Authentication
    api_key: str = Field(default_factory=_generate_fallback_secret)
    
    # Rate Limiting
    rate_limit_requests: int = Field(default=100)
    rate_limit_period: int = Field(default=60)
    
    # Generation Limits
    min_records: int = Field(default=100)
    max_records: int = Field(default=1000000)
    default_records: int = Field(default=1000)
    
    # Password Policy
    min_password_length: int = Field(default=8)
    require_password_uppercase: bool = Field(default=True)
    require_password_digit: bool = Field(default=True)
    
    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


settings = get_settings()
