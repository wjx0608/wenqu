import { Link } from 'react-router-dom'

import { Button, EmptyState } from '@/shared/ui'

export function NotFoundPage() {
  return (
    <div style={{ padding: '64px 0' }}>
      <EmptyState
        icon="search"
        title="页面不存在"
        description="你访问的页面可能已被移动或删除"
        action={
          <Link to="/">
            <Button>返回首页</Button>
          </Link>
        }
      />
    </div>
  )
}
