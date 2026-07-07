"""
Upload & SDV Routes

Endpoints:
- POST /api/upload — upload real data file, returns upload_id + schema preview
- POST /api/generate-from-upload — generate synthetic data from a fitted SDV model
- GET /api/uploads — list user's uploaded datasets and model status
"""

import json
import logging
import os
from pathlib import Path
from typing import Optional
from uuid import UUID as UUIDType

import pandas as pd
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.auth import verify_api_key, get_current_user_id
from app.config import settings
from app.database import get_db
from app.models import UploadedFile
from app.schemas import (
    UploadResponse,
    UploadSchemaPreview,
    GenerateFromUploadRequest,
    GenerateFromUploadResponse,
    UploadListResponse,
    UploadedFileInfo,
)
from app.services.upload_service import UploadService
from app.services.sdv_service import SDVService
from app.workers.tasks import fit_sdv_model_task

logger = logging.getLogger(__name__)

router = APIRouter()


def _enforce_upload_ownership(
    requester_user_id: Optional[str],
    resource_user_id,
    resource_id,
) -> None:
    """Strict ownership check for uploads — mirrors routes._enforce_ownership."""
    owner_str = str(resource_user_id) if resource_user_id else None
    if owner_str and not requester_user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Upload with ID {resource_id} not found",
        )
    if owner_str and requester_user_id and owner_str != requester_user_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Upload with ID {resource_id} not found",
        )


def _load_dataframe_from_uploaded(upload: UploadedFile) -> pd.DataFrame:
    """Load the original dataframe for an UploadedFile from disk."""
    storage_path = Path(settings.storage_path)
    full_path = storage_path / upload.file_path

    if not full_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Original uploaded file not found on disk.",
        )

    ext = full_path.suffix.lower()
    if ext == ".csv":
        return pd.read_csv(full_path)

    # JSON: try newline-delimited first, then standard JSON
    try:
        return pd.read_json(full_path, lines=True)
    except ValueError:
        return pd.read_json(full_path)


@router.post(
    "/upload",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload real dataset for SDV modeling",
    description="Upload a CSV or JSON file (up to 50MB). The file is analyzed and an SDV model is fitted asynchronously.",
)
async def upload_dataset(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    api_key: bool = Depends(verify_api_key),
    user_id: Optional[str] = Depends(get_current_user_id),
):
    """
    Upload a real dataset for SDV-based synthetic data generation.

    Returns an upload_id and a schema preview (column stats + first 5 rows).
    SDV model fitting is dispatched as a Celery background task.
    """
    upload_service = UploadService(db)
    uploaded, column_stats, preview_rows = upload_service.handle_upload(file, user_id)

    # Kick off SDV fitting in the background
    try:
        fit_sdv_model_task.delay(str(uploaded.id))
    except Exception as exc:
        # Log but do not fail the upload; generation can still fall back to basic sampling
        logger.warning("Failed to enqueue SDV fitting task for upload %s: %s", uploaded.id, exc)

    schema_preview = UploadSchemaPreview(
        column_stats=column_stats,
        preview_rows=preview_rows,
    )

    return UploadResponse(
        upload_id=uploaded.id,
        schema_preview=schema_preview,
    )


@router.post(
    "/generate-from-upload",
    response_model=GenerateFromUploadResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate synthetic data from uploaded dataset",
    description="Generate statistically realistic synthetic data using the fitted SDV model for a previously uploaded dataset.",
)
async def generate_from_upload(
    request: GenerateFromUploadRequest,
    db: Session = Depends(get_db),
    api_key: bool = Depends(verify_api_key),
    user_id: Optional[str] = Depends(get_current_user_id),
):
    """
    Generate synthetic data from an uploaded dataset using its fitted SDV model.

    If the SDV model is not yet fitted, returns a 400 error.
    """
    upload: Optional[UploadedFile] = (
        db.query(UploadedFile).filter(UploadedFile.id == request.upload_id).first()
    )

    if not upload:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Upload with ID {request.upload_id} not found",
        )

    _enforce_upload_ownership(user_id, upload.user_id, request.upload_id)

    if not upload.model_path:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SDV model is not yet fitted for this upload. Please try again later.",
        )

    df_original = _load_dataframe_from_uploaded(upload)
    sdv_service = SDVService()
    df_synth = sdv_service.sample(
        model_path=upload.model_path,
        df_original=df_original,
        record_count=request.record_count,
    )

    data = json.loads(df_synth.to_json(orient="records", date_format="iso"))
    return GenerateFromUploadResponse(data=data)


@router.get(
    "/uploads",
    response_model=UploadListResponse,
    status_code=status.HTTP_200_OK,
    summary="List uploaded datasets",
    description="List the current user's uploaded datasets and whether an SDV model has been fitted.",
)
async def list_uploads(
    db: Session = Depends(get_db),
    api_key: bool = Depends(verify_api_key),
    user_id: Optional[str] = Depends(get_current_user_id),
):
    """
    List uploaded datasets for the authenticated user.
    """
    query = db.query(UploadedFile)
    if user_id:
        query = query.filter(UploadedFile.user_id == user_id)
    else:
        # API-key-only auth (no JWT) should not see other users' uploads
        query = query.filter(UploadedFile.user_id.is_(None))

    uploads = query.order_by(UploadedFile.created_at.desc()).all()

    items = [
        UploadedFileInfo(
            id=u.id,
            filename=u.filename,
            file_path=u.file_path,
            model_path=u.model_path,
            column_stats=u.column_stats,
            row_count=u.row_count,
            column_count=u.column_count,
            created_at=u.created_at,
            model_fitted=bool(u.model_path),
        )
        for u in uploads
    ]

    return UploadListResponse(uploads=items, total=len(items))

