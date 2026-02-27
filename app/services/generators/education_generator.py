"""
Education Data Generator
Generates realistic student, course, and academic record data
"""

import uuid
import string
from datetime import datetime, timedelta, timezone
from typing import Dict, List, Any, Optional
import random

from app.services.generators.base import BaseGenerator


INSTITUTIONS = [
    "MIT", "Stanford University", "Harvard University", "UC Berkeley",
    "Yale University", "Princeton University", "Columbia University",
    "University of Michigan", "Georgia Tech", "Carnegie Mellon",
    "University of Texas at Austin", "UCLA", "NYU", "Duke University",
    "University of Washington", "Penn State", "Ohio State University",
    "University of Illinois", "Purdue University", "Arizona State University",
]

DEPARTMENTS = [
    "Computer Science", "Mathematics", "Physics", "Chemistry", "Biology",
    "Engineering", "Business Administration", "Economics", "Psychology",
    "English Literature", "History", "Political Science", "Sociology",
    "Philosophy", "Art & Design", "Music", "Education", "Nursing",
    "Data Science", "Cybersecurity",
]

COURSE_CATALOG = {
    "Computer Science": [
        ("CS 101", "Introduction to Computer Science"),
        ("CS 201", "Data Structures & Algorithms"),
        ("CS 301", "Operating Systems"),
        ("CS 310", "Database Systems"),
        ("CS 401", "Machine Learning"),
        ("CS 450", "Computer Networks"),
    ],
    "Mathematics": [
        ("MATH 101", "Calculus I"),
        ("MATH 201", "Linear Algebra"),
        ("MATH 301", "Probability & Statistics"),
        ("MATH 310", "Discrete Mathematics"),
        ("MATH 401", "Real Analysis"),
    ],
    "Business Administration": [
        ("BUS 101", "Principles of Management"),
        ("BUS 201", "Marketing Fundamentals"),
        ("BUS 301", "Financial Accounting"),
        ("BUS 310", "Business Analytics"),
        ("BUS 401", "Strategic Management"),
    ],
    "Engineering": [
        ("ENG 101", "Engineering Mechanics"),
        ("ENG 201", "Thermodynamics"),
        ("ENG 301", "Control Systems"),
        ("ENG 310", "Materials Science"),
        ("ENG 401", "Capstone Design"),
    ],
    "Psychology": [
        ("PSY 101", "Introduction to Psychology"),
        ("PSY 201", "Abnormal Psychology"),
        ("PSY 301", "Cognitive Psychology"),
        ("PSY 310", "Research Methods"),
        ("PSY 401", "Neuropsychology"),
    ],
}

DEGREE_LEVELS = ["Associate", "Bachelor's", "Master's", "Doctoral", "Certificate"]
DEGREE_WEIGHTS = [10, 50, 25, 10, 5]

ENROLLMENT_STATUSES = ["Active", "Graduated", "On Leave", "Suspended", "Withdrawn", "Deferred"]
ENROLLMENT_WEIGHTS = [55, 25, 8, 3, 5, 4]

SEMESTERS = ["Fall", "Spring", "Summer"]
GRADE_SCALE = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "F": 0.0,
}

SCHOLARSHIP_TYPES = [
    "Merit Scholarship", "Need-Based Grant", "Athletic Scholarship",
    "Research Fellowship", "Teaching Assistantship", "Departmental Award",
    "Alumni Scholarship", "Federal Pell Grant", "None",
]

EXTRACURRICULARS = [
    "Student Government", "Debate Club", "Robotics Team", "Drama Society",
    "Research Lab", "Sports Team", "Music Ensemble", "Volunteer Corps",
    "Coding Club", "Entrepreneurship Society", "Newspaper", "Greek Life",
]


class EducationGenerator(BaseGenerator):
    """
    Generator for education / academic data.
    Creates realistic student enrollment and course records.
    """

    @property
    def name(self) -> str:
        return "education"

    @property
    def description(self) -> str:
        return "Education/Academic data including student records, courses, grades, GPA, enrollment, and financial aid information"

    @property
    def fields(self) -> List[Dict[str, Any]]:
        return [
            {"name": "student_id", "type": "string", "description": "Unique student identifier", "example": "STU-20230001"},
            {"name": "first_name", "type": "string", "description": "Student first name", "example": "Alex"},
            {"name": "last_name", "type": "string", "description": "Student last name", "example": "Thompson"},
            {"name": "email", "type": "string", "description": "Student email", "example": "athompson@university.edu"},
            {"name": "date_of_birth", "type": "date", "description": "Date of birth", "example": "2002-08-15"},
            {"name": "institution", "type": "string", "description": "Institution name", "example": "MIT"},
            {"name": "department", "type": "string", "description": "Academic department", "example": "Computer Science"},
            {"name": "degree_level", "type": "string", "description": "Degree level", "example": "Bachelor's"},
            {"name": "enrollment_status", "type": "string", "description": "Current enrollment status", "example": "Active"},
            {"name": "enrollment_year", "type": "integer", "description": "Year of enrollment", "example": 2023},
            {"name": "expected_graduation", "type": "string", "description": "Expected graduation semester", "example": "Spring 2027"},
            {"name": "course_code", "type": "string", "description": "Current course code", "example": "CS 201"},
            {"name": "course_name", "type": "string", "description": "Current course name", "example": "Data Structures & Algorithms"},
            {"name": "semester", "type": "string", "description": "Current semester", "example": "Fall 2025"},
            {"name": "credits", "type": "integer", "description": "Course credit hours", "example": 3},
            {"name": "grade", "type": "string", "description": "Letter grade", "example": "A-"},
            {"name": "gpa", "type": "float", "description": "Cumulative GPA (4.0 scale)", "example": 3.65},
            {"name": "credits_completed", "type": "integer", "description": "Total credits completed", "example": 72},
            {"name": "credits_required", "type": "integer", "description": "Credits required for degree", "example": 120},
            {"name": "tuition_amount", "type": "float", "description": "Semester tuition (USD)", "example": 24500.00},
            {"name": "scholarship", "type": "string", "description": "Scholarship/aid type", "example": "Merit Scholarship"},
            {"name": "scholarship_amount", "type": "float", "description": "Scholarship amount (USD)", "example": 8000.00},
            {"name": "extracurricular", "type": "string", "description": "Primary extracurricular activity", "example": "Robotics Team"},
            {"name": "advisor_name", "type": "string", "description": "Academic advisor", "example": "Prof. David Kim"},
            {"name": "is_international", "type": "boolean", "description": "International student flag", "example": False},
            {"name": "record_date", "type": "datetime", "description": "Record timestamp", "example": "2025-09-01T10:00:00"},
        ]

    def generate_record(self) -> Dict[str, Any]:
        """Generate a single education/student record."""
        gender = random.choice(["Male", "Female"])
        first_name = self.faker.first_name_male() if gender == "Male" else self.faker.first_name_female()
        last_name = self.faker.last_name()

        institution = random.choice(INSTITUTIONS)
        department = random.choice(DEPARTMENTS)
        degree_level = random.choices(DEGREE_LEVELS, weights=DEGREE_WEIGHTS, k=1)[0]
        enrollment_status = random.choices(ENROLLMENT_STATUSES, weights=ENROLLMENT_WEIGHTS, k=1)[0]

        # Enrollment & graduation
        current_year = datetime.now(timezone.utc).year
        enrollment_year = random.randint(current_year - 5, current_year)
        duration = {"Associate": 2, "Bachelor's": 4, "Master's": 2, "Doctoral": 5, "Certificate": 1}
        grad_year = enrollment_year + duration.get(degree_level, 4)
        grad_semester = random.choice(["Spring", "Fall"])

        # Course
        dept_key = department if department in COURSE_CATALOG else random.choice(list(COURSE_CATALOG.keys()))
        course_code, course_name = random.choice(COURSE_CATALOG[dept_key])
        credits = random.choice([3, 3, 3, 4, 4])

        # Grade  – skew toward B+/A range
        grade_keys = list(GRADE_SCALE.keys())
        # Weights for: A+ A A- B+ B B- C+ C C- D+ D F
        grade_weights = [3, 10, 15, 20, 15, 12, 8, 7, 4, 3, 2, 1]
        grade = random.choices(grade_keys, weights=grade_weights, k=1)[0]

        # GPA – correlated loosely with grade
        gpa = round(random.gauss(3.2, 0.5), 2)
        gpa = max(0.0, min(4.0, gpa))

        # Credits progress
        years_in = current_year - enrollment_year
        credits_required = {"Associate": 60, "Bachelor's": 120, "Master's": 36, "Doctoral": 72, "Certificate": 18}
        req = credits_required.get(degree_level, 120)
        credits_completed = min(req, int(years_in * (req / duration.get(degree_level, 4))))

        # Tuition
        base_tuition = random.gauss(25000, 10000)
        tuition = round(max(5000, min(60000, base_tuition)), 2)

        # Scholarship
        scholarship = random.choices(
            SCHOLARSHIP_TYPES,
            weights=[15, 15, 5, 5, 5, 10, 10, 10, 25],
            k=1
        )[0]
        scholarship_amount = round(random.uniform(2000, 20000), 2) if scholarship != "None" else 0.0

        dob = self.faker.date_of_birth(minimum_age=17, maximum_age=35)
        is_international = random.random() < 0.15
        semester = f"{random.choice(SEMESTERS)} {current_year}"

        email_base = f"{first_name[0].lower()}{last_name.lower()}"
        email = f"{email_base}@{institution.lower().replace(' ', '').replace('&', '')[:12]}.edu"

        return {
            "student_id": f"STU-{enrollment_year}{random.randint(1000, 9999)}",
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "date_of_birth": dob.isoformat(),
            "institution": institution,
            "department": department,
            "degree_level": degree_level,
            "enrollment_status": enrollment_status,
            "enrollment_year": enrollment_year,
            "expected_graduation": f"{grad_semester} {grad_year}",
            "course_code": course_code,
            "course_name": course_name,
            "semester": semester,
            "credits": credits,
            "grade": grade,
            "gpa": gpa,
            "credits_completed": credits_completed,
            "credits_required": req,
            "tuition_amount": tuition,
            "scholarship": scholarship,
            "scholarship_amount": scholarship_amount,
            "extracurricular": random.choice(EXTRACURRICULARS),
            "advisor_name": f"Prof. {self.faker.first_name()} {self.faker.last_name()}",
            "is_international": is_international,
            "record_date": self.faker.date_time_between(start_date="-1y", end_date="now"),
        }
