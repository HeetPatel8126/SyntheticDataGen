"""
Synthetic Data Generation Platform
Configuration settings using Pydantic Settings
"""

from functools import lru_cache
from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Application configuration settings"""
    
    # Application Settings
    app_name: str = Field(default="Synthetic Data Generator")
    app_env: str = Field(default="development")
    debug: bool = Field(default=True)
    secret_key: str = Field(default="change-me-in-production")
    
    # JWT Authentication
    jwt_secret_key: str = Field(default="jwt-secret-change-in-production")
    jwt_algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=30)
    refresh_token_expire_days: int = Field(default=7)
    
    # API Settings
    api_host: str = Field(default="0.0.0.0")
    api_port: int = Field(default=8000)
    api_prefix: str = Field(default="/api")
    
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
    
    # API Authentication
    api_key: str = Field(default="change-me-in-production")
    
    # Rate Limiting
    rate_limit_requests: int = Field(default=100)
    rate_limit_period: int = Field(default=60)
    
    # Generation Limits
    min_records: int = Field(default=100)
    max_records: int = Field(default=1000000)
    default_records: int = Field(default=1000)
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


settings = get_settings()
