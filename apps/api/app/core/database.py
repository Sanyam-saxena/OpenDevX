"""Async SQLAlchemy 2.x engine, session factory, and FastAPI dependency."""

from collections.abc import AsyncIterator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.settings import get_settings


def create_db_engine():  # type: ignore[no-untyped-def]
    settings = get_settings()
    kwargs = {
        "echo": settings.debug,
    }
    if not settings.database_url.startswith("sqlite"):
        kwargs.update({
            "pool_pre_ping": True,
            "pool_size": 5,
            "max_overflow": 10,
        })
    return create_async_engine(settings.database_url, **kwargs)


engine = create_db_engine()

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db_session() -> AsyncIterator[AsyncSession]:
    """FastAPI dependency that yields an async database session.

    The session is committed on success and rolled back on exception.
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
