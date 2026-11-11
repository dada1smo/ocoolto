import { useEffect, useState } from 'react'
import { api, request } from '../../global/api'
import { Section } from '../../ui/Section'
import { GroupList } from './GroupList'

type RootGroups = Awaited<ReturnType<typeof fetchAll>>
const fetchAll = () => request(api.me.root.$get())

/** Root only: every group. */
export function RootGroupList() {
  const [groups, setGroups] = useState<RootGroups | null>()
  useEffect(() => {
    fetchAll().then(setGroups, () => setGroups(null))
  }, [])
  if (groups === undefined) return null
  if (groups === null) return <Section title="Sem acesso">Esta página é restrita.</Section>
  return (
    <Section title={`Todos os grupos (${groups.length})`}>
      <GroupList
        groups={groups}
        describe={(g) =>
          `${g.ownerEmail} · ${g.participants} ${g.participants === 1 ? 'participante' : 'participantes'}`
        }
      />
    </Section>
  )
}
