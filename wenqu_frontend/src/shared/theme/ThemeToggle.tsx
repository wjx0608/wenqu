import { useThemeStore } from './themeStore'
import styles from './ThemeToggle.module.css'

const SunIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)

const MoonIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    aria-hidden="true"
  >
    <path d="M21 13a9 9 0 1 1-9.9-9 7 7 0 0 0 9.9 9Z" strokeLinejoin="round" />
  </svg>
)

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
      {isDark ? MoonIcon : SunIcon}
    </button>
  )
}
