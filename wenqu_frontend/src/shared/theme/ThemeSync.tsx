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
    const root = document.documentElement
    let timer: number | undefined

    const apply = () => {
      const resolved = resolveTheme(mode)
      const previous = root.dataset.theme
      root.dataset.theme = resolved
      setResolved(resolved)

      // 首屏由内联脚本直出，无需过渡；之后的切换加一层短过渡，避免颜色硬切
      if (previous && previous !== resolved) {
        root.classList.add('theme-transition')
        window.clearTimeout(timer)
        timer = window.setTimeout(() => root.classList.remove('theme-transition'), 320)
      }
    }

    apply()

    if (mode !== 'system') {
      return () => {
        window.clearTimeout(timer)
        root.classList.remove('theme-transition')
      }
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', apply)

    return () => {
      media.removeEventListener('change', apply)
      window.clearTimeout(timer)
      root.classList.remove('theme-transition')
    }
  }, [mode, setResolved])

  return null
}
