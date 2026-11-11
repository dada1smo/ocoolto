import { Navigate } from 'react-router'
import { Section } from '../../ui/Section'
import { GroupList } from './GroupList'
import { useMyGroups } from './useMyGroups'

export function MyGroups() {
  const { groups } = useMyGroups()
  if (groups === undefined) return null
  if (groups === null) return <Navigate to="/entrar" replace />
  return (
    <Section title="Meus grupos">
      <GroupList groups={groups} />
    </Section>
  )
}
