import { Icon } from '@/shared/ui'

import { useThemeStore } from './themeStore'
import styles from './ThemeToggle.module.css'

export function ThemeToggle() {
  const resolved = useThemeStore((state) => state.resolved)
  const toggle = useThemeStore((state) => state.toggle)

  const isDark = resolved === 'dark'
  const label = isDark ? '切换到亮色模式' : '切换到暗色模式'

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <Icon name={isDark ? 'moon' : 'sun'} />
    </button>
  )
}
