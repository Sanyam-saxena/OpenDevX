import { apiClient } from '@/api/client'

export interface StorageFile {
  filename: string
  size: number
  uploaded_at: number
  storage_provider: string
  content_type: string
}

export async function listStorageFilesApi(projectId: string): Promise<StorageFile[]> {
  const response = await apiClient.get<StorageFile[]>(
    `/api/v1/projects/${projectId}/storage/files`,
  )
  return response.data
}

export async function uploadStorageFileApi(
  projectId: string,
  file: File,
): Promise<StorageFile> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await apiClient.post<StorageFile>(
    `/api/v1/projects/${projectId}/storage/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return response.data
}

export async function deleteStorageFileApi(
  projectId: string,
  filename: string,
): Promise<void> {
  await apiClient.delete(`/api/v1/projects/${projectId}/storage/files/${filename}`)
}
