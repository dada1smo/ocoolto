import { useState } from 'react'
import { Button } from '@primer/react'
import { CheckIcon, CopyIcon } from '@primer/octicons-react'

/** Copies `value`; the label flips to "Copiado" and is announced to screen readers. */
export function CopyButton({
  value,
  label,
  variant,
  className,
}: {
  value: string
  label: string
  variant?: 'primary' | 'default'
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const copy = () =>
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  return (
    <Button
      variant={variant}
      leadingVisual={copied ? CheckIcon : CopyIcon}
      onClick={copy}
      aria-live="polite"
      className={className}
    >
      {copied ? 'Copiado!' : label}
    </Button>
  )
}
