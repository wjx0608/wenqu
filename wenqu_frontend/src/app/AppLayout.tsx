import { Link, NavLink, Outlet } from 'react-router-dom'

import { Button, Icon } from '@/shared/ui'
import type { IconName } from '@/shared/ui'
import { ThemeToggle } from '@/shared/theme/ThemeToggle'

import styles from './AppLayout.module.css'

interface NavItem {
  to: string
  label: string
  icon: IconName
  end?: boolean
}

const navItems: NavItem[] = [
  { to: '/', label: '首页', icon: 'home', end: true },
  { to: '/search', label: '搜索', icon: 'search' },
  { to: '/learn', label: '我的学习', icon: 'bookmark' },
  { to: '/profile', label: '个人主页', icon: 'user' },
]

const sections = ['后端', '前端', 'AI', '数据库']

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandName}>问渠</span>
          <span className={styles.brandNote}>有源之问，方有清渠之答</span>
        </Link>

        <Link to="/search" className={styles.search} aria-label="搜索知文、作者或标签">
          <Icon name="search" size={16} />
          <span className={styles.searchText}>搜索知文、作者或标签</span>
        </Link>

        <div className={styles.actions}>
          <ThemeToggle />
          <Button size="sm">
            <Icon name="penLine" size={15} />
            写知文
          </Button>
        </div>
      </header>

      <nav className={styles.nav} aria-label="主导航">
        <div className={styles.navGroup}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [styles.navItem, isActive ? styles.navItemActive : ''].filter(Boolean).join(' ')
              }
            >
              <Icon name={item.icon} size={17} className={styles.navIcon} />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className={styles.navGroup}>
          <p className={styles.navLabel}>分区</p>
          {sections.map((name) => (
            <Link
              key={name}
              to={`/search?tag=${encodeURIComponent(name)}`}
              className={styles.navSubItem}
            >
              <span className={styles.navDot} aria-hidden="true" />
              {name}
            </Link>
          ))}
        </div>

        <p className={styles.navFoot}>问渠 · 0.1</p>
      </nav>

      <main className={styles.main}>
        <div className={styles.mainInner}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
