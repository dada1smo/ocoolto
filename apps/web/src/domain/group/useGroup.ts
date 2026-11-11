import { useCallback, useEffect, useState } from 'react'
import { api, request } from '../../global/api'

const fetchGroup = (id: string) => request(api.groups[':id'].$get({ param: { id } }))

export type GroupData = Awaited<ReturnType<typeof fetchGroup>>
/** The view a logged-in participant gets (the anonymous one only has name/drawn). */
export type MemberView = Extract<GroupData, { member: true }>
export type Participant = MemberView['participants'][number]

export const inviteText = (id: string, group: MemberView) =>
  `${group.participants.find((p) => p.id === group.meId)?.name} te convidou para entrar no grupo de amigo ocoolto ${group.name}: ${location.origin}/g/${id}`

export function useGroup(id: string) {
  const [group, setGroup] = useState<GroupData>()
  const [error, setError] = useState<string>()
  const reload = useCallback(
    () =>
      fetchGroup(id).then(
        (g) => {
          setGroup(g)
          setError(undefined)
        },
        (e: Error) => setError(e.message),
      ),
    [id],
  )
  useEffect(() => {
    reload()
  }, [reload])
  return { group, error, reload }
}

export const createGroup = (json: { groupName: string; name: string; email: string }) =>
  request(api.groups.$post({ json }))
export const joinGroup = (id: string, json: { name: string; email: string }) =>
  request(api.groups[':id'].join.$post({ param: { id }, json }))
export const addParticipant = (id: string, json: { name: string; email: string }) =>
  request(api.groups[':id'].participants.$post({ param: { id }, json }))
export const removeParticipant = (id: string, pid: string) =>
  request(api.groups[':id'].participants[':pid'].$delete({ param: { id, pid } }))
export const saveWishes = (id: string, json: { wishes: string }) =>
  request(api.groups[':id'].me.wishes.$put({ param: { id }, json }))
export const drawGroup = (id: string) => request(api.groups[':id'].draw.$post({ param: { id } }))
export const undrawGroup = (id: string) => request(api.groups[':id'].draw.$delete({ param: { id } }))
