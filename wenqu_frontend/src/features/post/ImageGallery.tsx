import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import { IconButton } from '@/shared/ui'

import styles from './ImageGallery.module.css'

const MAX_THUMBS = 4

export function ImageGallery({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  useEffect(() => {
    if (activeIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null)
      if (e.key === 'ArrowLeft') setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length))
      if (e.key === 'ArrowRight') setActiveIndex((i) => (i === null ? null : (i + 1) % images.length))
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [activeIndex, images.length])

  if (images.length === 0) return null

  const thumbs = images.slice(0, MAX_THUMBS)
  const rest = images.length - MAX_THUMBS

  return (
    <>
      <div className={styles.strip} data-count={thumbs.length}>
        {thumbs.map((src, i) => (
          <button key={src} type="button" className={styles.thumb} onClick={() => setActiveIndex(i)}>
            <img src={src} alt={`配图 ${i + 1}`} loading="lazy" />
            {i === MAX_THUMBS - 1 && rest > 0 && <span className={styles.more}>+{rest}</span>}
          </button>
        ))}
      </div>

      {activeIndex !== null &&
        createPortal(
          <div className={styles.lightbox} onClick={() => setActiveIndex(null)}>
            <img
              src={images[activeIndex]}
              alt={`配图 ${activeIndex + 1}`}
              onClick={(e) => e.stopPropagation()}
            />
            <IconButton icon="close" label="关闭" className={styles.closeBtn} onClick={() => setActiveIndex(null)} />
            {images.length > 1 && (
              <>
                <IconButton
                  icon="arrowLeft"
                  label="上一张"
                  className={styles.prevBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveIndex((activeIndex - 1 + images.length) % images.length)
                  }}
                />
                <IconButton
                  icon="arrowRight"
                  label="下一张"
                  className={styles.nextBtn}
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveIndex((activeIndex + 1) % images.length)
                  }}
                />
              </>
            )}
            <span className={styles.counter}>
              {activeIndex + 1} / {images.length}
            </span>
          </div>,
          document.body,
        )}
    </>
  )
}
