import { ApiError } from './error'
import { clearTokens, loadTokens, saveTokens } from './tokens'
import type { TokenResponse } from '@/shared/types/api'

const BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? ''

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  /** 对象会序列化为 JSON；FormData 原样发送 */
  body?: unknown
  query?: Record<string, string | number | boolean | undefined | null>
  /** false = 显式不带 access token（如刷新接口）；默认自动携带 */
  auth?: boolean
  signal?: AbortSignal
}

/** 认证失效时由 auth store 注册的回调（清空登录态、跳转登录页由调用方决定） */
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void): void {
  onUnauthorized = handler
}

/** 401 单例刷新：并发请求共享同一个刷新 Promise */
let refreshing: Promise<boolean> | null = null

async function refreshTokens(): Promise<boolean> {
  refreshing ??= (async () => {
    const tokens = loadTokens()
    if (!tokens) return false
    try {
      const res = await fetch(`${BASE_URL}/api/v1/auth/token/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      })
      if (!res.ok) return false
      const data = (await res.json()) as TokenResponse
      saveTokens(data)
      return true
    } catch {
      return false
    }
  })().finally(() => {
    refreshing = null
  })
  return refreshing
}

function readXsrfToken(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
  const url = `${BASE_URL}${path}`
  if (!query) return url
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `${url}?${qs}` : url
}

async function request<T>(path: string, options: RequestOptions, allowRetry: boolean): Promise<T> {
  const { method = 'GET', body, query, auth = true, signal } = options

  const headers = new Headers()
  if (auth) {
    const tokens = loadTokens()
    if (tokens) headers.set('Authorization', `Bearer ${tokens.accessToken}`)
  }
  const isFormData = body instanceof FormData
  if (body !== undefined && !isFormData) headers.set('Content-Type', 'application/json')
  if (method !== 'GET') {
    const xsrf = readXsrfToken()
    if (xsrf) headers.set('X-XSRF-TOKEN', xsrf)
  }

  const res = await fetch(buildUrl(path, query), {
    method,
    headers,
    credentials: 'include',
    signal,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  })

  if (res.status === 401 && auth && allowRetry) {
    const ok = await refreshTokens()
    if (ok) return request<T>(path, options, false)
    clearTokens()
    onUnauthorized?.()
    throw new ApiError(401, 'UNAUTHORIZED', '登录已失效，请重新登录')
  }

  if (res.status === 204) return undefined as T

  if (!res.ok) {
    let code = 'UNKNOWN'
    let message = `请求失败（${res.status}）`
    try {
      const data = (await res.json()) as { code?: string; message?: string }
      if (data.code) code = data.code
      if (data.message) message = data.message
    } catch {
      /* 非 JSON 错误体，使用默认信息 */
    }
    throw new ApiError(res.status, code, message)
  }

  return (await res.json()) as T
}

export function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return request<T>(path, options, true)
}
