# 问渠

> 有源之问，方有清渠之答

面向技术内容创作、检索与智能问答的内容分享平台。平台以「多级缓存 + 检索增强生成（RAG）」为核心：
读路径由本地缓存、Redis 页面缓存与条目缓存分层承载，长文阅读场景提供基于向量检索的流式问答，
并给出可回溯的引用来源。

## 技术栈

| 层面 | 选型 |
| --- | --- |
| 前端 | React 19 · TypeScript · Vite · TanStack Query · React Router |
| 后端 | Java 21 · Spring Boot 3 · Spring Security · Spring AI |
| 存储 | MySQL · Redis · Elasticsearch |
| 中间件 | Kafka · Canal · 阿里云 OSS |

## 目录结构

```
wenqu/
├── wenqu_frontend/   # 前端
└── wenqu_backend/    # 后端
```

## 本地启动

```bash
cd wenqu_frontend
npm install
npm run dev
```

前端默认端口 `5173`，`/api` 请求代理到 `http://localhost:8080`。

## 开发进度

- [x] 阶段 0：仓库初始化与前端工程搭建
- [ ] 阶段 1：工程规范与设计系统
- [ ] 阶段 2：应用外壳与路由
- [ ] 阶段 3：认证与登录态
- [ ] 阶段 4：内容流与详情页
- [ ] 阶段 5：AI 伴读（流式问答 + 引用定位）
- [ ] 阶段 6：创作与个人中心
- [ ] 阶段 7：搜索
- [ ] 阶段 8：质量保障与部署
