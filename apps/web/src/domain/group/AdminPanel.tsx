import { useState } from 'react'
import { Banner, Button } from '@primer/react'
import { SyncIcon, UndoIcon } from '@primer/octicons-react'
import { ConfirmAction } from '../../ui/ConfirmAction'
import { Section } from '../../ui/Section'
import { drawGroup, undrawGroup, type MemberView } from './useGroup'

const MIN = 3

/** Owner-only: run or undo the draw. */
export function AdminPanel({
  groupId,
  group,
  onChange,
}: {
  groupId: string
  group: MemberView
  onChange: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [undoing, setUndoing] = useState(false)
  const [tooFew, setTooFew] = useState(false)
  const count = group.participants.length

  if (group.drawn)
    return (
      <Section title="Sorteio feito">
        <Button leadingVisual={UndoIcon} onClick={() => setUndoing(true)}>
          Desfazer sorteio
        </Button>
        {undoing && (
          <ConfirmAction
            title="Desfazer o sorteio?"
            confirmLabel="Desfazer sorteio"
            onConfirm={async () => {
              await undrawGroup(groupId)
              onChange()
            }}
            onClose={() => setUndoing(false)}
          >
            Todos os amigos ocultos atuais somem. O grupo volta a aceitar gente e você pode sortear de novo.
          </ConfirmAction>
        )}
      </Section>
    )

  return (
    <Section title="Sorteio">
      <p style={{ color: 'var(--fgColor-muted)' }}>
        Quando todo mundo tiver entrado, faça o sorteio. Depois disso ninguém mais entra, a menos que você desfaça o sorteio.
      </p>
      {tooFew && count < MIN && (
        <Banner
          variant="warning"
          title="Faltam pessoas"
          hideTitle
          description={`Adicione pelo menos mais ${MIN - count} ${MIN - count === 1 ? 'pessoa' : 'pessoas'} para sortear.`}
        />
      )}
      <Button
        variant="primary"
        size="large"
        block
        leadingVisual={SyncIcon}
        onClick={() => (count < MIN ? setTooFew(true) : setConfirming(true))}
      >
        Sortear agora
      </Button>
      {confirming && (
        <ConfirmAction
          title="Sortear agora?"
          tone="primary"
          confirmLabel={`Sortear ${count} pessoas`}
          onConfirm={async () => {
            await drawGroup(groupId)
            onChange()
          }}
          onClose={() => setConfirming(false)}
        >
          Depois do sorteio não entra gente nova, a menos que você desfaça. Cada pessoa vê só quem tirou.
        </ConfirmAction>
      )}
    </Section>
  )
}
