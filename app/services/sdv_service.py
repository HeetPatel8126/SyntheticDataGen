"""
SDV Service
Wrapper around SDV GaussianCopulaSynthesizer for single-table modeling.
"""

import logging
import pickle
from pathlib import Path
from typing import Optional

import numpy as np
import pandas as pd
from sdv.metadata import Metadata
from sdv.single_table import GaussianCopulaSynthesizer

from app.config import settings

logger = logging.getLogger(__name__)


class SDVService:
    """
    Service for fitting and sampling SDV GaussianCopulaSynthesizer models.
    """

    def __init__(self, model_dir: Optional[str] = None) -> None:
        self.model_dir = Path(model_dir or settings.model_storage_path)
        self.model_dir.mkdir(parents=True, exist_ok=True)

    def _get_model_path(self, upload_id: str) -> Path:
        return self.model_dir / f"{upload_id}.pkl"

    def fit_and_save_model(self, upload_id: str, df: pd.DataFrame) -> str:
        """
        Fit a GaussianCopulaSynthesizer on the given dataframe and persist it.

        Returns the absolute filesystem path to the saved model.
        """
        table_name = f"upload_{upload_id}"
        logger.info("Fitting SDV GaussianCopulaSynthesizer for %s", table_name)

        metadata = Metadata.detect_from_dataframe(data=df, table_name=table_name)
        synthesizer = GaussianCopulaSynthesizer(metadata)
        synthesizer.fit(df)

        model_path = self._get_model_path(upload_id)
        with open(model_path, "wb") as f:
            pickle.dump(synthesizer, f)

        logger.info("Saved SDV model for upload %s to %s", upload_id, model_path)
        return str(model_path)

    def _load_model(self, model_path: str) -> GaussianCopulaSynthesizer:
        with open(model_path, "rb") as f:
            return pickle.load(f)

    def sample(
        self,
        model_path: Optional[str],
        df_original: pd.DataFrame,
        record_count: int,
    ) -> pd.DataFrame:
        """
        Generate synthetic data using a fitted SDV model.

        If the model is missing or SDV sampling fails, falls back to basic
        per-column statistical sampling based on the original dataframe.
        """
        if model_path:
            try:
                model = self._load_model(model_path)
                return model.sample(num_rows=record_count)
            except Exception as exc:
                logger.warning(
                    "SDV sampling failed for model %s, falling back to basic sampling: %s",
                    model_path,
                    exc,
                )

        return self._basic_sample(df_original, record_count)

    def _basic_sample(self, df: pd.DataFrame, record_count: int) -> pd.DataFrame:
        """
        Basic statistical sampling fallback by column.

        - Numeric: sample with replacement from observed values; if too few,
          use normal approximation with mean/std.
        - Non-numeric: sample with replacement according to empirical frequencies.
        """
        if df.empty:
            return df

        rng = np.random.default_rng()
        result = {}

        for col in df.columns:
            series = df[col].dropna()
            if series.empty:
                result[col] = [None] * record_count
                continue

            if np.issubdtype(series.dtype, np.number):
                values = series.to_numpy()
                if len(values) >= 10:
                    sampled = rng.choice(values, size=record_count, replace=True)
                else:
                    mean = float(series.mean())
                    std = float(series.std()) or 1.0
                    sampled = rng.normal(loc=mean, scale=std, size=record_count)
                result[col] = sampled.tolist()
            else:
                values, counts = np.unique(series.astype(str).to_numpy(), return_counts=True)
                probs = counts / counts.sum()
                sampled = rng.choice(values, size=record_count, replace=True, p=probs)
                result[col] = sampled.tolist()

        return pd.DataFrame(result)

