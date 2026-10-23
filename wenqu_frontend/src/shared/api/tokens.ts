import type { TokenResponse } from '@/shared/types/api'
import { parseInstantToMillis } from '@/shared/utils/time'

const TOKEN_KEY = 'wenqu_auth_tokens'

export interface StoredTokens {
  accessToken: string
  refreshToken: string
  /** 毫秒时间戳 */
  accessTokenExpiresAt: number
}

export function loadTokens(): StoredTokens | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredTokens
    if (!parsed.accessToken || !parsed.refreshToken) return null
    return parsed
  } catch {
    return null
  }
}

export function saveTokens(token: TokenResponse): StoredTokens {
  const stored: StoredTokens = {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken,
    accessTokenExpiresAt: parseInstantToMillis(token.accessTokenExpiresAt),
  }
  localStorage.setItem(TOKEN_KEY, JSON.stringify(stored))
  return stored
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY)
}
