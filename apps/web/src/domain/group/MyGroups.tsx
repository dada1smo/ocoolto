import { Section } from '../../ui/Section'
import { FindGroupsForm } from './FindGroupsForm'
import { GroupList } from './GroupList'
import { useMyGroups } from './useMyGroups'

export function MyGroups() {
  const { groups } = useMyGroups()
  if (groups === undefined) return null
  if (groups === null)
    return (
      <Section title="Encontrar meus grupos">
        <FindGroupsForm />
      </Section>
    )
  return (
    <Section title="Meus grupos">
      <GroupList groups={groups} />
    </Section>
  )
}
