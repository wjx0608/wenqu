import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import { LikeFavBar } from '@/features/interaction/LikeFavBar'
import { fetchPostContent, getPostDetail } from '@/features/post/api'
import { ImageGallery } from '@/features/post/ImageGallery'
import { Markdown } from '@/features/post/Markdown'
import { QaPanel } from '@/features/post/QaPanel'
import { FollowButton } from '@/features/relation/FollowButton'
import { isApiError } from '@/shared/api/error'
import { formatRelativeTime } from '@/shared/utils/time'
import { Avatar, Button, EmptyState, Skeleton, SkeletonText, Tag } from '@/shared/ui'

import styles from './PostDetailPage.module.css'

const visibilityMeta: Record<string, { icon: 'globe' | 'users' | 'lock' | 'eye'; label: string }> = {
  public: { icon: 'globe', label: '公开' },
  followers: { icon: 'users', label: '关注可见' },
  school: { icon: 'users', label: '校友可见' },
  private: { icon: 'lock', label: '私密' },
  unlisted: { icon: 'eye', label: '不列出' },
}

function parseAuthorTags(tagJson?: string | null): string[] {
  if (!tagJson) return []
  try {
    const parsed: unknown = JSON.parse(tagJson)
    return Array.isArray(parsed) ? parsed.filter((t): t is string => typeof t === 'string').slice(0, 4) : []
  } catch {
    return []
  }
}

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()

  const detailQuery = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostDetail(id!),
    enabled: !!id,
  })

  const contentQuery = useQuery({
    queryKey: ['post-content', detailQuery.data?.contentUrl],
    queryFn: () => fetchPostContent(detailQuery.data!.contentUrl),
    enabled: !!detailQuery.data?.contentUrl,
  })

  if (detailQuery.isPending) {
    return (
      <div className={styles.page}>
        <div className={styles.article}>
          <Skeleton width="60%" height={32} />
          <div className={styles.skeletonMeta}>
            <Skeleton circle width={36} />
            <Skeleton width={120} />
          </div>
          <SkeletonText lines={6} />
        </div>
      </div>
    )
  }

  if (detailQuery.isError || !detailQuery.data) {
    return (
      <div className={styles.page}>
        <EmptyState
          icon="book"
          title="知文加载失败"
          description={isApiError(detailQuery.error) ? detailQuery.error.message : '内容不存在或已删除'}
          action={<Button onClick={() => detailQuery.refetch()}>重新加载</Button>}
        />
      </div>
    )
  }

  const post = detailQuery.data
  const visible = visibilityMeta[post.visible] ?? visibilityMeta.public
  const authorTags = parseAuthorTags(post.authorTagJson)

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.metaRow}>
            <Avatar src={post.authorAvatar} name={post.authorNickname} size={36} />
            <div className={styles.authorMeta}>
              <span className={styles.authorName}>{post.authorNickname}</span>
              <span className={styles.sub}>
                {post.publishTime && <>{formatRelativeTime(post.publishTime)} · </>}
                {visible.label}
              </span>
            </div>
            <FollowButton authorId={post.authorId} />
          </div>
          {post.tags.length > 0 && (
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <Tag key={tag} color="brand">
                  {tag}
                </Tag>
              ))}
            </div>
          )}
        </header>

        {post.description && <p className={styles.description}>{post.description}</p>}

        <ImageGallery images={post.images} />

        {contentQuery.isPending && <SkeletonText lines={8} />}
        {contentQuery.isError && (
          <EmptyState
            icon="refresh"
            title="正文加载失败"
            action={<Button onClick={() => contentQuery.refetch()}>重新加载</Button>}
          />
        )}
        {contentQuery.isSuccess && <Markdown>{contentQuery.data}</Markdown>}

        <footer className={styles.footer}>
          <LikeFavBar
            entityId={post.id}
            likeCount={post.likeCount}
            favoriteCount={post.favoriteCount}
            liked={post.liked}
            faved={post.faved}
          />
        </footer>

        <section className={styles.authorCard}>
          <Avatar src={post.authorAvatar} name={post.authorNickname} size={48} />
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{post.authorNickname}</span>
            {authorTags.length > 0 && (
              <div className={styles.authorTags}>
                {authorTags.map((tag) => (
                  <Tag key={tag} size="sm" color="moss">
                    {tag}
                  </Tag>
                ))}
              </div>
            )}
          </div>
          <FollowButton authorId={post.authorId} />
        </section>
      </article>

      {post.visible === 'public' && <QaPanel postId={post.id} />}
    </div>
  )
}
