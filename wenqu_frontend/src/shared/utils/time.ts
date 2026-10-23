/** 兼容 ISO 字符串 / 秒级 / 毫秒级时间戳，统一解析为毫秒数 */
export function parseInstantToMillis(value: string | number): number {
  if (typeof value === 'number') {
    return value < 1e12 ? value * 1000 : value
  }
  const asNumber = Number(value)
  if (!Number.isNaN(asNumber) && value.trim() !== '') {
    return asNumber < 1e12 ? asNumber * 1000 : asNumber
  }
  return new Date(value).getTime()
}

/** 相对时间：刚刚 / n 分钟前 / n 小时前 / n 天前 / 具体日期 */
export function formatRelativeTime(value: string | number | null | undefined): string {
  if (value == null || value === '') return ''
  const time = parseInstantToMillis(value)
  if (Number.isNaN(time)) return ''
  const diff = Date.now() - time
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)} 天前`
  const d = new Date(time)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** 计算 SHA-256 并返回 hex 字符串（用于 OSS 上传校验） */
export async function computeSha256(file: Blob): Promise<string> {
  const buffer = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
