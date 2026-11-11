import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Banner, Button, FormControl, IconButton, Textarea, TextInput } from '@primer/react'
import { CalendarIcon, PencilIcon } from '@primer/octicons-react'
import { useAction } from '../../global/useAction'
import { Section } from '../../ui/Section'
import { updateGroup, type GroupData } from './useGroup'

// date-only value: render in UTC so the day never shifts with the viewer's timezone
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

/** Optional event date + description: visible to everyone, editable only by the owner (Primer Edit/Saving patterns). */
export function GroupDetails({
  groupId,
  group,
  canEdit,
  onChange,
}: {
  groupId: string
  group: GroupData
  canEdit: boolean
  onChange: () => unknown
}) {
  const { run, pending, error } = useAction((v: { eventDate: string; description: string }) =>
    updateGroup(groupId, { name: group.name, ...v }),
  )
  const [editing, setEditing] = useState(false)
  const date = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (editing) date.current?.focus()
  }, [editing])

  // nothing to show and nobody who can edit it
  if (!canEdit && !group.eventDate && !group.description) return null

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const v = { eventDate: String(f.get('eventDate') ?? ''), description: String(f.get('description') ?? '') }
    if ((await run(v)) === undefined) return // keep the draft open on failure
    await onChange()
    setEditing(false)
  }

  return (
    <Section
      title="Detalhes do encontro"
      actions={
        canEdit &&
        !editing && (
          <IconButton
            icon={PencilIcon}
            variant="invisible"
            aria-label="Editar detalhes do encontro"
            onClick={() => setEditing(true)}
          />
        )
      }
    >
      {editing ? (
        <form onSubmit={submit} onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}>
          <div className="flex flex-col gap-4">
            <FormControl>
              <FormControl.Label>Data do encontro</FormControl.Label>
              <TextInput ref={date} type="date" name="eventDate" defaultValue={group.eventDate ?? ''} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Descrição</FormControl.Label>
              <Textarea
                block
                rows={5}
                resize="vertical"
                name="description"
                maxLength={1000}
                characterLimit={1000}
                defaultValue={group.description ?? ''}
                placeholder="Ex.: local, horário, valor sugerido…"
              />
            </FormControl>
            {error && <Banner variant="critical" title="Erro" hideTitle description={error} />}
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" variant="primary" loading={pending}>
                Salvar detalhes
              </Button>
              <Button type="button" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      ) : group.eventDate || group.description ? (
        <div className="flex flex-col gap-2">
          {group.eventDate && (
            <p className="flex items-center gap-2 first-letter:uppercase">
              <CalendarIcon size={16} className="shrink-0" fill="var(--fgColor-muted)" />
              <time dateTime={group.eventDate}>{formatDate(group.eventDate)}</time>
            </p>
          )}
          {group.description && <p className="whitespace-pre-wrap wrap-break-word">{group.description}</p>}
        </div>
      ) : (
        <p style={{ color: 'var(--fgColor-muted)' }}>Quando e como será a confra dos amigos?</p>
      )}
    </Section>
  )
}
