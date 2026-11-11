import { Section } from '../../ui/Section'
import { GroupDetails } from './GroupDetails'
import { JoinGroupForm } from './JoinGroupForm'
import type { GroupData } from './useGroup'

export function VisitorView({ groupId, group, onChange }: { groupId: string; group: GroupData; onChange: () => void }) {
  return (
    <>
      <GroupDetails groupId={groupId} group={group} canEdit={false} onChange={onChange} />
      <Section title={group.drawn ? 'Já participa? Receba um novo link' : 'Entrar no grupo'}>
        <JoinGroupForm groupId={groupId} drawn={group.drawn} />
      </Section>
    </>
  )
}
