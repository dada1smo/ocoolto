import { useState } from 'react'
import { CheckEmail } from './CheckEmail'
import { PersonForm } from './PersonForm'
import { createGroup } from './useGroup'

export function CreateGroupForm() {
  const [sentTo, setSentTo] = useState<string>()
  if (sentTo) return <CheckEmail email={sentTo} onBack={() => setSentTo(undefined)} />
  return (
    <PersonForm
      withGroupName
      submitLabel="Criar grupo"
      emailCaption="Enviamos um link de acesso. Sem senha."
      onSubmit={async (f) => {
        await createGroup({ groupName: f.groupName, name: f.name, email: f.email })
        setSentTo(f.email)
        return true
      }}
    />
  )
}
