import { create } from 'zustand'

/** 主题只有明暗两态，同步落在 html[data-theme] 上 */
export type ThemeMode = 'light' | 'dark'

const THEME_KEY = 'wenqu_theme'

function applyTheme(mode: ThemeMode, withTransition: boolean) {
  const root = document.documentElement
  if (withTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('theme-transition')
    window.setTimeout(() => root.classList.remove('theme-transition'), 240)
  }
  root.dataset.theme = mode
  // 同步移动端浏览器地址栏配色
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', mode === 'dark' ? '#0f1615' : '#f3f6f3')
}

function loadMode(): ThemeMode {
  return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'
}

interface ThemeState {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  /** 在明暗之间切换 */
  toggle: () => void
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: loadMode(),
  setMode: (mode) => {
    localStorage.setItem(THEME_KEY, mode)
    applyTheme(mode, true)
    set({ mode })
  },
  toggle: () => get().setMode(get().mode === 'dark' ? 'light' : 'dark'),
}))
