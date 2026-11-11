import { useState } from 'react'
import { CheckEmail } from './CheckEmail'
import { PersonForm } from './PersonForm'
import { joinGroup } from './useGroup'

/** Joins the group, or recovers access for someone already in it. */
export function JoinGroupForm({ groupId, drawn }: { groupId: string; drawn: boolean }) {
  const [sentTo, setSentTo] = useState<string>()
  if (sentTo) return <CheckEmail email={sentTo} onBack={() => setSentTo(undefined)} />
  return (
    <PersonForm
      withTurnstile
      submitLabel={drawn ? 'Receber link de acesso' : 'Entrar no grupo'}
      emailCaption={drawn ? 'Use o mesmo e-mail com que você entrou.' : 'Enviamos um link de acesso. Sem senha.'}
      onSubmit={async (f) => {
        await joinGroup(groupId, { name: f.name, email: f.email, turnstile: f.turnstile })
        setSentTo(f.email)
        return true
      }}
    />
  )
}
