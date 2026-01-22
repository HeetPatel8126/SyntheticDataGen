"""
Celery Tasks for Data Generation
"""

import logging
from uuid import UUID
from typing import Optional

from celery import shared_task
from celery.exceptions import MaxRetriesExceededError

from app.workers.celery_app import celery_app
from app.database import SessionLocal
from app.models import Job, JobStatus
from app.services.generators import GeneratorFactory
from app.services.file_service import FileService
from app.config import settings

logger = logging.getLogger(__name__)


def get_db_session():
    """Get a new database session"""
    return SessionLocal()


def update_job_in_db(job_id: str, **kwargs):
    """Update job fields in database"""
    db = get_db_session()
    try:
        job = db.query(Job).filter(Job.id == UUID(job_id)).first()
        if job:
            for key, value in kwargs.items():
                setattr(job, key, value)
            db.commit()
            return True
        return False
    finally:
        db.close()


@celery_app.task(
    bind=True,
    name="app.workers.tasks.generate_data_task",
    max_retries=3,
    default_retry_delay=60,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_jitter=True
)
def generate_data_task(
    self,
    job_id: str,
    data_type: str,
    record_count: int,
    output_format: str,
    template_id: Optional[str] = None
):
    """
    Celery task for generating synthetic data.
    
    Args:
        job_id: Unique job identifier
        data_type: Type of data to generate (user, ecommerce, company)
        record_count: Number of records to generate
        output_format: Output file format (csv, json)
        template_id: Optional custom template ID
    """
    logger.info(f"Starting data generation task for job {job_id}")
    
    db = get_db_session()
    file_service = FileService()
    
    try:
        # Get job from database
        job = db.query(Job).filter(Job.id == UUID(job_id)).first()
        
        if not job:
            logger.error(f"Job {job_id} not found in database")
            return {"status": "error", "message": "Job not found"}
        
        # Update job status to processing
        job.status = JobStatus.PROCESSING
        from datetime import datetime
        job.started_at = datetime.utcnow()
        db.commit()
        
        logger.info(f"Job {job_id}: Generating {record_count} {data_type} records")
        
        # Create generator
        generator = GeneratorFactory.get_generator(data_type)
        
        # Generate filename
        filename = file_service.generate_filename(
            data_type=data_type,
            output_format=output_format,
            job_id=job_id
        )
        
        file_path = file_service.get_file_path(filename)
        
        # Progress callback for updating database
        last_progress = [0]  # Use list to allow modification in nested function
        
        def progress_callback(progress: float):
            # Only update if progress changed significantly (every 5%)
            if progress - last_progress[0] >= 5:
                last_progress[0] = progress
                try:
                    update_job_in_db(job_id, progress=progress)
                    logger.debug(f"Job {job_id}: Progress {progress:.1f}%")
                except Exception as e:
                    logger.warning(f"Failed to update progress: {e}")
        
        # Generate data based on format
        if output_format.lower() == "csv":
            result = generator.save_to_csv(
                count=record_count,
                file_path=str(file_path),
                progress_callback=progress_callback
            )
        else:
            result = generator.save_to_json(
                count=record_count,
                file_path=str(file_path),
                progress_callback=progress_callback
            )
        
        # Update job with completion info
        job.status = JobStatus.COMPLETED
        job.progress = 100.0
        job.file_path = filename  # Store relative filename
        job.file_size = result["file_size"]
        job.completed_at = datetime.utcnow()
        job.metadata = {
            **(job.metadata or {}),
            "generation_time_seconds": result["generation_time_seconds"],
            "generated_at": result["generated_at"]
        }
        db.commit()
        
        logger.info(
            f"Job {job_id}: Completed successfully. "
            f"Generated {record_count} records in {result['generation_time_seconds']:.2f}s"
        )
        
        return {
            "status": "completed",
            "job_id": job_id,
            "file_path": filename,
            "file_size": result["file_size"],
            "record_count": record_count,
            "generation_time_seconds": result["generation_time_seconds"]
        }
        
    except Exception as e:
        logger.exception(f"Job {job_id}: Generation failed with error: {str(e)}")
        
        # Update job status to failed
        try:
            job = db.query(Job).filter(Job.id == UUID(job_id)).first()
            if job:
                job.status = JobStatus.FAILED
                job.error_message = str(e)
                job.retry_count = self.request.retries
                from datetime import datetime
                job.completed_at = datetime.utcnow()
                db.commit()
        except Exception as db_error:
            logger.error(f"Failed to update job status: {db_error}")
        
        # Re-raise to trigger retry if retries remaining
        if self.request.retries < self.max_retries:
            raise self.retry(exc=e)
        
        return {
            "status": "failed",
            "job_id": job_id,
            "error": str(e)
        }
        
    finally:
        db.close()


@celery_app.task(name="app.workers.tasks.cleanup_old_files_task")
def cleanup_old_files_task(max_age_days: Optional[int] = None):
    """
    Periodic task to clean up old generated files.
    
    Args:
        max_age_days: Maximum file age in days (defaults to settings)
    """
    logger.info("Starting file cleanup task")
    
    file_service = FileService()
    deleted_count = file_service.cleanup_old_files(max_age_days)
    
    logger.info(f"File cleanup completed: {deleted_count} files deleted")
    
    return {
        "status": "completed",
        "files_deleted": deleted_count
    }


@celery_app.task(name="app.workers.tasks.cancel_job_task")
def cancel_job_task(job_id: str):
    """
    Task to cancel a running job.
    
    Args:
        job_id: Job identifier to cancel
    """
    logger.info(f"Cancelling job {job_id}")
    
    db = get_db_session()
    
    try:
        job = db.query(Job).filter(Job.id == UUID(job_id)).first()
        
        if not job:
            return {"status": "error", "message": "Job not found"}
        
        if job.status in [JobStatus.COMPLETED, JobStatus.FAILED]:
            return {"status": "error", "message": f"Job already {job.status.value}"}
        
        job.status = JobStatus.CANCELLED
        from datetime import datetime
        job.completed_at = datetime.utcnow()
        db.commit()
        
        logger.info(f"Job {job_id} cancelled successfully")
        return {"status": "cancelled", "job_id": job_id}
        
    finally:
        db.close()
