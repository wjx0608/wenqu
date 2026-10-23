import { z } from 'zod'

export const phoneSchema = z.string().regex(/^1[3-9]\d{9}$/, '请输入正确的手机号')

export const codeSchema = z.string().regex(/^\d{4,8}$/, '验证码为 4-8 位数字')

export const passwordSchema = z
  .string()
  .min(8, '密码至少 8 位')
  .max(64, '密码最多 64 位')
  .regex(/^(?=.*[A-Za-z])(?=.*\d)/, '密码需同时包含字母和数字')
