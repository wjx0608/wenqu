import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { suggestDescription } from '@/features/editor/api'
import { ImageUploader, type LocalImage } from '@/features/editor/ImageUploader'
import { runPublishPipeline, STEP_LABEL, type PublishProgress } from '@/features/editor/publishPipeline'
import { TagInput } from '@/features/editor/TagInput'
import { isApiError } from '@/shared/api/error'
import type { Visibility } from '@/shared/types/api'
import { Button, Textarea } from '@/shared/ui'
import { toast } from '@/stores/toast'

import styles from './EditorPage.module.css'

const visibilityOptions: { value: Visibility; label: string; hint: string }[] = [
  { value: 'public', label: '公开', hint: '所有人可见，进入推荐流' },
  { value: 'followers', label: '关注可见', hint: '仅关注你的人可见' },
  { value: 'school', label: '校友可见', hint: '仅同校用户可见' },
  { value: 'unlisted', label: '不列出', hint: '不进推荐流，知道链接可看' },
  { value: 'private', label: '私密', hint: '仅自己可见' },
]

export function EditorPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [images, setImages] = useState<LocalImage[]>([])
  const [visible, setVisible] = useState<Visibility>('public')
  const [suggesting, setSuggesting] = useState(false)
  const [progress, setProgress] = useState<PublishProgress | null>(null)

  const publishing = progress !== null
  const canPublish = title.trim().length > 0 && content.trim().length > 0 && !publishing

  const handleSuggest = async () => {
    if (!content.trim()) {
      toast.info('先写点正文，AI 才能帮你总结')
      return
    }
    setSuggesting(true)
    try {
      const { description: desc } = await suggestDescription(content)
      setDescription(desc.slice(0, 50))
      toast.success('已生成摘要')
    } catch (e) {
      toast.error(isApiError(e) ? e.message : '生成失败，请稍后再试')
    } finally {
      setSuggesting(false)
    }
  }

  const handlePublish = async () => {
    if (!canPublish) {
      toast.info('标题和正文不能为空')
      return
    }
    setProgress({ step: 'draft' })
    try {
      const id = await runPublishPipeline(
        { title: title.trim(), description: description.trim(), content, tags, images: images.map((i) => i.file), visible },
        setProgress,
      )
      toast.success('发布成功')
      navigate(`/post/${id}`, { replace: true })
    } catch (e) {
      toast.error(isApiError(e) ? e.message : '发布失败，请稍后再试')
      setProgress(null)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>写知文</h1>
        <Button icon="send" loading={publishing} disabled={!canPublish} onClick={handlePublish}>
          {publishing
            ? progress.step === 'images'
              ? `${STEP_LABEL.images} ${progress.imageIndex}/${progress.imageTotal}`
              : STEP_LABEL[progress.step]
            : '发布'}
        </Button>
      </header>

      <input
        className={styles.titleInput}
        placeholder="起个好标题"
        value={title}
        maxLength={60}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className={styles.descriptionRow}>
        <Textarea
          label="摘要（可选）"
          placeholder="一句话介绍这篇知文，将显示在信息流中"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button variant="secondary" size="sm" icon="sparkle" loading={suggesting} onClick={handleSuggest}>
          AI 生成
        </Button>
      </div>

      <section className={styles.section}>
        <label className={styles.label}>配图（可选）</label>
        <ImageUploader images={images} onChange={setImages} />
      </section>

      <section className={styles.section}>
        <label className={styles.label}>正文（支持 Markdown）</label>
        <textarea
          className={styles.editor}
          placeholder={'用 Markdown 写作\n\n## 支持标题、列表、代码块、表格…'}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </section>

      <section className={styles.section}>
        <label className={styles.label}>标签</label>
        <TagInput tags={tags} onChange={setTags} />
      </section>

      <section className={styles.section}>
        <label className={styles.label}>可见范围</label>
        <div className={styles.visibility}>
          {visibilityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={visible === opt.value ? styles.visibleActive : styles.visibleOption}
              onClick={() => setVisible(opt.value)}
            >
              <span className={styles.visibleLabel}>{opt.label}</span>
              <span className={styles.visibleHint}>{opt.hint}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}
