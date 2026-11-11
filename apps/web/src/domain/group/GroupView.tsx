import { GroupHeader } from './GroupHeader'
import { MemberTabs } from './MemberTabs'
import { VisitorView } from './VisitorView'
import type { GroupData } from './useGroup'

export function GroupView({ groupId, group, onChange }: { groupId: string; group: GroupData; onChange: () => void }) {
  return (
    <>
      <GroupHeader groupId={groupId} group={group} onChange={onChange} />
      {group.member ? (
        <MemberTabs groupId={groupId} group={group} onChange={onChange} />
      ) : (
        <VisitorView groupId={groupId} group={group} />
      )}
    </>
  )
}
