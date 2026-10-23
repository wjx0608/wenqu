import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { Icon, type IconName } from '../Icon/Icon'
import { Spinner } from '../Spinner/Spinner'
import styles from './Button.module.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  icon?: IconName
  iconRight?: IconName
  loading?: boolean
  fullWidth?: boolean
  children?: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(styles.button, styles[variant], styles[size], fullWidth && styles.fullWidth, className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Spinner size={size === 'sm' ? 14 : 16} /> : icon ? <Icon name={icon} size={size === 'sm' ? 14 : 16} /> : null}
      {children != null && <span className={styles.label}>{children}</span>}
      {!loading && iconRight ? <Icon name={iconRight} size={size === 'sm' ? 14 : 16} /> : null}
    </button>
  )
}
