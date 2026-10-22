import type { ReactNode } from 'react'

import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  /** 空态标题 */
  title: string
  /** 补充说明，建议一句话讲清为什么为空 */
  description?: string
  /** 图标，建议 20~24px 的线性图标 */
  icon?: ReactNode
  /** 操作区，通常放一个 Button */
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
