import { useCallback, useEffect, useState } from 'react'

import { getFollowers, getFollowing } from '@/features/relation/api'
import { isApiError } from '@/shared/api/error'
import type { Profile } from '@/shared/types/api'
import { Avatar, Button, EmptyState, Modal, SkeletonText } from '@/shared/ui'

import styles from './RelationListModal.module.css'

const PAGE_SIZE = 20

interface RelationListModalProps {
  open: boolean
  onClose: () => void
  userId: number
  type: 'following' | 'followers'
}

export function RelationListModal({ open, onClose, userId, type }: RelationListModalProps) {
  const [items, setItems] = useState<Profile[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState('')

  const loadMore = useCallback(
    async (offset: number) => {
      setLoading(true)
      setError('')
      try {
        const list = type === 'following' ? await getFollowing(userId, PAGE_SIZE, offset) : await getFollowers(userId, PAGE_SIZE, offset)
        setItems((prev) => (offset === 0 ? list : [...prev, ...list]))
        setHasMore(list.length >= PAGE_SIZE)
      } catch (e) {
        setError(isApiError(e) ? e.message : '加载失败')
      } finally {
        setLoading(false)
      }
    },
    [type, userId],
  )

  useEffect(() => {
    if (open) {
      setItems([])
      setHasMore(true)
      void loadMore(0)
    }
  }, [open, loadMore])

  return (
    <Modal open={open} onClose={onClose} title={type === 'following' ? '正在关注' : '粉丝'} width={420}>
      {loading && items.length === 0 && <SkeletonText lines={5} />}
      {error && (
        <EmptyState icon="refresh" title={error} action={<Button onClick={() => loadMore(items.length)}>重试</Button>} />
      )}
      {!loading && !error && items.length === 0 && (
        <EmptyState icon="users" title={type === 'following' ? '还没有关注任何人' : '还没有粉丝'} />
      )}
      {items.length > 0 && (
        <ul className={styles.list}>
          {items.map((p) => (
            <li key={p.id} className={styles.item}>
              <Avatar src={p.avatar} name={p.nickname} size={36} />
              <div className={styles.info}>
                <span className={styles.name}>{p.nickname}</span>
                {p.bio && <span className={styles.bio}>{p.bio}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {hasMore && items.length > 0 && (
        <div className={styles.more}>
          <Button variant="ghost" size="sm" loading={loading} onClick={() => loadMore(items.length)}>
            加载更多
          </Button>
        </div>
      )}
    </Modal>
  )
}
