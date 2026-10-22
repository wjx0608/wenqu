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
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  /** 依次在 亮色 → 暗色 → 跟随系统 之间切换 */
  cycle: () => void
}

const cycleOrder: ThemeMode[] = ['light', 'dark', 'system']

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: readStoredTheme(),
  setMode: (mode) => {
    localStorage.setItem(STORAGE_KEY, mode)
    set({ mode })
  },
  cycle: () => {
    const index = cycleOrder.indexOf(get().mode)
    const next = cycleOrder[(index + 1) % cycleOrder.length]
    localStorage.setItem(STORAGE_KEY, next)
    set({ mode: next })
  },
}))
