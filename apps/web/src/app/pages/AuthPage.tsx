import { useNavigate, useSearchParams } from 'react-router'
import { Banner, Button } from '@primer/react'
import { login } from '../../global/auth'
import { useAction } from '../../global/useAction'
import { Section } from '../../ui/Section'

/** A button instead of auto-login: mail scanners open links first and would spend the one-time token. */
export default function AuthPage() {
  const token = useSearchParams()[0].get('t')
  const navigate = useNavigate()
  const { run, pending, error } = useAction(async () => {
    const { groupId } = await login(token!)
    navigate(`/g/${groupId}`, { replace: true })
  })
  if (!token) return <Banner variant="critical" title="Link incompleto" description="Abra o link exatamente como chegou no e-mail." />
  return (
    <Section title="Entrar no amigo oculto">
      {error && <Banner variant="critical" title="Erro" hideTitle description={error} />}
      <Button variant="primary" size="large" block loading={pending} onClick={() => run()}>
        Entrar
      </Button>
    </Section>
  )
}
