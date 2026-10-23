import type { ReactNode } from 'react'

import styles from './AuthLayout.module.css'

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.panel}>
        <header className={styles.brand}>
          <span className={styles.logo}>问渠</span>
          <span className={styles.tagline}>问渠那得清如许，为有源头活水来</span>
        </header>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}
