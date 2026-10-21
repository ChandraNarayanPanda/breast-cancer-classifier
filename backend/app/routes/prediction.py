import logging

from fastapi import APIRouter, HTTPException, Request

from app.schemas.prediction import PredictionRequest, PredictionResponse

logger = logging.getLogger("breastcare")
router = APIRouter(tags=["prediction"])


@router.post("/predict", response_model=PredictionResponse)
def predict(payload: PredictionRequest, request: Request):
    predictor = request.app.state.predictor
    if not predictor.is_loaded:
        raise HTTPException(status_code=503, detail="Model is not available")
    try:
        return predictor.predict(payload.model_dump())
    except Exception:
        # Log the error type only. Never log the input values (health data).
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail="Prediction failed")