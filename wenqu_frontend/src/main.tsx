import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

// 字体本地加载（fontsource），标题宋体按 unicode-range 分片，仅按需下载
import '@fontsource/noto-serif-sc/400.css'
import '@fontsource/noto-serif-sc/600.css'
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'

import { Providers } from '@/app/Providers'
import { router } from '@/app/router'
import '@/styles/global.css'

const container = document.getElementById('root')

if (!container) {
  throw new Error('找不到根节点 #root，请检查 index.html')
}

createRoot(container).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
)
