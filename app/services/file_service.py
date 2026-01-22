"""
File Service
Handles file storage, retrieval, and cleanup operations
"""

import os
import shutil
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, List, Dict, Any
import logging
import aiofiles
import aiofiles.os

from app.config import settings

logger = logging.getLogger(__name__)


class FileService:
    """
    Service for managing generated data files.
    Handles storage, retrieval, and cleanup operations.
    """
    
    def __init__(self, storage_path: Optional[str] = None):
        """
        Initialize file service.
        
        Args:
            storage_path: Path to storage directory (defaults to settings)
        """
        self.storage_path = Path(storage_path or settings.storage_path)
        self._ensure_storage_directory()
    
    def _ensure_storage_directory(self) -> None:
        """Ensure the storage directory exists"""
        self.storage_path.mkdir(parents=True, exist_ok=True)
        logger.info(f"Storage directory ensured: {self.storage_path}")
    
    def get_file_path(self, filename: str) -> Path:
        """
        Get the full path for a file in storage.
        
        Args:
            filename: Name of the file
            
        Returns:
            Full path to the file
        """
        return self.storage_path / filename
    
    def generate_filename(
        self,
        data_type: str,
        output_format: str,
        job_id: str
    ) -> str:
        """
        Generate a unique filename for generated data.
        
        Args:
            data_type: Type of data (user, ecommerce, company)
            output_format: File format (csv, json)
            job_id: Job identifier
            
        Returns:
            Generated filename
        """
        timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
        return f"{data_type}_{timestamp}_{job_id[:8]}.{output_format}"
    
    def file_exists(self, filename: str) -> bool:
        """
        Check if a file exists in storage.
        
        Args:
            filename: Name of the file to check
            
        Returns:
            True if file exists
        """
        return self.get_file_path(filename).exists()
    
    def get_file_size(self, filename: str) -> Optional[int]:
        """
        Get the size of a file in bytes.
        
        Args:
            filename: Name of the file
            
        Returns:
            File size in bytes, or None if file doesn't exist
        """
        file_path = self.get_file_path(filename)
        if file_path.exists():
            return file_path.stat().st_size
        return None
    
    def get_file_info(self, filename: str) -> Optional[Dict[str, Any]]:
        """
        Get information about a stored file.
        
        Args:
            filename: Name of the file
            
        Returns:
            Dictionary with file info, or None if file doesn't exist
        """
        file_path = self.get_file_path(filename)
        
        if not file_path.exists():
            return None
        
        stat = file_path.stat()
        return {
            "filename": filename,
            "path": str(file_path),
            "size": stat.st_size,
            "created_at": datetime.fromtimestamp(stat.st_ctime),
            "modified_at": datetime.fromtimestamp(stat.st_mtime),
            "format": file_path.suffix.lstrip(".")
        }
    
    def delete_file(self, filename: str) -> bool:
        """
        Delete a file from storage.
        
        Args:
            filename: Name of the file to delete
            
        Returns:
            True if file was deleted, False if it didn't exist
        """
        file_path = self.get_file_path(filename)
        
        if file_path.exists():
            try:
                file_path.unlink()
                logger.info(f"Deleted file: {filename}")
                return True
            except Exception as e:
                logger.error(f"Failed to delete file {filename}: {e}")
                raise
        
        return False
    
    async def delete_file_async(self, filename: str) -> bool:
        """
        Asynchronously delete a file from storage.
        
        Args:
            filename: Name of the file to delete
            
        Returns:
            True if file was deleted, False if it didn't exist
        """
        file_path = self.get_file_path(filename)
        
        if file_path.exists():
            try:
                await aiofiles.os.remove(file_path)
                logger.info(f"Deleted file: {filename}")
                return True
            except Exception as e:
                logger.error(f"Failed to delete file {filename}: {e}")
                raise
        
        return False
    
    def list_files(self, pattern: str = "*") -> List[Dict[str, Any]]:
        """
        List files in storage matching a pattern.
        
        Args:
            pattern: Glob pattern for filtering files
            
        Returns:
            List of file info dictionaries
        """
        files = []
        for file_path in self.storage_path.glob(pattern):
            if file_path.is_file():
                info = self.get_file_info(file_path.name)
                if info:
                    files.append(info)
        
        return sorted(files, key=lambda x: x["created_at"], reverse=True)
    
    def cleanup_old_files(self, max_age_days: Optional[int] = None) -> int:
        """
        Delete files older than the specified age.
        
        Args:
            max_age_days: Maximum file age in days (defaults to settings)
            
        Returns:
            Number of files deleted
        """
        max_age = max_age_days or settings.max_file_age_days
        cutoff_date = datetime.utcnow() - timedelta(days=max_age)
        
        deleted_count = 0
        
        for file_path in self.storage_path.glob("*"):
            if file_path.is_file():
                file_time = datetime.fromtimestamp(file_path.stat().st_mtime)
                
                if file_time < cutoff_date:
                    try:
                        file_path.unlink()
                        deleted_count += 1
                        logger.info(f"Cleaned up old file: {file_path.name}")
                    except Exception as e:
                        logger.error(f"Failed to delete old file {file_path.name}: {e}")
        
        logger.info(f"Cleanup complete: deleted {deleted_count} files")
        return deleted_count
    
    def get_storage_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the storage directory.
        
        Returns:
            Dictionary with storage statistics
        """
        total_size = 0
        file_count = 0
        format_stats = {}
        
        for file_path in self.storage_path.glob("*"):
            if file_path.is_file():
                file_count += 1
                size = file_path.stat().st_size
                total_size += size
                
                ext = file_path.suffix.lstrip(".")
                if ext not in format_stats:
                    format_stats[ext] = {"count": 0, "size": 0}
                format_stats[ext]["count"] += 1
                format_stats[ext]["size"] += size
        
        return {
            "storage_path": str(self.storage_path),
            "total_files": file_count,
            "total_size_bytes": total_size,
            "total_size_mb": round(total_size / (1024 * 1024), 2),
            "formats": format_stats
        }


# Singleton instance
file_service = FileService()
