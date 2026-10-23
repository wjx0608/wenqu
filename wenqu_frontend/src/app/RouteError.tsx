import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

import { Button, EmptyState } from '@/shared/ui'

export function RouteError() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : '页面出了点问题，请稍后再试'

  return (
    <div style={{ padding: '64px 0' }}>
      <EmptyState
        icon="refresh"
        title="页面加载出错"
        description={message}
        action={<Button onClick={() => window.location.reload()}>刷新重试</Button>}
      />
    </div>
  )
}
