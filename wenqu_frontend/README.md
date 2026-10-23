# 问渠前端（wenqu_frontend）

「问渠那得清如许，为有源头活水来」——技术内容分享平台前端。基于 React 19 + Vite + TypeScript 构建，对接 Spring Boot 后端 `/api/v1`。

## 技术栈

| 领域 | 选型 |
| --- | --- |
| 框架 | React 19 + TypeScript（strict） |
| 构建 | Vite 8（`@/` → `src/` 别名，dev 代理 `/api` → `localhost:8080`） |
| 路由 | React Router 7（`createBrowserRouter` + 路由守卫 + 错误边界） |
| 服务端状态 | TanStack Query 5（无限滚动用 `useInfiniteQuery`） |
| 客户端状态 | zustand（登录态 / 主题 / Toast） |
| 表单 | react-hook-form + zod |
| Markdown | react-markdown + remark-gfm + rehype-highlight |
| 样式 | CSS Modules + 设计 token（天青×竹纸，亮/暗双主题） |
| 字体 | fontsource 本地加载：Noto Serif SC（标题）/ Inter（正文）/ JetBrains Mono（代码） |

## 目录结构

```
src/
├── app/            # 入口、路由、Provider、404/错误边界
├── layouts/        # 应用外壳（顶栏 + 侧栏 + 内容区）
├── stores/         # zustand：auth / theme / toast
├── shared/
│   ├── api/        # apiFetch（token 注入、401 单例刷新重试）、streamSse
│   ├── types/      # 后端 API 契约类型（八个业务域）
│   ├── ui/         # 16 个基础组件（统一从 @/shared/ui 导入）
│   ├── hooks/      # useCountdown / useDebouncedValue / useIntersection
│   ├── utils/      # 时间解析、SHA-256
│   └── styles/     # tokens.css / global.css
├── features/       # 业务域
│   ├── auth/       # 登录 / 注册 / 找回密码 / 路由守卫
│   ├── feed/       # 首页内容流（无限滚动）与知文卡片
│   ├── post/       # 详情页、Markdown、图片灯箱、AI 伴读面板（SSE）
│   ├── editor/     # 创作发布（OSS 预签名直传五步流水线）
│   ├── profile/    # 个人主页、资料编辑、关注/粉丝列表
│   ├── search/     # 搜索联想 + 游标分页
│   ├── interaction/# 点赞 / 收藏
│   └── relation/   # 关注关系
└── dev/            # /dev/ui 组件自查页（仅开发环境注册路由）
```

## 常用命令

```powershell
npm run dev          # 开发服务器 http://localhost:5173
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run format       # Prettier 写入
npm run build        # 类型检查 + 生产构建
```

## 关键实现

- **认证**：RS256 双令牌（access 15min / refresh 7d），localStorage 持久化；401 时单例刷新并重试原请求，刷新失败自动清空登录态
- **AI 伴读**：`fetch + ReadableStream` 手写解析 `text/event-stream`，逐字渲染 Markdown，`AbortController` 可随时中止
- **发布流水线**：建草稿 → 图片预签名直传 OSS → 正文 .md 直传并回执（SHA-256 校验）→ 补元数据 → 发布
- **主题**：亮 / 暗 / 跟随系统三态，`index.html` 内联脚本防首屏闪烁
