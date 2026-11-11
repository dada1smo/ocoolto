import { PageHeader } from '@primer/react'
import { CopyButton } from '../../ui/CopyButton'
import { EditableTitle } from './EditableTitle'
import { GroupStatusLabel } from './GroupStatusLabel'
import { inviteText, type GroupData } from './useGroup'

type Props = { groupId: string; group: GroupData; onChange: () => void }

export function GroupHeader({ groupId, group, onChange }: Props) {
  return (
    <PageHeader>
      <PageHeader.TitleArea variant="large">
        <EditableTitle groupId={groupId} group={group} canEdit={group.member && group.isOwner} onChange={onChange} />
      </PageHeader.TitleArea>
      <PageHeader.Description className="justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <GroupStatusLabel drawn={group.drawn} />
          {group.member && (
            <span style={{ color: 'var(--fgColor-muted)' }}>
              {group.participants.length} {group.participants.length === 1 ? 'participante' : 'participantes'}
            </span>
          )}
        </div>
        {group.member && <CopyButton label="Copiar convite" value={inviteText(groupId, group)} />}
      </PageHeader.Description>
    </PageHeader>
  )
}
