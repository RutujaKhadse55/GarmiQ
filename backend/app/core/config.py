import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "GarmiQ Extreme Heat Risk Platform"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    BACKEND_PORT: int = int(os.getenv("BACKEND_PORT", 8000))
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://garmiq_user:garmiq_password@localhost:5432/garmiq_db"
    )
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:5173",
        "http://localhost:5174",
    ]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
