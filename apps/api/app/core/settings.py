from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from the environment and .env file."""

    environment: str = "development"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"
    project_name: str = "OpenDevX API"
    version: str = "0.1.0"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="OPENDEVX_",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings."""
    return Settings()
