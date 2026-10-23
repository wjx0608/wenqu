import clsx from 'clsx'
import type { ReactNode } from 'react'

import { Icon } from '../Icon/Icon'
import styles from './Tag.module.css'

export interface TagProps {
  color?: 'neutral' | 'brand' | 'moss'
  size?: 'sm' | 'md'
  onRemove?: () => void
  children: ReactNode
}

export function Tag({ color = 'neutral', size = 'md', onRemove, children }: TagProps) {
  return (
    <span className={clsx(styles.tag, styles[color], styles[size])}>
      {children}
      {onRemove && (
        <button type="button" className={styles.remove} onClick={onRemove} aria-label="移除标签">
          <Icon name="close" size={12} />
        </button>
      )}
    </span>
  )
}
