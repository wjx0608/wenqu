import { create } from 'zustand'

import { fetchCurrentUser, logout as apiLogout } from '@/features/auth/api'
import { setUnauthorizedHandler } from '@/shared/api/client'
import { clearTokens, loadTokens, saveTokens } from '@/shared/api/tokens'
import type { AuthResponse, AuthUser } from '@/shared/types/api'

const USER_KEY = 'wenqu_current_user'

function loadCachedUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

interface AuthState {
  user: AuthUser | null
  /** 写入会话（登录/注册成功） */
  setSession: (auth: AuthResponse) => void
  /** 更新当前用户缓存（资料编辑后同步） */
  setUser: (user: AuthUser) => void
  /** 后台校验 /auth/me，失败则清空登录态 */
  refreshMe: () => Promise<void>
  /** 退出登录（通知服务端吊销 refresh token） */
  logout: () => Promise<void>
  /** 仅清空本地登录态（401 失效时调用） */
  clear: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: loadTokens() ? loadCachedUser() : null,

  setSession: (auth) => {
    saveTokens(auth.token)
    localStorage.setItem(USER_KEY, JSON.stringify(auth.user))
    set({ user: auth.user })
  },

  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    set({ user })
  },

  refreshMe: async () => {
    if (!loadTokens()) {
      set({ user: null })
      return
    }
    try {
      const user = await fetchCurrentUser()
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      set({ user })
    } catch {
      clearTokens()
      localStorage.removeItem(USER_KEY)
      set({ user: null })
    }
  },

  logout: async () => {
    const tokens = loadTokens()
    if (tokens) {
      try {
        await apiLogout(tokens.refreshToken)
      } catch {
        /* 服务端吊销失败不阻塞本地退出 */
      }
    }
    clearTokens()
    localStorage.removeItem(USER_KEY)
    set({ user: null })
  },

  clear: () => {
    clearTokens()
    localStorage.removeItem(USER_KEY)
    set({ user: null })
  },
}))

// 401 且刷新失败时，HTTP 客户端回调这里清空登录态
setUnauthorizedHandler(() => useAuthStore.getState().clear())
