import io
import uuid
from datetime import UTC, datetime
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import create_app
from app.domain.roles import Role
from app.models.user import User
from app.api.dependencies import get_current_active_user

def get_test_admin_user() -> User:
    return User(
        id=uuid.uuid4(),
        email="admin@example.com",
        hashed_password="hashed_pwd",
        full_name="Admin User",
        role=Role.ADMIN,
        is_active=True,
        is_superuser=True,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
    )

@pytest.mark.anyio
async def test_storage_list_files_empty():
    app = create_app()
    app.dependency_overrides[get_current_active_user] = get_test_admin_user
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        project_id = uuid.uuid4()
        res = await ac.get(f"/api/v1/projects/{project_id}/storage/files")
        assert res.status_code == 200
        assert isinstance(res.json(), list)

@pytest.mark.anyio
async def test_storage_upload_and_delete_file():
    app = create_app()
    app.dependency_overrides[get_current_active_user] = get_test_admin_user
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        project_id = uuid.uuid4()
        file_data = io.BytesIO(b"sample build artifact data")

        # Upload
        res = await ac.post(
            f"/api/v1/projects/{project_id}/storage/upload",
            files={"file": ("build-v1.0.0.tar.gz", file_data, "application/gzip")},
        )
        assert res.status_code == 201
        body = res.json()
        assert body["filename"] == "build-v1.0.0.tar.gz"
        assert body["size"] == 26

        # List
        list_res = await ac.get(f"/api/v1/projects/{project_id}/storage/files")
        assert list_res.status_code == 200
        filenames = [f["filename"] for f in list_res.json()]
        assert "build-v1.0.0.tar.gz" in filenames

        # Delete
        del_res = await ac.delete(f"/api/v1/projects/{project_id}/storage/files/build-v1.0.0.tar.gz")
        assert del_res.status_code == 204

@pytest.mark.anyio
async def test_storage_path_traversal_sanitizes_filename():
    app = create_app()
    app.dependency_overrides[get_current_active_user] = get_test_admin_user
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        project_id = uuid.uuid4()
        file_data = io.BytesIO(b"malicious path payload")

        # Attempt upload with path traversal filename
        res = await ac.post(
            f"/api/v1/projects/{project_id}/storage/upload",
            files={"file": ("../../etc/passwd", file_data, "text/plain")},
        )
        assert res.status_code == 201
        body = res.json()
        # Verify filename was sanitized to base name only
        assert body["filename"] == "passwd"

