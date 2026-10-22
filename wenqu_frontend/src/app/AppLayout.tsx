import { Link, NavLink, Outlet } from 'react-router-dom'

import { ThemeToggle } from '@/shared/theme/ThemeToggle'
import { Button } from '@/shared/ui'

import styles from './AppLayout.module.css'

const navItems = [
  { to: '/', label: '首页', end: true },
  { to: '/search', label: '搜索' },
  { to: '/learn', label: '我的学习' },
  { to: '/profile', label: '个人主页' },
]

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          问渠
          <span className={styles.brandNote}>有源之问，方有清渠之答</span>
        </Link>

        <Link to="/search" className={styles.search} aria-label="搜索">
          搜索知文、作者或标签
        </Link>

        <div className={styles.headerActions}>
          <ThemeToggle />
          <Button size="sm">写知文</Button>
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
              {item.label}
            </NavLink>
          ))}
        </div>

        <hr className={styles.navDivider} />

        <div className={styles.navGroup}>
          <span className={styles.navLabel}>分区</span>
          <span className={styles.navLabel}>后端 · 前端 · AI · 数据库</span>
          <span className={styles.navLabel}>阶段 4 按标签生成</span>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.mainInner}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}
