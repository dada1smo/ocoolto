import { Navigate } from 'react-router'
import { FindGroupsForm } from '../../domain/group/FindGroupsForm'
import { useMyGroups } from '../../domain/group/useMyGroups'
import { Section } from '../../ui/Section'

export default function EntrarPage() {
  const { groups } = useMyGroups()
  if (groups === undefined) return null
  if (groups) return <Navigate to="/meus-grupos" replace />
  return (
    <Section title="Entrar">
      <FindGroupsForm />
    </Section>
  )
}
