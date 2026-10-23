import clsx from 'clsx'
import type { ButtonHTMLAttributes } from 'react'

import { Icon, type IconName } from '../Icon/Icon'
import styles from './IconButton.module.css'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName
  label: string
  size?: number
  active?: boolean
}

export function IconButton({ icon, label, size = 18, active = false, className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      className={clsx(styles.button, active && styles.active, className)}
      title={label}
      aria-label={label}
      {...rest}
    >
      <Icon name={icon} size={size} />
    </button>
  )
}
