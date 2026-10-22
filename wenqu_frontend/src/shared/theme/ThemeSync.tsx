import { useEffect } from 'react'

import { resolveTheme, useThemeStore } from './themeStore'

/**
 * 把主题偏好同步到 <html data-theme>，并在「跟随系统」时监听系统切换。
 * 首屏防闪烁由 index.html 中的内联脚本负责。
 */
export function ThemeSync() {
  const mode = useThemeStore((state) => state.mode)

  useEffect(() => {
    const apply = () => {
      document.documentElement.dataset.theme = resolveTheme(mode)
    }

    apply()

    if (mode !== 'system') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [mode])

  return null
}
