import { useEffect, useRef, useState, type FormEvent } from 'react'
import { FormControl, IconButton, PageHeader, TextInput } from '@primer/react'
import { InlineMessage } from '@primer/react/experimental'
import { CheckIcon, PencilIcon, XIcon } from '@primer/octicons-react'
import { useAction } from '../../global/useAction'
import { updateGroup, type GroupData } from './useGroup'

/** Group title: closed by default; the owner can rename it in place, on the same line (Primer Edit pattern). */
export function EditableTitle({
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
  const { run, pending, error } = useAction((name: string) =>
    updateGroup(groupId, { name, eventDate: group.eventDate ?? '', description: group.description ?? '' }),
  )
  const [editing, setEditing] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (editing) input.current?.focus()
  }, [editing])

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const name = String(new FormData(e.currentTarget).get('name') ?? '').trim()
    if ((await run(name)) === undefined) return // keep the draft open on failure
    await onChange()
    setEditing(false)
  }

  if (editing)
    return (
      <form onSubmit={submit} onKeyDown={(e) => e.key === 'Escape' && setEditing(false)} className="w-full">
        <div className="flex items-baseline gap-2">
          <div className="flex-1">
            <FormControl required>
              <FormControl.Label visuallyHidden>Nome do grupo</FormControl.Label>
              <TextInput ref={input} block size="large" name="name" maxLength={80} defaultValue={group.name} />
            </FormControl>
          </div>
          <div className="flex gap-1 items-baseline">
            <IconButton
              type="submit"
              icon={CheckIcon}
              variant="primary"
              loading={pending}
              aria-label="Salvar nome do grupo"
            />
            <IconButton
              type="button"
              icon={XIcon}
              aria-label="Cancelar edição do nome"
              onClick={() => setEditing(false)}
            />
          </div>
        </div>
        {error && (
          <div className="mt-1">
            <InlineMessage variant="critical">{error}</InlineMessage>
          </div>
        )}
      </form>
    )

  return (
    <>
      <PageHeader.Title as="h1">{group.name}</PageHeader.Title>
      {canEdit && (
        <PageHeader.TrailingVisual>
          <IconButton
            icon={PencilIcon}
            variant="invisible"
            aria-label="Editar nome do grupo"
            onClick={() => setEditing(true)}
          />
        </PageHeader.TrailingVisual>
      )}
    </>
  )
}
