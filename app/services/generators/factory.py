"""
Generator Factory
Creates appropriate generator instances based on data type
"""

from typing import Dict, Type, Optional, List, Any
from app.services.generators.base import BaseGenerator
from app.services.generators.user_generator import UserGenerator
from app.services.generators.ecommerce_generator import EcommerceGenerator
from app.services.generators.company_generator import CompanyGenerator
from app.services.generators.healthcare_generator import HealthcareGenerator
from app.services.generators.financial_generator import FinancialGenerator
from app.services.generators.education_generator import EducationGenerator
from app.services.generators.social_media_generator import SocialMediaGenerator
from app.services.generators.custom_generator import CustomTemplateGenerator


class GeneratorFactory:
    """
    Factory class for creating data generator instances.
    Provides a centralized way to get generators by type.
    """
    
    _generators: Dict[str, Type[BaseGenerator]] = {
        "user": UserGenerator,
        "ecommerce": EcommerceGenerator,
        "company": CompanyGenerator,
        "healthcare": HealthcareGenerator,
        "financial": FinancialGenerator,
        "education": EducationGenerator,
        "social_media": SocialMediaGenerator,
        # 'custom' handled specially because it needs template schema
    }
    
    @classmethod
    def get_generator(
        cls,
        data_type: str,
        locale: str = "en_US",
        seed: Optional[int] = None,
        template_schema: Optional[Dict[str, Any]] = None,
    ) -> BaseGenerator:
        """
        Get a generator instance for the specified data type.
        
        Args:
            data_type: Type of data to generate (user, ecommerce, company, custom)
            locale: Locale for Faker
            seed: Random seed for reproducibility
            template_schema: Template schema dict (required for custom data type)
            
        Returns:
            BaseGenerator instance
            
        Raises:
            ValueError: If data type is not supported
        """
        if data_type.lower() == "custom":
            if not template_schema:
                raise ValueError("Template schema is required for custom data type.")
            return CustomTemplateGenerator(schema=template_schema, locale=locale, seed=seed)

        generator_class = cls._generators.get(data_type.lower())
        
        if generator_class is None:
            supported = ", ".join(list(cls._generators.keys()) + ["custom"])
            raise ValueError(
                f"Unknown data type: {data_type}. Supported types: {supported}"
            )
        
        return generator_class(locale=locale, seed=seed)
    
    @classmethod
    def get_available_types(cls) -> List[str]:
        """
        Get list of available data types.
        
        Returns:
            List of supported data type names
        """
        return list(cls._generators.keys()) + ["custom"]
    
    @classmethod
    def get_all_info(cls) -> List[Dict[str, Any]]:
        """
        Get information about all available generators.
        
        Returns:
            List of generator info dictionaries
        """
        info = []
        for data_type in cls._generators.keys():
            generator = cls.get_generator(data_type)
            info.append(generator.get_info())
        return info
    
    @classmethod
    def register_generator(cls, name: str, generator_class: Type[BaseGenerator]) -> None:
        """
        Register a new generator type.
        
        Args:
            name: Name for the generator type
            generator_class: Generator class to register
        """
        cls._generators[name.lower()] = generator_class
    
    @classmethod
    def is_valid_type(cls, data_type: str) -> bool:
        """
        Check if a data type is valid/supported.
        
        Args:
            data_type: Data type to check
            
        Returns:
            True if data type is supported
        """
        return data_type.lower() in cls._generators
