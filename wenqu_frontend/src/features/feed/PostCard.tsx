import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { LikeFavBar } from '@/features/interaction/LikeFavBar'
import type { FeedItem } from '@/shared/types/api'
import { Avatar, Tag } from '@/shared/ui'

import styles from './PostCard.module.css'

const EM_PATTERN = /<em(?:\s[^>]*)?>(.*?)<\/em>/gis

/**
 * 搜索接口会给命中片段包上 `<em>` 标签，这里把它渲染成高亮节点。
 * 无标签时原样返回文本。
 */
function renderHighlighted(text: string): ReactNode {
  if (!text.includes('<em')) return text

  const parts: ReactNode[] = []
  let lastIndex = 0
  let key = 0

  for (const match of text.matchAll(EM_PATTERN)) {
    const start = match.index ?? 0
    if (start > lastIndex) parts.push(text.slice(lastIndex, start))
    parts.push(<em key={`em-${key++}`}>{match[1]}</em>)
    lastIndex = start + match[0].length
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts.length > 0 ? <>{parts}</> : text
}

export function PostCard({ item }: { item: FeedItem }) {
  return (
    <article className={styles.card}>
      <Link to={`/post/${item.id}`} className={styles.body}>
        <div className={styles.text}>
          <h3 className={styles.title}>
            {item.isTop && <span className={styles.topBadge}>置顶</span>}
            {renderHighlighted(item.title)}
          </h3>
          {item.description && <p className={styles.description}>{renderHighlighted(item.description)}</p>}
          <div className={styles.meta}>
            <Avatar src={item.authorAvatar} name={item.authorNickname} size={20} />
            <span className={styles.author}>{item.authorNickname}</span>
            {item.tags.slice(0, 3).map((tag) => (
              <Tag key={tag} size="sm" color="brand">
                {tag}
              </Tag>
            ))}
          </div>
        </div>
        {item.coverImage && (
          <div className={styles.cover}>
            <img src={item.coverImage} alt="" loading="lazy" />
          </div>
        )}
      </Link>
      <footer className={styles.footer}>
        <LikeFavBar
          entityId={item.id}
          likeCount={item.likeCount}
          favoriteCount={item.favoriteCount}
          liked={item.liked}
          faved={item.faved}
          compact
        />
      </footer>
    </article>
  )
}
