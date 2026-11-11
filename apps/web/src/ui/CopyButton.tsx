import { useState } from 'react'
import { Button } from '@primer/react'
import { CheckIcon, CopyIcon } from '@primer/octicons-react'

/** Copies `value`; the label flips to "Copiado" and is announced to screen readers. */
export function CopyButton({ value, label, variant }: { value: string; label: string; variant?: 'primary' | 'default' }) {
  const [copied, setCopied] = useState(false)
  const copy = () =>
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  return (
    <Button variant={variant} leadingVisual={copied ? CheckIcon : CopyIcon} onClick={copy} aria-live="polite">
      {copied ? 'Copiado!' : label}
    </Button>
  )
}
