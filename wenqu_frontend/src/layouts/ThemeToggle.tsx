import { IconButton } from '@/shared/ui'
import { useThemeStore, type ThemeMode } from '@/stores/theme'

const next: Record<ThemeMode, ThemeMode> = { light: 'dark', dark: 'system', system: 'light' }
const meta: Record<ThemeMode, { icon: 'sun' | 'moon' | 'monitor'; label: string }> = {
  light: { icon: 'sun', label: '亮色模式，点击切换暗色' },
  dark: { icon: 'moon', label: '暗色模式，点击跟随系统' },
  system: { icon: 'monitor', label: '跟随系统，点击切换亮色' },
}

export function ThemeToggle() {
  const mode = useThemeStore((s) => s.mode)
  const setMode = useThemeStore((s) => s.setMode)
  const { icon, label } = meta[mode]

  return <IconButton icon={icon} label={label} onClick={() => setMode(next[mode])} />
}
