"""Async Redis connection pool and FastAPI dependency."""

from collections.abc import AsyncIterator

import redis.asyncio as aioredis

from app.core.settings import get_settings

_settings = get_settings()

redis_pool: aioredis.Redis | None = None


async def init_redis() -> aioredis.Redis:
    """Create and return the global async Redis connection pool."""
    global redis_pool  # noqa: PLW0603
    redis_pool = aioredis.from_url(
        _settings.redis_url,
        decode_responses=True,
        max_connections=10,
    )
    return redis_pool


async def close_redis() -> None:
    """Close the global Redis connection pool."""
    global redis_pool  # noqa: PLW0603
    if redis_pool is not None:
        await redis_pool.aclose()
        redis_pool = None


async def get_redis() -> AsyncIterator[aioredis.Redis]:
    """FastAPI dependency that yields the async Redis client."""
    if redis_pool is None:
        raise RuntimeError("Redis pool is not initialised. Call init_redis() first.")
    yield redis_pool
