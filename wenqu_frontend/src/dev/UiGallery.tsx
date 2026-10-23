import { useState } from 'react'

import { useThemeStore } from '@/shared/theme/themeStore'
import { Button, Card, EmptyState, Icon, Input, Skeleton, Tag } from '@/shared/ui'
import type { IconName } from '@/shared/ui'

import styles from './UiGallery.module.css'

const colorTokens = [
  { name: '--color-brand', label: '品牌' },
  { name: '--color-brand-soft', label: '品牌浅底' },
  { name: '--color-accent', label: '缀色' },
  { name: '--color-bg', label: '页面底' },
  { name: '--color-surface', label: '卡片面' },
  { name: '--color-surface-sunken', label: '凹陷面' },
  { name: '--color-border', label: '描边' },
  { name: '--color-text-strong', label: '正文强' },
  { name: '--color-text-muted', label: '次要文字' },
  { name: '--color-success', label: '成功' },
  { name: '--color-warning', label: '警示' },
  { name: '--color-danger', label: '危险' },
]

const iconNames: IconName[] = [
  'home',
  'search',
  'bookmark',
  'user',
  'penLine',
  'sun',
  'moon',
  'arrowLeft',
  'refresh',
  'close',
]

const tags = ['Redis', 'Kafka', 'Elasticsearch']

export function UiGallery() {
  const [category, setCategory] = useState('后端')
  const [removable, setRemovable] = useState(tags)
  const theme = useThemeStore((state) => state.resolved)

  return (
    <article className={styles.root}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>开发自查</p>
        <h1 className={styles.title}>问渠 · 设计系统</h1>
        <p className={styles.subtitle}>
          色系为天青 × 竹纸，暗色为黛底青辉。所有组件只消费 tokens.css 中的语义变量；
          用顶栏的主题按钮切换后逐项核对，当前为「{theme === 'dark' ? '暗色' : '亮色'}」。
        </p>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>色板</h2>
          <span className={styles.sectionNote}>语义层，不直接使用色阶</span>
        </div>
        <ul className={styles.swatches}>
          {colorTokens.map((token) => (
            <li key={token.name} className={styles.swatchItem}>
              <span
                className={styles.swatchChip}
                style={{ backgroundColor: `var(${token.name})` }}
                aria-hidden="true"
              />
              <span className={styles.swatchLabel}>{token.label}</span>
              <code className={styles.swatchCode}>{token.name}</code>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Button</h2>
          <span className={styles.sectionNote}>四种变体 / 三档尺寸 / 禁用与加载</span>
        </div>

        <div className={styles.group}>
          <p className={styles.groupLabel}>变体</p>
          <div className={styles.row}>
            <Button>发布知文</Button>
            <Button variant="secondary">保存草稿</Button>
            <Button variant="ghost">取消</Button>
            <Button variant="danger">删除</Button>
          </div>
        </div>

        <div className={styles.group}>
          <p className={styles.groupLabel}>尺寸</p>
          <div className={styles.row}>
            <Button size="sm" variant="secondary">
              小号 28
            </Button>
            <Button size="md" variant="secondary">
              中号 36
            </Button>
            <Button size="lg" variant="secondary">
              大号 44
            </Button>
          </div>
        </div>

        <div className={styles.group}>
          <p className={styles.groupLabel}>状态</p>
          <div className={styles.row}>
            <Button disabled>禁用</Button>
            <Button loading>生成摘要中</Button>
            <Button variant="secondary" disabled>
              禁用
            </Button>
            <Button variant="ghost" disabled>
              禁用
            </Button>
            <Button variant="danger" loading>
              删除中
            </Button>
          </div>
        </div>

        <div className={styles.group}>
          <p className={styles.groupLabel}>撑满容器</p>
          <div className={styles.narrow}>
            <Button fullWidth>
              <Icon name="penLine" size={16} />
              开始写一篇知文
            </Button>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Input</h2>
          <span className={styles.sectionNote}>标题 / 前后缀 / 错误 / 禁用</span>
        </div>
        <div className={styles.grid}>
          <Input label="标题" placeholder="给这篇文章起个名字" hint="建议 30 字以内，突出结论" />
          <Input
            label="标签"
            placeholder="例如 Redis"
            prefix="#"
            suffix="最多 5 个"
            defaultValue="Redis"
          />
          <Input
            label="站内地址"
            placeholder="blog"
            prefix="wenqu.dev/"
            required
            defaultValue="blog"
          />
          <Input
            label="搜索"
            placeholder="搜索知文、作者或标签"
            prefix={<Icon name="search" size={16} />}
          />
          <Input
            label="关键词"
            defaultValue="R"
            error="关键词至少 2 个字符"
            prefix={<Icon name="search" size={16} />}
          />
          <Input label="账号" defaultValue="wjx0608" disabled hint="账号创建后不可修改" />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Tag</h2>
          <span className={styles.sectionNote}>变体 / 尺寸 / 选中 / 可移除</span>
        </div>

        <div className={styles.group}>
          <p className={styles.groupLabel}>变体与尺寸</p>
          <div className={styles.row}>
            <Tag>默认</Tag>
            <Tag variant="brand">品牌</Tag>
            <Tag variant="outline">描边</Tag>
            <Tag size="md">中号默认</Tag>
            <Tag size="md" variant="brand">
              中号品牌
            </Tag>
            <Tag size="md" variant="outline">
              中号描边
            </Tag>
          </div>
        </div>

        <div className={styles.group}>
          <p className={styles.groupLabel}>可选中（用于分区筛选）</p>
          <div className={styles.row}>
            {['后端', '前端', 'AI', '数据库'].map((item) => (
              <Tag
                key={item}
                variant="outline"
                size="md"
                selected={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </Tag>
            ))}
            <span className={styles.note}>当前选中：{category}</span>
          </div>
        </div>

        <div className={styles.group}>
          <p className={styles.groupLabel}>可移除</p>
          <div className={styles.row}>
            {removable.map((tag) => (
              <Tag
                key={tag}
                variant="brand"
                size="md"
                onRemove={() => setRemovable((prev) => prev.filter((item) => item !== tag))}
              >
                {tag}
              </Tag>
            ))}
            {removable.length === 0 && (
              <Button size="sm" variant="ghost" onClick={() => setRemovable(tags)}>
                重置
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Card</h2>
          <span className={styles.sectionNote}>三档内边距 / 可悬浮</span>
        </div>
        <div className={styles.grid}>
          <Card hoverable>
            <div className={styles.stack}>
              <p className={styles.cardTitle}>三级缓存如何避免缓存击穿</p>
              <p className={styles.note}>本地 Caffeine + Redis 页骨架 + 条目碎片，配单飞锁回源。</p>
              <p className={styles.meta}>wjx · 6 分钟阅读</p>
            </div>
          </Card>
          <Card padding="lg">
            <div className={styles.stack}>
              <p className={styles.cardTitle}>宽内边距</p>
              <p className={styles.note}>padding=&quot;lg&quot;，用于详情页侧栏或引导块。</p>
            </div>
          </Card>
          <Card padding="none">
            <div className={styles.innerPad}>
              <p className={styles.cardTitle}>无内边距</p>
              <p className={styles.note}>padding=&quot;none&quot;，适合内部自行排版，如封面图。</p>
            </div>
          </Card>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Skeleton</h2>
          <span className={styles.sectionNote}>高光取自 token，暗色不刺眼</span>
        </div>
        <div className={styles.grid}>
          <Card>
            <div className={styles.stack}>
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
          <Card>
            <div className={styles.feedItem}>
              <Skeleton variant="circle" width={40} height={40} />
              <div className={styles.grow}>
                <Skeleton lines={2} />
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>EmptyState</h2>
          <span className={styles.sectionNote}>图标 + 说明 + 单一操作</span>
        </div>
        <Card padding="none">
          <EmptyState
            icon={<Icon name="search" size={22} />}
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

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Icon</h2>
          <span className={styles.sectionNote}>24 栅格 / 1.5px 描边</span>
        </div>
        <ul className={styles.icons}>
          {iconNames.map((name) => (
            <li key={name} className={styles.iconItem}>
              <Icon name={name} size={20} />
              <span>{name}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
