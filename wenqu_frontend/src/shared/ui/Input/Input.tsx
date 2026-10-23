import clsx from 'clsx'
import { useId, type InputHTMLAttributes, type Ref } from 'react'

import { Icon, type IconName } from '../Icon/Icon'
import styles from './Input.module.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: IconName
  ref?: Ref<HTMLInputElement>
}

export function Input({ label, error, hint, leftIcon, id, className, ref, ...rest }: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div className={clsx(styles.field, className)}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={clsx(styles.control, error && styles.hasError)}>
        {leftIcon && (
          <span className={styles.leftIcon}>
            <Icon name={leftIcon} size={16} />
          </span>
        )}
        <input id={inputId} className={styles.input} ref={ref} {...rest} />
      </div>
      {error ? (
        <p className={styles.error}>{error}</p>
      ) : hint ? (
        <p className={styles.hint}>{hint}</p>
      ) : null}
    </div>
  )
}
