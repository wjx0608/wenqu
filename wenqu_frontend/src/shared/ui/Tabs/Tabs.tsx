import clsx from 'clsx'

import styles from './Tabs.module.css'

export interface TabItem {
  key: string
  label: string
}

export interface TabsProps {
  items: TabItem[]
  activeKey: string
  onChange: (key: string) => void
}

export function Tabs({ items, activeKey, onChange }: TabsProps) {
  return (
    <div className={styles.tabs} role="tablist">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          role="tab"
          aria-selected={item.key === activeKey}
          className={clsx(styles.tab, item.key === activeKey && styles.active)}
          onClick={() => onChange(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
