import { computeSha256 } from '@/shared/utils/time'
import type { Visibility } from '@/shared/types/api'

import { confirmContent, createDraft, patchPost, presign, publishPost } from './api'

export interface PublishInput {
  title: string
  description?: string
  content: string
  tags: string[]
  images: File[]
  visible: Visibility
}

export interface PublishProgress {
  step: 'draft' | 'images' | 'content' | 'meta' | 'publish'
  /** 图片上传进度：第几张 / 共几张 */
  imageIndex?: number
  imageTotal?: number
}

export const STEP_LABEL: Record<PublishProgress['step'], string> = {
  draft: '创建草稿…',
  images: '上传图片…',
  content: '上传正文…',
  meta: '保存元数据…',
  publish: '发布中…',
}

/** PUT 直传预签名 URL，返回 ETag（去引号） */
async function uploadToPresigned(putUrl: string, headers: Record<string, string>, body: Blob): Promise<string> {
  const res = await fetch(putUrl, { method: 'PUT', headers, body, credentials: 'omit' })
  if (!res.ok) throw new Error(`上传失败（${res.status}）`)
  return (res.headers.get('ETag') ?? '').replaceAll('"', '')
}

/** 发布五步流水线：草稿 → 图片直传 → 正文直传并回执 → 元数据 → 发布 */
export async function runPublishPipeline(
  input: PublishInput,
  onProgress: (p: PublishProgress) => void,
): Promise<string> {
  onProgress({ step: 'draft' })
  const { id } = await createDraft()

  const imgUrls: string[] = []
  for (let i = 0; i < input.images.length; i++) {
    onProgress({ step: 'images', imageIndex: i + 1, imageTotal: input.images.length })
    const file = input.images[i]
    const ext = `.${file.name.split('.').pop()?.toLowerCase() ?? 'jpg'}`
    const pre = await presign({ scene: 'knowpost_image', postId: id, contentType: file.type, ext })
    await uploadToPresigned(pre.putUrl, pre.headers, file)
    imgUrls.push(pre.putUrl.split('?')[0])
  }

  onProgress({ step: 'content' })
  const contentFile = new File([input.content], 'content.md', { type: 'text/markdown' })
  const sha256 = await computeSha256(contentFile)
  const pre = await presign({ scene: 'knowpost_content', postId: id, contentType: 'text/markdown', ext: '.md' })
  const etag = await uploadToPresigned(pre.putUrl, pre.headers, contentFile)
  await confirmContent(id, { objectKey: pre.objectKey, etag, size: contentFile.size, sha256 })

  onProgress({ step: 'meta' })
  await patchPost(id, {
    title: input.title,
    tags: input.tags,
    imgUrls,
    visible: input.visible,
    description: input.description || undefined,
  })

  onProgress({ step: 'publish' })
  await publishPost(id)
  return id
}
