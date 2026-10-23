import { useState } from 'react'

import { toast } from '@/stores/toast'
import {
  Avatar,
  Button,
  Card,
  Dropdown,
  DropdownItem,
  EmptyState,
  Icon,
  IconButton,
  Input,
  Modal,
  Skeleton,
  SkeletonText,
  Switch,
  Tabs,
  Tag,
  Textarea,
} from '@/shared/ui'

import styles from './UiGallery.module.css'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <div className={styles.sectionBody}>{children}</div>
    </section>
  )
}

export function UiGallery() {
  const [modalOpen, setModalOpen] = useState(false)
  const [switchOn, setSwitchOn] = useState(true)
  const [tab, setTab] = useState('a')

  return (
    <main className={styles.page}>
      <h1 className={styles.pageTitle}>问渠组件陈列</h1>

      <Section title="按钮 Button">
        <Button>主要按钮</Button>
        <Button variant="secondary">次要按钮</Button>
        <Button variant="ghost">幽灵按钮</Button>
        <Button variant="danger">危险按钮</Button>
        <Button loading>加载中</Button>
        <Button disabled>禁用</Button>
        <Button size="sm" icon="plus">
          小号
        </Button>
        <Button size="lg" icon="compose">
          大号
        </Button>
        <IconButton icon="more" label="更多" />
      </Section>

      <Section title="输入 Input / Textarea">
        <Input label="手机号" placeholder="请输入手机号" leftIcon="phone" />
        <Input label="验证码" error="验证码错误" placeholder="6 位数字" />
        <Textarea label="简介" placeholder="介绍一下自己" hint="最多 120 字" />
      </Section>

      <Section title="标签 Tag">
        <Tag>默认</Tag>
        <Tag color="brand">天青</Tag>
        <Tag color="moss">苔绿</Tag>
        <Tag size="sm" onRemove={() => toast.info('移除标签')}>
          可移除
        </Tag>
      </Section>

      <Section title="头像 Avatar">
        <Avatar name="问渠" size={40} />
        <Avatar name="文" size={32} />
        <Avatar name="靖" size={24} />
      </Section>

      <Section title="骨架 Skeleton">
        <SkeletonText lines={3} />
        <div className={styles.row}>
          <Skeleton circle width={40} />
          <Skeleton width={120} />
        </div>
      </Section>

      <Section title="卡片 Card / 空态 EmptyState">
        <Card interactive padding="lg">
          <EmptyState
            icon="search"
            title="没有找到相关内容"
            description="换个关键词试试"
            action={<Button size="sm">返回首页</Button>}
          />
        </Card>
      </Section>

      <Section title="弹窗 Modal / 下拉 Dropdown">
        <Button variant="secondary" onClick={() => setModalOpen(true)}>
          打开弹窗
        </Button>
        <Dropdown trigger={<Button variant="secondary">下拉菜单</Button>}>
          <DropdownItem icon="pin" onClick={() => toast.info('置顶')}>
            置顶
          </DropdownItem>
          <DropdownItem icon="eye" onClick={() => toast.info('设为公开')}>
            设为公开
          </DropdownItem>
          <DropdownItem icon="trash" danger onClick={() => toast.error('已删除')}>
            删除
          </DropdownItem>
        </Dropdown>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="弹窗标题"
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                取消
              </Button>
              <Button onClick={() => setModalOpen(false)}>确认</Button>
            </>
          }
        >
          <p>弹窗正文内容。</p>
        </Modal>
      </Section>

      <Section title="开关 Switch / 页签 Tabs / 提示 Toast">
        <Switch checked={switchOn} onChange={setSwitchOn} label="公开可见" />
        <Tabs
          items={[
            { key: 'a', label: '页签一' },
            { key: 'b', label: '页签二' },
          ]}
          activeKey={tab}
          onChange={setTab}
        />
        <div className={styles.row}>
          <Button variant="secondary" onClick={() => toast.success('操作成功')}>
            成功提示
          </Button>
          <Button variant="secondary" onClick={() => toast.error('操作失败')}>
            失败提示
          </Button>
        </div>
      </Section>

      <Section title="图标 Icon">
        <div className={styles.iconGrid}>
          {(
            [
              'home', 'search', 'compose', 'user', 'users', 'book', 'sun', 'moon', 'monitor',
              'heart', 'star', 'more', 'close', 'chevronDown', 'chevronRight', 'arrowLeft',
              'arrowRight', 'plus', 'image', 'send', 'stop', 'check', 'copy', 'trash', 'pin',
              'eye', 'lock', 'logout', 'userPlus', 'userCheck', 'sparkle', 'upload', 'refresh',
              'external', 'globe', 'clock', 'tag', 'message', 'mail', 'phone', 'key',
            ] as const
          ).map((name) => (
            <span key={name} className={styles.iconCell} title={name}>
              <Icon name={name} size={20} />
            </span>
          ))}
        </div>
      </Section>
    </main>
  )
}
