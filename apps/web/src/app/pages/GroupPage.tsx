import { useState } from 'react'
import { useParams } from 'react-router'
import { Banner, Heading, Spinner } from '@primer/react'
import { AdminPanel } from '../../domain/group/AdminPanel'
import { JoinGroupForm } from '../../domain/group/JoinGroupForm'
import { ParticipantList } from '../../domain/group/ParticipantList'
import { TargetCard } from '../../domain/group/TargetCard'
import { useGroup } from '../../domain/group/useGroup'
import { CopyField } from '../../ui/CopyField'
import { Section } from '../../ui/Section'

export default function GroupPage() {
  const id = useParams().id!
  const { group, error, reload } = useGroup(id)
  // owner is also a participant, so the full result stays hidden until they ask
  const [showPairs, setShowPairs] = useState(false)

  if (error) return <Banner variant="critical" title="Erro" description={error} />
  if (!group) return <Spinner />

  return (
    <>
      <Heading as="h1">{group.name}</Heading>
      {!group.member ? (
        <Section title={group.drawn ? 'Já participa? Receba um novo link' : 'Entrar no grupo'}>
          <JoinGroupForm groupId={id} drawn={group.drawn} />
        </Section>
      ) : (
        <>
          <TargetCard name={group.target?.name ?? null} />
          {group.isOwner && (
            <AdminPanel groupId={id} group={group} showPairs={showPairs} onShowPairs={setShowPairs} onChange={reload} />
          )}
          {!group.drawn && <CopyField label="Link de convite" value={`${location.origin}/g/${id}`} />}
          <Section title={`Participantes (${group.participants.length})`}>
            <ParticipantList groupId={id} group={group} showPairs={showPairs} onChange={reload} />
          </Section>
        </>
      )}
    </>
  )
}
