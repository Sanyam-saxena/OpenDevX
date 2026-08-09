import os
from functools import lru_cache

from pydantic import computed_field, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from the environment and .env file."""

    # Application
    environment: str = "development"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"
    project_name: str = "OpenDevX API"
    version: str = "0.1.0"
    cors_origins: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]

    # Security & JWT
    secret_key: str = "dev_secret_key_change_in_production_opendevx_2026_secure"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # Database Override
    database_url_override: str | None = None
    use_sqlite: bool = False

    # PostgreSQL
    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "opendevx"
    postgres_user: str = "opendevx"
    postgres_password: str = "opendevx_dev_password"

    # Redis
    redis_host: str = "localhost"
    redis_port: int = 6379

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="OPENDEVX_",
        extra="ignore",
    )

    @model_validator(mode="after")
    def validate_production_settings(self) -> "Settings":
        """Enforce strict security validation for production environment."""
        if self.environment.lower() == "production":
            if "dev_secret_key" in self.secret_key or len(self.secret_key) < 32:
                raise ValueError(
                    "Production deployment requires a secure OPENDEVX_SECRET_KEY at least 32 characters long."
                )
            if self.debug:
                raise ValueError("OPENDEVX_DEBUG must be set to False in production.")
        return self

    @computed_field  # type: ignore[prop-decorator]
    @property
    def database_url(self) -> str:
        """Build the async database DSN from environment or components."""
        if self.database_url_override:
            return self.database_url_override
        env_db_url = os.getenv("OPENDEVX_DATABASE_URL") or os.getenv("DATABASE_URL")
        if env_db_url:
            return env_db_url

        # For custom non-default postgres host (e.g. in tests), build postgres DSN directly
        if self.postgres_host != "localhost":
            return (
                f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
                f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
            )

        use_sqlite_env = os.getenv("OPENDEVX_USE_SQLITE")
        if use_sqlite_env is not None:
            if use_sqlite_env.lower() == "true":
                return "sqlite+aiosqlite:///./opendevx.db"
            if use_sqlite_env.lower() == "false":
                return (
                    f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
                    f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
                )

        if self.use_sqlite:
            return "sqlite+aiosqlite:///./opendevx.db"

        if not self._is_postgres_available():
            return "sqlite+aiosqlite:///./opendevx.db"

        return (
            f"postgresql+asyncpg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    def _is_postgres_available(self) -> bool:
        """Quick socket check to verify if PostgreSQL port is listening."""
        import socket

        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
                sock.settimeout(0.5)
                return sock.connect_ex((self.postgres_host, self.postgres_port)) == 0
        except Exception:
            return False

    @computed_field  # type: ignore[prop-decorator]
    @property
    def database_url_sync(self) -> str:
        """Build the synchronous database DSN for Alembic migrations."""
        async_url = self.database_url
        if async_url.startswith("sqlite+aiosqlite://"):
            return async_url.replace("sqlite+aiosqlite://", "sqlite://")
        if async_url.startswith("postgresql+asyncpg://"):
            return async_url.replace("postgresql+asyncpg://", "postgresql://")
        return (
            f"postgresql://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @computed_field  # type: ignore[prop-decorator]
    @property
    def redis_url(self) -> str:
        """Build the Redis connection URL."""
        return f"redis://{self.redis_host}:{self.redis_port}/0"


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings."""
    return Settings()
