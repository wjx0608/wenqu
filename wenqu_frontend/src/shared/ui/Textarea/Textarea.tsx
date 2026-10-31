import clsx from 'clsx'
import { useEffect, useId, useRef, type Ref, type TextareaHTMLAttributes } from 'react'

import styles from './Textarea.module.css'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  /** 随内容自动增高，超过 maxHeight 后内部滚动 */
  autoResize?: boolean
  /** 显示字数计数，需要配合 maxLength */
  showCount?: boolean
  /** 自动增高时的最大高度（px） */
  maxHeight?: number
  ref?: Ref<HTMLTextAreaElement>
}

export function Textarea({
  label,
  error,
  hint,
  id,
  className,
  ref,
  rows = 4,
  autoResize = false,
  showCount = false,
  maxHeight = 240,
  maxLength,
  value,
  ...rest
}: TextareaProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const innerRef = useRef<HTMLTextAreaElement | null>(null)

  const assignRef = (node: HTMLTextAreaElement | null) => {
    innerRef.current = node
    if (typeof ref === 'function') ref(node)
    else if (ref) (ref as unknown as { current: HTMLTextAreaElement | null }).current = node
  }

  // 内容变化时重算高度：先归零再按 scrollHeight 撑开，避免删字后高度不回收
  useEffect(() => {
    if (!autoResize) return
    const el = innerRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
  }, [autoResize, maxHeight, value])

  const length = typeof value === 'string' ? value.length : 0
  const hasFooter = Boolean(error || hint || (showCount && maxLength))

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
        maxLength={maxLength}
        value={value}
        className={clsx(styles.textarea, autoResize && styles.auto, error && styles.hasError)}
        ref={assignRef}
        {...rest}
      />
      {hasFooter && (
        <div className={styles.footer}>
          <span className={styles.message}>
            {error ? (
              <span className={styles.error}>{error}</span>
            ) : hint ? (
              <span className={styles.hint}>{hint}</span>
            ) : null}
          </span>
          {showCount && maxLength ? (
            <span className={clsx(styles.count, maxLength - length <= 20 && styles.countWarn)}>
              {length}/{maxLength}
            </span>
          ) : null}
        </div>
      )}
    </div>
  )
}
