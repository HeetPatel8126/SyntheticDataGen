"""
Base Generator Class
Abstract base class for all data generators
"""

import csv
import json
import os
import uuid
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Dict, List, Any, Generator, Optional, Callable
from faker import Faker

from app.config import settings


class BaseGenerator(ABC):
    """
    Abstract base class for data generators.
    Provides common functionality for generating and saving data.
    """
    
    def __init__(self, locale: str = "en_US", seed: Optional[int] = None):
        """
        Initialize the generator.
        
        Args:
            locale: Locale for Faker data generation
            seed: Random seed for reproducibility
        """
        self.faker = Faker(locale)
        if seed:
            Faker.seed(seed)
        self.locale = locale
        self.seed = seed
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Return the name of this generator"""
        pass
    
    @property
    @abstractmethod
    def description(self) -> str:
        """Return the description of this generator"""
        pass
    
    @property
    @abstractmethod
    def fields(self) -> List[Dict[str, Any]]:
        """
        Return the field definitions for this generator.
        Each field should have: name, type, description, example
        """
        pass
    
    @abstractmethod
    def generate_record(self) -> Dict[str, Any]:
        """
        Generate a single record of data.
        
        Returns:
            Dictionary containing generated data for one record
        """
        pass
    
    def generate_records(
        self, 
        count: int, 
        progress_callback: Optional[Callable[[float], None]] = None,
        batch_size: int = 1000
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Generate multiple records as a generator.
        
        Args:
            count: Number of records to generate
            progress_callback: Optional callback to report progress (0-100)
            batch_size: Number of records per batch for progress reporting
            
        Yields:
            Generated records one at a time
        """
        for i in range(count):
            yield self.generate_record()
            
            # Report progress at batch intervals
            if progress_callback and (i + 1) % batch_size == 0:
                progress = ((i + 1) / count) * 100
                progress_callback(min(progress, 99.0))  # Cap at 99 until complete
    
    def generate_batch(self, count: int) -> List[Dict[str, Any]]:
        """
        Generate a batch of records and return as a list.
        Use with caution for large datasets as this loads all data into memory.
        
        Args:
            count: Number of records to generate
            
        Returns:
            List of generated records
        """
        return list(self.generate_records(count))
    
    def save_to_csv(
        self,
        count: int,
        file_path: str,
        progress_callback: Optional[Callable[[float], None]] = None
    ) -> Dict[str, Any]:
        """
        Generate data and save to CSV file.
        
        Args:
            count: Number of records to generate
            file_path: Path to save the CSV file
            progress_callback: Optional callback to report progress
            
        Returns:
            Dictionary with file metadata
        """
        start_time = datetime.utcnow()
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Get field names from first generated record
        sample_record = self.generate_record()
        fieldnames = list(sample_record.keys())
        
        records_written = 0
        
        with open(file_path, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            # Write the sample record
            writer.writerow(self._serialize_record(sample_record))
            records_written += 1
            
            # Generate and write remaining records
            for record in self.generate_records(count - 1, progress_callback):
                writer.writerow(self._serialize_record(record))
                records_written += 1
        
        end_time = datetime.utcnow()
        file_size = os.path.getsize(file_path)
        
        return {
            "file_path": file_path,
            "file_size": file_size,
            "record_count": records_written,
            "format": "csv",
            "generation_time_seconds": (end_time - start_time).total_seconds(),
            "generated_at": end_time.isoformat()
        }
    
    def save_to_json(
        self,
        count: int,
        file_path: str,
        progress_callback: Optional[Callable[[float], None]] = None
    ) -> Dict[str, Any]:
        """
        Generate data and save to JSON file.
        Uses streaming approach to handle large datasets.
        
        Args:
            count: Number of records to generate
            file_path: Path to save the JSON file
            progress_callback: Optional callback to report progress
            
        Returns:
            Dictionary with file metadata
        """
        start_time = datetime.utcnow()
        
        # Ensure directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        records_written = 0
        
        with open(file_path, 'w', encoding='utf-8') as jsonfile:
            jsonfile.write('[\n')
            
            for i, record in enumerate(self.generate_records(count, progress_callback)):
                serialized = self._serialize_record(record)
                
                if i > 0:
                    jsonfile.write(',\n')
                
                json.dump(serialized, jsonfile, indent=2, default=str)
                records_written += 1
            
            jsonfile.write('\n]')
        
        end_time = datetime.utcnow()
        file_size = os.path.getsize(file_path)
        
        return {
            "file_path": file_path,
            "file_size": file_size,
            "record_count": records_written,
            "format": "json",
            "generation_time_seconds": (end_time - start_time).total_seconds(),
            "generated_at": end_time.isoformat()
        }
    
    def _serialize_record(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """
        Serialize a record for output.
        Converts non-serializable types to strings.
        
        Args:
            record: Record to serialize
            
        Returns:
            Serialized record
        """
        serialized = {}
        for key, value in record.items():
            if isinstance(value, datetime):
                serialized[key] = value.isoformat()
            elif isinstance(value, uuid.UUID):
                serialized[key] = str(value)
            elif isinstance(value, (list, dict)):
                serialized[key] = json.dumps(value)
            else:
                serialized[key] = value
        return serialized
    
    def get_info(self) -> Dict[str, Any]:
        """
        Get information about this generator.
        
        Returns:
            Dictionary with generator name, description, and field info
        """
        return {
            "name": self.name,
            "description": self.description,
            "fields": self.fields
        }
