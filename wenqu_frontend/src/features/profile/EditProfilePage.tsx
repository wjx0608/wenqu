import { useRef, useState } from 'react'

import { updateProfile, uploadAvatar } from '@/features/profile/api'
import { TagInput } from '@/features/editor/TagInput'
import { isApiError } from '@/shared/api/error'
import type { Gender } from '@/shared/types/api'
import { Avatar, Button, Card, Input, Textarea } from '@/shared/ui'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/stores/toast'

import styles from './EditProfilePage.module.css'

const genderOptions: { value: Gender; label: string }[] = [
  { value: 'UNKNOWN', label: '保密' },
  { value: 'MALE', label: '男' },
  { value: 'FEMALE', label: '女' },
]

function parseTags(tagJson?: string | null): string[] {
  if (!tagJson) return []
  try {
    const parsed: unknown = JSON.parse(tagJson)
    return Array.isArray(parsed) ? parsed.filter((t): t is string => typeof t === 'string') : []
  } catch {
    return []
  }
}

export function EditProfilePage() {
  const user = useAuthStore((s) => s.user)
  const refreshMe = useAuthStore((s) => s.refreshMe)
  const fileRef = useRef<HTMLInputElement>(null)

  const [nickname, setNickname] = useState(user?.nickname ?? '')
  const [bio, setBio] = useState(user?.bio ?? '')
  const [school, setSchool] = useState(user?.school ?? '')
  const [zgId, setZgId] = useState(user?.zhId ?? '')
  const [gender, setGender] = useState<Gender>(user?.gender ?? 'UNKNOWN')
  const [birthday, setBirthday] = useState(user?.birthday ?? '')
  const [tags, setTags] = useState<string[]>(parseTags(user?.tagJson))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  if (!user) return null

  const handleAvatar = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      await uploadAvatar(file)
      await refreshMe()
      toast.success('头像已更新')
    } catch (e) {
      toast.error(isApiError(e) ? e.message : '上传失败，请稍后再试')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!nickname.trim()) {
      toast.info('昵称不能为空')
      return
    }
    if (zgId && !/^[a-zA-Z0-9_]{4,32}$/.test(zgId)) {
      toast.info('问渠号仅支持 4-32 位字母、数字、下划线')
      return
    }
    setSaving(true)
    try {
      await updateProfile({
        nickname: nickname.trim(),
        bio: bio.trim() || undefined,
        school: school.trim() || undefined,
        zgId: zgId.trim() || undefined,
        gender,
        birthday: birthday || undefined,
        tagJson: tags.length > 0 ? JSON.stringify(tags) : undefined,
      })
      await refreshMe()
      toast.success('资料已保存')
    } catch (e) {
      toast.error(isApiError(e) ? e.message : '保存失败，请稍后再试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>编辑资料</h1>

      <Card padding="lg" className={styles.card}>
        <div className={styles.avatarRow}>
          <Avatar src={user.avatar} name={user.nickname} size={72} />
          <Button variant="secondary" size="sm" loading={uploading} onClick={() => fileRef.current?.click()}>
            更换头像
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => void handleAvatar(e.target.files?.[0])}
          />
        </div>

        <div className={styles.form}>
          <Input label="昵称" value={nickname} maxLength={24} onChange={(e) => setNickname(e.target.value)} />
          <Input
            label="问渠号"
            value={zgId}
            placeholder="4-32 位字母、数字、下划线"
            hint="设置后他人可通过问渠号找到你"
            onChange={(e) => setZgId(e.target.value)}
          />
          <Textarea
            label="个人简介"
            value={bio}
            rows={3}
            maxLength={120}
            placeholder="介绍一下自己"
            onChange={(e) => setBio(e.target.value)}
          />
          <Input label="学校" value={school} onChange={(e) => setSchool(e.target.value)} />
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <span className={styles.label}>性别</span>
              <div className={styles.genderRow}>
                {genderOptions.map((opt) => (
                  <Button
                    key={opt.value}
                    size="sm"
                    variant={gender === opt.value ? 'primary' : 'secondary'}
                    onClick={() => setGender(opt.value)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>
            <Input
              label="生日"
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.label}>技能标签</span>
            <TagInput tags={tags} onChange={setTags} />
          </div>
        </div>

        <div className={styles.actions}>
          <Button loading={saving} onClick={handleSave}>
            保存
          </Button>
        </div>
      </Card>
    </div>
  )
}
