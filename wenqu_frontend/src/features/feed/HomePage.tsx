import { useInfiniteQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import { getFeed } from '@/features/feed/api'
import { PostCard } from '@/features/feed/PostCard'
import { isApiError } from '@/shared/api/error'
import { useIntersection } from '@/shared/hooks/useIntersection'
import { Button, EmptyState, Skeleton, Spinner } from '@/shared/ui'

import styles from './HomePage.module.css'

function FeedSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <Skeleton width="55%" height={20} />
      <Skeleton width="90%" />
      <Skeleton width="80%" />
      <div className={styles.skeletonMeta}>
        <Skeleton circle width={20} />
        <Skeleton width={96} />
      </div>
    </div>
  )
}

export function HomePage() {
  const query = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => getFeed(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.hasMore ? last.page + 1 : undefined),
  })

  const fetchNext = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage()
  }, [query])

  const sentinelRef = useIntersection(fetchNext, !!query.hasNextPage)
  const items = query.data?.pages.flatMap((p) => p.items) ?? []

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>源头活水</h1>
        <p className={styles.subtitle}>最新分享的技术知文</p>
      </header>

      {query.isPending && (
        <div className={styles.list}>
          {Array.from({ length: 4 }, (_, i) => (
            <FeedSkeleton key={i} />
          ))}
        </div>
      )}

      {query.isError && (
        <EmptyState
          icon="refresh"
          title="内容加载失败"
          description={isApiError(query.error) ? query.error.message : '网络异常，请稍后再试'}
          action={<Button onClick={() => query.refetch()}>重新加载</Button>}
        />
      )}

      {query.isSuccess && items.length === 0 && (
        <EmptyState icon="book" title="还没有知文" description="成为第一个分享的人吧" />
      )}

      {items.length > 0 && (
        <div className={styles.list}>
          {items.map((item) => (
            <PostCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className={styles.sentinel}>
        {query.isFetchingNextPage && <Spinner size={20} />}
        {query.isSuccess && !query.hasNextPage && items.length > 0 && (
          <span className={styles.end}>—— 到底啦 ——</span>
        )}
      </div>
    </div>
  )
}
