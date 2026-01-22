"""
SQLAlchemy Database Models
"""

import enum
import uuid
from datetime import datetime
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
    CUSTOM = "custom"


class OutputFormat(str, enum.Enum):
    """Supported output formats"""
    CSV = "csv"
    JSON = "json"


class Job(Base):
    """
    Job model for tracking data generation jobs
    """
    __tablename__ = "jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(String(255), nullable=True, index=True)  # For future user management
    
    # Job configuration
    data_type = Column(Enum(DataType), nullable=False)
    record_count = Column(Integer, nullable=False)
    output_format = Column(Enum(OutputFormat), default=OutputFormat.CSV)
    template_id = Column(UUID(as_uuid=True), ForeignKey("templates.id"), nullable=True)
    
    # Job status
    status = Column(Enum(JobStatus), default=JobStatus.PENDING, index=True)
    progress = Column(Float, default=0.0)  # 0.0 to 100.0
    error_message = Column(Text, nullable=True)
    retry_count = Column(Integer, default=0)
    max_retries = Column(Integer, default=3)
    
    # File information
    file_path = Column(String(500), nullable=True)
    file_size = Column(Integer, nullable=True)  # Size in bytes
    
    # Metadata
    metadata = Column(JSON, nullable=True)  # Additional job metadata
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    template = relationship("Template", back_populates="jobs")
    
    def __repr__(self):
        return f"<Job(id={self.id}, type={self.data_type}, status={self.status})>"
    
    def to_dict(self):
        """Convert job to dictionary"""
        return {
            "id": str(self.id),
            "user_id": self.user_id,
            "data_type": self.data_type.value,
            "record_count": self.record_count,
            "output_format": self.output_format.value,
            "template_id": str(self.template_id) if self.template_id else None,
            "status": self.status.value,
            "progress": self.progress,
            "error_message": self.error_message,
            "file_path": self.file_path,
            "file_size": self.file_size,
            "metadata": self.metadata,
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
    name = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(Text, nullable=True)
    
    # Schema definition
    schema = Column(JSON, nullable=False)  # Field definitions
    
    # Template settings
    is_active = Column(Boolean, default=True)
    is_system = Column(Boolean, default=False)  # System templates can't be deleted
    
    # Metadata
    user_id = Column(String(255), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    jobs = relationship("Job", back_populates="template")
    
    def __repr__(self):
        return f"<Template(id={self.id}, name={self.name})>"
    
    def to_dict(self):
        """Convert template to dictionary"""
        return {
            "id": str(self.id),
            "name": self.name,
            "description": self.description,
            "schema": self.schema,
            "is_active": self.is_active,
            "is_system": self.is_system,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
