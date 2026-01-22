"""
Celery Application Configuration
"""

from celery import Celery
from app.config import settings

# Create Celery application
celery_app = Celery(
    "synthetic_data_generator",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=["app.workers.tasks"]
)

# Celery configuration
celery_app.conf.update(
    # Task settings
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    
    # Task execution settings
    task_acks_late=True,  # Tasks acknowledged after completion
    task_reject_on_worker_lost=True,
    
    # Worker settings
    worker_prefetch_multiplier=1,  # One task at a time per worker
    worker_concurrency=4,  # Number of concurrent workers
    
    # Result backend settings
    result_expires=3600,  # Results expire after 1 hour
    
    # Task routing
    task_routes={
        "app.workers.tasks.generate_data_task": {"queue": "generation"},
        "app.workers.tasks.cleanup_old_files_task": {"queue": "maintenance"},
    },
    
    # Task retry settings
    task_default_retry_delay=60,  # 1 minute retry delay
    task_max_retries=3,
    
    # Beat scheduler for periodic tasks
    beat_schedule={
        "cleanup-old-files": {
            "task": "app.workers.tasks.cleanup_old_files_task",
            "schedule": 86400.0,  # Run daily (in seconds)
        },
    },
)

# Optional: Configure task queues
celery_app.conf.task_queues = {
    "generation": {
        "exchange": "generation",
        "routing_key": "generation",
    },
    "maintenance": {
        "exchange": "maintenance", 
        "routing_key": "maintenance",
    },
}

# Default queue
celery_app.conf.task_default_queue = "generation"
