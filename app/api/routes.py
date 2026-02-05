"""
API Routes
RESTful endpoints for the Synthetic Data Generation Platform
"""

import os
import logging
from typing import Optional, List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session
from starlette.status import (
    HTTP_200_OK, HTTP_201_CREATED, HTTP_404_NOT_FOUND,
    HTTP_400_BAD_REQUEST, HTTP_422_UNPROCESSABLE_ENTITY
)

from app.database import get_db
from app.api.auth import verify_api_key, get_current_user_id
from app.models import Job, Template, JobStatus, DataType, OutputFormat
from app.schemas import (
    GenerateRequest, GenerateResponse, PreviewRequest,
    JobResponse, JobStatusResponse, JobListResponse,
    TemplateCreate, TemplateResponse, TemplateListResponse,
    DataTypeInfo, DataTypeFieldInfo, DataTypeListResponse,
    ErrorResponse, SuccessResponse
)
from app.services.generators import GeneratorFactory
from app.services.file_service import FileService
from app.services.job_service import JobService
from app.workers.tasks import generate_data_task
from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()
file_service = FileService()


# ============== Data Generation Endpoints ==============

@router.post(
    "/preview",
    summary="Preview generated data",
    description="Generate a small sample of data to preview before creating a job.",
    responses={
        200: {"description": "Preview data generated successfully"},
        400: {"model": ErrorResponse, "description": "Invalid request"},
    }
)
async def preview_data(
    request: PreviewRequest,
    api_key: str = Depends(verify_api_key)
):
    """
    Generate a preview of synthetic data (limited to 10 records).
    This is synchronous and returns data immediately for preview purposes.
    
    - **data_type**: Type of data to generate (user, ecommerce, company)
    - **output_format**: Output file format (csv or json) - for preview, only affects response format
    """
    # Validate data type
    if request.data_type.value not in GeneratorFactory.get_available_types():
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid data type. Supported types: {GeneratorFactory.get_available_types()}"
        )
    
    try:
        # Create generator and generate preview records (max 10)
        generator = GeneratorFactory.get_generator(request.data_type.value)
        preview_count = min(request.record_count, 10)  # Limit to 10 for preview
        records = generator.generate_batch(preview_count)
        
        logger.info(f"Generated preview of {preview_count} {request.data_type.value} records")
        return records
        
    except Exception as e:
        logger.error(f"Preview generation failed: {str(e)}")
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Failed to generate preview: {str(e)}"
        )


@router.post(
    "/generate",
    response_model=GenerateResponse,
    status_code=HTTP_201_CREATED,
    summary="Submit a data generation job",
    description="Create a new job to generate synthetic data. The job will be processed asynchronously.",
    responses={
        201: {"description": "Job created successfully"},
        400: {"model": ErrorResponse, "description": "Invalid request"},
        422: {"model": ErrorResponse, "description": "Validation error"}
    }
)
async def create_generation_job(
    request: GenerateRequest,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key),
    user_id: str = Depends(get_current_user_id)
):
    """
    Submit a new data generation job.
    
    - **data_type**: Type of data to generate (user, ecommerce, company)
    - **record_count**: Number of records to generate (100 - 1,000,000)
    - **output_format**: Output file format (csv or json)
    - **template_id**: Optional custom template ID (for custom data type)
    """
    # Validate data type
    if request.data_type.value not in GeneratorFactory.get_available_types():
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Invalid data type. Supported types: {GeneratorFactory.get_available_types()}"
        )
    
    # Create job in database
    job_service = JobService(db)
    job = job_service.create_job(request, user_id)
    
    # Submit task to Celery
    generate_data_task.delay(
        job_id=str(job.id),
        data_type=request.data_type.value,
        record_count=request.record_count,
        output_format=request.output_format.value,
        template_id=str(request.template_id) if request.template_id else None
    )
    
    logger.info(f"Created generation job {job.id} for {request.record_count} {request.data_type.value} records")
    
    return GenerateResponse(
        job_id=job.id,
        message=f"Job created successfully. Generating {request.record_count} {request.data_type.value} records.",
        status=JobStatus.PENDING
    )


# ============== Job Management Endpoints ==============

@router.get(
    "/jobs/{job_id}",
    response_model=JobStatusResponse,
    summary="Get job status",
    description="Check the status and progress of a generation job.",
    responses={
        200: {"description": "Job status retrieved"},
        404: {"model": ErrorResponse, "description": "Job not found"}
    }
)
async def get_job_status(
    job_id: UUID,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """
    Get the status of a generation job.
    
    Returns:
    - **id**: Job identifier
    - **status**: Current status (pending, processing, completed, failed, cancelled)
    - **progress**: Progress percentage (0-100)
    - **error_message**: Error details if job failed
    - **created_at**, **started_at**, **completed_at**: Timestamps
    """
    job_service = JobService(db)
    job = job_service.get_job(job_id)
    
    if not job:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Job with ID {job_id} not found"
        )
    
    return JobStatusResponse(
        id=job.id,
        status=job.status,
        progress=job.progress,
        error_message=job.error_message,
        created_at=job.created_at,
        started_at=job.started_at,
        completed_at=job.completed_at
    )


@router.get(
    "/jobs/{job_id}/details",
    response_model=JobResponse,
    summary="Get full job details",
    description="Get complete details of a generation job including file information.",
    responses={
        200: {"description": "Job details retrieved"},
        404: {"model": ErrorResponse, "description": "Job not found"}
    }
)
async def get_job_details(
    job_id: UUID,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """Get complete job details including configuration and file information."""
    job_service = JobService(db)
    job = job_service.get_job(job_id)
    
    if not job:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Job with ID {job_id} not found"
        )
    
    return JobResponse.model_validate(job)


@router.get(
    "/jobs/{job_id}/download",
    summary="Download generated file",
    description="Download the generated data file for a completed job.",
    responses={
        200: {"description": "File download", "content": {"application/octet-stream": {}}},
        400: {"model": ErrorResponse, "description": "Job not completed"},
        404: {"model": ErrorResponse, "description": "Job or file not found"}
    }
)
async def download_job_file(
    job_id: UUID,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """
    Download the generated data file.
    
    File is only available after job status is 'completed'.
    """
    job_service = JobService(db)
    job = job_service.get_job(job_id)
    
    if not job:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Job with ID {job_id} not found"
        )
    
    if job.status != JobStatus.COMPLETED:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Job is not completed. Current status: {job.status.value}"
        )
    
    if not job.file_path:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Generated file not found"
        )
    
    # Get full file path
    file_path = file_service.get_file_path(job.file_path)
    
    if not file_path.exists():
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail="Generated file no longer exists. It may have been cleaned up."
        )
    
    # Determine content type
    content_type = "text/csv" if job.output_format == OutputFormat.CSV else "application/json"
    
    return FileResponse(
        path=str(file_path),
        filename=job.file_path,
        media_type=content_type
    )


@router.get(
    "/jobs",
    response_model=JobListResponse,
    summary="List all jobs",
    description="Get a paginated list of all generation jobs.",
    responses={
        200: {"description": "Jobs list retrieved"}
    }
)
async def list_jobs(
    status: Optional[str] = Query(None, description="Filter by status"),
    data_type: Optional[str] = Query(None, description="Filter by data type"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key),
    user_id: str = Depends(get_current_user_id)
):
    """
    List all generation jobs with optional filtering and pagination.
    
    - **status**: Filter by job status (pending, processing, completed, failed, cancelled)
    - **data_type**: Filter by data type (user, ecommerce, company)
    - **page**: Page number (default: 1)
    - **page_size**: Items per page (default: 20, max: 100)
    """
    job_service = JobService(db)
    
    # Convert string filters to enums
    status_filter = None
    if status:
        try:
            status_filter = JobStatus(status)
        except ValueError:
            raise HTTPException(
                status_code=HTTP_400_BAD_REQUEST,
                detail=f"Invalid status. Valid values: {[s.value for s in JobStatus]}"
            )
    
    type_filter = None
    if data_type:
        try:
            type_filter = DataType(data_type)
        except ValueError:
            raise HTTPException(
                status_code=HTTP_400_BAD_REQUEST,
                detail=f"Invalid data_type. Valid values: {[t.value for t in DataType]}"
            )
    
    jobs, total = job_service.list_jobs(
        user_id=user_id,
        status=status_filter,
        data_type=type_filter,
        page=page,
        page_size=page_size
    )
    
    return JobListResponse(
        jobs=[JobResponse.model_validate(job) for job in jobs],
        total=total,
        page=page,
        page_size=page_size
    )


@router.delete(
    "/jobs/{job_id}",
    response_model=SuccessResponse,
    summary="Delete a job",
    description="Delete a job and its associated generated file.",
    responses={
        200: {"description": "Job deleted"},
        404: {"model": ErrorResponse, "description": "Job not found"}
    }
)
async def delete_job(
    job_id: UUID,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """Delete a job and clean up its generated file if exists."""
    job_service = JobService(db)
    job = job_service.get_job(job_id)
    
    if not job:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Job with ID {job_id} not found"
        )
    
    # Delete associated file if exists
    if job.file_path:
        try:
            file_service.delete_file(job.file_path)
        except Exception as e:
            logger.warning(f"Failed to delete file for job {job_id}: {e}")
    
    # Delete job from database
    job_service.delete_job(job_id)
    
    return SuccessResponse(message=f"Job {job_id} deleted successfully")


# ============== Template Endpoints ==============

@router.get(
    "/templates",
    response_model=TemplateListResponse,
    summary="List available templates",
    description="Get all available data templates, including system templates and custom templates.",
    responses={
        200: {"description": "Templates list retrieved"}
    }
)
async def list_templates(
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """
    List all available data templates.
    
    Returns system templates (built-in data types) and custom templates.
    """
    # Get system templates from generators
    system_templates = []
    for info in GeneratorFactory.get_all_info():
        system_templates.append(
            TemplateResponse(
                id=UUID('00000000-0000-0000-0000-000000000000'),  # Placeholder ID for system templates
                name=info["name"],
                description=info["description"],
                schema={"fields": info["fields"]},
                is_active=True,
                is_system=True,
                created_at=None,
                updated_at=None
            )
        )
    
    # Get custom templates from database
    custom_templates = db.query(Template).filter(Template.is_active == True).all()
    
    all_templates = system_templates + [
        TemplateResponse.model_validate(t) for t in custom_templates
    ]
    
    return TemplateListResponse(
        templates=all_templates,
        total=len(all_templates)
    )


@router.post(
    "/templates",
    response_model=TemplateResponse,
    status_code=HTTP_201_CREATED,
    summary="Create custom template",
    description="Create a new custom data template with user-defined fields.",
    responses={
        201: {"description": "Template created"},
        400: {"model": ErrorResponse, "description": "Invalid template"}
    }
)
async def create_template(
    template: TemplateCreate,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key),
    user_id: str = Depends(get_current_user_id)
):
    """
    Create a new custom data template.
    
    Define custom fields with types:
    - string, integer, float, boolean
    - date, datetime
    - email, phone, address, name, company
    - uuid, choice
    """
    # Check if template name already exists
    existing = db.query(Template).filter(Template.name == template.name).first()
    if existing:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail=f"Template with name '{template.name}' already exists"
        )
    
    # Convert schema fields to dictionary
    schema_dict = {
        "fields": [field.model_dump() for field in template.schema_fields]
    }
    
    # Create template
    new_template = Template(
        name=template.name,
        description=template.description,
        schema=schema_dict,
        is_active=True,
        is_system=False,
        user_id=user_id
    )
    
    db.add(new_template)
    db.commit()
    db.refresh(new_template)
    
    logger.info(f"Created custom template: {template.name}")
    
    return TemplateResponse.model_validate(new_template)


@router.get(
    "/templates/{template_id}",
    response_model=TemplateResponse,
    summary="Get template details",
    description="Get details of a specific template.",
    responses={
        200: {"description": "Template details retrieved"},
        404: {"model": ErrorResponse, "description": "Template not found"}
    }
)
async def get_template(
    template_id: UUID,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """Get details of a specific template by ID."""
    template = db.query(Template).filter(Template.id == template_id).first()
    
    if not template:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Template with ID {template_id} not found"
        )
    
    return TemplateResponse.model_validate(template)


@router.delete(
    "/templates/{template_id}",
    response_model=SuccessResponse,
    summary="Delete a template",
    description="Delete a custom template. System templates cannot be deleted.",
    responses={
        200: {"description": "Template deleted"},
        400: {"model": ErrorResponse, "description": "Cannot delete system template"},
        404: {"model": ErrorResponse, "description": "Template not found"}
    }
)
async def delete_template(
    template_id: UUID,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
):
    """Delete a custom template. System templates cannot be deleted."""
    template = db.query(Template).filter(Template.id == template_id).first()
    
    if not template:
        raise HTTPException(
            status_code=HTTP_404_NOT_FOUND,
            detail=f"Template with ID {template_id} not found"
        )
    
    if template.is_system:
        raise HTTPException(
            status_code=HTTP_400_BAD_REQUEST,
            detail="System templates cannot be deleted"
        )
    
    db.delete(template)
    db.commit()
    
    return SuccessResponse(message=f"Template '{template.name}' deleted successfully")


# ============== Data Types Info Endpoint ==============

@router.get(
    "/data-types",
    response_model=DataTypeListResponse,
    summary="List available data types",
    description="Get information about all supported data types and their fields.",
    responses={
        200: {"description": "Data types list retrieved"}
    }
)
async def list_data_types(
    api_key: str = Depends(verify_api_key)
):
    """
    Get information about all available data types.
    
    Returns details about each data type including:
    - Name and description
    - Available fields with types and examples
    """
    data_types = []
    
    for info in GeneratorFactory.get_all_info():
        fields = [
            DataTypeFieldInfo(
                name=f["name"],
                type=f["type"],
                description=f["description"],
                example=f["example"]
            )
            for f in info["fields"]
        ]
        
        data_types.append(
            DataTypeInfo(
                name=info["name"],
                description=info["description"],
                fields=fields
            )
        )
    
    return DataTypeListResponse(data_types=data_types)


# ============== Stats Endpoint ==============

@router.get(
    "/stats",
    summary="Get platform statistics",
    description="Get statistics about jobs and storage usage.",
    responses={
        200: {"description": "Statistics retrieved"}
    }
)
async def get_stats(
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key),
    user_id: str = Depends(get_current_user_id)
):
    """
    Get platform statistics including:
    - Job counts by status and type
    - Storage usage statistics
    """
    job_service = JobService(db)
    job_stats = job_service.get_stats(user_id)
    storage_stats = file_service.get_storage_stats()
    
    return {
        "jobs": job_stats,
        "storage": storage_stats
    }
