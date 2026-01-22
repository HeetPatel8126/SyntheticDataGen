"""
Job Service
Business logic for job management
"""

import logging
from datetime import datetime
from typing import Optional, List, Dict, Any
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models import Job, JobStatus, DataType, OutputFormat
from app.schemas import JobCreate, GenerateRequest

logger = logging.getLogger(__name__)


class JobService:
    """
    Service for managing generation jobs.
    Handles job creation, status updates, and retrieval.
    """
    
    def __init__(self, db: Session):
        """
        Initialize job service.
        
        Args:
            db: Database session
        """
        self.db = db
    
    def create_job(self, request: GenerateRequest, user_id: Optional[str] = None) -> Job:
        """
        Create a new generation job.
        
        Args:
            request: Generation request parameters
            user_id: Optional user identifier
            
        Returns:
            Created job instance
        """
        job = Job(
            user_id=user_id,
            data_type=DataType(request.data_type.value),
            record_count=request.record_count,
            output_format=OutputFormat(request.output_format.value),
            template_id=request.template_id,
            status=JobStatus.PENDING,
            progress=0.0,
            metadata={
                "requested_at": datetime.utcnow().isoformat()
            }
        )
        
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        
        logger.info(f"Created job {job.id} for {request.data_type.value} with {request.record_count} records")
        return job
    
    def get_job(self, job_id: UUID) -> Optional[Job]:
        """
        Get a job by ID.
        
        Args:
            job_id: Job identifier
            
        Returns:
            Job instance or None
        """
        return self.db.query(Job).filter(Job.id == job_id).first()
    
    def get_job_by_id_str(self, job_id: str) -> Optional[Job]:
        """
        Get a job by ID string.
        
        Args:
            job_id: Job identifier as string
            
        Returns:
            Job instance or None
        """
        try:
            return self.db.query(Job).filter(Job.id == UUID(job_id)).first()
        except ValueError:
            return None
    
    def update_job_status(
        self,
        job_id: UUID,
        status: JobStatus,
        progress: Optional[float] = None,
        error_message: Optional[str] = None
    ) -> Optional[Job]:
        """
        Update job status.
        
        Args:
            job_id: Job identifier
            status: New status
            progress: Optional progress value (0-100)
            error_message: Optional error message
            
        Returns:
            Updated job or None
        """
        job = self.get_job(job_id)
        if not job:
            return None
        
        job.status = status
        
        if progress is not None:
            job.progress = progress
        
        if error_message:
            job.error_message = error_message
        
        if status == JobStatus.PROCESSING and job.started_at is None:
            job.started_at = datetime.utcnow()
        
        if status in [JobStatus.COMPLETED, JobStatus.FAILED, JobStatus.CANCELLED]:
            job.completed_at = datetime.utcnow()
            if status == JobStatus.COMPLETED:
                job.progress = 100.0
        
        self.db.commit()
        self.db.refresh(job)
        
        logger.info(f"Updated job {job_id} status to {status.value}")
        return job
    
    def update_job_progress(self, job_id: UUID, progress: float) -> Optional[Job]:
        """
        Update job progress.
        
        Args:
            job_id: Job identifier
            progress: Progress value (0-100)
            
        Returns:
            Updated job or None
        """
        job = self.get_job(job_id)
        if not job:
            return None
        
        job.progress = min(100.0, max(0.0, progress))
        self.db.commit()
        
        return job
    
    def complete_job(
        self,
        job_id: UUID,
        file_path: str,
        file_size: int,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Optional[Job]:
        """
        Mark job as completed with file information.
        
        Args:
            job_id: Job identifier
            file_path: Path to generated file
            file_size: Size of generated file
            metadata: Optional additional metadata
            
        Returns:
            Updated job or None
        """
        job = self.get_job(job_id)
        if not job:
            return None
        
        job.status = JobStatus.COMPLETED
        job.progress = 100.0
        job.file_path = file_path
        job.file_size = file_size
        job.completed_at = datetime.utcnow()
        
        if metadata:
            job.metadata = {**(job.metadata or {}), **metadata}
        
        self.db.commit()
        self.db.refresh(job)
        
        logger.info(f"Completed job {job_id}, file: {file_path}")
        return job
    
    def fail_job(
        self,
        job_id: UUID,
        error_message: str,
        increment_retry: bool = True
    ) -> Optional[Job]:
        """
        Mark job as failed.
        
        Args:
            job_id: Job identifier
            error_message: Error description
            increment_retry: Whether to increment retry count
            
        Returns:
            Updated job or None
        """
        job = self.get_job(job_id)
        if not job:
            return None
        
        job.status = JobStatus.FAILED
        job.error_message = error_message
        job.completed_at = datetime.utcnow()
        
        if increment_retry:
            job.retry_count += 1
        
        self.db.commit()
        self.db.refresh(job)
        
        logger.error(f"Job {job_id} failed: {error_message}")
        return job
    
    def can_retry(self, job: Job) -> bool:
        """
        Check if a job can be retried.
        
        Args:
            job: Job instance
            
        Returns:
            True if job can be retried
        """
        return job.retry_count < job.max_retries
    
    def list_jobs(
        self,
        user_id: Optional[str] = None,
        status: Optional[JobStatus] = None,
        data_type: Optional[DataType] = None,
        page: int = 1,
        page_size: int = 20
    ) -> tuple[List[Job], int]:
        """
        List jobs with optional filtering and pagination.
        
        Args:
            user_id: Filter by user
            status: Filter by status
            data_type: Filter by data type
            page: Page number (1-based)
            page_size: Items per page
            
        Returns:
            Tuple of (jobs list, total count)
        """
        query = self.db.query(Job)
        
        if user_id:
            query = query.filter(Job.user_id == user_id)
        
        if status:
            query = query.filter(Job.status == status)
        
        if data_type:
            query = query.filter(Job.data_type == data_type)
        
        # Get total count
        total = query.count()
        
        # Apply pagination
        offset = (page - 1) * page_size
        jobs = query.order_by(desc(Job.created_at)).offset(offset).limit(page_size).all()
        
        return jobs, total
    
    def delete_job(self, job_id: UUID) -> bool:
        """
        Delete a job.
        
        Args:
            job_id: Job identifier
            
        Returns:
            True if job was deleted
        """
        job = self.get_job(job_id)
        if not job:
            return False
        
        self.db.delete(job)
        self.db.commit()
        
        logger.info(f"Deleted job {job_id}")
        return True
    
    def get_stats(self, user_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Get job statistics.
        
        Args:
            user_id: Optional user filter
            
        Returns:
            Dictionary with statistics
        """
        query = self.db.query(Job)
        
        if user_id:
            query = query.filter(Job.user_id == user_id)
        
        total = query.count()
        
        status_counts = {}
        for status in JobStatus:
            count = query.filter(Job.status == status).count()
            status_counts[status.value] = count
        
        type_counts = {}
        for dtype in DataType:
            count = query.filter(Job.data_type == dtype).count()
            type_counts[dtype.value] = count
        
        return {
            "total_jobs": total,
            "by_status": status_counts,
            "by_type": type_counts
        }
