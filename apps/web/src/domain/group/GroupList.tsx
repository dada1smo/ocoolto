import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ActionList } from '@primer/react'
import { GroupStatusLabel } from './GroupStatusLabel'

type Item = { id: string; name: string; drawn: boolean }

/** Links to each group's page; `describe` adds an optional second line. */
export function GroupList<T extends Item>({ groups, describe }: { groups: T[]; describe?: (g: T) => ReactNode }) {
  return (
    <ActionList variant="full" showDividers>
      {groups.map((g) => (
        <ActionList.LinkItem key={g.id} as={Link} to={`/g/${g.id}`} size="large">
          {g.name}
          {describe && <ActionList.Description variant="block">{describe(g)}</ActionList.Description>}
          <ActionList.TrailingVisual>
            <GroupStatusLabel drawn={g.drawn} muted />
          </ActionList.TrailingVisual>
        </ActionList.LinkItem>
      ))}
    </ActionList>
  )
}
