import { useState } from 'react'
import { CheckEmail } from './CheckEmail'
import { PersonForm } from './PersonForm'
import { joinGroup } from './useGroup'

/** Joins the group, or recovers access for someone already in it. */
export function JoinGroupForm({ groupId, drawn }: { groupId: string; drawn: boolean }) {
  const [sentTo, setSentTo] = useState<string>()
  if (sentTo) return <CheckEmail email={sentTo} />
  return (
    <PersonForm
      submitLabel={drawn ? 'Receber link de acesso' : 'Entrar no grupo'}
      onSubmit={async (f) => {
        await joinGroup(groupId, { name: f.name, email: f.email })
        setSentTo(f.email)
      }}
    />
  )
}
