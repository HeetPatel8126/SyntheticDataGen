"""
Pydantic Schemas for API Request/Response validation
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from pydantic import BaseModel, Field, field_validator
from enum import Enum

from app.config import settings

# Re-export enums from models to avoid duplication
from app.models.models import DataType, OutputFormat, JobStatus


class FieldType(str, Enum):
    """Supported field types for custom templates"""
    STRING = "string"
    INTEGER = "integer"
    FLOAT = "float"
    BOOLEAN = "boolean"
    DATE = "date"
    DATETIME = "datetime"
    EMAIL = "email"
    PHONE = "phone"
    ADDRESS = "address"
    NAME = "name"
    COMPANY = "company"
    UUID = "uuid"
    CHOICE = "choice"  # legacy alias for enum
    ENUM = "enum"
    REGEX = "regex"
    DISTRIBUTION = "distribution"
    PERCENTAGE = "percentage"
    PRICE = "price"
    LATITUDE = "latitude"
    LONGITUDE = "longitude"
    DATE_RANGE = "date_range"
    BOOLEAN_WEIGHTED = "boolean_weighted"


# ============== Template Schemas ==============

class TemplateField(BaseModel):
    """Schema for a single template field"""
    name: str = Field(..., min_length=1, max_length=100, description="Field name")
    field_type: FieldType = Field(..., description="Type of data to generate")
    nullable: bool = Field(default=False, description="Whether field can be null")
    options: Optional[Dict[str, Any]] = Field(default=None, description="Field-specific options")
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "email",
                "field_type": "email",
                "nullable": False,
                "options": {"domain": "example.com"}
            }
        }


class TemplateCreate(BaseModel):
    """Schema for creating a new template"""
    name: str = Field(..., min_length=1, max_length=255, description="Template name")
    description: Optional[str] = Field(default=None, max_length=1000, description="Template description")
    schema_fields: List[TemplateField] = Field(..., min_length=1, description="List of fields in the template")
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Customer Profile",
                "description": "Template for customer data",
                "schema_fields": [
                    {"name": "id", "field_type": "uuid", "nullable": False},
                    {"name": "name", "field_type": "name", "nullable": False},
                    {"name": "email", "field_type": "email", "nullable": False}
                ]
            }
        }


class TemplateResponse(BaseModel):
    """Schema for template response"""
    id: UUID
    name: str
    description: Optional[str]
    schema: Dict[str, Any]
    is_active: bool
    is_system: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class TemplateListResponse(BaseModel):
    """Schema for list of templates response"""
    templates: List[TemplateResponse]
    total: int


# ============== Job Schemas ==============

class GenerateRequest(BaseModel):
    """Schema for data generation request"""
    data_type: DataType = Field(..., description="Type of data to generate")
    record_count: int = Field(
        default=settings.default_records,
        ge=settings.min_records,
        le=settings.max_records,
        description="Number of records to generate"
    )
    output_format: OutputFormat = Field(default=OutputFormat.CSV, description="Output file format")
    template_id: Optional[UUID] = Field(default=None, description="Custom template ID (for custom data type)")
    locale: str = Field(default="en_US", description="Locale used by Faker data generation")
    seed: Optional[int] = Field(default=None, ge=0, le=2_147_483_647, description="Optional seed for reproducible generation")
    
    @field_validator('record_count')
    @classmethod
    def validate_record_count(cls, v):
        if v < settings.min_records:
            raise ValueError(f"record_count must be at least {settings.min_records}")
        if v > settings.max_records:
            raise ValueError(f"record_count must not exceed {settings.max_records}")
        return v

    @field_validator('locale')
    @classmethod
    def validate_locale(cls, v):
        if v not in settings.supported_locales:
            raise ValueError(f"Unsupported locale '{v}'. Supported locales: {settings.supported_locales}")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "data_type": "user",
                "record_count": 10000,
                "output_format": "csv"
            }
        }


class PreviewRequest(BaseModel):
    """Schema for data preview request - allows smaller record counts"""
    data_type: DataType = Field(..., description="Type of data to generate")
    record_count: int = Field(
        default=10,
        ge=1,
        le=100,
        description="Number of records to preview (1-100)"
    )
    output_format: OutputFormat = Field(default=OutputFormat.JSON, description="Output format")
    locale: str = Field(default="en_US", description="Locale used by Faker data generation")
    seed: Optional[int] = Field(default=None, ge=0, le=2_147_483_647, description="Optional seed for reproducible preview")

    @field_validator('locale')
    @classmethod
    def validate_locale(cls, v):
        if v not in settings.supported_locales:
            raise ValueError(f"Unsupported locale '{v}'. Supported locales: {settings.supported_locales}")
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "data_type": "user",
                "record_count": 10,
                "output_format": "json"
            }
        }


class GenerateResponse(BaseModel):
    """Schema for generation job creation response"""
    job_id: UUID
    message: str = "Job created successfully"
    status: JobStatus = JobStatus.PENDING
    
    class Config:
        json_schema_extra = {
            "example": {
                "job_id": "123e4567-e89b-12d3-a456-426614174000",
                "message": "Job created successfully",
                "status": "pending"
            }
        }


class JobCreate(BaseModel):
    """Internal schema for job creation"""
    data_type: DataType
    record_count: int
    output_format: OutputFormat = OutputFormat.CSV
    template_id: Optional[UUID] = None
    user_id: Optional[str] = None


class JobResponse(BaseModel):
    """Schema for job response"""
    id: UUID
    user_id: Optional[str]
    data_type: DataType
    record_count: int
    output_format: OutputFormat
    template_id: Optional[UUID]
    status: JobStatus
    progress: float
    error_message: Optional[str]
    file_path: Optional[str]
    file_size: Optional[int]
    job_metadata: Optional[Dict[str, Any]] = Field(None)
    created_at: datetime
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class JobStatusResponse(BaseModel):
    """Schema for job status check response"""
    id: UUID
    status: JobStatus
    progress: float
    error_message: Optional[str]
    created_at: datetime
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class JobListResponse(BaseModel):
    """Schema for list of jobs response"""
    jobs: List[JobResponse]
    total: int
    page: int = 1
    page_size: int = 20


# ============== Data Type Info Schemas ==============

class DataTypeFieldInfo(BaseModel):
    """Information about a field in a data type"""
    name: str
    type: str
    description: str
    example: Any


class DataTypeInfo(BaseModel):
    """Information about a data type"""
    name: str
    description: str
    fields: List[DataTypeFieldInfo]
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "user",
                "description": "User/Person data with personal information",
                "fields": [
                    {"name": "id", "type": "uuid", "description": "Unique identifier", "example": "123e4567-e89b-12d3-a456-426614174000"},
                    {"name": "name", "type": "string", "description": "Full name", "example": "John Doe"}
                ]
            }
        }


class DataTypeListResponse(BaseModel):
    """Schema for list of available data types"""
    data_types: List[DataTypeInfo]


# ============== Common Response Schemas ==============

class ErrorResponse(BaseModel):
    """Schema for error responses"""
    error: str
    detail: Optional[str] = None
    code: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "error": "Job not found",
                "detail": "No job exists with the specified ID",
                "code": "JOB_NOT_FOUND"
            }
        }


class SuccessResponse(BaseModel):
    """Schema for generic success responses"""
    message: str
    data: Optional[Dict[str, Any]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Operation completed successfully",
                "data": None
            }
        }


class HealthResponse(BaseModel):
    """Schema for health check response"""
    status: str = "healthy"
    version: str
    database: str = "connected"
    redis: str = "connected"
    timestamp: datetime


# ============== Upload / SDV Schemas ==============


class UploadSchemaPreview(BaseModel):
    """Schema preview for an uploaded dataset."""
    column_stats: Dict[str, Any]
    preview_rows: List[Dict[str, Any]]


class UploadResponse(BaseModel):
    """Response for a successful upload."""
    upload_id: UUID
    schema_preview: UploadSchemaPreview


class GenerateFromUploadRequest(BaseModel):
    """Request body for generating synthetic data from an uploaded dataset."""
    upload_id: UUID
    record_count: int = Field(
        default=settings.default_records,
        ge=1,
        le=settings.max_records,
        description="Number of synthetic records to generate from the uploaded data",
    )


class GenerateFromUploadResponse(BaseModel):
    """Synthetic data generated from an uploaded dataset."""
    data: List[Dict[str, Any]]


class UploadedFileInfo(BaseModel):
    """Metadata about an uploaded dataset and its fitted model."""
    id: UUID
    filename: str
    file_path: str
    model_path: Optional[str]
    column_stats: Optional[Dict[str, Any]] = None
    row_count: Optional[int] = None
    column_count: Optional[int] = None
    created_at: datetime
    model_fitted: bool

    class Config:
        from_attributes = True


class UploadListResponse(BaseModel):
    """List of uploaded datasets for the current user."""
    uploads: List[UploadedFileInfo]
    total: int


# ============== AI Schema Generation Schemas ==============


class SchemaFromDescriptionRequest(BaseModel):
    """Request body for AI-assisted schema generation."""
    description: str = Field(..., min_length=3, max_length=2000)


class AISchemaField(BaseModel):
    name: str
    field_type: str
    nullable: bool
    enum_values: Optional[List[str]] = None
    min: Optional[str] = None
    max: Optional[str] = None
    regex_pattern: Optional[str] = None


class AISchemaResponse(BaseModel):
    table_name: str
    description: str
    fields: List[AISchemaField]
