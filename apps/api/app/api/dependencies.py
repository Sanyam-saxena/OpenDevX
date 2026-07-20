from app.core.settings import Settings, get_settings


def get_app_settings() -> Settings:
    """Provide application settings to API handlers."""
    return get_settings()
