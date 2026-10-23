import clsx from 'clsx'

import styles from './Skeleton.module.css'

export interface SkeletonProps {
  width?: number | string
  height?: number | string
  circle?: boolean
  className?: string
}

export function Skeleton({ width, height = 14, circle = false, className }: SkeletonProps) {
  return (
    <span
      className={clsx(styles.skeleton, circle && styles.circle, className)}
      style={{ width, height: circle ? width : height }}
      aria-hidden="true"
    />
  )
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <span className={clsx(styles.textBlock, className)} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </span>
  )
}
