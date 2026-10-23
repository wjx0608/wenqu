import { apiFetch } from '@/shared/api/client'
import type { Profile, RelationCounter, RelationStatus } from '@/shared/types/api'

export function follow(toUserId: number): Promise<boolean> {
  return apiFetch('/api/v1/relation/follow', { method: 'POST', query: { toUserId } })
}

export function unfollow(toUserId: number): Promise<boolean> {
  return apiFetch('/api/v1/relation/unfollow', { method: 'POST', query: { toUserId } })
}

export function getRelationStatus(toUserId: number): Promise<RelationStatus> {
  return apiFetch('/api/v1/relation/status', { query: { toUserId } })
}

export function getFollowing(userId: number, limit = 20, offset = 0): Promise<Profile[]> {
  return apiFetch('/api/v1/relation/following', { query: { userId, limit, offset } })
}

export function getFollowers(userId: number, limit = 20, offset = 0): Promise<Profile[]> {
  return apiFetch('/api/v1/relation/followers', { query: { userId, limit, offset } })
}

export function getRelationCounter(userId: number): Promise<RelationCounter> {
  return apiFetch('/api/v1/relation/counter', { query: { userId } })
}
