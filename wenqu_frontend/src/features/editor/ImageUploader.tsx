import { useEffect, useRef } from 'react'

import { Icon, IconButton } from '@/shared/ui'

import styles from './ImageUploader.module.css'

const MAX_IMAGES = 15

export interface LocalImage {
  file: File
  preview: string
}

export function ImageUploader({
  images,
  onChange,
}: {
  images: LocalImage[]
  onChange: (images: LocalImage[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  // 卸载时释放所有预览 URL
  useEffect(() => {
    return () => images.forEach((img) => URL.revokeObjectURL(img.preview))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const room = MAX_IMAGES - images.length
    const next = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, room)
      .map((file) => ({ file, preview: URL.createObjectURL(file) }))
    onChange([...images, ...next])
    if (inputRef.current) inputRef.current.value = ''
  }

  const remove = (index: number) => {
    URL.revokeObjectURL(images[index].preview)
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className={styles.grid}>
      {images.map((img, i) => (
        <div key={img.preview} className={styles.cell}>
          <img src={img.preview} alt={`待上传图片 ${i + 1}`} />
          {i === 0 && <span className={styles.coverBadge}>封面</span>}
          <IconButton icon="close" label="移除图片" className={styles.remove} onClick={() => remove(i)} />
        </div>
      ))}
      {images.length < MAX_IMAGES && (
        <button type="button" className={styles.add} onClick={() => inputRef.current?.click()}>
          <Icon name="image" size={20} />
          <span>
            添加图片 {images.length}/{MAX_IMAGES}
          </span>
          <span className={styles.tip}>首图将作为封面</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
