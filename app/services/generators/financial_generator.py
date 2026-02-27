"""
Financial / Banking Data Generator
Generates realistic financial transaction and account data
"""

import uuid
import string
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Any, Optional
import random
from decimal import Decimal

from app.services.generators.base import BaseGenerator


ACCOUNT_TYPES = ["Checking", "Savings", "Credit Card", "Money Market", "Certificate of Deposit", "Brokerage"]

TRANSACTION_TYPES = [
    "Deposit", "Withdrawal", "Transfer", "Payment", "Purchase",
    "Direct Deposit", "Wire Transfer", "ACH", "ATM Withdrawal",
    "POS Purchase", "Online Purchase", "Recurring Payment",
    "Interest Credit", "Fee", "Refund",
]

MERCHANT_CATEGORIES = {
    "Groceries": ["Whole Foods", "Trader Joe's", "Kroger", "Safeway", "Walmart Grocery", "Costco"],
    "Restaurants": ["Starbucks", "Chipotle", "McDonald's", "Olive Garden", "Domino's", "Panera Bread"],
    "Gas Stations": ["Shell", "Chevron", "BP", "ExxonMobil", "Costco Gas", "Circle K"],
    "Retail": ["Amazon", "Target", "Walmart", "Best Buy", "Home Depot", "Costco"],
    "Utilities": ["Electric Company", "Water Utility", "Gas Company", "Internet Provider", "Phone Bill"],
    "Entertainment": ["Netflix", "Spotify", "Disney+", "AMC Theatres", "Steam", "Apple Music"],
    "Transportation": ["Uber", "Lyft", "Delta Airlines", "United Airlines", "Amtrak", "Hertz"],
    "Healthcare": ["CVS Pharmacy", "Walgreens", "Quest Diagnostics", "Hospital Payment", "Doctor Visit"],
    "Insurance": ["State Farm", "Geico", "Progressive", "Allstate", "MetLife"],
    "Subscriptions": ["Adobe Creative", "Microsoft 365", "AWS", "Gym Membership", "News Subscription"],
}

CURRENCIES = [
    {"code": "USD", "symbol": "$", "weight": 60},
    {"code": "EUR", "symbol": "€", "weight": 15},
    {"code": "GBP", "symbol": "£", "weight": 10},
    {"code": "CAD", "symbol": "C$", "weight": 5},
    {"code": "JPY", "symbol": "¥", "weight": 5},
    {"code": "AUD", "symbol": "A$", "weight": 5},
]

CARD_NETWORKS = ["Visa", "Mastercard", "American Express", "Discover"]
TRANSACTION_STATUSES = ["Completed", "Pending", "Failed", "Reversed", "Disputed"]

BANK_NAMES = [
    "JPMorgan Chase", "Bank of America", "Wells Fargo", "Citibank",
    "Goldman Sachs", "Morgan Stanley", "US Bank", "PNC Financial",
    "Capital One", "TD Bank", "HSBC", "Barclays",
]

RISK_LEVELS = ["Low", "Medium", "High"]


class FinancialGenerator(BaseGenerator):
    """
    Generator for financial/banking transaction data.
    Creates realistic bank transactions, account data, and payment records.
    """

    @property
    def name(self) -> str:
        return "financial"

    @property
    def description(self) -> str:
        return "Financial/Banking data including transactions, accounts, merchants, card details, and risk scoring"

    @property
    def fields(self) -> List[Dict[str, Any]]:
        return [
            {"name": "transaction_id", "type": "string", "description": "Unique transaction identifier", "example": "TXN-A1B2C3D4E5F6"},
            {"name": "account_id", "type": "string", "description": "Bank account identifier", "example": "ACCT-98765432"},
            {"name": "account_holder", "type": "string", "description": "Account holder full name", "example": "Michael Rivera"},
            {"name": "account_type", "type": "string", "description": "Type of bank account", "example": "Checking"},
            {"name": "bank_name", "type": "string", "description": "Financial institution name", "example": "JPMorgan Chase"},
            {"name": "routing_number", "type": "string", "description": "Bank routing number", "example": "021000021"},
            {"name": "transaction_type", "type": "string", "description": "Type of transaction", "example": "Purchase"},
            {"name": "amount", "type": "float", "description": "Transaction amount", "example": 127.45},
            {"name": "currency", "type": "string", "description": "Currency code", "example": "USD"},
            {"name": "balance_before", "type": "float", "description": "Account balance before transaction", "example": 5432.10},
            {"name": "balance_after", "type": "float", "description": "Account balance after transaction", "example": 5304.65},
            {"name": "merchant_name", "type": "string", "description": "Merchant/payee name", "example": "Amazon"},
            {"name": "merchant_category", "type": "string", "description": "Merchant category", "example": "Retail"},
            {"name": "card_type", "type": "string", "description": "Payment card network", "example": "Visa"},
            {"name": "card_last_four", "type": "string", "description": "Last four digits of card", "example": "4532"},
            {"name": "transaction_status", "type": "string", "description": "Transaction status", "example": "Completed"},
            {"name": "is_international", "type": "boolean", "description": "Whether transaction is international", "example": False},
            {"name": "is_recurring", "type": "boolean", "description": "Whether transaction is recurring", "example": True},
            {"name": "risk_score", "type": "float", "description": "Fraud risk score (0-100)", "example": 12.5},
            {"name": "risk_level", "type": "string", "description": "Risk classification", "example": "Low"},
            {"name": "ip_address", "type": "string", "description": "Originating IP (for online)", "example": "192.168.1.42"},
            {"name": "location_city", "type": "string", "description": "Transaction location city", "example": "San Francisco"},
            {"name": "location_country", "type": "string", "description": "Transaction location country", "example": "United States"},
            {"name": "reference_number", "type": "string", "description": "Reference/confirmation number", "example": "REF-20251110-XYZ"},
            {"name": "transaction_date", "type": "datetime", "description": "Transaction timestamp", "example": "2025-11-10T14:23:45"},
            {"name": "settlement_date", "type": "date", "description": "Settlement date", "example": "2025-11-12"},
        ]

    def generate_record(self) -> Dict[str, Any]:
        """Generate a single financial transaction record."""
        # Account info
        account_holder = self.faker.name()
        account_type = random.choice(ACCOUNT_TYPES)
        bank_name = random.choice(BANK_NAMES)
        routing_number = "".join(random.choices(string.digits, k=9))

        # Transaction type & amount
        txn_type = random.choice(TRANSACTION_TYPES)

        # Amount distribution: many small, some medium, few large
        amount_bucket = random.choices(
            ["small", "medium", "large", "very_large"],
            weights=[50, 30, 15, 5],
            k=1,
        )[0]
        if amount_bucket == "small":
            amount = round(random.uniform(1.00, 50.00), 2)
        elif amount_bucket == "medium":
            amount = round(random.uniform(50.00, 500.00), 2)
        elif amount_bucket == "large":
            amount = round(random.uniform(500.00, 5000.00), 2)
        else:
            amount = round(random.uniform(5000.00, 50000.00), 2)

        # Balance
        balance_before = round(random.uniform(100.00, 150000.00), 2)
        is_credit = txn_type in ("Deposit", "Direct Deposit", "Interest Credit", "Refund", "Wire Transfer")
        balance_after = round(balance_before + amount if is_credit else balance_before - amount, 2)

        # Merchant
        category = random.choice(list(MERCHANT_CATEGORIES.keys()))
        merchant = random.choice(MERCHANT_CATEGORIES[category])

        # Currency
        currency_obj = random.choices(CURRENCIES, weights=[c["weight"] for c in CURRENCIES], k=1)[0]

        # Card
        card_type = random.choice(CARD_NETWORKS)
        card_last_four = "".join(random.choices(string.digits, k=4))

        # Status
        status = random.choices(
            TRANSACTION_STATUSES,
            weights=[80, 10, 4, 3, 3],
            k=1,
        )[0]

        # Fraud risk
        risk_score = round(random.betavariate(2, 10) * 100, 1)  # skew toward low risk
        risk_level = "High" if risk_score > 70 else ("Medium" if risk_score > 40 else "Low")

        is_international = random.random() < 0.08
        is_recurring = txn_type in ("Recurring Payment",) or (random.random() < 0.15)

        txn_date = self.faker.date_time_between(start_date="-1y", end_date="now")
        settlement_date = (txn_date + timedelta(days=random.choice([1, 2, 3]))).date()

        return {
            "transaction_id": f"TXN-{uuid.uuid4().hex[:12].upper()}",
            "account_id": f"ACCT-{random.randint(10000000, 99999999)}",
            "account_holder": account_holder,
            "account_type": account_type,
            "bank_name": bank_name,
            "routing_number": routing_number,
            "transaction_type": txn_type,
            "amount": amount,
            "currency": currency_obj["code"],
            "balance_before": balance_before,
            "balance_after": balance_after,
            "merchant_name": merchant,
            "merchant_category": category,
            "card_type": card_type,
            "card_last_four": card_last_four,
            "transaction_status": status,
            "is_international": is_international,
            "is_recurring": is_recurring,
            "risk_score": risk_score,
            "risk_level": risk_level,
            "ip_address": self.faker.ipv4() if random.random() < 0.6 else "",
            "location_city": self.faker.city(),
            "location_country": "United States" if not is_international else self.faker.country(),
            "reference_number": f"REF-{txn_date.strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}",
            "transaction_date": txn_date,
            "settlement_date": settlement_date.isoformat(),
        }
