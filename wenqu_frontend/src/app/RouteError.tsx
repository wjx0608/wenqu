import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

import { Button } from '@/shared/ui'

import styles from './RouteError.module.css'

export function RouteError() {
  const error = useRouteError()

  const detail = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : '未知错误'

  return (
    <div className={styles.root}>
      <h1 className={styles.title}>页面出错了</h1>
      <p className={styles.detail}>{detail}</p>
      <p className={styles.hint}>
        如果是刷新后出现，请检查开发服务器是否正常；开发期错误详情也会打印在浏览器控制台。
      </p>
      <Button onClick={() => window.location.reload()}>重新加载</Button>
    </div>
  )
}
