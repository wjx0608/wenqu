import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { AuthLayout } from '@/features/auth/AuthLayout'
import { login, sendCode } from '@/features/auth/api'
import { codeSchema, passwordSchema, phoneSchema } from '@/features/auth/schemas'
import { isApiError } from '@/shared/api/error'
import { useCountdown } from '@/shared/hooks/useCountdown'
import { Button, Input, Tabs } from '@/shared/ui'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/stores/toast'

import styles from './auth-form.module.css'

const loginSchema = z
  .object({
    phone: phoneSchema,
    code: z.string().optional(),
    password: z.string().optional(),
    mode: z.enum(['code', 'password']),
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'code') {
      const r = codeSchema.safeParse(data.code ?? '')
      if (!r.success) ctx.addIssue({ code: 'custom', path: ['code'], message: r.error.issues[0].message })
    } else {
      const r = passwordSchema.safeParse(data.password ?? '')
      if (!r.success) ctx.addIssue({ code: 'custom', path: ['password'], message: r.error.issues[0].message })
    }
  })

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useAuthStore((s) => s.setSession)
  const countdown = useCountdown()
  const [mode, setMode] = useState<'code' | 'password'>('code')
  const [submitting, setSubmitting] = useState(false)

  const {
    register: field,
    handleSubmit,
    getValues,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { mode: 'code' },
  })

  const from = (location.state as { from?: string } | null)?.from ?? '/'

  const switchMode = (key: string) => {
    const next = key as 'code' | 'password'
    setMode(next)
    setValue('mode', next)
  }

  const handleSendCode = async () => {
    if (!(await trigger('phone'))) return
    try {
      const res = await sendCode({ scene: 'LOGIN', identifierType: 'PHONE', identifier: getValues('phone') })
      countdown.start(res.expireSeconds)
      toast.success('验证码已发送')
    } catch (e) {
      toast.error(isApiError(e) ? e.message : '发送失败，请稍后再试')
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true)
    try {
      const auth = await login(
        data.mode === 'code'
          ? { identifierType: 'PHONE', identifier: data.phone, code: data.code! }
          : { identifierType: 'PHONE', identifier: data.phone, password: data.password! },
      )
      setSession(auth)
      toast.success(`欢迎回来，${auth.user.nickname}`)
      navigate(from, { replace: true })
    } catch (e) {
      toast.error(isApiError(e) ? e.message : '登录失败，请稍后再试')
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <AuthLayout title="登录" subtitle="登录后可发布知文、使用 AI 伴读">
      <Tabs
        items={[
          { key: 'code', label: '验证码登录' },
          { key: 'password', label: '密码登录' },
        ]}
        activeKey={mode}
        onChange={switchMode}
      />
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <Input label="手机号" placeholder="请输入手机号" leftIcon="phone" error={errors.phone?.message} {...field('phone')} />
        {mode === 'code' ? (
          <div className={styles.codeRow}>
            <Input
              label="验证码"
              placeholder="短信验证码"
              leftIcon="key"
              error={errors.code?.message}
              {...field('code')}
            />
            <Button
              type="button"
              variant="secondary"
              className={styles.codeButton}
              disabled={countdown.running}
              onClick={handleSendCode}
            >
              {countdown.running ? `${countdown.seconds}s` : '获取验证码'}
            </Button>
          </div>
        ) : (
          <Input
            label="密码"
            type="password"
            placeholder="请输入密码"
            leftIcon="lock"
            error={errors.password?.message}
            {...field('password')}
          />
        )}
        <Button type="submit" size="lg" fullWidth loading={submitting}>
          登录
        </Button>
        <div className={styles.links}>
          <Link to="/reset-password">忘记密码</Link>
          <Link to="/register">注册新账号</Link>
        </div>
      </form>
    </AuthLayout>
  )
}
