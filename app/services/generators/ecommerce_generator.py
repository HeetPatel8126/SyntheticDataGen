"""
E-commerce Transaction Data Generator
Generates realistic e-commerce transaction data
"""

import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import random
from decimal import Decimal, ROUND_HALF_UP

from app.services.generators.base import BaseGenerator


# Product catalog for realistic data
PRODUCT_CATALOG = [
    # Electronics
    {"name": "Wireless Bluetooth Headphones", "category": "Electronics", "base_price": 79.99, "sku_prefix": "ELEC"},
    {"name": "USB-C Charging Cable", "category": "Electronics", "base_price": 12.99, "sku_prefix": "ELEC"},
    {"name": "Portable Power Bank 10000mAh", "category": "Electronics", "base_price": 34.99, "sku_prefix": "ELEC"},
    {"name": "Smart Watch Fitness Tracker", "category": "Electronics", "base_price": 149.99, "sku_prefix": "ELEC"},
    {"name": "Wireless Mouse", "category": "Electronics", "base_price": 29.99, "sku_prefix": "ELEC"},
    {"name": "Mechanical Keyboard", "category": "Electronics", "base_price": 89.99, "sku_prefix": "ELEC"},
    {"name": "4K Webcam", "category": "Electronics", "base_price": 129.99, "sku_prefix": "ELEC"},
    {"name": "Noise Cancelling Earbuds", "category": "Electronics", "base_price": 199.99, "sku_prefix": "ELEC"},
    
    # Clothing
    {"name": "Cotton T-Shirt", "category": "Clothing", "base_price": 19.99, "sku_prefix": "CLTH"},
    {"name": "Denim Jeans", "category": "Clothing", "base_price": 49.99, "sku_prefix": "CLTH"},
    {"name": "Running Shoes", "category": "Clothing", "base_price": 89.99, "sku_prefix": "CLTH"},
    {"name": "Winter Jacket", "category": "Clothing", "base_price": 129.99, "sku_prefix": "CLTH"},
    {"name": "Sports Shorts", "category": "Clothing", "base_price": 24.99, "sku_prefix": "CLTH"},
    {"name": "Casual Hoodie", "category": "Clothing", "base_price": 44.99, "sku_prefix": "CLTH"},
    
    # Home & Kitchen
    {"name": "Stainless Steel Water Bottle", "category": "Home & Kitchen", "base_price": 24.99, "sku_prefix": "HOME"},
    {"name": "Non-Stick Frying Pan", "category": "Home & Kitchen", "base_price": 34.99, "sku_prefix": "HOME"},
    {"name": "Coffee Maker", "category": "Home & Kitchen", "base_price": 79.99, "sku_prefix": "HOME"},
    {"name": "Blender", "category": "Home & Kitchen", "base_price": 59.99, "sku_prefix": "HOME"},
    {"name": "Knife Set", "category": "Home & Kitchen", "base_price": 49.99, "sku_prefix": "HOME"},
    {"name": "Bedding Set Queen", "category": "Home & Kitchen", "base_price": 89.99, "sku_prefix": "HOME"},
    
    # Books
    {"name": "Programming Python", "category": "Books", "base_price": 39.99, "sku_prefix": "BOOK"},
    {"name": "Data Science Handbook", "category": "Books", "base_price": 44.99, "sku_prefix": "BOOK"},
    {"name": "Business Strategy Guide", "category": "Books", "base_price": 29.99, "sku_prefix": "BOOK"},
    {"name": "Fiction Bestseller Novel", "category": "Books", "base_price": 14.99, "sku_prefix": "BOOK"},
    
    # Sports & Outdoors
    {"name": "Yoga Mat", "category": "Sports & Outdoors", "base_price": 29.99, "sku_prefix": "SPRT"},
    {"name": "Resistance Bands Set", "category": "Sports & Outdoors", "base_price": 19.99, "sku_prefix": "SPRT"},
    {"name": "Camping Tent 4-Person", "category": "Sports & Outdoors", "base_price": 159.99, "sku_prefix": "SPRT"},
    {"name": "Hiking Backpack", "category": "Sports & Outdoors", "base_price": 79.99, "sku_prefix": "SPRT"},
    {"name": "Dumbbells Set", "category": "Sports & Outdoors", "base_price": 69.99, "sku_prefix": "SPRT"},
]

PAYMENT_METHODS = ["Credit Card", "Debit Card", "PayPal", "Apple Pay", "Google Pay", "Bank Transfer"]
ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"]
SHIPPING_METHODS = ["Standard", "Express", "Next Day", "Free Shipping"]


class EcommerceGenerator(BaseGenerator):
    """
    Generator for e-commerce transaction data.
    Creates realistic order and transaction records.
    """
    
    @property
    def name(self) -> str:
        return "ecommerce"
    
    @property
    def description(self) -> str:
        return "E-commerce transaction data including orders, products, pricing, and customer information"
    
    @property
    def fields(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": "order_id",
                "type": "uuid",
                "description": "Unique order identifier",
                "example": "ORD-123e4567-e89b-12d3"
            },
            {
                "name": "transaction_id",
                "type": "string",
                "description": "Payment transaction ID",
                "example": "TXN-20240115-ABC123"
            },
            {
                "name": "customer_id",
                "type": "uuid",
                "description": "Customer identifier",
                "example": "123e4567-e89b-12d3-a456-426614174000"
            },
            {
                "name": "customer_email",
                "type": "string",
                "description": "Customer email address",
                "example": "customer@example.com"
            },
            {
                "name": "product_id",
                "type": "string",
                "description": "Product SKU",
                "example": "ELEC-001234"
            },
            {
                "name": "product_name",
                "type": "string",
                "description": "Product name",
                "example": "Wireless Bluetooth Headphones"
            },
            {
                "name": "product_category",
                "type": "string",
                "description": "Product category",
                "example": "Electronics"
            },
            {
                "name": "quantity",
                "type": "integer",
                "description": "Quantity ordered",
                "example": 2
            },
            {
                "name": "unit_price",
                "type": "float",
                "description": "Price per unit",
                "example": 79.99
            },
            {
                "name": "discount_percent",
                "type": "float",
                "description": "Discount percentage applied",
                "example": 10.0
            },
            {
                "name": "subtotal",
                "type": "float",
                "description": "Subtotal before tax and shipping",
                "example": 143.98
            },
            {
                "name": "tax_amount",
                "type": "float",
                "description": "Tax amount",
                "example": 11.52
            },
            {
                "name": "shipping_cost",
                "type": "float",
                "description": "Shipping cost",
                "example": 5.99
            },
            {
                "name": "total_amount",
                "type": "float",
                "description": "Total order amount",
                "example": 161.49
            },
            {
                "name": "currency",
                "type": "string",
                "description": "Currency code",
                "example": "USD"
            },
            {
                "name": "payment_method",
                "type": "string",
                "description": "Payment method used",
                "example": "Credit Card"
            },
            {
                "name": "order_status",
                "type": "string",
                "description": "Current order status",
                "example": "Delivered"
            },
            {
                "name": "shipping_method",
                "type": "string",
                "description": "Shipping method selected",
                "example": "Express"
            },
            {
                "name": "shipping_address",
                "type": "string",
                "description": "Shipping address",
                "example": "123 Main St, New York, NY 10001"
            },
            {
                "name": "order_date",
                "type": "datetime",
                "description": "Order placement timestamp",
                "example": "2024-01-15T14:30:00"
            },
            {
                "name": "shipped_date",
                "type": "datetime",
                "description": "Shipment date (if shipped)",
                "example": "2024-01-16T09:00:00"
            },
            {
                "name": "delivered_date",
                "type": "datetime",
                "description": "Delivery date (if delivered)",
                "example": "2024-01-18T15:30:00"
            }
        ]
    
    def generate_record(self) -> Dict[str, Any]:
        """
        Generate a single e-commerce transaction record.
        
        Returns:
            Dictionary containing transaction data
        """
        # Select a random product
        product = random.choice(PRODUCT_CATALOG)
        
        # Generate order and customer IDs
        order_id = f"ORD-{uuid.uuid4().hex[:12].upper()}"
        transaction_id = f"TXN-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        customer_id = str(uuid.uuid4())
        product_id = f"{product['sku_prefix']}-{random.randint(100000, 999999)}"
        
        # Generate quantity (weighted towards lower quantities)
        quantity = random.choices([1, 2, 3, 4, 5], weights=[50, 25, 15, 7, 3])[0]
        
        # Apply price variation (±10%)
        price_variation = random.uniform(0.9, 1.1)
        unit_price = round(product['base_price'] * price_variation, 2)
        
        # Generate discount (30% chance of discount)
        if random.random() < 0.3:
            discount_percent = random.choice([5, 10, 15, 20, 25])
        else:
            discount_percent = 0
        
        # Calculate amounts
        subtotal = round(unit_price * quantity * (1 - discount_percent / 100), 2)
        tax_rate = random.choice([0.0, 0.05, 0.06, 0.07, 0.08, 0.0825, 0.1])
        tax_amount = round(subtotal * tax_rate, 2)
        
        # Shipping cost based on method
        shipping_method = random.choice(SHIPPING_METHODS)
        shipping_costs = {
            "Free Shipping": 0.0,
            "Standard": random.uniform(4.99, 9.99),
            "Express": random.uniform(12.99, 19.99),
            "Next Day": random.uniform(24.99, 34.99)
        }
        shipping_cost = round(shipping_costs[shipping_method], 2)
        
        # Free shipping for orders over $100
        if subtotal >= 100:
            shipping_cost = 0.0
            shipping_method = "Free Shipping"
        
        total_amount = round(subtotal + tax_amount + shipping_cost, 2)
        
        # Generate order date (within last year)
        order_date = self.faker.date_time_between(
            start_date="-1y",
            end_date="now"
        )
        
        # Generate status and related dates
        order_status = random.choices(
            ORDER_STATUSES,
            weights=[5, 10, 15, 55, 10, 5]  # Most orders delivered
        )[0]
        
        shipped_date = None
        delivered_date = None
        
        if order_status in ["Shipped", "Delivered"]:
            shipped_date = order_date + timedelta(days=random.randint(1, 3))
        
        if order_status == "Delivered":
            delivery_days = 2 if shipping_method == "Next Day" else (4 if shipping_method == "Express" else random.randint(5, 10))
            delivered_date = shipped_date + timedelta(days=delivery_days)
        
        # Generate customer email
        customer_email = self.faker.email()
        
        # Generate shipping address
        shipping_address = f"{self.faker.street_address()}, {self.faker.city()}, {self.faker.state_abbr()} {self.faker.postcode()}"
        
        return {
            "order_id": order_id,
            "transaction_id": transaction_id,
            "customer_id": customer_id,
            "customer_email": customer_email,
            "product_id": product_id,
            "product_name": product['name'],
            "product_category": product['category'],
            "quantity": quantity,
            "unit_price": unit_price,
            "discount_percent": discount_percent,
            "subtotal": subtotal,
            "tax_amount": tax_amount,
            "shipping_cost": shipping_cost,
            "total_amount": total_amount,
            "currency": "USD",
            "payment_method": random.choice(PAYMENT_METHODS),
            "order_status": order_status,
            "shipping_method": shipping_method,
            "shipping_address": shipping_address,
            "order_date": order_date,
            "shipped_date": shipped_date,
            "delivered_date": delivered_date
        }
