import { IconButton, Label } from '@primer/react'
import { ArrowRightIcon, TrashIcon } from '@primer/octicons-react'
import { useAction } from '../../global/useAction'
import { removeParticipant, type MemberView } from './useGroup'

export function ParticipantList({
  groupId,
  group,
  showPairs,
  onChange,
}: {
  groupId: string
  group: MemberView
  showPairs: boolean
  onChange: () => void
}) {
  const remove = useAction(async (pid: string) => {
    await removeParticipant(groupId, pid)
    onChange()
  })
  const canRemove = group.isOwner && !group.drawn
  return (
    <>
      <ul className="flex flex-col divide-y" style={{ borderColor: 'var(--borderColor-muted)' }}>
        {group.participants.map((p) => (
          <li key={p.id} className="flex items-center gap-2 py-2">
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="flex items-center gap-2">
                {p.name}
                {p.isOwner && <Label variant="accent">organizador</Label>}
                {p.id === group.meId && <Label>você</Label>}
              </span>
              {p.email && (
                <span className="truncate text-sm" style={{ color: 'var(--fgColor-muted)' }}>
                  {p.email}
                </span>
              )}
            </div>
            {showPairs && p.targetName && (
              <span className="flex items-center gap-1 font-semibold">
                <ArrowRightIcon /> {p.targetName}
              </span>
            )}
            {canRemove && !p.isOwner && (
              <IconButton
                icon={TrashIcon}
                variant="invisible"
                aria-label={`Remover ${p.name}`}
                disabled={remove.pending}
                onClick={() => confirm(`Remover ${p.name}?`) && remove.run(p.id)}
              />
            )}
          </li>
        ))}
      </ul>
      {remove.error && <p style={{ color: 'var(--fgColor-danger)' }}>{remove.error}</p>}
    </>
  )
}
