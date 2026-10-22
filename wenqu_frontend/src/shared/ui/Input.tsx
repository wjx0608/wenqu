import type { InputHTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'

import styles from './Input.module.css'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** 字段标题 */
  label?: string
  /** 辅助说明，错误存在时不展示 */
  hint?: string
  /** 错误信息，存在即进入错误态 */
  error?: string
  /** 输入框左侧内容（图标或单位） */
  prefix?: ReactNode
  /** 输入框右侧内容（单位或操作） */
  suffix?: ReactNode
  /** 是否必填，仅在 label 上做标记 */
  required?: boolean
}

export function Input({
  label,
  hint,
  error,
  prefix,
  suffix,
  required,
  id,
  className,
  disabled,
  ...rest
}: InputProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div
        className={[styles.control, error ? styles.invalid : ''].filter(Boolean).join(' ')}
        data-disabled={disabled || undefined}
      >
        {prefix && <span className={styles.affix}>{prefix}</span>}
        <input
          {...rest}
          id={inputId}
          className={styles.input}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
        {suffix && <span className={styles.affix}>{suffix}</span>}
      </div>

      {error ? (
        <span id={`${inputId}-error`} className={styles.error} role="alert">
          {error}
        </span>
      ) : (
        hint && (
          <span id={`${inputId}-hint`} className={styles.hint}>
            {hint}
          </span>
        )
      )}
    </div>
  )
}
