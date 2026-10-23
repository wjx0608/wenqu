import clsx from 'clsx'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Avatar, Button, Dropdown, DropdownItem, Icon } from '@/shared/ui'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/stores/toast'

import styles from './AppLayout.module.css'
import { ThemeToggle } from './ThemeToggle'

const navItems = [
  { to: '/', icon: 'home', label: '首页', end: true },
  { to: '/search', icon: 'search', label: '搜索' },
  { to: '/create', icon: 'compose', label: '创作' },
  { to: '/profile', icon: 'user', label: '我的' },
] as const

export function AppLayout() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.info('已退出登录')
    navigate('/')
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link to="/" className={styles.logo}>
          问渠
        </Link>
        <Link to="/search" className={styles.searchEntry}>
          <Icon name="search" size={15} />
          <span>搜索知文、标签或作者</span>
        </Link>
        <div className={styles.actions}>
          <ThemeToggle />
          {user ? (
            <>
              <Button size="sm" icon="compose" onClick={() => navigate('/create')}>
                发布知文
              </Button>
              <Dropdown trigger={<Avatar src={user.avatar} name={user.nickname} size={32} className={styles.avatarTrigger} />}>
                <DropdownItem icon="user" onClick={() => navigate('/profile')}>
                  个人主页
                </DropdownItem>
                <DropdownItem icon="compose" onClick={() => navigate('/profile/edit')}>
                  编辑资料
                </DropdownItem>
                <DropdownItem icon="logout" onClick={handleLogout}>
                  退出登录
                </DropdownItem>
              </Dropdown>
            </>
          ) : (
            <Button size="sm" onClick={() => navigate('/login')}>
              登录
            </Button>
          )}
        </div>
      </header>

      <div className={styles.body}>
        <nav className={styles.sidenav} aria-label="主导航">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={'end' in item && item.end}
              className={({ isActive }) => clsx(styles.navItem, isActive && styles.navActive)}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
