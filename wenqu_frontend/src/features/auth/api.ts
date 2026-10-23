import { apiFetch } from '@/shared/api/client'
import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  PasswordResetRequest,
  RegisterRequest,
  SendCodeRequest,
  SendCodeResponse,
} from '@/shared/types/api'

export function sendCode(body: SendCodeRequest): Promise<SendCodeResponse> {
  return apiFetch('/api/v1/auth/send-code', { method: 'POST', body, auth: false })
}

export function register(body: RegisterRequest): Promise<AuthResponse> {
  return apiFetch('/api/v1/auth/register', { method: 'POST', body, auth: false })
}

export function login(body: LoginRequest): Promise<AuthResponse> {
  return apiFetch('/api/v1/auth/login', { method: 'POST', body, auth: false })
}

export function logout(refreshToken: string): Promise<void> {
  return apiFetch('/api/v1/auth/logout', { method: 'POST', body: { refreshToken }, auth: false })
}

export function resetPassword(body: PasswordResetRequest): Promise<void> {
  return apiFetch('/api/v1/auth/password/reset', { method: 'POST', body, auth: false })
}

export function fetchCurrentUser(): Promise<AuthUser> {
  return apiFetch('/api/v1/auth/me')
}
