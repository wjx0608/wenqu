import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { IconButton } from '../IconButton/IconButton'
import styles from './Modal.module.css'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  width?: number
  children: ReactNode
  footer?: ReactNode
}

export function Modal({ open, onClose, title, width = 480, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        className={styles.dialog}
        style={{ maxWidth: width }}
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title && (
          <header className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            <IconButton icon="close" label="关闭" onClick={onClose} />
          </header>
        )}
        <div className={styles.body}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  )
}
