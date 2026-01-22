"""
Unit Tests for API Endpoints
"""

import pytest
from fastapi import status
from uuid import uuid4


class TestHealthEndpoint:
    """Tests for health check endpoint"""
    
    def test_health_check(self, client):
        """Test health check returns healthy status"""
        response = client.get("/health")
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert data["status"] == "healthy"
        assert "version" in data
        assert "timestamp" in data


class TestRootEndpoint:
    """Tests for root endpoint"""
    
    def test_root_endpoint(self, client):
        """Test root endpoint returns API info"""
        response = client.get("/")
        assert response.status_code == status.HTTP_200_OK
        
        data = response.json()
        assert "name" in data
        assert "version" in data
        assert "documentation" in data
        assert "endpoints" in data


class TestAuthenticationRequired:
    """Tests for authentication requirement"""
    
    def test_generate_without_api_key(self, client):
        """Test generate endpoint requires API key"""
        response = client.post(
            "/api/generate",
            json={
                "data_type": "user",
                "record_count": 100,
                "output_format": "csv"
            }
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_generate_with_invalid_api_key(self, client):
        """Test generate endpoint rejects invalid API key"""
        response = client.post(
            "/api/generate",
            json={
                "data_type": "user",
                "record_count": 100,
                "output_format": "csv"
            },
            headers={"X-API-Key": "invalid-key"}
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN
    
    def test_generate_with_valid_api_key(self, client, api_headers):
        """Test generate endpoint accepts valid API key"""
        response = client.post(
            "/api/generate",
            json={
                "data_type": "user",
                "record_count": 100,
                "output_format": "csv"
            },
            headers=api_headers
        )
        # Should succeed (201) or at least not be auth error
        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_200_OK]


class TestGenerateEndpoint:
    """Tests for data generation endpoint"""
    
    def test_generate_user_data(self, client, api_headers):
        """Test generating user data"""
        response = client.post(
            "/api/generate",
            json={
                "data_type": "user",
                "record_count": 100,
                "output_format": "csv"
            },
            headers=api_headers
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert "job_id" in data
        assert data["status"] == "pending"
    
    def test_generate_ecommerce_data(self, client, api_headers):
        """Test generating ecommerce data"""
        response = client.post(
            "/api/generate",
            json={
                "data_type": "ecommerce",
                "record_count": 500,
                "output_format": "json"
            },
            headers=api_headers
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert "job_id" in data
    
    def test_generate_company_data(self, client, api_headers):
        """Test generating company data"""
        response = client.post(
            "/api/generate",
            json={
                "data_type": "company",
                "record_count": 200,
                "output_format": "csv"
            },
            headers=api_headers
        )
        
        assert response.status_code == status.HTTP_201_CREATED
    
    def test_generate_invalid_data_type(self, client, api_headers):
        """Test error for invalid data type"""
        response = client.post(
            "/api/generate",
            json={
                "data_type": "invalid_type",
                "record_count": 100,
                "output_format": "csv"
            },
            headers=api_headers
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_generate_invalid_record_count_too_low(self, client, api_headers):
        """Test error for record count below minimum"""
        response = client.post(
            "/api/generate",
            json={
                "data_type": "user",
                "record_count": 10,  # Below minimum of 100
                "output_format": "csv"
            },
            headers=api_headers
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    def test_generate_invalid_output_format(self, client, api_headers):
        """Test error for invalid output format"""
        response = client.post(
            "/api/generate",
            json={
                "data_type": "user",
                "record_count": 100,
                "output_format": "xml"  # Invalid format
            },
            headers=api_headers
        )
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


class TestJobStatusEndpoint:
    """Tests for job status endpoint"""
    
    def test_get_job_status(self, client, api_headers):
        """Test getting job status"""
        # First create a job
        create_response = client.post(
            "/api/generate",
            json={
                "data_type": "user",
                "record_count": 100,
                "output_format": "csv"
            },
            headers=api_headers
        )
        
        job_id = create_response.json()["job_id"]
        
        # Get job status
        response = client.get(
            f"/api/jobs/{job_id}",
            headers=api_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == job_id
        assert "status" in data
        assert "progress" in data
    
    def test_get_nonexistent_job(self, client, api_headers):
        """Test error for nonexistent job"""
        fake_id = str(uuid4())
        response = client.get(
            f"/api/jobs/{fake_id}",
            headers=api_headers
        )
        
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestJobListEndpoint:
    """Tests for job listing endpoint"""
    
    def test_list_jobs(self, client, api_headers):
        """Test listing jobs"""
        # Create a few jobs first
        for data_type in ["user", "ecommerce", "company"]:
            client.post(
                "/api/generate",
                json={
                    "data_type": data_type,
                    "record_count": 100,
                    "output_format": "csv"
                },
                headers=api_headers
            )
        
        # List jobs
        response = client.get(
            "/api/jobs",
            headers=api_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "jobs" in data
        assert "total" in data
        assert len(data["jobs"]) >= 3
    
    def test_list_jobs_with_pagination(self, client, api_headers):
        """Test job listing with pagination"""
        response = client.get(
            "/api/jobs?page=1&page_size=10",
            headers=api_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["page"] == 1
        assert data["page_size"] == 10


class TestDataTypesEndpoint:
    """Tests for data types info endpoint"""
    
    def test_list_data_types(self, client, api_headers):
        """Test listing available data types"""
        response = client.get(
            "/api/data-types",
            headers=api_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "data_types" in data
        
        type_names = [dt["name"] for dt in data["data_types"]]
        assert "user" in type_names
        assert "ecommerce" in type_names
        assert "company" in type_names


class TestTemplatesEndpoint:
    """Tests for templates endpoint"""
    
    def test_list_templates(self, client, api_headers):
        """Test listing templates"""
        response = client.get(
            "/api/templates",
            headers=api_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "templates" in data
        assert "total" in data
        # Should include system templates
        assert data["total"] >= 3
    
    def test_create_custom_template(self, client, api_headers):
        """Test creating a custom template"""
        response = client.post(
            "/api/templates",
            json={
                "name": "Test Template",
                "description": "A test template",
                "schema_fields": [
                    {"name": "id", "field_type": "uuid", "nullable": False},
                    {"name": "name", "field_type": "name", "nullable": False},
                    {"name": "email", "field_type": "email", "nullable": False}
                ]
            },
            headers=api_headers
        )
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == "Test Template"
        assert data["is_system"] is False


class TestStatsEndpoint:
    """Tests for statistics endpoint"""
    
    def test_get_stats(self, client, api_headers):
        """Test getting platform statistics"""
        response = client.get(
            "/api/stats",
            headers=api_headers
        )
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert "jobs" in data
        assert "storage" in data
