import { apiFetch } from '@/shared/api/client'
import type { SearchResponse, SuggestResponse } from '@/shared/types/api'

export function searchPosts(q: string, after?: string | null, size = 20): Promise<SearchResponse> {
  return apiFetch('/api/v1/search', { query: { q, size, after: after ?? undefined } })
}

export function suggest(prefix: string, size = 10): Promise<SuggestResponse> {
  return apiFetch('/api/v1/search/suggest', { query: { prefix, size } })
}
