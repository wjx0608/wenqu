import clsx from 'clsx'
import { useEffect, useRef, useState, type ReactNode } from 'react'

import { Icon, type IconName } from '../Icon/Icon'
import styles from './Dropdown.module.css'

export interface DropdownProps {
  trigger: ReactNode
  align?: 'left' | 'right'
  children: ReactNode
}

export function Dropdown({ trigger, align = 'right', children }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={styles.root} ref={rootRef}>
      <span className={styles.trigger} onClick={() => setOpen((v) => !v)}>
        {trigger}
      </span>
      {open && (
        <div className={clsx(styles.menu, styles[align])} role="menu" onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  )
}

export interface DropdownItemProps {
  icon?: IconName
  danger?: boolean
  onClick: () => void
  children: ReactNode
}

export function DropdownItem({ icon, danger = false, onClick, children }: DropdownItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      className={clsx(styles.item, danger && styles.danger)}
      onClick={onClick}
    >
      {icon && <Icon name={icon} size={15} />}
      {children}
    </button>
  )
}
