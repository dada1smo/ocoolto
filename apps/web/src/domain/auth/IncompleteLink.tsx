import { Blankslate } from '@primer/react/experimental'
import { AlertIcon } from '@primer/octicons-react'

export function IncompleteLink() {
  return (
    <Blankslate border spacious>
      <Blankslate.Visual>
        <AlertIcon size="medium" />
      </Blankslate.Visual>
      <Blankslate.Heading as="h1">Link incompleto</Blankslate.Heading>
      <Blankslate.Description>Abra o link exatamente como chegou no e-mail.</Blankslate.Description>
      <Blankslate.PrimaryAction href="/">Voltar ao início</Blankslate.PrimaryAction>
    </Blankslate>
  )
}
