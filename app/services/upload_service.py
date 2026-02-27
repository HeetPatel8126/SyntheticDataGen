"""
Upload Service
Handles upload validation, storage, and schema/statistics extraction.
"""

import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import pandas as pd
from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.config import settings
from app.models.models import UploadedFile

logger = logging.getLogger(__name__)


class UploadService:
    """
    Service for handling user-uploaded real datasets (CSV/JSON).
    """

    def __init__(self, db: Session) -> None:
        self.db = db
        self.base_path = Path(settings.storage_path)
        self.uploads_path = self.base_path / "uploads"
        self.uploads_path.mkdir(parents=True, exist_ok=True)

    def _validate_file_type(self, filename: str) -> str:
        ext = os.path.splitext(filename)[1].lower()
        if ext not in {".csv", ".json"}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Only CSV and JSON files are supported.",
            )
        return ext

    def _validate_file_size(self, upload_file: UploadFile) -> None:
        max_bytes = settings.max_upload_size_mb * 1024 * 1024
        file_obj = upload_file.file
        file_obj.seek(0, os.SEEK_END)
        size = file_obj.tell()
        file_obj.seek(0)

        if size > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File is too large. Max size is {settings.max_upload_size_mb} MB.",
            )

    def _save_file(self, upload_file: UploadFile, ext: str) -> str:
        """
        Save uploaded file to disk under the uploads directory.

        Returns a storage-relative path (e.g. 'uploads/<timestamp>_<name>.ext').
        """
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        safe_name = os.path.basename(upload_file.filename)
        filename = f"{timestamp}_{safe_name}"
        relative_path = os.path.join("uploads", filename)
        full_path = self.base_path / relative_path

        with open(full_path, "wb") as f:
            while True:
                chunk = upload_file.file.read(1024 * 1024)
                if not chunk:
                    break
                f.write(chunk)

        logger.info("Saved uploaded file to %s", full_path)
        return relative_path

    def _load_dataframe(self, full_path: Path, ext: str) -> pd.DataFrame:
        if ext == ".csv":
            return pd.read_csv(full_path)

        # JSON: try newline-delimited first, then standard JSON
        try:
            return pd.read_json(full_path, lines=True)
        except ValueError:
            return pd.read_json(full_path)

    def _compute_column_stats(self, df: pd.DataFrame) -> Dict[str, Any]:
        stats: Dict[str, Any] = {}
        total_rows = len(df)

        for col in df.columns:
            series = df[col]
            non_null = series.dropna()
            null_count = series.isna().sum()
            null_pct = float(null_count) / total_rows if total_rows > 0 else 0.0

            col_stats: Dict[str, Any] = {
                "dtype": str(series.dtype),
                "null_count": int(null_count),
                "null_pct": round(null_pct * 100.0, 2),
                "unique_values": int(non_null.nunique()),
            }

            try:
                col_min = non_null.min()
                col_max = non_null.max()
                col_stats["min"] = (
                    col_min.isoformat() if hasattr(col_min, "isoformat") else col_min
                )
                col_stats["max"] = (
                    col_max.isoformat() if hasattr(col_max, "isoformat") else col_max
                )
            except Exception:
                col_stats["min"] = None
                col_stats["max"] = None

            if pd.api.types.is_numeric_dtype(series):
                try:
                    mean = float(non_null.mean())
                except Exception:
                    mean = None
                col_stats["mean"] = mean
            else:
                col_stats["mean"] = None

            stats[col] = col_stats

        return stats

    def _get_preview_rows(self, df: pd.DataFrame, limit: int = 5) -> List[Dict[str, Any]]:
        if df.empty:
            return []
        preview_df = df.head(limit)
        return json.loads(preview_df.to_json(orient="records", date_format="iso"))

    def handle_upload(
        self,
        upload_file: UploadFile,
        user_id: Optional[str],
    ) -> Tuple[UploadedFile, Dict[str, Any], List[Dict[str, Any]]]:
        """
        Validate, persist, and analyze an uploaded CSV/JSON file.

        Returns:
            (UploadedFile ORM instance, column_stats dict, preview_rows list)
        """
        if not upload_file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Filename is required.",
            )

        ext = self._validate_file_type(upload_file.filename)
        self._validate_file_size(upload_file)

        relative_path = self._save_file(upload_file, ext)
        full_path = self.base_path / relative_path

        try:
            df = self._load_dataframe(full_path, ext)
        except Exception as exc:
            logger.exception("Failed to parse uploaded file %s: %s", full_path, exc)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to parse file: {exc}",
            )

        column_stats = self._compute_column_stats(df)
        preview_rows = self._get_preview_rows(df)
        row_count = int(len(df))
        column_count = int(len(df.columns))

        uploaded = UploadedFile(
            user_id=user_id,
            filename=upload_file.filename,
            file_path=relative_path,
            model_path=None,
            column_stats=column_stats,
            row_count=row_count,
            column_count=column_count,
            created_at=datetime.now(timezone.utc),
        )

        self.db.add(uploaded)
        self.db.commit()
        self.db.refresh(uploaded)

        logger.info(
            "Stored UploadedFile %s for user %s with %s rows and %s columns",
            uploaded.id,
            user_id,
            row_count,
            column_count,
        )

        return uploaded, column_stats, preview_rows

