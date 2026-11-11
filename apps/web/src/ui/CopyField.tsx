import { useState } from 'react'
import { FormControl, TextInput } from '@primer/react'
import { CheckIcon, CopyIcon } from '@primer/octicons-react'

export function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => navigator.clipboard.writeText(value).then(() => setCopied(true))
  return (
    <FormControl>
      <FormControl.Label>{label}</FormControl.Label>
      <TextInput
        block
        readOnly
        value={value}
        onFocus={(e) => e.target.select()}
        trailingAction={
          <TextInput.Action onClick={copy} icon={copied ? CheckIcon : CopyIcon} aria-label={copied ? 'Copiado' : 'Copiar'} />
        }
      />
    </FormControl>
  )
}
