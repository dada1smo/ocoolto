import { Blankslate } from '@primer/react/experimental'
import { AlertIcon } from '@primer/octicons-react'

export function GroupLoadError({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <Blankslate border spacious>
      <Blankslate.Visual>
        <AlertIcon size="medium" />
      </Blankslate.Visual>
      <Blankslate.Heading as="h1">Não foi possível abrir o grupo</Blankslate.Heading>
      <Blankslate.Description>{error}</Blankslate.Description>
      <Blankslate.PrimaryAction onClick={onRetry}>Tentar de novo</Blankslate.PrimaryAction>
    </Blankslate>
  )
}
