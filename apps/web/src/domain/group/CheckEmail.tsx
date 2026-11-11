import { Button } from '@primer/react'
import { Blankslate } from '@primer/react/experimental'
import { MailIcon } from '@primer/octicons-react'

export function CheckEmail({ email, onBack }: { email: string; onBack: () => void }) {
  return (
    <Blankslate>
      <Blankslate.Visual>
        <MailIcon size="medium" />
      </Blankslate.Visual>
      <Blankslate.Heading as="h3">Confira seu e-mail</Blankslate.Heading>
      <Blankslate.Description>
        Enviamos um link de acesso para <b>{email}</b>. Ele vale por 15 minutos.
        {import.meta.env.DEV && ' (Em dev, o link aparece no console do wrangler.)'}
      </Blankslate.Description>
      {/* SecondaryAction only renders links, so a plain invisible Button */}
      <Button variant="invisible" onClick={onBack}>
        Usar outro e-mail
      </Button>
    </Blankslate>
  )
}
