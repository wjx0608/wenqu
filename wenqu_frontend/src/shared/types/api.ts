/* ============================================================
 * 后端 API 契约类型（对齐 Spring Boot /api/v1 各域 Controller）
 * 注意：成功响应无包装层，直接消费 body；错误为 { code, message }
 * ============================================================ */

/* ---------- 通用 ---------- */

export interface ApiErrorBody {
  code: string
  message: string
}

/* ---------- 认证 auth ---------- */

export type IdentifierType = 'PHONE' | 'EMAIL'
export type VerificationScene = 'REGISTER' | 'LOGIN' | 'RESET_PASSWORD'
export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'UNKNOWN'

export interface SendCodeRequest {
  scene: VerificationScene
  identifierType: IdentifierType
  identifier: string
}

export interface SendCodeResponse {
  identifier: string
  scene: VerificationScene
  expireSeconds: number
}

export interface RegisterRequest {
  identifierType: IdentifierType
  identifier: string
  code: string
  password: string
  agreeTerms: boolean
}

/** 登录：验证码 / 密码二选一 */
export type LoginRequest =
  | { identifierType: IdentifierType; identifier: string; code: string }
  | { identifierType: IdentifierType; identifier: string; password: string }

export interface PasswordResetRequest {
  identifierType: IdentifierType
  identifier: string
  code: string
  newPassword: string
}

/** 后端返回 ISO 时间字符串 */
export interface TokenResponse {
  accessToken: string
  accessTokenExpiresAt: string
  refreshToken: string
  refreshTokenExpiresAt: string
}

export interface AuthUser {
  id: number
  nickname: string
  avatar?: string | null
  phone?: string | null
  email?: string | null
  zhId?: string | null
  birthday?: string | null
  school?: string | null
  bio?: string | null
  gender?: Gender | null
  tagJson?: string | null
}

export interface AuthResponse {
  user: AuthUser
  token: TokenResponse
}

/* ---------- 用户资料 profile ---------- */

export interface Profile {
  id: number
  nickname: string
  avatar?: string | null
  bio?: string | null
  zgId?: string | null
  gender?: Gender | null
  birthday?: string | null
  school?: string | null
  phone?: string | null
  email?: string | null
  tagJson?: string | null
}

export interface ProfilePatchRequest {
  nickname?: string
  bio?: string
  gender?: Gender
  birthday?: string
  zgId?: string
  school?: string
  tagJson?: string
}

/* ---------- 知文 knowpost ---------- */

export type Visibility = 'public' | 'followers' | 'school' | 'private' | 'unlisted'

export interface FeedItem {
  id: string
  title: string
  description?: string | null
  coverImage?: string | null
  tags: string[]
  authorId?: number | null
  authorAvatar?: string | null
  authorNickname: string
  authorTagJson?: string | null
  likeCount: number
  favoriteCount: number
  liked?: boolean
  faved?: boolean
  isTop?: boolean
  visible?: Visibility
}

export interface FeedPage {
  items: FeedItem[]
  page: number
  size: number
  hasMore: boolean
}

export interface PostDetail {
  id: string
  title: string
  description?: string | null
  contentUrl: string
  images: string[]
  tags: string[]
  authorId: number
  authorAvatar?: string | null
  authorNickname: string
  authorTagJson?: string | null
  likeCount: number
  favoriteCount: number
  liked?: boolean
  faved?: boolean
  isTop: boolean
  visible: Visibility
  type: string
  publishTime?: string | null
}

export interface KnowPostPatchRequest {
  title?: string
  tagId?: string
  tags?: string[]
  imgUrls?: string[]
  visible?: Visibility
  isTop?: boolean
  description?: string
}

/* ---------- 计数 counter / 动作 action ---------- */

export type ActionEntityType = 'knowpost'

export interface ActionRequest {
  entityType: ActionEntityType
  entityId: string
}

export interface ActionResult {
  changed: boolean
  liked?: boolean
  faved?: boolean
}

export interface CountsResponse {
  entityType: string
  entityId: string
  counts: Record<string, number>
}

/* ---------- 关注关系 relation ---------- */

export interface RelationStatus {
  following: boolean
  followedBy: boolean
  mutual: boolean
}

export interface RelationCounter {
  followings: number
  followers: number
  posts: number
  likedPosts: number
  favedPosts: number
}

/* ---------- 搜索 search ---------- */

export interface SearchResponse {
  items: FeedItem[]
  nextAfter: string | null
  hasMore: boolean
}

export interface SuggestResponse {
  items: string[]
}

/* ---------- 存储 storage ---------- */

export type StorageScene = 'knowpost_content' | 'knowpost_image'

export interface StoragePresignRequest {
  scene: StorageScene
  postId: string
  contentType: string
  ext?: string
}

export interface StoragePresignResponse {
  objectKey: string
  putUrl: string
  headers: Record<string, string>
  expiresIn: number
}

export interface ContentConfirmRequest {
  objectKey: string
  etag: string
  size: number
  sha256: string
}

/* ---------- AI ---------- */

export interface DescriptionSuggestResponse {
  description: string
}
