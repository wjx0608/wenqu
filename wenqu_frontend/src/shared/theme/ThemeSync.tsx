import { useEffect } from 'react'

import { resolveTheme, useThemeStore } from './themeStore'

/**
 * 把主题偏好同步到 <html data-theme>，并在「跟随系统」时监听系统切换。
 * 首屏防闪烁由 index.html 中的内联脚本负责。
 */
export function ThemeSync() {
  const mode = useThemeStore((state) => state.mode)
  const setResolved = useThemeStore((state) => state.setResolved)

  useEffect(() => {
    const apply = () => {
      const resolved = resolveTheme(mode)
      document.documentElement.dataset.theme = resolved
      setResolved(resolved)
    }

    apply()

    if (mode !== 'system') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [mode, setResolved])

  return null
}
