import { Dialog } from '@primer/react'
import { formatEditedAt } from './WishesForm'

export function WishesDialog({
  name,
  wishes,
  wishesAt,
  onClose,
}: {
  name: string
  wishes: string
  wishesAt: number | null
  onClose: () => void
}) {
  return (
    <Dialog
      title={`Lista de desejos de ${name}`}
      subtitle={wishesAt && `Editado em ${formatEditedAt(wishesAt)}`}
      width="large"
      onClose={onClose}
    >
      <p className="whitespace-pre-wrap wrap-break-word">{wishes}</p>
    </Dialog>
  )
}
