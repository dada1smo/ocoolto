import { Label } from '@primer/react'

/** `muted`: the list style, where an open group is plain and a drawn one is highlighted. */
export function GroupStatusLabel({ drawn, muted }: { drawn: boolean; muted?: boolean }) {
  const [done, open] = muted ? (['success', 'default'] as const) : (['done', 'success'] as const)
  return <Label variant={drawn ? done : open}>{drawn ? 'Sorteado' : 'Aberto'}</Label>
}
