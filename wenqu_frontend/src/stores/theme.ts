import { useEffect } from 'react'
import { create } from 'zustand'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const THEME_KEY = 'wenqu_theme'
const media = window.matchMedia('(prefers-color-scheme: dark)')

function resolve(mode: ThemeMode): ResolvedTheme {
  if (mode === 'system') return media.matches ? 'dark' : 'light'
  return mode
}

function applyTheme(resolved: ResolvedTheme, withTransition: boolean) {
  const root = document.documentElement
  if (withTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('theme-transition')
    window.setTimeout(() => root.classList.remove('theme-transition'), 240)
  }
  root.dataset.theme = resolved
}

function loadMode(): ThemeMode {
  const raw = localStorage.getItem(THEME_KEY)
  return raw === 'light' || raw === 'dark' || raw === 'system' ? raw : 'system'
}

interface ThemeState {
  mode: ThemeMode
  resolved: ResolvedTheme
  setMode: (mode: ThemeMode) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  mode: loadMode(),
  resolved: resolve(loadMode()),
  setMode: (mode) => {
    localStorage.setItem(THEME_KEY, mode)
    const resolved = resolve(mode)
    applyTheme(resolved, true)
    set({ mode, resolved })
  },
}))

/** 跟随系统偏好变化（仅 mode === 'system' 时生效），挂载一次即可 */
export function useThemeSync() {
  const mode = useThemeStore((s) => s.mode)

  useEffect(() => {
    const onChange = () => {
      if (useThemeStore.getState().mode !== 'system') return
      const resolved = resolve('system')
      applyTheme(resolved, true)
      useThemeStore.setState({ resolved })
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [mode])
}
