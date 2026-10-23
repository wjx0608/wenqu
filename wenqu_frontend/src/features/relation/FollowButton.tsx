import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'

import { follow, getRelationStatus, unfollow } from '@/features/relation/api'
import { isApiError } from '@/shared/api/error'
import { Button } from '@/shared/ui'
import { useAuthStore } from '@/stores/auth'
import { toast } from '@/stores/toast'

export function FollowButton({ authorId }: { authorId: number }) {
  const navigate = useNavigate()
  const location = useLocation()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const isSelf = user?.id === authorId

  const statusQuery = useQuery({
    queryKey: ['relation', 'status', authorId],
    queryFn: () => getRelationStatus(authorId),
    enabled: !!user && !isSelf,
  })

  const mutation = useMutation({
    mutationFn: (following: boolean) => (following ? unfollow(authorId) : follow(authorId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['relation'] })
    },
    onError: (e) => toast.error(isApiError(e) ? e.message : '操作失败，请稍后再试'),
  })

  if (isSelf) return null

  const following = statusQuery.data?.following ?? false

  const handleClick = () => {
    if (!user) {
      navigate('/login', { state: { from: location.pathname + location.search } })
      return
    }
    mutation.mutate(following)
  }

  return (
    <Button
      size="sm"
      variant={following ? 'secondary' : 'primary'}
      icon={following ? 'userCheck' : 'userPlus'}
      loading={mutation.isPending}
      onClick={handleClick}
    >
      {following ? '已关注' : '关注'}
    </Button>
  )
}
