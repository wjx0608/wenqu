import type { CSSProperties } from 'react'

import styles from './Skeleton.module.css'

export interface SkeletonProps {
  /** 文本行 / 矩形 / 圆形头像 */
  variant?: 'text' | 'rect' | 'circle'
  /** 行数，仅 text 生效；大于 1 时最后一行自动缩短 */
  lines?: number
  width?: number | string
  height?: number | string
  className?: string
}

export function Skeleton({ variant = 'text', lines = 1, width, height, className }: SkeletonProps) {
  const sizeStyle: CSSProperties = {
    width: width ?? (variant === 'circle' ? 40 : undefined),
    height: height ?? (variant === 'circle' ? 40 : variant === 'rect' ? 120 : undefined),
  }

  const classes = [styles.base, styles[variant], className].filter(Boolean).join(' ')

  if (variant === 'text' && lines > 1) {
    return (
      <div className={styles.stack} aria-hidden="true">
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={classes}
            style={{ width: index === lines - 1 ? '60%' : (width ?? '100%') }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={classes}
      style={{ ...sizeStyle, width: width ?? (variant === 'circle' ? 40 : '100%') }}
      aria-hidden="true"
    />
  )
}
