import clsx from 'clsx'
import { useState } from 'react'

import styles from './Avatar.module.css'

export interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: number
  className?: string
}

export function Avatar({ src, name, size = 32, className }: AvatarProps) {
  const [broken, setBroken] = useState(false)
  const showImage = src && !broken
  const initial = name?.trim().charAt(0) ?? '问'

  return (
    <span
      className={clsx(styles.avatar, className)}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {showImage ? (
        <img src={src} alt={name ?? '头像'} loading="lazy" onError={() => setBroken(true)} />
      ) : (
        <span className={styles.initial}>{initial}</span>
      )}
    </span>
  )
}
