import clsx from 'clsx'
import { createPortal } from 'react-dom'

import { useToastStore } from '@/stores/toast'

import { Icon } from '../Icon/Icon'
import styles from './ToastHost.module.css'

const icons = { success: 'check', error: 'close', info: 'message' } as const

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts)
  const remove = useToastStore((s) => s.remove)

  if (toasts.length === 0) return null

  return createPortal(
    <div className={styles.host} role="status" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} className={clsx(styles.toast, styles[t.type])} onClick={() => remove(t.id)}>
          <Icon name={icons[t.type]} size={15} />
          <span>{t.message}</span>
        </button>
      ))}
    </div>,
    document.body,
  )
}
