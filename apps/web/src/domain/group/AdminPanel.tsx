import { Banner, Button, Stack, ToggleSwitch } from '@primer/react'
import { useId } from 'react'
import { useAction } from '../../global/useAction'
import { Section } from '../../ui/Section'
import { PersonForm } from './PersonForm'
import { addParticipant, drawGroup, type MemberView } from './useGroup'

/** Owner-only: add people, run the draw, toggle the full result. */
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
  const draw = useAction(async () => {
    await drawGroup(groupId)
    onChange()
  })
  const toggleLabel = useId()
  const count = group.participants.length

  if (group.drawn)
    return (
      <Section title="Administração">
        <div className="flex items-center justify-between gap-4">
          <span id={toggleLabel}>Mostrar quem tirou quem</span>
          <ToggleSwitch aria-labelledby={toggleLabel} checked={showPairs} onClick={() => onShowPairs(!showPairs)} />
        </div>
      </Section>
    )

  return (
    <Section title="Administração">
      <PersonForm
        submitLabel="Adicionar pessoa"
        onSubmit={async (f) => {
          await addParticipant(groupId, { name: f.name, email: f.email })
          onChange()
        }}
      />
      <Stack gap="condensed">
        {draw.error && <Banner variant="critical" title="Erro" hideTitle description={draw.error} />}
        <Button
          variant="danger"
          block
          loading={draw.pending}
          disabled={count < 3}
          onClick={() => confirm('Sortear agora? Depois não dá para desfazer nem entrar gente nova.') && draw.run()}
        >
          Sortear ({count} pessoas)
        </Button>
        {count < 3 && <span className="text-sm" style={{ color: 'var(--fgColor-muted)' }}>São necessárias pelo menos 3 pessoas.</span>}
      </Stack>
    </Section>
  )
}
