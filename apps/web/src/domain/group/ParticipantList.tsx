import { useState } from 'react'
import { Button, Dialog, IconButton, Label } from '@primer/react'
import { Blankslate } from '@primer/react/experimental'
import { ArrowRightIcon, GiftIcon, PeopleIcon, PersonAddIcon, TrashIcon } from '@primer/octicons-react'
import { ConfirmAction } from '../../ui/ConfirmAction'
import { CopyButton } from '../../ui/CopyButton'
import { Section } from '../../ui/Section'
import { PersonForm } from './PersonForm'
import { formatEditedAt } from './WishesForm'
import { addParticipant, inviteText, removeParticipant, type MemberView, type Participant } from './useGroup'

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')

export function ParticipantList({
  groupId,
  group,
  showPairs,
  onChange,
}: {
  groupId: string
  group: MemberView
  showPairs: boolean
  onChange: () => void
}) {
  const [adding, setAdding] = useState(false)
  const [removing, setRemoving] = useState<Participant>()
  const [viewing, setViewing] = useState<Participant>()
  const editable = group.isOwner && !group.drawn
  const onlyOwner = group.participants.length === 1

  return (
    <Section
      title={`Participantes (${group.participants.length})`}
      actions={
        editable && (
          <Button size="medium" leadingVisual={PersonAddIcon} onClick={() => setAdding(true)}>
            Adicionar pessoa
          </Button>
        )
      }
    >
      <ul className="-my-2 flex flex-col divide-y" style={{ borderColor: 'var(--borderColor-muted)' }}>
        {group.participants.map((p) => (
          <li key={p.id} className="flex items-center gap-3 py-3" style={{ borderColor: 'var(--borderColor-muted)' }}>
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
              style={{ background: 'var(--bgColor-neutral-muted)', color: 'var(--fgColor-muted)' }}
            >
              {initials(p.name)}
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="flex flex-wrap items-center gap-2 font-semibold">
                {p.name}
                {p.isOwner && <Label variant="accent">organizador</Label>}
                {p.id === group.meId && <Label>você</Label>}
              </span>
              {p.email && (
                <span className="truncate text-sm" style={{ color: 'var(--fgColor-muted)' }}>
                  {p.email}
                </span>
              )}
            </div>
            {p.wishes && (
              <Button
                size="medium"
                leadingVisual={GiftIcon}
                aria-label={`Ver lista de desejos de ${p.name}`}
                onClick={() => setViewing(p)}
              >
                Lista de desejos
              </Button>
            )}
            {showPairs && p.targetName && (
              <span className="flex items-center gap-1 font-semibold">
                <span style={{ color: 'var(--fgColor-muted)' }}>
                  <ArrowRightIcon aria-label="tirou" />
                </span>
                {p.targetName}
              </span>
            )}
            {editable && !p.isOwner && (
              <IconButton
                icon={TrashIcon}
                variant="invisible"
                aria-label={`Remover ${p.name}`}
                onClick={() => setRemoving(p)}
              />
            )}
          </li>
        ))}
      </ul>

      {onlyOwner && !group.drawn && (
        <Blankslate>
          <Blankslate.Visual>
            <PeopleIcon size="medium" />
          </Blankslate.Visual>
          <Blankslate.Heading as="h3">Chame a galera</Blankslate.Heading>
          <Blankslate.Description>
            Copie o convite e mande no grupo da família ou dos amigos. Cada pessoa entra com o próprio e-mail.
          </Blankslate.Description>
          <CopyButton variant="primary" label="Copiar convite" value={inviteText(groupId, group)} className="mt-4" />
        </Blankslate>
      )}

      {adding && (
        <Dialog
          title="Adicionar pessoa"
          subtitle="Nenhum e-mail é enviado agora. Ela entra depois pelo convite, com este mesmo e-mail."
          onClose={() => setAdding(false)}
        >
          <PersonForm
            submitLabel="Adicionar"
            onSubmit={async (f) => {
              await addParticipant(groupId, { name: f.name, email: f.email })
              onChange()
              setAdding(false)
              return true
            }}
          />
        </Dialog>
      )}

      {viewing?.wishes && (
        <Dialog
          title={`Lista de desejos de ${viewing.name}`}
          subtitle={viewing.wishesAt && `Editado em ${formatEditedAt(viewing.wishesAt)}`}
          width="large"
          onClose={() => setViewing(undefined)}
        >
          <p className="whitespace-pre-wrap wrap-break-word">{viewing.wishes}</p>
        </Dialog>
      )}

      {removing && (
        <ConfirmAction
          title={`Remover ${removing.name}?`}
          confirmLabel="Remover"
          onConfirm={async () => {
            await removeParticipant(groupId, removing.id)
            onChange()
          }}
          onClose={() => setRemoving(undefined)}
        >
          {removing.name} sai do grupo. Dá para adicionar de novo antes do sorteio.
        </ConfirmAction>
      )}
    </Section>
  )
}
