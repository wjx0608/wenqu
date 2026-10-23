import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { AuthLayout } from '@/features/auth/AuthLayout'
import { register as apiRegister, sendCode } from '@/features/auth/api'
import { codeSchema, passwordSchema, phoneSchema } from '@/features/auth/schemas'
import { isApiError } from '@/shared/api/error'
import { useCountdown } from '@/shared/hooks/useCountdown'
import { Button, Input } from '@/shared/ui'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/stores/toast'

import styles from './auth-form.module.css'

const registerSchema = z
  .object({
    phone: phoneSchema,
    code: codeSchema,
    password: passwordSchema,
    confirm: z.string(),
    agreeTerms: z.boolean(),
  })
  .refine((d) => d.password === d.confirm, { path: ['confirm'], message: '两次输入的密码不一致' })
  .refine((d) => d.agreeTerms, { path: ['agreeTerms'], message: '请先阅读并同意用户协议' })

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)
  const countdown = useCountdown()
  const [submitting, setSubmitting] = useState(false)

  const {
    register: field,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const handleSendCode = async () => {
    if (!(await trigger('phone'))) return
    try {
      const res = await sendCode({ scene: 'REGISTER', identifierType: 'PHONE', identifier: getValues('phone') })
      countdown.start(res.expireSeconds)
      toast.success('验证码已发送')
    } catch (e) {
      toast.error(isApiError(e) ? e.message : '发送失败，请稍后再试')
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true)
    try {
      const auth = await apiRegister({
        identifierType: 'PHONE',
        identifier: data.phone,
        code: data.code,
        password: data.password,
        agreeTerms: true,
      })
      setSession(auth)
      toast.success('注册成功，欢迎来到问渠')
      navigate('/', { replace: true })
    } catch (e) {
      toast.error(isApiError(e) ? e.message : '注册失败，请稍后再试')
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <AuthLayout title="注册" subtitle="一个手机号即可开始分享与提问">
      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <Input label="手机号" placeholder="请输入手机号" leftIcon="phone" error={errors.phone?.message} {...field('phone')} />
        <div className={styles.codeRow}>
          <Input label="验证码" placeholder="短信验证码" leftIcon="key" error={errors.code?.message} {...field('code')} />
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
        <Input
          label="密码"
          type="password"
          placeholder="8-64 位，包含字母和数字"
          leftIcon="lock"
          error={errors.password?.message}
          {...field('password')}
        />
        <Input
          label="确认密码"
          type="password"
          placeholder="再次输入密码"
          leftIcon="lock"
          error={errors.confirm?.message}
          {...field('confirm')}
        />
        <div>
          <label className={styles.agree}>
            <input type="checkbox" {...field('agreeTerms')} />
            <span>我已阅读并同意《用户协议》与《隐私政策》</span>
          </label>
          {errors.agreeTerms && <p className={styles.agreeError}>{errors.agreeTerms.message}</p>}
        </div>
        <Button type="submit" size="lg" fullWidth loading={submitting}>
          注册并登录
        </Button>
        <div className={styles.links}>
          <Link to="/login">已有账号？去登录</Link>
        </div>
      </form>
    </AuthLayout>
  )
}
