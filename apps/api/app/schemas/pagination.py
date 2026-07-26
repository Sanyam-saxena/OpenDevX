"""Paginated response schema."""

import math

from pydantic import BaseModel, Field


class PaginatedResponse[T](BaseModel):
    """Generic paginated response structure."""

    items: list[T]
    total: int = Field(..., description="Total count of items across all pages")
    page: int = Field(..., ge=1, description="Current page number (1-indexed)")
    size: int = Field(..., ge=1, description="Number of items per page")
    pages: int = Field(..., description="Total number of pages")

    @classmethod
    def create(
        cls, items: list[T], total: int, page: int, size: int
    ) -> "PaginatedResponse[T]":
        """Factory method computing total pages."""
        pages = math.ceil(total / size) if size > 0 else 0
        return cls(
            items=items,
            total=total,
            page=page,
            size=size,
            pages=pages,
        )
