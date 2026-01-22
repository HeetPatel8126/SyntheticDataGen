"""
Synthetic Data Generation Platform
Main FastAPI Application Entry Point
"""

import logging
from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.openapi.utils import get_openapi

from app.config import settings
from app.database import init_db, engine, Base
from app.api.routes import router as api_router
from app import __version__

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Runs on startup and shutdown.
    """
    # Startup
    logger.info(f"Starting {settings.app_name} v{__version__}")
    
    # Initialize database tables
    logger.info("Initializing database...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database initialized successfully")
    
    # Ensure storage directory exists
    import os
    os.makedirs(settings.storage_path, exist_ok=True)
    logger.info(f"Storage directory ready: {settings.storage_path}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application...")


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="""
## Synthetic Data Generation Platform API

Generate realistic synthetic data for testing, development, and demos.

### Features

- **Multiple Data Types**: Generate User/Person, E-commerce, and Company data
- **Flexible Output**: Export as CSV or JSON
- **Async Processing**: Large datasets processed in background
- **Progress Tracking**: Real-time job status and progress updates
- **Custom Templates**: Create your own data schemas

### Quick Start

1. Get your API key
2. Submit a generation request to `/api/generate`
3. Poll `/api/jobs/{job_id}` for status
4. Download your file from `/api/jobs/{job_id}/download`

### Authentication

All endpoints require an API key. Include it in your request:
- Header: `X-API-Key: your-api-key`
- Query parameter: `?api_key=your-api-key`
    """,
    version=__version__,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Custom exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom handler for HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "status_code": exc.status_code,
            "path": str(request.url.path)
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Custom handler for unhandled exceptions"""
    logger.exception(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if settings.debug else "An unexpected error occurred",
            "path": str(request.url.path)
        }
    )


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests"""
    start_time = datetime.utcnow()
    
    response = await call_next(request)
    
    process_time = (datetime.utcnow() - start_time).total_seconds() * 1000
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.2f}ms"
    )
    
    return response


# Health check endpoint (no auth required)
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    Returns application health status.
    """
    return {
        "status": "healthy",
        "version": __version__,
        "app_name": settings.app_name,
        "environment": settings.app_env,
        "timestamp": datetime.utcnow().isoformat()
    }


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint.
    Returns basic API information and links to documentation.
    """
    return {
        "name": settings.app_name,
        "version": __version__,
        "description": "Synthetic Data Generation Platform API",
        "documentation": {
            "swagger": "/docs",
            "redoc": "/redoc",
            "openapi": "/openapi.json"
        },
        "endpoints": {
            "generate": f"{settings.api_prefix}/generate",
            "jobs": f"{settings.api_prefix}/jobs",
            "templates": f"{settings.api_prefix}/templates",
            "data_types": f"{settings.api_prefix}/data-types"
        }
    }


# Include API router with prefix
app.include_router(
    api_router,
    prefix=settings.api_prefix,
    tags=["API"]
)


# Custom OpenAPI schema
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=settings.app_name,
        version=__version__,
        description=app.description,
        routes=app.routes,
    )
    
    # Add security scheme
    openapi_schema["components"]["securitySchemes"] = {
        "ApiKeyHeader": {
            "type": "apiKey",
            "in": "header",
            "name": "X-API-Key"
        },
        "ApiKeyQuery": {
            "type": "apiKey",
            "in": "query",
            "name": "api_key"
        }
    }
    
    # Apply security globally to API endpoints
    openapi_schema["security"] = [
        {"ApiKeyHeader": []},
        {"ApiKeyQuery": []}
    ]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug,
        log_level="debug" if settings.debug else "info"
    )
