import json
import logging

import joblib
import pandas as pd

from app.config import Settings
from app.schemas.prediction import FEATURE_FIELDS

logger = logging.getLogger("breastcare")

DISCLAIMER = "Educational prediction only; not a medical diagnosis."
PROBABILITY_NOTE = (
    "These are model scores from a logistic regression trained on a small public dataset. "
    "They are not the probability that a person has cancer."
)


class Predictor:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.pipeline = None
        self.metadata: dict = {}

    def load(self) -> None:
        """Load and validate the model artifact. Raises if anything is inconsistent."""
        if not self.settings.model_path.exists():
            raise FileNotFoundError(f"Model file not found: {self.settings.model_path}")
        if not self.settings.metadata_path.exists():
            raise FileNotFoundError(f"Metadata file not found: {self.settings.metadata_path}")

        self.metadata = json.loads(self.settings.metadata_path.read_text(encoding="utf-8"))
        self.pipeline = joblib.load(self.settings.model_path)

        names = self.metadata["feature_names"]
        if len(names) != len(FEATURE_FIELDS):
            raise RuntimeError("Metadata feature count does not match the API schema")
        if list(self.pipeline.feature_names_in_) != names:
            raise RuntimeError("Pipeline feature names do not match metadata")
        logger.info("Model loaded: %s v%s", self.metadata["model_name"], self.metadata["model_version"])

    @property
    def is_loaded(self) -> bool:
        return self.pipeline is not None

    def predict(self, features: dict) -> dict:
        names = self.metadata["feature_names"]
        # FEATURE_FIELDS and names are in the same order; map API names -> training names
        values = [features[f] for f in FEATURE_FIELDS]
        row = pd.DataFrame([values], columns=names)

        proba = self.pipeline.predict_proba(row)[0]
        classes = list(self.pipeline.classes_)
        p_malignant = float(proba[classes.index(0)])
        p_benign = float(proba[classes.index(1)])
        label = "Malignant" if p_malignant > p_benign else "Benign"

        return {
            "prediction": label,
            "probabilities": {"benign": round(p_benign, 4), "malignant": round(p_malignant, 4)},
            "probability_note": PROBABILITY_NOTE,
            "model_name": self.metadata["model_name"],
            "model_version": self.metadata["model_version"],
            "disclaimer": DISCLAIMER,
        }