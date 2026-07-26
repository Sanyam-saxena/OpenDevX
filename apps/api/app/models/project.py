"""Project ORM model."""

import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.environment import Environment
    from app.models.user import User


class Project(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """Platform project representing a service or application domain."""

    __tablename__ = "projects"

    name: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )
    slug: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )
    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )
    owner_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    owner: Mapped["User | None"] = relationship("User", lazy="joined")
    environments: Mapped[list["Environment"]] = relationship(
        "Environment",
        back_populates="project",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
