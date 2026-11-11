import { useState, type FormEvent } from 'react'
import { Banner, Button, FormControl, Stack, TextInput } from '@primer/react'
import { requestLink } from '../../global/auth'
import { useAction } from '../../global/useAction'
import { Turnstile } from '../../ui/Turnstile'
import { CheckEmail } from './CheckEmail'

export function FindGroupsForm() {
  const [sentTo, setSentTo] = useState<string>()
  const [challenge, setChallenge] = useState(0) // a Turnstile token is single-use: remount for a new one
  const { run, pending, error } = useAction(async (email: string, turnstile: string) => {
    await requestLink(email, turnstile)
    setSentTo(email)
  })
  if (sentTo) return <CheckEmail email={sentTo} onBack={() => setSentTo(undefined)} />

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    await run(data.get('email') as string, (data.get('cf-turnstile-response') as string) ?? '')
    setChallenge((n) => n + 1)
  }
  return (
    <form onSubmit={submit}>
      <Stack gap="normal">
        <FormControl required>
          <FormControl.Label>E-mail</FormControl.Label>
          <TextInput block size="large" name="email" type="email" autoComplete="email" />
          <FormControl.Caption>
            Informe o e-mail com que você entrou nos grupos e enviaremos um link de acesso.
          </FormControl.Caption>
        </FormControl>
        <Turnstile key={challenge} />
        {error && <Banner variant="critical" title="Erro" hideTitle description={error} />}
        <Button type="submit" variant="primary" size="large" block loading={pending}>
          Receber link de acesso
        </Button>
      </Stack>
    </form>
  )
}
