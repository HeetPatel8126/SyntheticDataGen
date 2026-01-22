"""
Company/Business Data Generator
Generates realistic company and business data
"""

import uuid
from datetime import datetime
from typing import Dict, List, Any, Optional
import random

from app.services.generators.base import BaseGenerator


# Industry data for realistic companies
INDUSTRIES = [
    {"name": "Technology", "sub_industries": ["Software", "Hardware", "IT Services", "Cybersecurity", "Cloud Computing", "AI/ML"]},
    {"name": "Healthcare", "sub_industries": ["Pharmaceuticals", "Medical Devices", "Healthcare Services", "Biotechnology", "Telemedicine"]},
    {"name": "Finance", "sub_industries": ["Banking", "Insurance", "Investment", "Fintech", "Asset Management"]},
    {"name": "Retail", "sub_industries": ["E-commerce", "Fashion", "Consumer Electronics", "Grocery", "Department Stores"]},
    {"name": "Manufacturing", "sub_industries": ["Automotive", "Aerospace", "Industrial Equipment", "Consumer Goods", "Electronics"]},
    {"name": "Energy", "sub_industries": ["Oil & Gas", "Renewable Energy", "Utilities", "Clean Tech", "Mining"]},
    {"name": "Real Estate", "sub_industries": ["Commercial", "Residential", "Property Management", "REITs", "Construction"]},
    {"name": "Education", "sub_industries": ["Higher Education", "EdTech", "K-12", "Professional Training", "Online Learning"]},
    {"name": "Entertainment", "sub_industries": ["Media", "Gaming", "Streaming", "Sports", "Music"]},
    {"name": "Transportation", "sub_industries": ["Logistics", "Airlines", "Shipping", "Ride-sharing", "Automotive"]},
    {"name": "Agriculture", "sub_industries": ["Farming", "AgTech", "Food Processing", "Livestock", "Forestry"]},
    {"name": "Professional Services", "sub_industries": ["Consulting", "Legal", "Accounting", "Marketing", "HR Services"]},
]

COMPANY_TYPES = ["Public", "Private", "Startup", "Non-Profit", "Government", "Partnership"]
COMPANY_SIZE_CATEGORIES = ["Micro", "Small", "Medium", "Large", "Enterprise"]
STOCK_EXCHANGES = ["NYSE", "NASDAQ", "LSE", "TSE", "HKEX", None]  # None for private companies


class CompanyGenerator(BaseGenerator):
    """
    Generator for company/business data.
    Creates realistic company profiles with business information.
    """
    
    @property
    def name(self) -> str:
        return "company"
    
    @property
    def description(self) -> str:
        return "Company/Business data including company name, industry, financials, and organizational information"
    
    @property
    def fields(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": "id",
                "type": "uuid",
                "description": "Unique company identifier",
                "example": "123e4567-e89b-12d3-a456-426614174000"
            },
            {
                "name": "company_name",
                "type": "string",
                "description": "Company legal name",
                "example": "Tech Solutions Inc."
            },
            {
                "name": "trading_name",
                "type": "string",
                "description": "Trading/brand name",
                "example": "TechSol"
            },
            {
                "name": "industry",
                "type": "string",
                "description": "Primary industry",
                "example": "Technology"
            },
            {
                "name": "sub_industry",
                "type": "string",
                "description": "Industry sub-category",
                "example": "Software"
            },
            {
                "name": "company_type",
                "type": "string",
                "description": "Type of company",
                "example": "Public"
            },
            {
                "name": "founded_year",
                "type": "integer",
                "description": "Year company was founded",
                "example": 2010
            },
            {
                "name": "employee_count",
                "type": "integer",
                "description": "Number of employees",
                "example": 5000
            },
            {
                "name": "size_category",
                "type": "string",
                "description": "Company size category",
                "example": "Large"
            },
            {
                "name": "annual_revenue",
                "type": "float",
                "description": "Annual revenue in USD",
                "example": 50000000.00
            },
            {
                "name": "revenue_growth_percent",
                "type": "float",
                "description": "Year-over-year revenue growth percentage",
                "example": 15.5
            },
            {
                "name": "market_cap",
                "type": "float",
                "description": "Market capitalization in USD (for public companies)",
                "example": 500000000.00
            },
            {
                "name": "stock_symbol",
                "type": "string",
                "description": "Stock ticker symbol",
                "example": "TSOL"
            },
            {
                "name": "stock_exchange",
                "type": "string",
                "description": "Stock exchange listing",
                "example": "NASDAQ"
            },
            {
                "name": "headquarters_address",
                "type": "string",
                "description": "Headquarters address",
                "example": "100 Tech Park Drive, San Francisco, CA 94105"
            },
            {
                "name": "headquarters_city",
                "type": "string",
                "description": "Headquarters city",
                "example": "San Francisco"
            },
            {
                "name": "headquarters_country",
                "type": "string",
                "description": "Headquarters country",
                "example": "United States"
            },
            {
                "name": "website",
                "type": "string",
                "description": "Company website",
                "example": "https://www.techsol.com"
            },
            {
                "name": "email",
                "type": "string",
                "description": "Contact email",
                "example": "info@techsol.com"
            },
            {
                "name": "phone",
                "type": "string",
                "description": "Contact phone",
                "example": "+1-555-123-4567"
            },
            {
                "name": "ceo_name",
                "type": "string",
                "description": "CEO name",
                "example": "Jane Smith"
            },
            {
                "name": "description",
                "type": "string",
                "description": "Company description",
                "example": "Leading provider of enterprise software solutions"
            },
            {
                "name": "is_active",
                "type": "boolean",
                "description": "Whether company is currently active",
                "example": True
            },
            {
                "name": "created_at",
                "type": "datetime",
                "description": "Record creation timestamp",
                "example": "2024-01-15T10:30:00"
            }
        ]
    
    def _generate_stock_symbol(self, company_name: str) -> str:
        """Generate a realistic stock ticker symbol from company name"""
        # Take first letters of words, max 4 characters
        words = company_name.replace(",", "").replace(".", "").split()
        if len(words) >= 3:
            symbol = "".join([w[0].upper() for w in words[:4]])
        elif len(words) == 2:
            symbol = words[0][:2].upper() + words[1][0].upper()
        else:
            symbol = words[0][:4].upper()
        return symbol[:4]
    
    def _get_size_category(self, employee_count: int) -> str:
        """Determine company size category based on employee count"""
        if employee_count < 10:
            return "Micro"
        elif employee_count < 50:
            return "Small"
        elif employee_count < 250:
            return "Medium"
        elif employee_count < 1000:
            return "Large"
        else:
            return "Enterprise"
    
    def generate_record(self) -> Dict[str, Any]:
        """
        Generate a single company record.
        
        Returns:
            Dictionary containing company data
        """
        # Select random industry
        industry_data = random.choice(INDUSTRIES)
        industry = industry_data["name"]
        sub_industry = random.choice(industry_data["sub_industries"])
        
        # Generate company name
        company_suffix = random.choice(["Inc.", "Corp.", "LLC", "Ltd.", "Co.", "Group", "Holdings", "Technologies", "Solutions"])
        company_base = self.faker.company().split()[0]  # Get first word
        
        # Create more realistic company names
        name_patterns = [
            f"{company_base} {company_suffix}",
            f"{company_base} {sub_industry} {company_suffix}",
            f"{self.faker.last_name()} & {self.faker.last_name()} {company_suffix}",
            f"{company_base} {random.choice(['Global', 'International', 'Digital', 'Advanced'])} {company_suffix}",
        ]
        company_name = random.choice(name_patterns)
        
        # Generate trading name (sometimes same as company name)
        trading_name = company_base if random.random() > 0.3 else company_name.split()[0]
        
        # Generate company type
        company_type = random.choices(
            COMPANY_TYPES,
            weights=[15, 40, 20, 10, 5, 10]  # Private most common
        )[0]
        
        # Generate founding year (newer companies more common)
        current_year = datetime.now().year
        if random.random() < 0.3:  # 30% startups (last 10 years)
            founded_year = random.randint(current_year - 10, current_year - 1)
        elif random.random() < 0.6:  # 30% established (10-30 years)
            founded_year = random.randint(current_year - 30, current_year - 10)
        else:  # 40% legacy companies
            founded_year = random.randint(1900, current_year - 30)
        
        # Generate employee count (log-normal distribution for realistic spread)
        if company_type == "Startup":
            employee_count = random.randint(2, 200)
        elif company_type == "Enterprise":
            employee_count = random.randint(1000, 100000)
        else:
            # Log-normal distribution
            employee_count = int(min(100000, max(1, random.lognormvariate(5, 2))))
        
        size_category = self._get_size_category(employee_count)
        
        # Generate financials based on size
        revenue_per_employee = random.uniform(80000, 500000)
        annual_revenue = round(employee_count * revenue_per_employee, 2)
        
        # Revenue growth (can be negative)
        revenue_growth = round(random.gauss(8, 15), 1)  # Mean 8%, std 15%
        revenue_growth = max(-50, min(100, revenue_growth))  # Cap between -50% and 100%
        
        # Market cap and stock info (only for public companies)
        market_cap = None
        stock_symbol = None
        stock_exchange = None
        
        if company_type == "Public":
            # P/E ratio between 10 and 40
            pe_ratio = random.uniform(10, 40)
            market_cap = round(annual_revenue * pe_ratio / 10, 2)  # Simplified calculation
            stock_symbol = self._generate_stock_symbol(company_name)
            stock_exchange = random.choice(["NYSE", "NASDAQ", "LSE", "TSE"])
        
        # Generate location
        city = self.faker.city()
        state = self.faker.state_abbr()
        country = "United States"
        headquarters_address = f"{self.faker.street_address()}, {city}, {state} {self.faker.postcode()}"
        
        # Generate contact info
        domain = trading_name.lower().replace(" ", "") + ".com"
        website = f"https://www.{domain}"
        email = f"info@{domain}"
        
        # Generate CEO name
        ceo_name = self.faker.name()
        
        # Generate description
        description = f"Leading {sub_industry.lower()} company specializing in {self.faker.bs()}."
        
        return {
            "id": str(uuid.uuid4()),
            "company_name": company_name,
            "trading_name": trading_name,
            "industry": industry,
            "sub_industry": sub_industry,
            "company_type": company_type,
            "founded_year": founded_year,
            "employee_count": employee_count,
            "size_category": size_category,
            "annual_revenue": annual_revenue,
            "revenue_growth_percent": revenue_growth,
            "market_cap": market_cap,
            "stock_symbol": stock_symbol,
            "stock_exchange": stock_exchange,
            "headquarters_address": headquarters_address,
            "headquarters_city": city,
            "headquarters_country": country,
            "website": website,
            "email": email,
            "phone": self.faker.phone_number(),
            "ceo_name": ceo_name,
            "description": description,
            "is_active": random.random() > 0.05,  # 95% active
            "created_at": datetime.utcnow()
        }
