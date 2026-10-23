import { apiFetch } from '@/shared/api/client'
import type { ActionRequest, ActionResult, CountsResponse } from '@/shared/types/api'

const action = (path: string, entityId: string) =>
  apiFetch<ActionResult>(`/api/v1/action/${path}`, {
    method: 'POST',
    body: { entityType: 'knowpost', entityId } satisfies ActionRequest,
  })

export const like = (entityId: string) => action('like', entityId)
export const unlike = (entityId: string) => action('unlike', entityId)
export const fav = (entityId: string) => action('fav', entityId)
export const unfav = (entityId: string) => action('unfav', entityId)

export function getCounts(entityId: string): Promise<CountsResponse> {
  return apiFetch(`/api/v1/counter/knowpost/${entityId}`, { query: { metrics: 'like,fav' } })
}
