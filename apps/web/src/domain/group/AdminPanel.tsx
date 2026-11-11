import { useId, useState } from 'react'
import { Banner, Button, ToggleSwitch } from '@primer/react'
import { SyncIcon, UndoIcon } from '@primer/octicons-react'
import { ConfirmAction } from '../../ui/ConfirmAction'
import { Section } from '../../ui/Section'
import { drawGroup, undrawGroup, type MemberView } from './useGroup'

const MIN = 3

/** Owner-only: run the draw, then toggle the full result. */
export function AdminPanel({
  groupId,
  group,
  showPairs,
  onShowPairs,
  onChange,
}: {
  groupId: string
  group: MemberView
  showPairs: boolean
  onShowPairs: (v: boolean) => void
  onChange: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const [undoing, setUndoing] = useState(false)
  const [tooFew, setTooFew] = useState(false)
  const toggleLabel = useId()
  const toggleCaption = useId()
  const count = group.participants.length

  if (group.drawn)
    return (
      <Section title="Resultado completo">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span id={toggleLabel} className="font-semibold">
              Mostrar quem tirou quem
            </span>
            <span id={toggleCaption} className="text-sm" style={{ color: 'var(--fgColor-muted)' }}>
              Você também participa: ligado, isso revela o seu amigo oculto.
            </span>
          </div>
          <ToggleSwitch
            aria-labelledby={toggleLabel}
            aria-describedby={toggleCaption}
            checked={showPairs}
            onClick={() => onShowPairs(!showPairs)}
          />
        </div>
        <Button leadingVisual={UndoIcon} onClick={() => setUndoing(true)}>
          Desfazer sorteio
        </Button>
        {undoing && (
          <ConfirmAction
            title="Desfazer o sorteio?"
            confirmLabel="Desfazer sorteio"
            onConfirm={async () => {
              await undrawGroup(groupId)
              onShowPairs(false)
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
