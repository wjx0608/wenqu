import { apiFetch } from '@/shared/api/client'
import type { Profile, ProfilePatchRequest } from '@/shared/types/api'

export function updateProfile(body: ProfilePatchRequest): Promise<Profile> {
  return apiFetch('/api/v1/profile', { method: 'PATCH', body })
}

export function uploadAvatar(file: File): Promise<Profile> {
  const form = new FormData()
  form.append('file', file)
  return apiFetch('/api/v1/profile/avatar', { method: 'POST', body: form })
}
