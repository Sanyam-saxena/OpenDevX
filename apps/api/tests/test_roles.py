"""Tests for RBAC roles and hierarchy helper."""

from app.domain.roles import Role, has_role_permission


def test_admin_has_all_permissions() -> None:
    """Admin role should satisfy admin, operator, and viewer requirements."""
    assert has_role_permission(Role.ADMIN, Role.ADMIN) is True
    assert has_role_permission(Role.ADMIN, Role.OPERATOR) is True
    assert has_role_permission(Role.ADMIN, Role.VIEWER) is True


def test_operator_permissions() -> None:
    """Operator satisfies operator and viewer, but not admin."""
    assert has_role_permission(Role.OPERATOR, Role.ADMIN) is False
    assert has_role_permission(Role.OPERATOR, Role.OPERATOR) is True
    assert has_role_permission(Role.OPERATOR, Role.VIEWER) is True


def test_viewer_permissions() -> None:
    """Viewer satisfies viewer, but not operator or admin."""
    assert has_role_permission(Role.VIEWER, Role.ADMIN) is False
    assert has_role_permission(Role.VIEWER, Role.OPERATOR) is False
    assert has_role_permission(Role.VIEWER, Role.VIEWER) is True
