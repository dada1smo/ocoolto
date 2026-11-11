import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ActionList, Label } from '@primer/react'
import { api, request } from '../../global/api'
import { Section } from '../../ui/Section'

type RootGroups = Awaited<ReturnType<typeof fetchAll>>
const fetchAll = () => request(api.me.root.$get())

/** Root only: every group, each linking to its normal page. */
export default function RootPage() {
  const [groups, setGroups] = useState<RootGroups | null>()
  useEffect(() => {
    fetchAll().then(setGroups, () => setGroups(null))
  }, [])
  if (groups === undefined) return null
  if (groups === null) return <Section title="Sem acesso">Esta página é restrita.</Section>
  return (
    <Section title={`Todos os grupos (${groups.length})`}>
      <ActionList variant="full" showDividers>
        {groups.map((g) => (
          <ActionList.LinkItem key={g.id} as={Link} to={`/g/${g.id}`} size="large">
            {g.name}
            <ActionList.Description variant="block">
              {g.ownerEmail} · {g.participants} {g.participants === 1 ? 'participante' : 'participantes'}
            </ActionList.Description>
            <ActionList.TrailingVisual>
              <Label variant={g.drawn ? 'success' : 'default'}>{g.drawn ? 'Sorteado' : 'Aberto'}</Label>
            </ActionList.TrailingVisual>
          </ActionList.LinkItem>
        ))}
      </ActionList>
    </Section>
  )
}
