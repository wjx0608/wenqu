import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getMine } from '@/features/feed/api'
import { MyPostCard } from '@/features/profile/MyPostCard'
import { RelationListModal } from '@/features/profile/RelationListModal'
import { getRelationCounter } from '@/features/relation/api'
import { useIntersection } from '@/shared/hooks/useIntersection'
import { Avatar, Button, EmptyState, SkeletonText, Spinner, Tag } from '@/shared/ui'
import { useAuthStore } from '@/stores/auth'

import styles from './ProfilePage.module.css'
import { useCallback } from 'react'

function parseTags(tagJson?: string | null): string[] {
  if (!tagJson) return []
  try {
    const parsed: unknown = JSON.parse(tagJson)
    return Array.isArray(parsed) ? parsed.filter((t): t is string => typeof t === 'string') : []
  } catch {
    return []
  }
}

export function ProfilePage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [relationModal, setRelationModal] = useState<'following' | 'followers' | null>(null)

  const counterQuery = useQuery({
    queryKey: ['relation', 'counter', user?.id],
    queryFn: () => getRelationCounter(user!.id),
    enabled: !!user,
  })

  const mineQuery = useInfiniteQuery({
    queryKey: ['mine'],
    queryFn: ({ pageParam }) => getMine(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
  })

  const fetchNext = useCallback(() => {
    if (mineQuery.hasNextPage && !mineQuery.isFetchingNextPage) void mineQuery.fetchNextPage()
  }, [mineQuery])

  const sentinelRef = useIntersection(fetchNext, !!mineQuery.hasNextPage)
  const posts = mineQuery.data?.pages.flatMap((p) => p.items) ?? []

  if (!user) return null

  const tags = parseTags(user.tagJson)
  const counter = counterQuery.data

  return (
    <div className={styles.page}>
      <section className={styles.profile}>
        <Avatar src={user.avatar} name={user.nickname} size={72} />
        <div className={styles.info}>
          <h1 className={styles.name}>{user.nickname}</h1>
          {user.zhId && <span className={styles.zhId}>问渠号：{user.zhId}</span>}
          {user.bio && <p className={styles.bio}>{user.bio}</p>}
          {tags.length > 0 && (
            <div className={styles.tags}>
              {tags.map((tag) => (
                <Tag key={tag} color="moss" size="sm">
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </div>
        <Button variant="secondary" size="sm" icon="compose" onClick={() => navigate('/profile/edit')}>
          编辑资料
        </Button>
      </section>

      <section className={styles.counters}>
        <button type="button" className={styles.counter} onClick={() => setRelationModal('following')}>
          <strong>{counter?.followings ?? '-'}</strong>
          <span>关注</span>
        </button>
        <button type="button" className={styles.counter} onClick={() => setRelationModal('followers')}>
          <strong>{counter?.followers ?? '-'}</strong>
          <span>粉丝</span>
        </button>
        <div className={styles.counter}>
          <strong>{counter?.posts ?? '-'}</strong>
          <span>知文</span>
        </div>
      </section>

      <h2 className={styles.sectionTitle}>我的知文</h2>

      {mineQuery.isPending && <SkeletonText lines={5} />}
      {mineQuery.isSuccess && posts.length === 0 && (
        <EmptyState
          icon="compose"
          title="还没有发布知文"
          action={<Button onClick={() => navigate('/create')}>去写一篇</Button>}
        />
      )}
      {posts.length > 0 && (
        <div className={styles.posts}>
          {posts.map((item) => (
            <MyPostCard key={item.id} item={item} />
          ))}
        </div>
      )}
      <div ref={sentinelRef} className={styles.sentinel}>
        {mineQuery.isFetchingNextPage && <Spinner size={20} />}
      </div>

      {relationModal && (
        <RelationListModal
          open
          onClose={() => setRelationModal(null)}
          userId={user.id}
          type={relationModal}
        />
      )}
    </div>
  )
}
