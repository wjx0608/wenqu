import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { fav, like, unfav, unlike } from '@/features/interaction/api'
import { isApiError } from '@/shared/api/error'
import { Icon } from '@/shared/ui'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/stores/toast'

import styles from './LikeFavBar.module.css'

export interface LikeFavBarProps {
  entityId: string
  likeCount: number
  favoriteCount: number
  liked?: boolean
  faved?: boolean
  compact?: boolean
}

/** 点赞/收藏条：本地乐观更新，失败回滚；未登录跳登录页 */
export function LikeFavBar({ entityId, likeCount, favoriteCount, liked, faved, compact = false }: LikeFavBarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)

  const [state, setState] = useState({ liked: !!liked, faved: !!faved, likeCount, favoriteCount })
  useEffect(() => {
    setState({ liked: !!liked, faved: !!faved, likeCount, favoriteCount })
  }, [liked, faved, likeCount, favoriteCount])

  const ensureLogin = (): boolean => {
    if (user) return true
    navigate('/login', { state: { from: location.pathname + location.search } })
    return false
  }

  const toggle = async (kind: 'like' | 'fav') => {
    if (!ensureLogin()) return
    const prev = state
    setState((s) =>
      kind === 'like'
        ? { ...s, liked: !s.liked, likeCount: s.likeCount + (s.liked ? -1 : 1) }
        : { ...s, faved: !s.faved, favoriteCount: s.favoriteCount + (s.faved ? -1 : 1) },
    )
    try {
      if (kind === 'like') {
        await (prev.liked ? unlike(entityId) : like(entityId))
      } else {
        await (prev.faved ? unfav(entityId) : fav(entityId))
      }
    } catch (e) {
      setState(prev)
      toast.error(isApiError(e) ? e.message : '操作失败，请稍后再试')
    }
  }

  return (
    <div className={clsx(styles.bar, compact && styles.compact)}>
      <button
        type="button"
        className={clsx(styles.action, state.liked && styles.active)}
        aria-pressed={state.liked}
        onClick={(e) => {
          e.preventDefault()
          void toggle('like')
        }}
      >
        <Icon name="heart" size={compact ? 15 : 17} filled={state.liked} />
        <span>{state.likeCount}</span>
      </button>
      <button
        type="button"
        className={clsx(styles.action, state.faved && styles.active)}
        aria-pressed={state.faved}
        onClick={(e) => {
          e.preventDefault()
          void toggle('fav')
        }}
      >
        <Icon name="star" size={compact ? 15 : 17} filled={state.faved} />
        <span>{state.favoriteCount}</span>
      </button>
    </div>
  )
}
