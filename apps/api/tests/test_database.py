"""Tests for the database and Redis modules (unit level, no live infrastructure)."""

from app.core.settings import Settings
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


def test_settings_database_url_constructed_correctly() -> None:
    """Verify the database_url computed field builds the expected DSN."""
    settings = Settings(
        postgres_host="myhost",
        postgres_port=5433,
        postgres_db="testdb",
        postgres_user="testuser",
        postgres_password="testpass",
    )
    assert settings.database_url == (
        "postgresql+asyncpg://testuser:testpass@myhost:5433/testdb"
    )


def test_settings_database_url_sync_constructed_correctly() -> None:
    """Verify the sync database_url computed field for Alembic."""
    settings = Settings(
        postgres_host="myhost",
        postgres_port=5433,
        postgres_db="testdb",
        postgres_user="testuser",
        postgres_password="testpass",
    )
    assert settings.database_url_sync == (
        "postgresql://testuser:testpass@myhost:5433/testdb"
    )


def test_settings_redis_url_constructed_correctly() -> None:
    """Verify the redis_url computed field builds the expected URL."""
    settings = Settings(
        redis_host="myredis",
        redis_port=6380,
    )
    assert settings.redis_url == "redis://myredis:6380/0"


def test_base_metadata_is_sqlalchemy_metadata() -> None:
    """Base.metadata should be a valid SQLAlchemy MetaData instance."""
    assert Base.metadata is not None


def test_uuid_primary_key_mixin_has_id_column() -> None:
    """UUIDPrimaryKeyMixin should define an 'id' mapped attribute."""
    assert hasattr(UUIDPrimaryKeyMixin, "id")


def test_timestamp_mixin_has_created_and_updated_columns() -> None:
    """TimestampMixin should define 'created_at' and 'updated_at'."""
    assert hasattr(TimestampMixin, "created_at")
    assert hasattr(TimestampMixin, "updated_at")
