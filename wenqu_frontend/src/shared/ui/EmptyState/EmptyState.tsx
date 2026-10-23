import type { ReactNode } from 'react'

import { Icon, type IconName } from '../Icon/Icon'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  icon?: IconName
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon = 'book', title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      <span className={styles.icon}>
        <Icon name={icon} size={28} />
      </span>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
