from fastapi import APIRouter, Request

from app.config import settings
from app.schemas.prediction import HealthResponse, ModelInfoResponse

router = APIRouter(tags=["system"])


@router.get("/health", response_model=HealthResponse)
def health(request: Request):
    predictor = request.app.state.predictor
    return HealthResponse(
        status="ok" if predictor.is_loaded else "degraded",
        model_loaded=predictor.is_loaded,
        version=settings.app_version,
    )


@router.get("/model-info", response_model=ModelInfoResponse)
def model_info(request: Request):
    predictor = request.app.state.predictor
    meta = predictor.metadata
    return ModelInfoResponse(
        model_name=meta["model_name"],
        model_version=meta["model_version"],
        n_features=len(meta["feature_names"]),
        feature_names=meta["feature_names"],
        classes=meta["classes"],
    )