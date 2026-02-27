"""
SQLAlchemy Database Models
"""

import enum
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Integer, Float, DateTime, 
    Text, JSON, Enum, Boolean, ForeignKey
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class JobStatus(str, enum.Enum):
    """Job status enumeration"""
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class DataType(str, enum.Enum):
    """Supported data types for generation"""
    USER = "user"
    ECOMMERCE = "ecommerce"
    COMPANY = "company"
    HEALTHCARE = "healthcare"
    FINANCIAL = "financial"
    EDUCATION = "education"
    SOCIAL_MEDIA = "social_media"
    CUSTOM = "custom"


class OutputFormat(str, enum.Enum):
    """Supported output formats"""
    CSV = "csv"
    JSON = "json"


class User(Base):
    """
    User model for authentication
    """
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    
    # Account status
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    # Usage tracking
    total_records_generated = Column(Integer, default=0)
    storage_used = Column(Integer, default=0)  # bytes
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    last_login = Column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    jobs = relationship("Job", back_populates="user")
    templates = relationship("Template", back_populates="user")
    uploaded_files = relationship("UploadedFile", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email})>"
    
    def to_dict(self):
        """Convert user to dictionary (exclude sensitive data)"""
        return {
            "id": str(self.id),
            "email": self.email,
            "full_name": self.full_name,
            "is_active": self.is_active,
            "is_verified": self.is_verified,
            "total_records_generated": self.total_records_generated,
            "storage_used": self.storage_used,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "last_login": self.last_login.isoformat() if self.last_login else None,
        }


class Job(Base):
    """
    Job model for tracking data generation jobs
    """
    __tablename__ = "jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    
    # Job configuration
    data_type = Column(Enum(DataType, values_callable=lambda x: [e.value for e in x]), nullable=False)
    record_count = Column(Integer, nullable=False)
    output_format = Column(Enum(OutputFormat, values_callable=lambda x: [e.value for e in x]), default=OutputFormat.CSV)
    template_id = Column(UUID(as_uuid=True), ForeignKey("templates.id"), nullable=True)
    
    # Job status
    status = Column(Enum(JobStatus, values_callable=lambda x: [e.value for e in x]), default=JobStatus.PENDING, index=True)
    progress = Column(Float, default=0.0)  # 0.0 to 100.0
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    
    # File information
    file_path = Column(String(500), nullable=True)
    file_size = Column(Integer, nullable=True)  # Size in bytes
    
    # Metadata
    job_metadata = Column(JSON, nullable=True)  # Additional job metadata
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    template = relationship("Template", back_populates="jobs")
    user = relationship("User", back_populates="jobs")
    
    def __repr__(self):
        return f"<Job(id={self.id}, type={self.data_type}, status={self.status})>"
    
    def to_dict(self):
        """Convert job to dictionary"""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id) if self.user_id else None,
            "data_type": self.data_type.value,
            "record_count": self.record_count,
            "output_format": self.output_format.value,
            "template_id": str(self.template_id) if self.template_id else None,
            "status": self.status.value,
            "progress": self.progress,
            "error_message": self.error_message,
            "file_path": self.file_path,
            "file_size": self.file_size,
            "metadata": self.job_metadata,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
        }


class Template(Base):
    """
    Template model for custom data generation schemas
    """
    __tablename__ = "templates"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Schema definition
    schema = Column(JSON, nullable=False)  # Field definitions
    data_type = Column(String(50), nullable=True)  # Data type category
    
    # Template settings
    is_active = Column(Boolean, default=True)
    is_system = Column(Boolean, default=False)  # System templates can't be deleted
    
    # Metadata
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    jobs = relationship("Job", back_populates="template")
    user = relationship("User", back_populates="templates")
    
    def __repr__(self):
        return f"<Template(id={self.id}, name={self.name})>"
    
    def to_dict(self):
        """Convert template to dictionary"""
        return {
            "id": str(self.id),
            "name": self.name,
            "description": self.description,
            "schema": self.schema,
            "data_type": self.data_type,
            "is_active": self.is_active,
            "is_system": self.is_system,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class UploadedFile(Base):
    """
    Uploaded file model for SDV-based synthetic data generation.
    Stores metadata about user-uploaded real datasets and fitted models.
    """
    __tablename__ = "uploaded_files"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    model_path = Column(String(500), nullable=True)
    column_stats = Column(JSON, nullable=True)
    
    row_count = Column(Integer, nullable=True)
    column_count = Column(Integer, nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    
    # Relationships
    user = relationship("User", back_populates="uploaded_files")
    
    def __repr__(self):
        return f"<UploadedFile(id={self.id}, filename={self.filename})>"
