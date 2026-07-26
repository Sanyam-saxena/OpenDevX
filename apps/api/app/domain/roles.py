"""Role-based Access Control (RBAC) definitions."""

from enum import StrEnum


class Role(StrEnum):
    """Platform RBAC roles."""

    ADMIN = "admin"
    OPERATOR = "operator"
    VIEWER = "viewer"


ROLE_HIERARCHY: dict[Role, set[Role]] = {
    Role.ADMIN: {Role.ADMIN, Role.OPERATOR, Role.VIEWER},
    Role.OPERATOR: {Role.OPERATOR, Role.VIEWER},
    Role.VIEWER: {Role.VIEWER},
}


def has_role_permission(user_role: Role, required_role: Role) -> bool:
    """Return True if user_role satisfies required_role in hierarchy."""
    allowed_roles = ROLE_HIERARCHY.get(user_role, set())
    return required_role in allowed_roles
