import math
from typing import Dict

from pydantic import BaseModel, ConfigDict, model_validator

BASE_MEASUREMENTS = [
    "radius", "texture", "perimeter", "area", "smoothness",
    "compactness", "concavity", "concave_points", "symmetry", "fractal_dimension",
]
# Same order scikit-learn used: all 'mean', then all 'error', then all 'worst'
FEATURE_FIELDS = (
    [f"mean_{m}" for m in BASE_MEASUREMENTS]
    + [f"{m}_error" for m in BASE_MEASUREMENTS]
    + [f"worst_{m}" for m in BASE_MEASUREMENTS]
)

# Features that are legitimately 0 in the dataset (13 rows). All others must be > 0.
ZERO_ALLOWED = {
    "mean_concavity", "mean_concave_points",
    "concavity_error", "concave_points_error",
    "worst_concavity", "worst_concave_points",
}


class PredictionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)

    mean_radius: float
    mean_texture: float
    mean_perimeter: float
    mean_area: float
    mean_smoothness: float
    mean_compactness: float
    mean_concavity: float
    mean_concave_points: float
    mean_symmetry: float
    mean_fractal_dimension: float

    radius_error: float
    texture_error: float
    perimeter_error: float
    area_error: float
    smoothness_error: float
    compactness_error: float
    concavity_error: float
    concave_points_error: float
    symmetry_error: float
    fractal_dimension_error: float

    worst_radius: float
    worst_texture: float
    worst_perimeter: float
    worst_area: float
    worst_smoothness: float
    worst_compactness: float
    worst_concavity: float
    worst_concave_points: float
    worst_symmetry: float
    worst_fractal_dimension: float

    @model_validator(mode="after")
    def check_ranges(self):
        for name in FEATURE_FIELDS:
            value = getattr(self, name)
            if not math.isfinite(value):
                raise ValueError(f"{name} must be a finite number")
            if name in ZERO_ALLOWED:
                if value < 0:
                    raise ValueError(f"{name} must be >= 0")
            elif value <= 0:
                raise ValueError(f"{name} must be > 0")
        return self


class Probabilities(BaseModel):
    benign: float
    malignant: float


class PredictionResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    prediction: str
    probabilities: Probabilities
    probability_note: str
    model_name: str
    model_version: str
    disclaimer: str


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str


class ModelInfoResponse(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    model_name: str
    model_version: str
    n_features: int
    feature_names: list[str]
    classes: Dict[str, str]