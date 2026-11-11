import type { FormEvent, ReactNode } from 'react'
import { Banner, Button, FormControl, Stack, TextInput } from '@primer/react'
import { useAction } from '../../global/useAction'

type Fields = { name: string; email: string } & Record<string, string>

/** Name + email form; `children` adds extra named inputs (e.g. groupName). */
export function PersonForm({
  submitLabel,
  onSubmit,
  children,
}: {
  submitLabel: string
  onSubmit: (fields: Fields) => Promise<unknown>
  children?: ReactNode
}) {
  const { run, pending, error } = useAction(onSubmit)
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fields = Object.fromEntries(new FormData(form)) as Fields
    if ((await run(fields)) !== undefined) form.reset()
  }
  return (
    <form onSubmit={submit}>
      <Stack gap="normal">
        {children}
        <FormControl required>
          <FormControl.Label>Nome</FormControl.Label>
          <TextInput block name="name" maxLength={60} autoComplete="name" />
        </FormControl>
        <FormControl required>
          <FormControl.Label>E-mail</FormControl.Label>
          <TextInput block name="email" type="email" autoComplete="email" />
        </FormControl>
        {error && <Banner variant="critical" title="Erro" hideTitle description={error} />}
        <Button type="submit" variant="primary" loading={pending}>
          {submitLabel}
        </Button>
      </Stack>
    </form>
  )
}
