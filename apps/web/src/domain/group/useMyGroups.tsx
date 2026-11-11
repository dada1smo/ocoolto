import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { api, request } from '../../global/api'

export type MyGroup = { id: string; name: string; drawn: boolean }

type Value = { groups: MyGroup[] | null | undefined; reload: () => Promise<void> }
const Ctx = createContext<Value>({ groups: undefined, reload: async () => {} })

/** One shared fetch for the header and the page. `groups` is undefined while loading, null without a session (401). */
export function MyGroupsProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<MyGroup[] | null>()
  const reload = useCallback(() => request(api.me.groups.$get()).then(setGroups, () => setGroups(null)), [])
  useEffect(() => {
    reload()
  }, [reload])
  return <Ctx.Provider value={{ groups, reload }}>{children}</Ctx.Provider>
}

export const useMyGroups = () => useContext(Ctx)
