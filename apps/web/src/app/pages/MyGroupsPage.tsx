import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { ActionList, Banner, Button, FormControl, Label, Stack, TextInput } from '@primer/react'
import { CheckEmail } from '../../domain/group/CheckEmail'
import { useMyGroups } from '../../domain/group/useMyGroups'
import { requestLink } from '../../global/auth'
import { useAction } from '../../global/useAction'
import { Section } from '../../ui/Section'
import { Turnstile } from '../../ui/Turnstile'

function FindGroups() {
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
            Use o e-mail com que você entrou nos grupos. Se ele tiver grupos, enviamos um link de acesso.
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

export default function MyGroupsPage() {
  const { groups } = useMyGroups()
  if (groups === undefined) return null
  if (groups === null)
    return (
      <Section title="Encontrar meus grupos">
        <FindGroups />
      </Section>
    )
  return (
    <Section title="Meus grupos">
      <ActionList variant="full" showDividers>
        {groups.map((g) => (
          <ActionList.LinkItem key={g.id} as={Link} to={`/g/${g.id}`} size="large">
            {g.name}
            <ActionList.TrailingVisual>
              <Label variant={g.drawn ? 'success' : 'default'}>{g.drawn ? 'Sorteado' : 'Aberto'}</Label>
            </ActionList.TrailingVisual>
          </ActionList.LinkItem>
        ))}
      </ActionList>
    </Section>
  )
}
