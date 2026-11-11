import { UnderlinePanels } from '@primer/react/experimental'
import { DrawTab } from './DrawTab'
import { ParticipantList } from './ParticipantList'
import type { MemberView } from './useGroup'
import { WishesForm } from './WishesForm'

type Props = { groupId: string; group: MemberView; onChange: () => void }

export function MemberTabs({ groupId, group, onChange }: Props) {
  return (
    <UnderlinePanels aria-label="Seções do grupo">
      <UnderlinePanels.Tab>Sorteio</UnderlinePanels.Tab>
      <UnderlinePanels.Tab counter={group.participants.length}>Participantes</UnderlinePanels.Tab>
      {group.meId && <UnderlinePanels.Tab>Lista de desejos</UnderlinePanels.Tab>}

      <UnderlinePanels.Panel>
        <DrawTab groupId={groupId} group={group} onChange={onChange} />
      </UnderlinePanels.Panel>
      <UnderlinePanels.Panel>
        <ParticipantList groupId={groupId} group={group} onChange={onChange} />
      </UnderlinePanels.Panel>
      {group.meId && (
        <UnderlinePanels.Panel>
          <WishesForm groupId={groupId} group={group} onChange={onChange} />
        </UnderlinePanels.Panel>
      )}
    </UnderlinePanels>
  )
}
