"""
Development database initializer and seeder.
Run this script once to create tables and seed an admin user.

Usage:
    python seed_db.py
"""
import asyncio
import sys
import os

# Ensure .env is loaded from the correct directory
os.chdir(os.path.dirname(os.path.abspath(__file__)))

import app.models.audit_log  # noqa: F401
import app.models.environment  # noqa: F401
import app.models.project  # noqa: F401
import app.models.user  # noqa: F401
from app.core.database import engine, async_session_factory
from app.core.security import get_password_hash
from app.domain.roles import Role
from app.models.base import Base
from app.models.user import User


async def seed_db() -> None:
    print("Creating all database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[OK] Database tables created successfully!")

    async with async_session_factory() as session:
        # Check if admin already exists
        from sqlalchemy import select
        result = await session.execute(select(User).where(User.email == "admin@example.com"))
        existing = result.scalar_one_or_none()

        if existing:
            print("[OK] Admin user already exists — skipping seed.")
        else:
            admin = User(
                email="admin@example.com",
                hashed_password=get_password_hash("admin123"),
                full_name="Platform Admin",
                role=Role.ADMIN,
                is_active=True,
                is_superuser=True,
            )
            session.add(admin)
            await session.commit()
            print("[OK] Admin user created:")
            print("  Email:    admin@example.com")
            print("  Password: admin123")
            print("  Role:     admin")

        # Also create a viewer user for testing
        result2 = await session.execute(select(User).where(User.email == "viewer@example.com"))
        existing2 = result2.scalar_one_or_none()

        if not existing2:
            viewer = User(
                email="viewer@example.com",
                hashed_password=get_password_hash("viewer123"),
                full_name="Test Viewer",
                role=Role.VIEWER,
                is_active=True,
                is_superuser=False,
            )
            session.add(viewer)
            await session.commit()
            print("[OK] Viewer user created:")
            print("  Email:    viewer@example.com")
            print("  Password: viewer123")
            print("  Role:     viewer")

    await engine.dispose()
    print("\n[OK] Database initialization complete.")


if __name__ == "__main__":
    asyncio.run(seed_db())
