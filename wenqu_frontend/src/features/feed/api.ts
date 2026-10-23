import { apiFetch } from '@/shared/api/client'
import type { FeedPage } from '@/shared/types/api'

export function getFeed(page: number, size = 20): Promise<FeedPage> {
  return apiFetch('/api/v1/knowposts/feed', { query: { page, size } })
}

export function getMine(page: number, size = 20): Promise<FeedPage> {
  return apiFetch('/api/v1/knowposts/mine', { query: { page, size } })
}
