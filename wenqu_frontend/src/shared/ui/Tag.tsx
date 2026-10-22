import type { ReactNode } from 'react'

import styles from './Tag.module.css'

export type TagVariant = 'default' | 'brand' | 'outline'
export type TagSize = 'sm' | 'md'

export interface TagProps {
  children: ReactNode
  variant?: TagVariant
  size?: TagSize
  /** 是否处于选中态，仅与 onClick 配合使用 */
  selected?: boolean
  /** 传入后标签可点击（渲染为 button） */
  onClick?: () => void
  /** 传入后展示移除按钮 */
  onRemove?: () => void
  className?: string
}

export function Tag({
  children,
  variant = 'default',
  size = 'sm',
  selected = false,
  onClick,
  onRemove,
  className,
}: TagProps) {
  const classes = [
    styles.base,
    styles[variant],
    styles[size],
    onClick ? styles.interactive : '',
    selected ? styles.selected : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (onClick) {
    return (
      <button type="button" className={classes} aria-pressed={selected} onClick={onClick}>
        {children}
      </button>
    )
  }

  return (
    <span className={classes}>
      {children}
      {onRemove && (
        <button type="button" className={styles.remove} aria-label="移除" onClick={onRemove}>
          ×
        </button>
      )}
    </span>
  )
}
