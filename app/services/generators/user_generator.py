"""
User/Person Data Generator
Generates realistic user profile data
"""

import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import random

from app.services.generators.base import BaseGenerator


class UserGenerator(BaseGenerator):
    """
    Generator for user/person data.
    Creates realistic user profiles with personal information.
    """
    
    @property
    def name(self) -> str:
        return "user"
    
    @property
    def description(self) -> str:
        return "User/Person data with personal information including name, email, address, phone, and demographics"
    
    @property
    def fields(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": "id",
                "type": "uuid",
                "description": "Unique identifier",
                "example": "123e4567-e89b-12d3-a456-426614174000"
            },
            {
                "name": "first_name",
                "type": "string",
                "description": "First name",
                "example": "John"
            },
            {
                "name": "last_name",
                "type": "string",
                "description": "Last name",
                "example": "Doe"
            },
            {
                "name": "full_name",
                "type": "string",
                "description": "Full name",
                "example": "John Doe"
            },
            {
                "name": "email",
                "type": "string",
                "description": "Email address",
                "example": "john.doe@example.com"
            },
            {
                "name": "phone",
                "type": "string",
                "description": "Phone number",
                "example": "+1-555-123-4567"
            },
            {
                "name": "date_of_birth",
                "type": "date",
                "description": "Date of birth",
                "example": "1990-05-15"
            },
            {
                "name": "age",
                "type": "integer",
                "description": "Age in years",
                "example": 34
            },
            {
                "name": "gender",
                "type": "string",
                "description": "Gender",
                "example": "Male"
            },
            {
                "name": "street_address",
                "type": "string",
                "description": "Street address",
                "example": "123 Main Street"
            },
            {
                "name": "city",
                "type": "string",
                "description": "City",
                "example": "New York"
            },
            {
                "name": "state",
                "type": "string",
                "description": "State/Province",
                "example": "NY"
            },
            {
                "name": "postal_code",
                "type": "string",
                "description": "Postal/ZIP code",
                "example": "10001"
            },
            {
                "name": "country",
                "type": "string",
                "description": "Country",
                "example": "United States"
            },
            {
                "name": "username",
                "type": "string",
                "description": "Username",
                "example": "johndoe123"
            },
            {
                "name": "job_title",
                "type": "string",
                "description": "Job title",
                "example": "Software Engineer"
            },
            {
                "name": "company",
                "type": "string",
                "description": "Company name",
                "example": "Tech Corp"
            },
            {
                "name": "salary",
                "type": "float",
                "description": "Annual salary",
                "example": 85000.00
            },
            {
                "name": "created_at",
                "type": "datetime",
                "description": "Account creation timestamp",
                "example": "2024-01-15T10:30:00"
            },
            {
                "name": "is_active",
                "type": "boolean",
                "description": "Whether the user account is active",
                "example": True
            }
        ]
    
    def generate_record(self) -> Dict[str, Any]:
        """
        Generate a single user record.
        
        Returns:
            Dictionary containing user data
        """
        # Generate coherent profile data
        profile = self.faker.simple_profile()
        
        # Generate date of birth and calculate age
        dob = self.faker.date_of_birth(minimum_age=18, maximum_age=80)
        today = datetime.now().date()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
        
        # Generate gender-appropriate names
        gender = random.choice(["Male", "Female", "Non-binary", "Prefer not to say"])
        if gender == "Male":
            first_name = self.faker.first_name_male()
        elif gender == "Female":
            first_name = self.faker.first_name_female()
        else:
            first_name = self.faker.first_name()
        
        last_name = self.faker.last_name()
        full_name = f"{first_name} {last_name}"
        
        # Generate email based on name
        email_domain = self.faker.free_email_domain()
        email = f"{first_name.lower()}.{last_name.lower()}@{email_domain}"
        
        # Generate salary based on a realistic distribution
        base_salary = random.gauss(65000, 25000)
        salary = round(max(25000, min(250000, base_salary)), 2)
        
        # Generate account creation date (within last 5 years)
        created_at = self.faker.date_time_between(
            start_date="-5y",
            end_date="now"
        )
        
        return {
            "id": str(uuid.uuid4()),
            "first_name": first_name,
            "last_name": last_name,
            "full_name": full_name,
            "email": email,
            "phone": self.faker.phone_number(),
            "date_of_birth": dob.isoformat(),
            "age": age,
            "gender": gender,
            "street_address": self.faker.street_address(),
            "city": self.faker.city(),
            "state": self.faker.state_abbr(),
            "postal_code": self.faker.postcode(),
            "country": "United States",
            "username": self.faker.user_name(),
            "job_title": self.faker.job(),
            "company": self.faker.company(),
            "salary": salary,
            "created_at": created_at,
            "is_active": random.random() > 0.1  # 90% active users
        }
