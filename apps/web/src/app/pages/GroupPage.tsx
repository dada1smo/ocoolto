import { useParams } from 'react-router'
import { GroupLoadError } from '../../domain/group/GroupLoadError'
import { GroupSkeleton } from '../../domain/group/GroupSkeleton'
import { GroupView } from '../../domain/group/GroupView'
import { useGroup } from '../../domain/group/useGroup'

export default function GroupPage() {
  const id = useParams().id!
  const { group, error, reload } = useGroup(id)

  if (error) return <GroupLoadError error={error} onRetry={reload} />
  if (!group) return <GroupSkeleton />
  return <GroupView groupId={id} group={group} onChange={reload} />
}
