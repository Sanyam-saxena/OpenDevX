"""Generic base repository for async SQLAlchemy database operations."""

from collections.abc import Sequence
from typing import Any

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import Base
from app.utils.uuid_helpers import parse_uuid


class BaseRepository[ModelT: Base]:
    """Generic repository encapsulating common CRUD database operations."""

    def __init__(self, model_cls: type[ModelT], db: AsyncSession) -> None:
        self.model_cls = model_cls
        self.db = db

    async def get_by_id(self, entity_id: Any) -> ModelT | None:
        """Fetch entity by primary key, handling string-to-UUID conversion if needed."""
        target_id = entity_id
        if isinstance(entity_id, str):
            parsed_uuid = parse_uuid(entity_id)
            if parsed_uuid is not None:
                target_id = parsed_uuid
        result = await self.db.execute(
            select(self.model_cls).where(self.model_cls.id == target_id)  # type: ignore[attr-defined]
        )
        return result.scalar_one_or_none()

    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
    ) -> Sequence[ModelT]:
        """Fetch all entities with deterministic pagination offset and limit."""
        stmt = select(self.model_cls)
        if hasattr(self.model_cls, "created_at"):
            stmt = stmt.order_by(self.model_cls.created_at.desc())  # type: ignore[attr-defined]
        elif hasattr(self.model_cls, "id"):
            stmt = stmt.order_by(self.model_cls.id.asc())  # type: ignore[attr-defined]
        stmt = stmt.offset(skip).limit(limit)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def count(self) -> int:
        """Count total entities in table."""
        result = await self.db.execute(select(func.count()).select_from(self.model_cls))
        return result.scalar_one() or 0

    async def create(self, instance: ModelT) -> ModelT:
        """Add and flush a new entity."""
        self.db.add(instance)
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def update(self, instance: ModelT) -> ModelT:
        """Flush and refresh an updated entity."""
        await self.db.flush()
        await self.db.refresh(instance)
        return instance

    async def delete(self, instance: ModelT) -> None:
        """Delete an entity from the database."""
        await self.db.delete(instance)
        await self.db.flush()
