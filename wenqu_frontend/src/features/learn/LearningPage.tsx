import { useNavigate } from 'react-router-dom'

import { Button, EmptyState } from '@/shared/ui'

import styles from './LearningPage.module.css'

/**
 * 我的学习。
 * 当前为占位页：后端尚未提供学习记录接口，此处只呈现空状态。
 */
export function LearningPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>我的学习</h1>
        <p className={styles.subtitle}>记录每一次学习进步，保持持续成长</p>
      </header>

      <EmptyState
        icon="book"
        title="还没有学习记录"
        description="去首页探索优质知文吧"
        action={<Button onClick={() => navigate('/')}>前往首页</Button>}
      />
    </div>
  )
}
