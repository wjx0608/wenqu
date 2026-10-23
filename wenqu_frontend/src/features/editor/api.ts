import { apiFetch } from '@/shared/api/client'
import type {
  ContentConfirmRequest,
  DescriptionSuggestResponse,
  KnowPostPatchRequest,
  StoragePresignRequest,
  StoragePresignResponse,
} from '@/shared/types/api'

export function createDraft(): Promise<{ id: string }> {
  return apiFetch('/api/v1/knowposts/drafts', { method: 'POST' })
}

export function presign(body: StoragePresignRequest): Promise<StoragePresignResponse> {
  return apiFetch('/api/v1/storage/presign', { method: 'POST', body })
}

export function confirmContent(id: string, body: ContentConfirmRequest): Promise<void> {
  return apiFetch(`/api/v1/knowposts/${id}/content/confirm`, { method: 'POST', body })
}

export function patchPost(id: string, body: KnowPostPatchRequest): Promise<void> {
  return apiFetch(`/api/v1/knowposts/${id}`, { method: 'PATCH', body })
}

export function publishPost(id: string): Promise<void> {
  return apiFetch(`/api/v1/knowposts/${id}/publish`, { method: 'POST' })
}

export function setTop(id: string, isTop: boolean): Promise<void> {
  return apiFetch(`/api/v1/knowposts/${id}/top`, { method: 'PATCH', body: { isTop } })
}

export function setVisibility(id: string, visible: string): Promise<void> {
  return apiFetch(`/api/v1/knowposts/${id}/visibility`, { method: 'PATCH', body: { visible } })
}

export function deletePost(id: string): Promise<void> {
  return apiFetch(`/api/v1/knowposts/${id}`, { method: 'DELETE' })
}

export function suggestDescription(content: string): Promise<DescriptionSuggestResponse> {
  return apiFetch('/api/v1/knowposts/description/suggest', { method: 'POST', body: { content } })
}
