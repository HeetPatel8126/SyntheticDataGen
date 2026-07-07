"""
Custom Template Generator

Uses Template.schema field definitions to generate records, supporting
expanded field types such as enum, regex, distribution, percentage, price,
latitude/longitude, date_range, and boolean_weighted, plus cross-field
constraints.
"""

import logging
import random
import uuid
from datetime import datetime, date, timedelta
from typing import Any, Callable, Dict, List, Optional

import rstr

from app.services.generators.base import BaseGenerator


logger = logging.getLogger(__name__)


class CustomTemplateGenerator(BaseGenerator):
    """
    Generator that produces records based on a saved template schema.
    Applies optional cross-field constraints with retry logic.
    """

    def __init__(self, schema: Dict[str, Any], locale: str = "en_US", seed: Optional[int] = None):
        super().__init__(locale=locale, seed=seed)
        self._schema = schema or {}
        self._fields: List[Dict[str, Any]] = list(self._schema.get("fields", []))
        self._constraints: List[Dict[str, Any]] = list(self._schema.get("constraints", []))

    @property
    def name(self) -> str:
        return "custom"

    @property
    def description(self) -> str:
        return "Custom template-based data using user-defined fields."

    @property
    def fields(self) -> List[Dict[str, Any]]:
        # Expose raw schema fields as field metadata
        return [
            {
                "name": f.get("name"),
                "type": f.get("field_type"),
                "description": "",
                "example": None,
            }
            for f in self._fields
        ]

    def generate_record(self) -> Dict[str, Any]:
        """
        Generate a single record (without enforcing constraints).
        Constraint enforcement is handled in generate_records to allow retries.
        """
        record: Dict[str, Any] = {}
        for field in self._fields:
            name = field.get("name")
            if not name:
                continue
            record[name] = self._generate_field_value(field)
        return record

    # Override to apply constraints with retries
    def generate_records(
        self,
        count: int,
        progress_callback: Optional[Callable[[float], None]] = None,
        batch_size: int = 1000,
    ):
        """
        Generate records, enforcing cross-field constraints.

        Attempts up to 3 retries per record; if constraints still fail,
        the record is skipped and a warning is logged.
        """
        max_retries = 3
        yielded = 0
        attempts = 0

        while yielded < count:
            attempts += 1
            record = None
            for attempt in range(max_retries):
                candidate = self.generate_record()
                if self._satisfies_constraints(candidate):
                    record = candidate
                    break
            if record is None:
                logger.warning("Skipping record after %d failed constraint attempts", max_retries)
            else:
                yielded += 1
                yield record

                if progress_callback and (yielded % batch_size == 0 or yielded == count):
                    progress = (yielded / count) * 100.0
                    progress_callback(min(progress, 99.0))

    # ----- Field generation helpers -----

    def _generate_field_value(self, field_def: Dict[str, Any]) -> Any:
        field_type = (field_def.get("field_type") or "string").lower()
        nullable = bool(field_def.get("nullable", False))
        options = field_def.get("options") or {}

        # Handle nullability with simple 10% null default
        null_probability = float(options.get("null_probability", 0.1)) if nullable else 0.0
        if random.random() < null_probability:
            return None

        if field_type in {"string", "text"}:
            max_length = int(options.get("max_length", 32))
            return self.faker.text(max_nb_chars=max_length)
        if field_type == "name":
            return self.faker.name()
        if field_type == "email":
            return self.faker.email()
        if field_type == "phone":
            return self.faker.phone_number()
        if field_type == "address":
            return self.faker.address()
        if field_type == "city":
            return self.faker.city()
        if field_type == "country":
            return self.faker.country()
        if field_type == "company":
            return self.faker.company()
        if field_type == "uuid":
            return str(uuid.uuid4())

        if field_type in {"integer", "float", "percentage", "price", "distribution"}:
            return self._generate_numeric(field_type, options)

        if field_type == "boolean":
            return bool(random.getrandbits(1))
        if field_type == "boolean_weighted":
            prob = options.get("true_probability", 0.5)
            try:
                prob_val = float(prob)
                if prob_val > 1:
                    prob_val = prob_val / 100.0
            except (TypeError, ValueError):
                prob_val = 0.5
            return random.random() < max(0.0, min(1.0, prob_val))

        if field_type == "enum" or field_type == "choice":
            values = options.get("values") or field_def.get("enum_values") or []
            if not values:
                return None
            return random.choice(values)

        if field_type == "regex":
            pattern = options.get("pattern") or field_def.get("regex_pattern")
            if not pattern:
                return None
            # Reject excessively long patterns to mitigate ReDoS (Issue #11)
            if len(pattern) > 200:
                logger.warning("Regex pattern too long (%d chars), skipping", len(pattern))
                return None
            try:
                import concurrent.futures
                with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
                    future = pool.submit(rstr.xeger, pattern)
                    return future.result(timeout=2)  # 2-second hard limit
            except concurrent.futures.TimeoutError:
                logger.warning("Regex generation timed out for pattern: %s", pattern[:50])
                return None
            except Exception:
                return None

        if field_type == "date":
            return self._generate_date(options)
        if field_type == "datetime":
            return self._generate_datetime(options)
        if field_type == "date_range":
            return self._generate_date_range(options)

        if field_type == "latitude":
            return self._random_latitude()
        if field_type == "longitude":
            return self._random_longitude()

        # Fallback: simple string
        return self.faker.word()

    def _generate_numeric(self, field_type: str, options: Dict[str, Any]) -> Any:
        min_val = options.get("min")
        max_val = options.get("max")
        mean = options.get("mean")
        std = options.get("std")

        try:
            min_f = float(min_val) if min_val is not None else None
        except (TypeError, ValueError):
            min_f = None
        try:
            max_f = float(max_val) if max_val is not None else None
        except (TypeError, ValueError):
            max_f = None
        try:
            mean_f = float(mean) if mean is not None else None
        except (TypeError, ValueError):
            mean_f = None
        try:
            std_f = float(std) if std is not None else None
        except (TypeError, ValueError):
            std_f = None

        if field_type == "distribution":
            dist = options.get("distribution") or "normal"
            value = self._random_distribution(
                dist,
                min_value=min_f,
                max_value=max_f,
                mean=mean_f,
                std=std_f,
            )
        elif field_type == "percentage":
            low = min_f if min_f is not None else 0.0
            high = max_f if max_f is not None else 100.0
            value = self._random_percentage(low, high)
        elif field_type == "price":
            low = min_f if min_f is not None else 0.0
            high = max_f if max_f is not None else 1000.0
            value = self._random_price(low, high)
        else:
            low = min_f if min_f is not None else 0.0
            high = max_f if max_f is not None else low + 100.0
            value = random.uniform(low, high)

        if field_type == "integer":
            return int(round(value))
        return value

    def _generate_date(self, options: Dict[str, Any]) -> str:
        start = options.get("start_date")
        end = options.get("end_date")
        if start and end:
            try:
                start_date = date.fromisoformat(start)
                end_date = date.fromisoformat(end)
                delta_days = max(0, (end_date - start_date).days)
                offset = random.randint(0, delta_days) if delta_days > 0 else 0
                result = start_date + timedelta(days=offset)
                return result.isoformat()
            except Exception:
                pass
        # Fallback: within last 10 years
        return self.faker.date_between(start_date="-10y", end_date="today").isoformat()

    def _generate_datetime(self, options: Dict[str, Any]) -> datetime:
        # For now simply use faker within last 5 years; options can extend later
        return self.faker.date_time_between(start_date="-5y", end_date="now")

    def _generate_date_range(self, options: Dict[str, Any]) -> str:
        """
        Generate a date within a specified start/end range (inclusive).
        Returns ISO date string.
        """
        start = options.get("start_date")
        end = options.get("end_date")
        if start and end:
            try:
                start_date = date.fromisoformat(start)
                end_date = date.fromisoformat(end)
                delta_days = max(0, (end_date - start_date).days)
                offset = random.randint(0, delta_days) if delta_days > 0 else 0
                result = start_date + timedelta(days=offset)
                return result.isoformat()
            except Exception:
                pass
        return self.faker.date_between(start_date="-1y", end_date="today").isoformat()

    # ----- Constraint evaluation -----

    def _satisfies_constraints(self, record: Dict[str, Any]) -> bool:
        if not self._constraints:
            return True

        for c in self._constraints:
            ctype = (c.get("type") or "").lower()
            try:
                if ctype == "greater_than":
                    if not self._constraint_greater_than(record, c):
                        return False
                elif ctype == "less_than":
                    if not self._constraint_less_than(record, c):
                        return False
                elif ctype == "date_after":
                    if not self._constraint_date_after(record, c):
                        return False
                elif ctype == "sum_equals":
                    if not self._constraint_sum_equals(record, c):
                        return False
                elif ctype == "conditional":
                    if not self._constraint_conditional(record, c):
                        return False
            except Exception as exc:
                logger.warning("Constraint evaluation error (%s): %s", ctype, exc)
                return False

        return True

    def _get_numeric(self, record: Dict[str, Any], field: str) -> Optional[float]:
        value = record.get(field)
        if value is None:
            return None
        try:
            return float(value)
        except (TypeError, ValueError):
            return None

    def _constraint_greater_than(self, record: Dict[str, Any], cfg: Dict[str, Any]) -> bool:
        a = cfg.get("field_a")
        b = cfg.get("field_b")
        if not a or not b:
            return True
        va = self._get_numeric(record, a)
        vb = self._get_numeric(record, b)
        if va is None or vb is None:
            return False
        return va > vb

    def _constraint_less_than(self, record: Dict[str, Any], cfg: Dict[str, Any]) -> bool:
        a = cfg.get("field_a")
        b = cfg.get("field_b")
        if not a or not b:
            return True
        va = self._get_numeric(record, a)
        vb = self._get_numeric(record, b)
        if va is None or vb is None:
            return False
        return va < vb

    def _constraint_date_after(self, record: Dict[str, Any], cfg: Dict[str, Any]) -> bool:
        a = cfg.get("field_a")
        b = cfg.get("field_b")
        if not a or not b:
            return True
        va = record.get(a)
        vb = record.get(b)
        if not va or not vb:
            return False
        try:
            da = datetime.fromisoformat(str(va))
            db = datetime.fromisoformat(str(vb))
            return da > db
        except Exception:
            return False

    def _constraint_sum_equals(self, record: Dict[str, Any], cfg: Dict[str, Any]) -> bool:
        fields = cfg.get("fields") or []
        target = cfg.get("target")
        tolerance = float(cfg.get("tolerance", 1e-6))
        if not fields or target is None:
            return True
        try:
            target_f = float(target)
        except (TypeError, ValueError):
            return True
        total = 0.0
        for f in fields:
            v = self._get_numeric(record, f)
            if v is None:
                return False
            total += v
        return abs(total - target_f) <= tolerance

    def _constraint_conditional(self, record: Dict[str, Any], cfg: Dict[str, Any]) -> bool:
        """
        if field_a == equals then field_b must == then_equals.
        """
        field_a = cfg.get("field_a")
        equals = cfg.get("equals")
        field_b = cfg.get("field_b") or cfg.get("then_field")
        then_equals = cfg.get("then_equals")
        if not field_a or field_b is None:
            return True
        if record.get(field_a) == equals:
            return record.get(field_b) == then_equals
        return True

