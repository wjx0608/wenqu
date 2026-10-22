import { create } from 'zustand'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'wenqu_theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

function isThemeMode(value: string | null): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function readStoredTheme(): ThemeMode {
  const raw = localStorage.getItem(STORAGE_KEY)
  return isThemeMode(raw) ? raw : 'system'
}

/** 把用户偏好解析为实际生效的主题 */
export function resolveTheme(mode: ThemeMode): ResolvedTheme {
  if (mode === 'system') {
    return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
  }
  return mode
}

interface ThemeState {
  /** 用户偏好，首次进入默认跟随系统 */
  mode: ThemeMode
  /** 实际生效的主题，由 ThemeSync 回写，供 UI 直接消费 */
  resolved: ResolvedTheme
  setMode: (mode: ThemeMode) => void
  /** 亮色与暗色之间直接切换；「跟随系统」只作为初始默认值，不参与循环 */
  toggle: () => void
  setResolved: (resolved: ResolvedTheme) => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: readStoredTheme(),
  resolved: resolveTheme(readStoredTheme()),
  setMode: (mode) => {
    localStorage.setItem(STORAGE_KEY, mode)
    set({ mode })
  },
  toggle: () => {
    const next: ResolvedTheme = get().resolved === 'dark' ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, next)
    set({ mode: next, resolved: next })
  },
  setResolved: (resolved) => {
    if (get().resolved !== resolved) {
      set({ resolved })
    }
  },
}))
