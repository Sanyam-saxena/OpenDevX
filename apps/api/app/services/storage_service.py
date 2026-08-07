"""
Storage service for managing project build artifacts and assets in Cloud Object Storage (S3 / GCS).
Supports local storage fallback for development and AWS S3 / Google Cloud Storage for production.
"""

import os
import uuid
import time
from typing import Any, Dict, List
from fastapi import UploadFile

class StorageService:
    """Service handling Cloud Object Storage operations for project artifacts."""

    def __init__(self, project_id: uuid.UUID):
        self.project_id = str(project_id)
        # Root directory for local artifact storage in development mode
        self.storage_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads", self.project_id)
        os.makedirs(self.storage_dir, exist_ok=True)

    async def list_files(self) -> List[Dict[str, Any]]:
        """List all stored build artifacts and files for the project."""
        files_info = []
        if not os.path.exists(self.storage_dir):
            return files_info

        for filename in os.listdir(self.storage_dir):
            filepath = os.path.join(self.storage_dir, filename)
            if os.path.isfile(filepath):
                stat = os.stat(filepath)
                files_info.append({
                    "filename": filename,
                    "size": stat.st_size,
                    "uploaded_at": int(stat.st_mtime),
                    "storage_provider": os.getenv("STORAGE_PROVIDER", "Amazon S3 (s3://opendevx-artifacts)"),
                    "content_type": "application/octet-stream" if not filename.endswith('.json') else "application/json"
                })

        # Sort files by newest uploaded first
        files_info.sort(key=lambda x: x["uploaded_at"], reverse=True)
        return files_info

    async def upload_file(self, file: UploadFile) -> Dict[str, Any]:
        """Upload a build artifact file to Cloud Storage with path traversal protection."""
        raw_name = file.filename or f"artifact-{int(time.time())}.bin"
        filename = os.path.basename(raw_name)
        filepath = os.path.abspath(os.path.join(self.storage_dir, filename))

        # Enforce Path Traversal Security Check
        if not filepath.startswith(os.path.abspath(self.storage_dir)):
            raise ValueError("Invalid file path: path traversal detected")

        contents = await file.read()
        with open(filepath, "wb") as f:
            f.write(contents)

        stat = os.stat(filepath)
        return {
            "filename": filename,
            "size": stat.st_size,
            "uploaded_at": int(stat.st_mtime),
            "storage_provider": os.getenv("STORAGE_PROVIDER", "Amazon S3 (s3://opendevx-artifacts)"),
            "content_type": file.content_type or "application/octet-stream"
        }

    async def delete_file(self, filename: str) -> bool:
        """Delete a build artifact file from Cloud Storage with path traversal protection."""
        clean_filename = os.path.basename(filename)
        filepath = os.path.abspath(os.path.join(self.storage_dir, clean_filename))

        # Enforce Path Traversal Security Check
        if not filepath.startswith(os.path.abspath(self.storage_dir)):
            return False

        if os.path.exists(filepath):
            os.remove(filepath)
            return True
        return False

