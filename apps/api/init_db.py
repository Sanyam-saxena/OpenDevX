import asyncio
from app.core.database import engine
from app.models.base import Base
import app.models.user  # noqa: F401
import app.models.project  # noqa: F401
import app.models.environment  # noqa: F401
import app.models.audit_log  # noqa: F401


async def init_db() -> None:
    print("Creating all database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created successfully!")


if __name__ == "__main__":
    asyncio.run(init_db())
