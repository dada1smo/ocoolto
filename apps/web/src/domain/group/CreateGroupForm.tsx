import { useState } from 'react'
import { FormControl, TextInput } from '@primer/react'
import { CheckEmail } from './CheckEmail'
import { PersonForm } from './PersonForm'
import { createGroup } from './useGroup'

export function CreateGroupForm() {
  const [sentTo, setSentTo] = useState<string>()
  if (sentTo) return <CheckEmail email={sentTo} />
  return (
    <PersonForm
      submitLabel="Criar grupo"
      onSubmit={async (f) => {
        await createGroup({ groupName: f.groupName, name: f.name, email: f.email })
        setSentTo(f.email)
      }}
    >
      <FormControl required>
        <FormControl.Label>Nome do grupo</FormControl.Label>
        <TextInput block name="groupName" maxLength={80} placeholder="Amigo oculto da família" />
      </FormControl>
    </PersonForm>
  )
}
