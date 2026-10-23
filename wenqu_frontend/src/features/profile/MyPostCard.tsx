import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { deletePost, setTop, setVisibility } from '@/features/editor/api'
import { PostCard } from '@/features/feed/PostCard'
import { isApiError } from '@/shared/api/error'
import type { FeedItem } from '@/shared/types/api'
import { Button, Dropdown, DropdownItem, IconButton, Modal } from '@/shared/ui'
import { toast } from '@/stores/toast'

import styles from './MyPostCard.module.css'

/** 个人主页的知文卡片：右上角管理菜单（置顶/可见性/删除） */
export function MyPostCard({ item }: { item: FeedItem }) {
  const queryClient = useQueryClient()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['mine'] })
    void queryClient.invalidateQueries({ queryKey: ['feed'] })
  }

  const onError = (e: unknown) => toast.error(isApiError(e) ? e.message : '操作失败，请稍后再试')

  const topMutation = useMutation({
    mutationFn: () => setTop(item.id, !item.isTop),
    onSuccess: () => {
      toast.success(item.isTop ? '已取消置顶' : '已置顶')
      invalidate()
    },
    onError,
  })

  const visibilityMutation = useMutation({
    mutationFn: (visible: 'public' | 'private') => setVisibility(item.id, visible),
    onSuccess: () => {
      toast.success('已更新可见范围')
      invalidate()
    },
    onError,
  })

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(item.id),
    onSuccess: () => {
      toast.success('已删除')
      setConfirmDelete(false)
      invalidate()
    },
    onError,
  })

  return (
    <div className={styles.wrap}>
      <PostCard item={item} />
      <div className={styles.menu}>
        <Dropdown trigger={<IconButton icon="more" label="管理" size={16} />}>
          <DropdownItem icon="pin" onClick={() => topMutation.mutate()}>
            {item.isTop ? '取消置顶' : '置顶'}
          </DropdownItem>
          {item.visible !== 'public' ? (
            <DropdownItem icon="globe" onClick={() => visibilityMutation.mutate('public')}>
              设为公开
            </DropdownItem>
          ) : (
            <DropdownItem icon="lock" onClick={() => visibilityMutation.mutate('private')}>
              设为私密
            </DropdownItem>
          )}
          <DropdownItem icon="trash" danger onClick={() => setConfirmDelete(true)}>
            删除
          </DropdownItem>
        </Dropdown>
      </div>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="删除知文"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
              取消
            </Button>
            <Button variant="danger" loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate()}>
              确认删除
            </Button>
          </>
        }
      >
        <p>
          确定删除《{item.title}》吗？删除后不可恢复。
        </p>
      </Modal>
    </div>
  )
}
