import { useState, type FormEvent } from 'react'
import { Banner, Button, FormControl, Stack, TextInput } from '@primer/react'
import { useAction } from '../../global/useAction'

type Fields = { name: string; email: string; groupName: string }
type Errors = Partial<Record<keyof Fields, string>>

function validate(f: Fields, withGroup: boolean): Errors {
  const e: Errors = {}
  if (withGroup && !f.groupName.trim()) e.groupName = 'Dê um nome ao grupo.'
  if (!f.name.trim()) e.name = 'Informe o nome.'
  if (!f.email.trim()) e.email = 'Informe o e-mail.'
  else if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'E-mail inválido. Ex.: nome@exemplo.com'
  return e
}

/** Name + email form (plus group name when `withGroupName`), validated with Primer messages. */
export function PersonForm({
  submitLabel,
  onSubmit,
  withGroupName = false,
  emailCaption,
}: {
  submitLabel: string
  onSubmit: (fields: Fields) => Promise<unknown>
  withGroupName?: boolean
  emailCaption?: string
}) {
  const { run, pending, error } = useAction(onSubmit)
  const [errors, setErrors] = useState<Errors>({})

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fields = { groupName: '', ...Object.fromEntries(new FormData(form)) } as Fields
    const found = validate(fields, withGroupName)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) return (form.elements.namedItem(first) as HTMLInputElement).focus()
    if ((await run(fields)) !== undefined) form.reset()
  }
  // once a field was flagged, clear its message as soon as the user edits it
  const clear = (e: FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name as keyof Fields
    if (errors[name]) setErrors({ ...errors, [name]: undefined })
  }

  const field = (name: keyof Fields, label: string, input: object, caption?: string) => (
    <FormControl required>
      <FormControl.Label>{label}</FormControl.Label>
      <TextInput block size="large" name={name} validationStatus={errors[name] ? 'error' : undefined} {...input} />
      {errors[name] ? (
        <FormControl.Validation variant="error">{errors[name]}</FormControl.Validation>
      ) : (
        caption && <FormControl.Caption>{caption}</FormControl.Caption>
      )}
    </FormControl>
  )

  return (
    <form onSubmit={submit} onChange={clear} noValidate>
      <Stack gap="normal">
        {withGroupName && field('groupName', 'Nome do grupo', { maxLength: 80, placeholder: 'Amigo oculto da família' })}
        {field('name', 'Nome', { maxLength: 60, autoComplete: 'name' })}
        {field('email', 'E-mail', { type: 'email', autoComplete: 'email' }, emailCaption)}
        {error && <Banner variant="critical" title="Erro" hideTitle description={error} />}
        <Button type="submit" variant="primary" size="large" block loading={pending}>
          {submitLabel}
        </Button>
      </Stack>
    </form>
  )
}
