import { IconButton } from '@/shared/ui'
import { useThemeStore } from '@/stores/theme'

export function ThemeToggle() {
  const mode = useThemeStore((s) => s.mode)
  const toggle = useThemeStore((s) => s.toggle)
  const dark = mode === 'dark'

  return (
    <IconButton
      icon={dark ? 'moon' : 'sun'}
      label={dark ? '当前为暗色，点击切换亮色' : '当前为亮色，点击切换暗色'}
      onClick={toggle}
    />
  )
}
