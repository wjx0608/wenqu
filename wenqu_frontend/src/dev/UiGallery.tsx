import { useState } from 'react'

import { Button, Card, EmptyState, Input, Skeleton, Tag } from '@/shared/ui'

import styles from './UiGallery.module.css'

const SearchIcon = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" strokeLinecap="round" />
  </svg>
)

export function UiGallery() {
  const [selectedCategory, setSelectedCategory] = useState('后端')
  const [tags, setTags] = useState(['Redis', 'Kafka', 'Elasticsearch'])

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>问渠 · 基础组件</h1>
        <p className={styles.subtitle}>
          阶段 1.3 自查页，仅开发期使用。所有组件只消费 tokens.css 中的语义变量。
        </p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Button</h2>
        <div className={styles.row}>
          <Button>发布知文</Button>
          <Button variant="secondary">保存草稿</Button>
          <Button variant="ghost">取消</Button>
          <Button variant="danger">删除</Button>
          <Button disabled>禁用</Button>
          <Button loading>生成摘要中</Button>
        </div>
        <div className={styles.row}>
          <Button size="sm">小号</Button>
          <Button size="md">中号</Button>
          <Button size="lg">大号</Button>
        </div>
        <div className={styles.narrow}>
          <Button fullWidth variant="secondary">
            撑满容器
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Input</h2>
        <div className={styles.grid}>
          <Input label="标题" placeholder="给这篇文章起个名字" hint="建议 30 字以内，突出结论" />
          <Input
            label="标签"
            placeholder="例如 Redis"
            defaultValue="Redis"
            prefix="#"
            suffix="最多 5 个"
          />
          <Input
            label="自定义域名"
            placeholder="blog"
            prefix="https://"
            suffix=".wenqu.dev"
            required
          />
          <Input
            label="搜索"
            placeholder="搜索知文、作者或标签"
            error="关键词至少 2 个字符"
            defaultValue="R"
          />
          <Input label="只读字段" defaultValue="wjx0608" disabled hint="账号创建后不可修改" />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Tag</h2>
        <div className={styles.row}>
          <Tag>默认</Tag>
          <Tag variant="brand">品牌</Tag>
          <Tag variant="outline">描边</Tag>
          <Tag size="md">中号标签</Tag>
        </div>
        <div className={styles.row}>
          {['后端', '前端', 'AI', '数据库'].map((item) => (
            <Tag
              key={item}
              variant="outline"
              size="md"
              selected={selectedCategory === item}
              onClick={() => setSelectedCategory(item)}
            >
              {item}
            </Tag>
          ))}
          <span className={styles.caption}>当前选中：{selectedCategory}</span>
        </div>
        <div className={styles.row}>
          {tags.map((tag) => (
            <Tag
              key={tag}
              variant="brand"
              size="md"
              onRemove={() => setTags((prev) => prev.filter((t) => t !== tag))}
            >
              {tag}
            </Tag>
          ))}
          {tags.length === 0 && (
            <Button size="sm" variant="ghost" onClick={() => setTags(['Redis', 'Kafka'])}>
              重置标签
            </Button>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Card</h2>
        <div className={styles.grid}>
          <Card hoverable>
            <div className={styles.cardBody}>
              <p className={styles.cardTitle}>三级缓存如何避免缓存击穿</p>
              <p className={styles.caption}>
                本地 Caffeine + Redis 页骨架 + 条目碎片，配单飞锁回源。
              </p>
              <div className={styles.cardMeta}>
                <span>wjx</span>
                <span>·</span>
                <span>6 分钟阅读</span>
              </div>
            </div>
          </Card>
          <Card padding="lg" hoverable>
            <div className={styles.cardBody}>
              <p className={styles.cardTitle}>宽内边距卡片</p>
              <p className={styles.caption}>padding=&quot;lg&quot;，用于详情页侧栏或引导块。</p>
            </div>
          </Card>
          <Card padding="none">
            <div style={{ padding: 'var(--space-4)' }}>
              <p className={styles.cardTitle}>无内边距卡片</p>
              <p className={styles.caption}>
                padding=&quot;none&quot;，适合内部自行排版（如封面图）。
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Skeleton</h2>
        <div className={styles.grid}>
          <Card>
            <div className={styles.cardBody}>
              <Skeleton lines={3} />
              <div className={styles.avatarRow}>
                <Skeleton variant="circle" width={32} height={32} />
                <Skeleton width="40%" />
              </div>
            </div>
          </Card>
          <Card padding="none">
            <Skeleton variant="rect" height={140} />
          </Card>
          <div className={styles.feedSkeleton}>
            <div className={styles.skeletonItem}>
              <Skeleton variant="circle" width={40} height={40} />
              <div style={{ flex: 1 }}>
                <Skeleton lines={2} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>EmptyState</h2>
        <Card padding="none">
          <EmptyState
            icon={SearchIcon}
            title="没有找到相关知文"
            description="试试更宽泛的关键词，或者切换左侧分区浏览最近发布的内容。"
            action={
              <Button variant="secondary" size="sm">
                清除筛选
              </Button>
            }
          />
        </Card>
      </section>
    </div>
  )
}
