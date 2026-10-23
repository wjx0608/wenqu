import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { PostCard } from '@/features/feed/PostCard'
import { searchPosts, suggest } from '@/features/search/api'
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue'
import { useIntersection } from '@/shared/hooks/useIntersection'
import { Button, EmptyState, Icon, Spinner } from '@/shared/ui'
import { useAuthStore } from '@/stores/auth'

import styles from './SearchPage.module.css'

export function SearchPage() {
  const user = useAuthStore((s) => s.user)
  const [input, setInput] = useState('')
  const [keyword, setKeyword] = useState('')
  const [focused, setFocused] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  const debounced = useDebouncedValue(input, 300)
  const suggestEnabled = focused && debounced.trim().length > 0 && debounced !== keyword

  const suggestQuery = useQuery({
    queryKey: ['search', 'suggest', debounced],
    queryFn: () => suggest(debounced.trim()),
    enabled: suggestEnabled,
  })

  const searchQuery = useInfiniteQuery({
    queryKey: ['search', 'query', keyword],
    queryFn: ({ pageParam }) => searchPosts(keyword, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (last) => (last.hasMore ? last.nextAfter : undefined),
    enabled: !!keyword && !!user,
  })

  const fetchNext = useCallback(() => {
    if (searchQuery.hasNextPage && !searchQuery.isFetchingNextPage) void searchQuery.fetchNextPage()
  }, [searchQuery])

  const sentinelRef = useIntersection(fetchNext, !!searchQuery.hasNextPage)

  const submit = (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return
    setInput(trimmed)
    setKeyword(trimmed)
    setFocused(false)
  }

  const items = searchQuery.data?.pages.flatMap((p) => p.items) ?? []
  const suggestions = suggestQuery.data?.items ?? []

  return (
    <div className={styles.page}>
      <div className={styles.box} ref={boxRef}>
        <form
          className={styles.bar}
          onSubmit={(e) => {
            e.preventDefault()
            submit(input)
          }}
        >
          <Icon name="search" size={17} />
          <input
            className={styles.input}
            placeholder="搜索知文、标签或作者"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => window.setTimeout(() => setFocused(false), 150)}
          />
          <Button type="submit" size="sm">
            搜索
          </Button>
        </form>

        {suggestEnabled && suggestions.length > 0 && (
          <ul className={styles.suggests}>
            {suggestions.map((s) => (
              <li key={s}>
                <button type="button" className={styles.suggest} onMouseDown={() => submit(s)}>
                  <Icon name="search" size={14} />
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {!user && keyword && (
        <EmptyState
          icon="lock"
          title="登录后使用搜索"
          action={
            <Link to="/login" state={{ from: '/search' }}>
              <Button>去登录</Button>
            </Link>
          }
        />
      )}

      {searchQuery.isPending && keyword && (
        <div className={styles.loading}>
          <Spinner size={22} />
        </div>
      )}

      {searchQuery.isSuccess && items.length === 0 && (
        <EmptyState icon="search" title={`没有找到「${keyword}」相关内容`} description="换个关键词试试" />
      )}

      {items.length > 0 && (
        <div className={styles.results}>
          {items.map((item) => (
            <PostCard key={item.id} item={item} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className={styles.sentinel}>
        {searchQuery.isFetchingNextPage && <Spinner size={20} />}
        {searchQuery.isSuccess && !searchQuery.hasNextPage && items.length > 0 && (
          <span className={styles.end}>—— 到底啦 ——</span>
        )}
      </div>
    </div>
  )
}
