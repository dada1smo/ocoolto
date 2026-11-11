import { SkeletonBox } from '@primer/react'
import { SkeletonText } from '@primer/react/experimental'

export function GroupSkeleton() {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-6">
      <span className="sr-only">Carregando grupo</span>
      <SkeletonText size="titleLarge" maxWidth="60%" />
      <SkeletonBox height="200px" />
      <SkeletonBox height="160px" />
    </div>
  )
}
