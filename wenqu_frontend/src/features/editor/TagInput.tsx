import { useState } from 'react'

import { Tag } from '@/shared/ui'

import styles from './TagInput.module.css'

const MAX_TAGS = 20

export function TagInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [value, setValue] = useState('')

  const add = () => {
    const tag = value.trim().replace(/^#/, '')
    if (!tag || tags.includes(tag) || tags.length >= MAX_TAGS) return
    onChange([...tags, tag])
    setValue('')
  }

  return (
    <div className={styles.root}>
      <div className={styles.tags}>
        {tags.map((tag) => (
          <Tag key={tag} color="brand" onRemove={() => onChange(tags.filter((t) => t !== tag))}>
            {tag}
          </Tag>
        ))}
      </div>
      <input
        className={styles.input}
        placeholder={tags.length === 0 ? '输入标签后回车添加，如：缓存、RAG' : '继续添加'}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ',') && !e.nativeEvent.isComposing) {
            e.preventDefault()
            add()
          }
          if (e.key === 'Backspace' && value === '' && tags.length > 0) {
            onChange(tags.slice(0, -1))
          }
        }}
        onBlur={add}
      />
      <span className={styles.count}>
        {tags.length}/{MAX_TAGS}
      </span>
    </div>
  )
}
