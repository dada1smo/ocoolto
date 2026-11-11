import { AdminPanel } from './AdminPanel'
import { GroupDetails } from './GroupDetails'
import { TargetCard } from './TargetCard'
import type { MemberView } from './useGroup'

export function DrawTab({ groupId, group, onChange }: { groupId: string; group: MemberView; onChange: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <GroupDetails groupId={groupId} group={group} canEdit={group.isOwner} onChange={onChange} />
      {group.meId && <TargetCard name={group.target?.name ?? null} />}
      {group.isOwner && <AdminPanel groupId={groupId} group={group} onChange={onChange} />}
    </div>
  )
}
