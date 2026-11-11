import { useState } from 'react'
import { useParams } from 'react-router'
import { Label, PageHeader, SkeletonBox } from '@primer/react'
import { Blankslate, SkeletonText } from '@primer/react/experimental'
import { AlertIcon } from '@primer/octicons-react'
import { AdminPanel } from '../../domain/group/AdminPanel'
import { JoinGroupForm } from '../../domain/group/JoinGroupForm'
import { ParticipantList } from '../../domain/group/ParticipantList'
import { TargetCard } from '../../domain/group/TargetCard'
import { inviteText, useGroup } from '../../domain/group/useGroup'
import { WishesForm } from '../../domain/group/WishesForm'
import { CopyButton } from '../../ui/CopyButton'
import { Section } from '../../ui/Section'

function Loading() {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-6">
      <span className="sr-only">Carregando grupo</span>
      <SkeletonText size="titleLarge" maxWidth="60%" />
      <SkeletonBox height="200px" />
      <SkeletonBox height="160px" />
    </div>
  )
}

export default function GroupPage() {
  const id = useParams().id!
  const { group, error, reload } = useGroup(id)
  // owner is also a participant, so the full result stays hidden until they ask
  const [showPairs, setShowPairs] = useState(false)

  if (error)
    return (
      <Blankslate border spacious>
        <Blankslate.Visual>
          <AlertIcon size="medium" />
        </Blankslate.Visual>
        <Blankslate.Heading as="h1">Não foi possível abrir o grupo</Blankslate.Heading>
        <Blankslate.Description>{error}</Blankslate.Description>
        <Blankslate.PrimaryAction onClick={() => reload()}>Tentar de novo</Blankslate.PrimaryAction>
      </Blankslate>
    )
  if (!group) return <Loading />

  return (
    <>
      <PageHeader>
        <PageHeader.TitleArea variant="large">
          <PageHeader.Title as="h1">{group.name}</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Description>
          {group.drawn ? <Label variant="done">Sorteado</Label> : <Label variant="success">Aberto</Label>}
          {group.member && (
            <span style={{ color: 'var(--fgColor-muted)' }}>
              {group.participants.length} {group.participants.length === 1 ? 'participante' : 'participantes'}
            </span>
          )}
        </PageHeader.Description>
        {group.member && !group.drawn && (
          <PageHeader.Actions>
            <CopyButton label="Copiar convite" value={inviteText(id, group)} />
          </PageHeader.Actions>
        )}
      </PageHeader>

      {!group.member ? (
        <Section title={group.drawn ? 'Já participa? Receba um novo link' : 'Entrar no grupo'}>
          <JoinGroupForm groupId={id} drawn={group.drawn} />
        </Section>
      ) : (
        <>
          <TargetCard name={group.target?.name ?? null} />
          <WishesForm groupId={id} group={group} onChange={reload} />
          {group.isOwner && (
            <AdminPanel groupId={id} group={group} showPairs={showPairs} onShowPairs={setShowPairs} onChange={reload} />
          )}
          <ParticipantList groupId={id} group={group} showPairs={showPairs} onChange={reload} />
        </>
      )}
    </>
  )
}
