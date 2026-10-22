import type { HTMLAttributes } from 'react'

import styles from './Card.module.css'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** 内边距档位，默认 md */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** 悬浮时是否给描边与阴影反馈 */
  hoverable?: boolean
}

export function Card({
  padding = 'md',
  hoverable = false,
  className,
  children,
  ...rest
}: CardProps) {
  const classes = [
    styles.base,
    styles[`padding-${padding}`],
    hoverable ? styles.hoverable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div {...rest} className={classes}>
      {children}
    </div>
  )
}
