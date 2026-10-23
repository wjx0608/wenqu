import clsx from 'clsx'
import { useId, type Ref, type TextareaHTMLAttributes } from 'react'

import styles from './Textarea.module.css'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  ref?: Ref<HTMLTextAreaElement>
}

export function Textarea({ label, error, hint, id, className, ref, rows = 4, ...rest }: TextareaProps) {
  const autoId = useId()
  const inputId = id ?? autoId

  return (
    <div className={clsx(styles.field, className)}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={clsx(styles.textarea, error && styles.hasError)}
        ref={ref}
        {...rest}
      />
      {error ? (
        <p className={styles.error}>{error}</p>
      ) : hint ? (
        <p className={styles.hint}>{hint}</p>
      ) : null}
    </div>
  )
}
