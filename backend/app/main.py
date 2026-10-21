import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routes import health, prediction
from app.services.predictor import Predictor

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("breastcare")


@asynccontextmanager
async def lifespan(app: FastAPI):
    predictor = Predictor(settings)
    predictor.load()
    app.state.predictor = predictor
    yield


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Educational breast mass classification API. Not a medical diagnosis tool.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    # Return only the field location, message and error type.
    # Never echo the submitted values back (they may be NaN, and they are health data).
    errors = [
        {"loc": [str(part) for part in err.get("loc", [])], "msg": err.get("msg", ""), "type": err.get("type", "")}
        for err in exc.errors()
    ]
    return JSONResponse(status_code=422, content={"detail": errors})


app.include_router(health.router)
app.include_router(prediction.router)


@app.get("/")
def root():
    return {"name": settings.app_name, "docs": "/docs", "health": "/health"}