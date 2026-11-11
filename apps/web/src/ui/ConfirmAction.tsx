import type { ReactNode } from 'react'
import { Banner, ConfirmationDialog } from '@primer/react'
import { useAction } from '../global/useAction'

/** ConfirmationDialog that runs an async action; stays open with the error if it fails. */
export function ConfirmAction({
  title,
  confirmLabel,
  onConfirm,
  onClose,
  tone = 'danger',
  children,
}: {
  title: string
  confirmLabel: string
  onConfirm: () => Promise<unknown>
  onClose: () => void
  /** danger for removals; primary (brand color) for irreversible but non-destructive actions */
  tone?: 'danger' | 'primary'
  children: ReactNode
}) {
  // returns true so a failed run (undefined) can be told apart from success
  const action = useAction(async () => (await onConfirm(), true))
  return (
    <ConfirmationDialog
      title={title}
      confirmButtonContent={confirmLabel}
      confirmButtonType={tone}
      confirmButtonLoading={action.pending}
      cancelButtonContent="Cancelar"
      onClose={async (gesture) => {
        if (gesture !== 'confirm') return onClose()
        if ((await action.run()) !== undefined) onClose()
      }}
    >
      <div className="flex flex-col gap-3">
        {children}
        {action.error && <Banner variant="critical" title="Erro" hideTitle description={action.error} />}
      </div>
    </ConfirmationDialog>
  )
}
