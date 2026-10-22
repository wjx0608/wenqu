import { Card, EmptyState } from '@/shared/ui'

export interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Card padding="none">
      <EmptyState title={`${title}功能建设中`} description={description} />
    </Card>
  )
}
