import { Link } from 'react-router-dom'

import { Button, Card, EmptyState, Icon } from '@/shared/ui'

export function NotFoundPage() {
  return (
    <Card padding="none">
      <EmptyState
        icon={<Icon name="search" size={22} />}
        title="页面不存在"
        description="链接可能已经失效，或者这篇知文已被作者设为私密。"
        action={
          <Link to="/">
            <Button variant="secondary" size="sm">
              回到首页
            </Button>
          </Link>
        }
      />
    </Card>
  )
}
