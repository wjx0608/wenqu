# 问渠后端（wenqu_backend）

问渠平台的服务端工程：内容发布与检索、关注关系与计数、多级缓存读路径、RAG 智能问答。

## 技术栈

Java 21 · Spring Boot 3 · Spring Security（JWT / RS256）· Spring AI · MyBatis · MySQL · Redis · Kafka · Canal · Elasticsearch · Caffeine · 阿里云 OSS

## 模块划分

| 包 | 职责 |
| --- | --- |
| `com.wenqu.auth` | 注册登录、双令牌签发与刷新、验证码、登录审计 |
| `com.wenqu.user` / `profile` | 用户实体、资料读写、头像上传 |
| `com.wenqu.knowpost` | 知文创作、发布流水线、Feed 与详情、RAG 索引入口 |
| `com.wenqu.counter` | 点赞收藏计数（Redis SDS + 位图）、异步聚合与灾备回放 |
| `com.wenqu.relation` | 关注关系、Outbox + Canal 事件驱动同步 |
| `com.wenqu.search` | Elasticsearch 检索、联想建议、索引构建 |
| `com.wenqu.cache` | 三级缓存与热点探测 |
| `com.wenqu.llm` | 摘要生成、向量索引与流式问答 |
| `com.wenqu.storage` | 对象存储预签名直传 |
| `com.wenqu.common` | 统一异常、错误码、Outbox 工具 |

## 本地启动

1. 初始化数据库（库名 `wenqu`）：

   ```bash
   mysql -uroot -p < db/schema.sql
   ```

2. 启动依赖服务：MySQL、Redis、Kafka、Elasticsearch、Canal（Canal 仅在需要事件同步时启动）。

3. 配置环境变量（见下表），未设置的项回落到本地默认值。

4. 启动应用：

   ```bash
   mvn spring-boot:run
   ```

   默认端口 `8080`，接口前缀 `/api/v1`。

## 环境变量

| 变量 | 说明 | 本地默认 |
| --- | --- | --- |
| `MYSQL_USERNAME` / `MYSQL_PASSWORD` | 数据库账号 | `root` / `123456` |
| `DEEPSEEK_API_KEY` | 摘要生成所用大模型密钥 | 空 |
| `DASHSCOPE_API_KEY` | 向量模型密钥 | 空 |
| `CANAL_USERNAME` / `CANAL_PASSWORD` | Canal 账号 | `canal` / `canal` |
| `OSS_ENDPOINT` / `OSS_BUCKET` | 对象存储端点与桶名 | 见 `application.yml` |
| `OSS_ACCESS_KEY_ID` / `OSS_ACCESS_KEY_SECRET` | 对象存储访问密钥 | 空 |
| `OSS_PUBLIC_DOMAIN` | 对象存储公网域名 | 空 |

> 仓库不保存任何真实密钥；`resources/keys/` 下的 RSA 密钥对仅用于本地开发，生产环境需自行生成并替换。

## 设计要点

- **认证**：RS256 双令牌（访问令牌 15 分钟 / 刷新令牌 7 天），刷新令牌以 Redis 白名单管理，支持即时吊销。
- **计数**：点赞与收藏按条目维度、关注按用户维度写入 Redis，自定义 SDS 结构做紧凑编码，Lua 脚本保证原子性，支持采样校验与自愈重建。
- **发布**：渐进式流程——草稿 → 图片直传 OSS → 正文直传并回执校验 → 元数据 → 发布；接入大模型生成摘要。
- **用户关系**：一主多从 + 事件驱动，关注写入与 Outbox 同事务，Canal 订阅 binlog 后投递 Kafka 异步更新计数与列表缓存。
- **点赞**：异步写 + 写聚合应对高并发，位图实现幂等判重，读路径异常时按需重建，Kafka 回放作为灾备兜底。
- **Feed**：本地 Caffeine + Redis 页面缓存 + Redis 片段缓存三级结构，自定义热点探测按层级延长 TTL 并叠加抖动，单飞锁避免并发回源。
- **搜索**：Elasticsearch 关键词检索 + 标签过滤，`search_after` 游标分页，`function_score` 融合相关性与业务权重，completion suggester 提供前缀联想。
- **问答**：单篇知文的 RAG 链路——索引检查 → 向量检索 → Prompt 构造 → 流式生成，分块与幂等删除保证单一版本，预索引降低首次提问等待。

## 接口文档

`docs/` 目录下按业务域维护接口说明与设计方案：

- `API接口文档.md`：认证、资料、动作与计数
- `API接口文档_knowpost.md`：知文创作、Feed、详情与问答
- `API接口文档_用户关系.md`：关注关系
- `API接口文档_计数.md`：计数读取
- `用户关系设计方案.md`、`计数系统设计方案.md`：关键设计说明
