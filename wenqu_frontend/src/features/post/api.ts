import { apiFetch } from '@/shared/api/client'
import type { PostDetail } from '@/shared/types/api'

export function getPostDetail(id: string): Promise<PostDetail> {
  return apiFetch(`/api/v1/knowposts/detail/${id}`)
}

/** 正文不在 API 响应里，需要从 OSS 地址二次拉取 markdown 纯文本 */
export async function fetchPostContent(contentUrl: string): Promise<string> {
  const res = await fetch(contentUrl, { credentials: 'omit' })
  if (!res.ok) throw new Error(`正文加载失败（${res.status}）`)
  return res.text()
}
