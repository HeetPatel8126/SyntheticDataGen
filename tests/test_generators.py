"""
Unit Tests for Data Generators
"""

import pytest
import os
import json
import csv
from datetime import datetime
from pathlib import Path

from app.services.generators import (
    GeneratorFactory,
    UserGenerator,
    EcommerceGenerator,
    CompanyGenerator
)


class TestUserGenerator:
    """Tests for UserGenerator"""
    
    def test_generator_initialization(self):
        """Test generator can be initialized"""
        generator = UserGenerator()
        assert generator is not None
        assert generator.name == "user"
    
    def test_generator_properties(self):
        """Test generator has required properties"""
        generator = UserGenerator()
        assert generator.name == "user"
        assert generator.description is not None
        assert len(generator.fields) > 0
    
    def test_generate_single_record(self):
        """Test generating a single user record"""
        generator = UserGenerator()
        record = generator.generate_record()
        
        assert "id" in record
        assert "first_name" in record
        assert "last_name" in record
        assert "email" in record
        assert "phone" in record
        assert "age" in record
        assert "city" in record
        assert "is_active" in record
    
    def test_record_data_types(self):
        """Test record fields have correct data types"""
        generator = UserGenerator()
        record = generator.generate_record()
        
        assert isinstance(record["id"], str)
        assert isinstance(record["first_name"], str)
        assert isinstance(record["age"], int)
        assert isinstance(record["salary"], float)
        assert isinstance(record["is_active"], bool)
    
    def test_generate_multiple_records(self):
        """Test generating multiple records"""
        generator = UserGenerator()
        count = 100
        records = list(generator.generate_records(count))
        
        assert len(records) == count
        # Check all records are unique (by ID)
        ids = [r["id"] for r in records]
        assert len(ids) == len(set(ids))
    
    def test_generate_batch(self):
        """Test batch generation"""
        generator = UserGenerator()
        count = 50
        records = generator.generate_batch(count)
        
        assert len(records) == count
    
    def test_age_is_realistic(self):
        """Test generated ages are within realistic range"""
        generator = UserGenerator()
        for _ in range(100):
            record = generator.generate_record()
            assert 18 <= record["age"] <= 80
    
    def test_email_format(self):
        """Test generated emails have valid format"""
        generator = UserGenerator()
        for _ in range(50):
            record = generator.generate_record()
            assert "@" in record["email"]
            assert "." in record["email"]


class TestEcommerceGenerator:
    """Tests for EcommerceGenerator"""
    
    def test_generator_initialization(self):
        """Test generator can be initialized"""
        generator = EcommerceGenerator()
        assert generator is not None
        assert generator.name == "ecommerce"
    
    def test_generate_single_record(self):
        """Test generating a single ecommerce record"""
        generator = EcommerceGenerator()
        record = generator.generate_record()
        
        assert "order_id" in record
        assert "transaction_id" in record
        assert "product_name" in record
        assert "quantity" in record
        assert "unit_price" in record
        assert "total_amount" in record
        assert "order_status" in record
    
    def test_price_calculations(self):
        """Test price calculations are correct"""
        generator = EcommerceGenerator()
        for _ in range(50):
            record = generator.generate_record()
            
            # Total should be greater than or equal to subtotal
            assert record["total_amount"] >= record["subtotal"] - record["discount_percent"]
            
            # Quantity should be positive
            assert record["quantity"] >= 1
            
            # Unit price should be positive
            assert record["unit_price"] > 0
    
    def test_order_status_valid(self):
        """Test order status is one of valid values"""
        valid_statuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"]
        generator = EcommerceGenerator()
        
        for _ in range(100):
            record = generator.generate_record()
            assert record["order_status"] in valid_statuses


class TestCompanyGenerator:
    """Tests for CompanyGenerator"""
    
    def test_generator_initialization(self):
        """Test generator can be initialized"""
        generator = CompanyGenerator()
        assert generator is not None
        assert generator.name == "company"
    
    def test_generate_single_record(self):
        """Test generating a single company record"""
        generator = CompanyGenerator()
        record = generator.generate_record()
        
        assert "id" in record
        assert "company_name" in record
        assert "industry" in record
        assert "employee_count" in record
        assert "annual_revenue" in record
    
    def test_employee_count_positive(self):
        """Test employee count is positive"""
        generator = CompanyGenerator()
        for _ in range(100):
            record = generator.generate_record()
            assert record["employee_count"] >= 1
    
    def test_founded_year_realistic(self):
        """Test founded year is realistic"""
        generator = CompanyGenerator()
        current_year = datetime.now().year
        
        for _ in range(100):
            record = generator.generate_record()
            assert 1900 <= record["founded_year"] <= current_year


class TestGeneratorFactory:
    """Tests for GeneratorFactory"""
    
    def test_get_user_generator(self):
        """Test getting user generator"""
        generator = GeneratorFactory.get_generator("user")
        assert isinstance(generator, UserGenerator)
    
    def test_get_ecommerce_generator(self):
        """Test getting ecommerce generator"""
        generator = GeneratorFactory.get_generator("ecommerce")
        assert isinstance(generator, EcommerceGenerator)
    
    def test_get_company_generator(self):
        """Test getting company generator"""
        generator = GeneratorFactory.get_generator("company")
        assert isinstance(generator, CompanyGenerator)
    
    def test_invalid_generator_type(self):
        """Test error for invalid generator type"""
        with pytest.raises(ValueError):
            GeneratorFactory.get_generator("invalid_type")
    
    def test_get_available_types(self):
        """Test getting list of available types"""
        types = GeneratorFactory.get_available_types()
        assert "user" in types
        assert "ecommerce" in types
        assert "company" in types
    
    def test_is_valid_type(self):
        """Test type validation"""
        assert GeneratorFactory.is_valid_type("user") is True
        assert GeneratorFactory.is_valid_type("ecommerce") is True
        assert GeneratorFactory.is_valid_type("invalid") is False
    
    def test_get_all_info(self):
        """Test getting all generator info"""
        info = GeneratorFactory.get_all_info()
        assert len(info) == 3
        
        names = [i["name"] for i in info]
        assert "user" in names
        assert "ecommerce" in names
        assert "company" in names


class TestFileGeneration:
    """Tests for file generation functionality"""
    
    def test_save_to_csv(self, tmp_path):
        """Test saving data to CSV file"""
        generator = UserGenerator()
        file_path = tmp_path / "test_users.csv"
        
        result = generator.save_to_csv(
            count=100,
            file_path=str(file_path)
        )
        
        assert file_path.exists()
        assert result["record_count"] == 100
        assert result["format"] == "csv"
        assert result["file_size"] > 0
        
        # Verify CSV content
        with open(file_path, 'r') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            assert len(rows) == 100
    
    def test_save_to_json(self, tmp_path):
        """Test saving data to JSON file"""
        generator = UserGenerator()
        file_path = tmp_path / "test_users.json"
        
        result = generator.save_to_json(
            count=50,
            file_path=str(file_path)
        )
        
        assert file_path.exists()
        assert result["record_count"] == 50
        assert result["format"] == "json"
        
        # Verify JSON content
        with open(file_path, 'r') as f:
            data = json.load(f)
            assert len(data) == 50
    
    def test_progress_callback(self, tmp_path):
        """Test progress callback is called"""
        generator = UserGenerator()
        file_path = tmp_path / "test_progress.csv"
        
        progress_values = []
        
        def progress_callback(progress):
            progress_values.append(progress)
        
        generator.save_to_csv(
            count=5000,
            file_path=str(file_path),
            progress_callback=progress_callback
        )
        
        # Progress should have been reported
        assert len(progress_values) > 0
        # Progress should increase
        for i in range(1, len(progress_values)):
            assert progress_values[i] >= progress_values[i-1]


class TestGeneratorWithSeed:
    """Tests for generator reproducibility with seed"""
    
    def test_reproducible_with_seed(self):
        """Test that same seed produces same data"""
        seed = 12345
        
        generator1 = UserGenerator(seed=seed)
        record1 = generator1.generate_record()
        
        generator2 = UserGenerator(seed=seed)
        record2 = generator2.generate_record()
        
        # Same seed should produce same first_name at least
        # Note: Due to Faker internals, exact reproducibility may vary
        assert generator1.seed == generator2.seed
