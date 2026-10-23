import clsx from 'clsx'

import styles from './Switch.module.css'

export interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  label?: string
}

export function Switch({ checked, onChange, disabled = false, label }: SwitchProps) {
  return (
    <label className={clsx(styles.wrap, disabled && styles.disabled)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={clsx(styles.track, checked && styles.on)}
        disabled={disabled}
        onClick={() => onChange(!checked)}
      >
        <span className={styles.thumb} />
      </button>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
