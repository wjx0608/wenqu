import clsx from 'clsx'
import type { HTMLAttributes } from 'react'

import styles from './Card.module.css'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
}

export function Card({ padding = 'md', interactive = false, className, ...rest }: CardProps) {
  return (
    <div
      className={clsx(styles.card, styles[`pad-${padding}`], interactive && styles.interactive, className)}
      {...rest}
    />
  )
}
