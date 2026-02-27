"""
Healthcare / Medical Data Generator
Generates realistic patient and medical record data
"""

import uuid
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Any, Optional
import random

from app.services.generators.base import BaseGenerator


# Realistic medical reference data
MEDICAL_CONDITIONS = [
    "Hypertension", "Type 2 Diabetes", "Asthma", "Hyperlipidemia",
    "Osteoarthritis", "Depression", "Anxiety Disorder", "GERD",
    "Hypothyroidism", "Chronic Back Pain", "Migraine", "Allergic Rhinitis",
    "Atrial Fibrillation", "COPD", "Chronic Kidney Disease",
    "Obstructive Sleep Apnea", "Iron Deficiency Anemia", "Obesity",
    "Coronary Artery Disease", "Heart Failure",
]

MEDICATIONS = [
    {"name": "Lisinopril", "dosage": "10mg", "frequency": "Once daily"},
    {"name": "Metformin", "dosage": "500mg", "frequency": "Twice daily"},
    {"name": "Atorvastatin", "dosage": "20mg", "frequency": "Once daily"},
    {"name": "Omeprazole", "dosage": "20mg", "frequency": "Once daily"},
    {"name": "Amlodipine", "dosage": "5mg", "frequency": "Once daily"},
    {"name": "Levothyroxine", "dosage": "50mcg", "frequency": "Once daily"},
    {"name": "Albuterol", "dosage": "90mcg", "frequency": "As needed"},
    {"name": "Metoprolol", "dosage": "25mg", "frequency": "Twice daily"},
    {"name": "Sertraline", "dosage": "50mg", "frequency": "Once daily"},
    {"name": "Gabapentin", "dosage": "300mg", "frequency": "Three times daily"},
    {"name": "Losartan", "dosage": "50mg", "frequency": "Once daily"},
    {"name": "Hydrochlorothiazide", "dosage": "25mg", "frequency": "Once daily"},
    {"name": "Prednisone", "dosage": "10mg", "frequency": "Once daily"},
    {"name": "Ibuprofen", "dosage": "400mg", "frequency": "As needed"},
    {"name": "Pantoprazole", "dosage": "40mg", "frequency": "Once daily"},
]

BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
BLOOD_TYPE_WEIGHTS = [34, 6, 9, 2, 3, 1, 38, 7]  # approximate US distribution

DEPARTMENTS = [
    "Emergency Medicine", "Internal Medicine", "Cardiology", "Orthopedics",
    "Neurology", "Pediatrics", "Oncology", "Dermatology", "Psychiatry",
    "Gastroenterology", "Pulmonology", "Endocrinology", "Radiology",
    "General Surgery", "Obstetrics & Gynecology",
]

INSURANCE_PROVIDERS = [
    "Blue Cross Blue Shield", "UnitedHealthcare", "Aetna", "Cigna",
    "Humana", "Kaiser Permanente", "Anthem", "Molina Healthcare",
    "Centene", "Medicare", "Medicaid", "Self-Pay",
]

VISIT_TYPES = [
    "Annual Physical", "Follow-Up", "Urgent Care", "Emergency",
    "Specialist Consultation", "Lab Work", "Imaging", "Procedure",
    "Telehealth", "Vaccination",
]

ALLERGIES = [
    "Penicillin", "Sulfa Drugs", "Aspirin", "Ibuprofen", "Latex",
    "Peanuts", "Shellfish", "Eggs", "Codeine", "No Known Allergies",
]

LAB_TESTS = [
    {"name": "Complete Blood Count", "code": "CBC"},
    {"name": "Basic Metabolic Panel", "code": "BMP"},
    {"name": "Lipid Panel", "code": "LIPID"},
    {"name": "Hemoglobin A1C", "code": "HBA1C"},
    {"name": "Thyroid Stimulating Hormone", "code": "TSH"},
    {"name": "Urinalysis", "code": "UA"},
    {"name": "Liver Function Test", "code": "LFT"},
    {"name": "Prothrombin Time", "code": "PT"},
]


class HealthcareGenerator(BaseGenerator):
    """
    Generator for healthcare/medical data.
    Creates realistic patient records with medical information.
    """

    @property
    def name(self) -> str:
        return "healthcare"

    @property
    def description(self) -> str:
        return "Healthcare/Medical data including patient records, diagnoses, medications, vitals, and insurance information"

    @property
    def fields(self) -> List[Dict[str, Any]]:
        return [
            {"name": "patient_id", "type": "string", "description": "Unique patient identifier (MRN)", "example": "MRN-00123456"},
            {"name": "first_name", "type": "string", "description": "Patient first name", "example": "Emily"},
            {"name": "last_name", "type": "string", "description": "Patient last name", "example": "Johnson"},
            {"name": "date_of_birth", "type": "date", "description": "Date of birth", "example": "1985-03-22"},
            {"name": "age", "type": "integer", "description": "Patient age in years", "example": 41},
            {"name": "gender", "type": "string", "description": "Gender", "example": "Female"},
            {"name": "blood_type", "type": "string", "description": "Blood type", "example": "O+"},
            {"name": "height_cm", "type": "float", "description": "Height in centimeters", "example": 168.5},
            {"name": "weight_kg", "type": "float", "description": "Weight in kilograms", "example": 72.3},
            {"name": "bmi", "type": "float", "description": "Body Mass Index", "example": 25.5},
            {"name": "blood_pressure_systolic", "type": "integer", "description": "Systolic blood pressure (mmHg)", "example": 128},
            {"name": "blood_pressure_diastolic", "type": "integer", "description": "Diastolic blood pressure (mmHg)", "example": 82},
            {"name": "heart_rate", "type": "integer", "description": "Heart rate (bpm)", "example": 74},
            {"name": "temperature_f", "type": "float", "description": "Body temperature (°F)", "example": 98.6},
            {"name": "primary_diagnosis", "type": "string", "description": "Primary diagnosis/condition", "example": "Hypertension"},
            {"name": "secondary_diagnosis", "type": "string", "description": "Secondary diagnosis (if any)", "example": "Type 2 Diabetes"},
            {"name": "medication", "type": "string", "description": "Current primary medication", "example": "Lisinopril 10mg"},
            {"name": "allergies", "type": "string", "description": "Known allergies", "example": "Penicillin"},
            {"name": "department", "type": "string", "description": "Hospital department", "example": "Internal Medicine"},
            {"name": "attending_physician", "type": "string", "description": "Attending physician name", "example": "Dr. Sarah Chen"},
            {"name": "visit_type", "type": "string", "description": "Type of visit", "example": "Follow-Up"},
            {"name": "insurance_provider", "type": "string", "description": "Insurance provider", "example": "Blue Cross Blue Shield"},
            {"name": "insurance_id", "type": "string", "description": "Insurance member ID", "example": "BCBS-987654321"},
            {"name": "lab_test", "type": "string", "description": "Lab test ordered", "example": "Complete Blood Count"},
            {"name": "admission_date", "type": "datetime", "description": "Visit/admission date", "example": "2025-11-10T08:30:00"},
            {"name": "discharge_date", "type": "datetime", "description": "Discharge date (if applicable)", "example": "2025-11-12T14:00:00"},
            {"name": "is_emergency", "type": "boolean", "description": "Whether visit was emergency", "example": False},
        ]

    def generate_record(self) -> Dict[str, Any]:
        """Generate a single healthcare/patient record."""
        # Demographics
        gender = random.choice(["Male", "Female"])
        first_name = self.faker.first_name_male() if gender == "Male" else self.faker.first_name_female()
        last_name = self.faker.last_name()

        dob = self.faker.date_of_birth(minimum_age=1, maximum_age=95)
        today = datetime.now(timezone.utc).date()
        age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))

        # Blood type with realistic distribution
        blood_type = random.choices(BLOOD_TYPES, weights=BLOOD_TYPE_WEIGHTS, k=1)[0]

        # Vitals – correlated to age
        height_cm = round(random.gauss(170 if gender == "Male" else 162, 8), 1)
        weight_kg = round(random.gauss(82 if gender == "Male" else 70, 15), 1)
        weight_kg = max(30.0, weight_kg)
        bmi = round(weight_kg / ((height_cm / 100) ** 2), 1)

        systolic = int(random.gauss(120 + age * 0.3, 15))
        diastolic = int(random.gauss(78 + age * 0.1, 10))
        heart_rate = int(random.gauss(75, 12))
        temperature = round(random.gauss(98.6, 0.4), 1)

        # Diagnoses & meds
        primary_dx = random.choice(MEDICAL_CONDITIONS)
        secondary_dx = random.choice(MEDICAL_CONDITIONS) if random.random() < 0.4 else None
        med = random.choice(MEDICATIONS)

        # Allergies
        allergy_count = random.choices([0, 1, 2], weights=[40, 45, 15], k=1)[0]
        if allergy_count == 0:
            allergies = "No Known Allergies"
        else:
            allergies = ", ".join(random.sample([a for a in ALLERGIES if a != "No Known Allergies"], allergy_count))

        # Visit details
        department = random.choice(DEPARTMENTS)
        visit_type = random.choice(VISIT_TYPES)
        is_emergency = visit_type == "Emergency"
        insurance = random.choice(INSURANCE_PROVIDERS)
        lab = random.choice(LAB_TESTS)

        admission = self.faker.date_time_between(start_date="-2y", end_date="now")
        stay_hours = random.choices(
            [0, 4, 24, 72, 120],
            weights=[40, 25, 20, 10, 5],
            k=1,
        )[0]
        discharge = admission + timedelta(hours=stay_hours) if stay_hours > 0 else None

        physician_prefix = "Dr."
        physician_name = f"{physician_prefix} {self.faker.first_name()} {self.faker.last_name()}"

        return {
            "patient_id": f"MRN-{random.randint(10000000, 99999999)}",
            "first_name": first_name,
            "last_name": last_name,
            "date_of_birth": dob.isoformat(),
            "age": age,
            "gender": gender,
            "blood_type": blood_type,
            "height_cm": height_cm,
            "weight_kg": weight_kg,
            "bmi": bmi,
            "blood_pressure_systolic": max(80, min(200, systolic)),
            "blood_pressure_diastolic": max(50, min(130, diastolic)),
            "heart_rate": max(45, min(150, heart_rate)),
            "temperature_f": max(96.0, min(104.0, temperature)),
            "primary_diagnosis": primary_dx,
            "secondary_diagnosis": secondary_dx or "",
            "medication": f"{med['name']} {med['dosage']}",
            "allergies": allergies,
            "department": department,
            "attending_physician": physician_name,
            "visit_type": visit_type,
            "insurance_provider": insurance,
            "insurance_id": f"{insurance[:4].upper().replace(' ', '')}-{random.randint(100000000, 999999999)}",
            "lab_test": lab["name"],
            "admission_date": admission,
            "discharge_date": discharge,
            "is_emergency": is_emergency,
        }
