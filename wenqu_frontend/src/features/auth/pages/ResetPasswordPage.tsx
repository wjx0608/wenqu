import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { AuthLayout } from '@/features/auth/AuthLayout'
import { resetPassword, sendCode } from '@/features/auth/api'
import { codeSchema, passwordSchema, phoneSchema } from '@/features/auth/schemas'
import { isApiError } from '@/shared/api/error'
import { useCountdown } from '@/shared/hooks/useCountdown'
import { Button, Input } from '@/shared/ui'
import { toast } from '@/stores/toast'

import styles from './auth-form.module.css'

const resetSchema = z
  .object({
    phone: phoneSchema,
    code: codeSchema,
    newPassword: passwordSchema,
    confirm: z.string(),
  })
  .refine((d) => d.newPassword === d.confirm, { path: ['confirm'], message: '两次输入的密码不一致' })

type ResetForm = z.infer<typeof resetSchema>

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const countdown = useCountdown()
  const [submitting, setSubmitting] = useState(false)

  const {
    register: field,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<ResetForm>({ resolver: zodResolver(resetSchema) })

  const handleSendCode = async () => {
    if (!(await trigger('phone'))) return
    try {
      const res = await sendCode({ scene: 'RESET_PASSWORD', identifierType: 'PHONE', identifier: getValues('phone') })
      countdown.start(res.expireSeconds)
      toast.success('验证码已发送')
    } catch (e) {
      toast.error(isApiError(e) ? e.message : '发送失败，请稍后再试')
    }
  }

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true)
    try {
      await resetPassword({
        identifierType: 'PHONE',
        identifier: data.phone,
        code: data.code,
        newPassword: data.newPassword,
      })
      toast.success('密码已重置，请重新登录')
      navigate('/login', { replace: true })
    } catch (e) {
      toast.error(isApiError(e) ? e.message : '重置失败，请稍后再试')
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <AuthLayout title="找回密码" subtitle="通过注册手机号验证身份">
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
          label="新密码"
          type="password"
          placeholder="8-64 位，包含字母和数字"
          leftIcon="lock"
          error={errors.newPassword?.message}
          {...field('newPassword')}
        />
        <Input
          label="确认新密码"
          type="password"
          placeholder="再次输入新密码"
          leftIcon="lock"
          error={errors.confirm?.message}
          {...field('confirm')}
        />
        <Button type="submit" size="lg" fullWidth loading={submitting}>
          重置密码
        </Button>
        <div className={styles.links}>
          <Link to="/login">返回登录</Link>
        </div>
      </form>
    </AuthLayout>
  )
}
