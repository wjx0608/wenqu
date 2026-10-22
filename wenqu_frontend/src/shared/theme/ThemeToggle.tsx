import { useThemeStore } from './themeStore'
import styles from './ThemeToggle.module.css'

const labels = {
  light: '切换到暗色模式',
  dark: '切换到跟随系统',
  system: '切换到亮色模式',
} as const

const SunIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
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
  >
    <path d="M21 13a9 9 0 1 1-9.9-9 7 7 0 0 0 9.9 9Z" strokeLinejoin="round" />
  </svg>
)

const SystemIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" strokeLinecap="round" />
  </svg>
)

const icons = {
  light: SunIcon,
  dark: MoonIcon,
  system: SystemIcon,
} as const

export function ThemeToggle() {
  const mode = useThemeStore((state) => state.mode)
  const cycle = useThemeStore((state) => state.cycle)

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={cycle}
      aria-label={labels[mode]}
      title={labels[mode]}
    >
      {icons[mode]}
    </button>
  )
}
