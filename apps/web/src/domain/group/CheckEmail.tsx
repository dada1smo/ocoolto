import { Banner } from '@primer/react'

export function CheckEmail({ email }: { email: string }) {
  return (
    <Banner
      variant="success"
      title="Confira seu e-mail"
      description={
        <>
          Enviamos um link de acesso para <b>{email}</b>. Ele vale por 15 minutos.
          {import.meta.env.DEV && ' (Em dev, o link aparece no console do wrangler.)'}
        </>
      }
    />
  )
}
