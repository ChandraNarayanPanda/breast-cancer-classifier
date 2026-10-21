from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent  # .../backend


class Settings(BaseSettings):
    app_name: str = "BreastCare AI API"
    app_version: str = "1.0.0"
    model_path: Path = BASE_DIR / "app" / "model" / "breast_cancer_pipeline.joblib"
    metadata_path: Path = BASE_DIR / "app" / "model" / "model_metadata.json"
    # Comma-separated list of allowed frontend origins
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


settings = Settings()