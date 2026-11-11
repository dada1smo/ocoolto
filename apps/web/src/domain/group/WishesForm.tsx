import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Banner, Button, FormControl, IconButton, Textarea } from '@primer/react'
import { Blankslate } from '@primer/react/experimental'
import { GiftIcon, PencilIcon } from '@primer/octicons-react'
import { useAction } from '../../global/useAction'
import { Section } from '../../ui/Section'
import { saveWishes, type MemberView } from './useGroup'

export const formatEditedAt = (ms: number) =>
  new Date(ms).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

/** The logged-in participant's own gift suggestions: empty state → read-only text → explicit edit (Primer Edit/Saving patterns). */
export function WishesForm({
  groupId,
  group,
  onChange,
}: {
  groupId: string
  group: MemberView
  onChange: () => unknown
}) {
  const me = group.participants.find((p) => p.id === group.meId)
  const { run, pending, error } = useAction((wishes: string) => saveWishes(groupId, { wishes }))
  const [editing, setEditing] = useState(false)
  const textarea = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (editing) textarea.current?.focus()
  }, [editing])

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const wishes = String(new FormData(e.currentTarget).get('wishes') ?? '')
    if ((await run(wishes)) === undefined) return // keep the editor open and the draft on failure
    await onChange()
    setEditing(false)
  }

  return (
    <Section
      title="Lista de desejos"
      actions={
        !editing &&
        me?.wishes && (
          <IconButton
            icon={PencilIcon}
            variant="invisible"
            aria-label="Editar minha lista de desejos"
            onClick={() => setEditing(true)}
          />
        )
      }
    >
      {editing ? (
        <form onSubmit={submit} onKeyDown={(e) => e.key === 'Escape' && setEditing(false)}>
          <div className="flex flex-col gap-4">
            <FormControl>
              <FormControl.Label>Lista de desejos</FormControl.Label>
              <Textarea
                ref={textarea}
                block
                rows={5}
                resize="vertical"
                name="wishes"
                maxLength={1000}
                characterLimit={1000}
                defaultValue={me?.wishes ?? ''}
                placeholder="Ex.: livros de ficção científica, camiseta tamanho M, café especial…"
              />
              <FormControl.Caption>
                Não inclua dados sensíveis (endereço, telefone, documentos, senhas ou dados bancários). Todos do grupo
                podem ler este texto.
              </FormControl.Caption>
            </FormControl>
            {error && <Banner variant="critical" title="Erro" hideTitle description={error} />}
            <div className="flex flex-wrap items-center gap-2">
              <Button type="submit" variant="primary" loading={pending}>
                Salvar lista de desejos
              </Button>
              <Button type="button" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      ) : me?.wishes ? (
        <div>
          <p className="whitespace-pre-wrap wrap-break-word">{me.wishes}</p>
          {me.wishesAt && (
            <p className="mt-2 text-sm" style={{ color: 'var(--fgColor-muted)' }}>
              Editado em {formatEditedAt(me.wishesAt)}
            </p>
          )}
        </div>
      ) : (
        <Blankslate>
          <Blankslate.Visual>
            <GiftIcon size="medium" />
          </Blankslate.Visual>
          <Blankslate.Heading as="h3">Ajude quem tirou você</Blankslate.Heading>
          <Blankslate.Description>
            Conte do que você gosta ou o que gostaria de ganhar. Todos do grupo podem ler.
          </Blankslate.Description>
          <Blankslate.PrimaryAction onClick={() => setEditing(true)}>
            Adicionar lista de desejos
          </Blankslate.PrimaryAction>
        </Blankslate>
      )}
    </Section>
  )
}
