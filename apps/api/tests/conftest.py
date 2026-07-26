"""Pytest configuration and global fixtures."""

import pytest


@pytest.fixture()
def anyio_backend() -> str:
    """Restructure AnyIO test runner to use asyncio only."""
    return "asyncio"
