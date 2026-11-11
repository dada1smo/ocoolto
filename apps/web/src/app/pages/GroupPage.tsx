import { useParams } from 'react-router'
import { Label, PageHeader, SkeletonBox } from '@primer/react'
import { Blankslate, SkeletonText } from '@primer/react/experimental'
import { AlertIcon } from '@primer/octicons-react'
import { AdminPanel } from '../../domain/group/AdminPanel'
import { EditableTitle } from '../../domain/group/EditableTitle'
import { GroupDetails } from '../../domain/group/GroupDetails'
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
          <EditableTitle groupId={id} group={group} canEdit={group.member && group.isOwner} onChange={reload} />
        </PageHeader.TitleArea>
        <PageHeader.Description>
          {group.drawn ? <Label variant="done">Sorteado</Label> : <Label variant="success">Aberto</Label>}
          {group.member && (
            <span style={{ color: 'var(--fgColor-muted)' }}>
              {group.participants.length} {group.participants.length === 1 ? 'participante' : 'participantes'}
            </span>
          )}
        </PageHeader.Description>
        {group.member && !group.isRoot && !group.drawn && (
          <PageHeader.Actions>
            <CopyButton label="Copiar convite" value={inviteText(id, group)} />
          </PageHeader.Actions>
        )}
      </PageHeader>

      <GroupDetails groupId={id} group={group} canEdit={group.member && group.isOwner} onChange={reload} />

      {!group.member ? (
        <Section title={group.drawn ? 'Já participa? Receba um novo link' : 'Entrar no grupo'}>
          <JoinGroupForm groupId={id} drawn={group.drawn} />
        </Section>
      ) : (
        <>
          {group.meId && <TargetCard name={group.target?.name ?? null} />}
          {group.meId && <WishesForm groupId={id} group={group} onChange={reload} />}
          {group.isOwner && <AdminPanel groupId={id} group={group} onChange={reload} />}
          <ParticipantList groupId={id} group={group} onChange={reload} />
        </>
      )}
    </>
  )
}
