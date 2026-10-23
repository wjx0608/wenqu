import { Link } from 'react-router-dom'

import { LikeFavBar } from '@/features/interaction/LikeFavBar'
import type { FeedItem } from '@/shared/types/api'
import { Avatar, Tag } from '@/shared/ui'

import styles from './PostCard.module.css'

export function PostCard({ item }: { item: FeedItem }) {
  return (
    <article className={styles.card}>
      <Link to={`/post/${item.id}`} className={styles.body}>
        <div className={styles.text}>
          <h3 className={styles.title}>
            {item.isTop && <span className={styles.topBadge}>置顶</span>}
            {item.title}
          </h3>
          {item.description && <p className={styles.description}>{item.description}</p>}
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
