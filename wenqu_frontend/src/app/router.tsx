import { createBrowserRouter } from 'react-router-dom'

import { UiGallery } from '@/dev/UiGallery'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <div style={{ padding: 40 }}>问渠 · 首页重构中</div>,
  },
  {
    path: '/dev/ui',
    element: <UiGallery />,
  },
])
