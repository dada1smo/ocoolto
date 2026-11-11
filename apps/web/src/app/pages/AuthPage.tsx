import { useNavigate, useSearchParams } from 'react-router'
import { Banner, Button } from '@primer/react'
import { Blankslate } from '@primer/react/experimental'
import { AlertIcon, KeyIcon } from '@primer/octicons-react'
import { login } from '../../global/auth'
import { useMyGroups } from '../../domain/group/useMyGroups'
import { useAction } from '../../global/useAction'

/** A button instead of auto-login: mail scanners open links first and would spend the one-time token. */
export default function AuthPage() {
  const token = useSearchParams()[0].get('t')
  const navigate = useNavigate()
  const { reload } = useMyGroups()
  const { run, pending, error } = useAction(async () => {
    const { groupId } = await login(token!)
    await reload() // header and list must see the new session
    navigate(groupId ? `/g/${groupId}` : '/meus-grupos', { replace: true })
  })

  if (!token)
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

  return (
    <div style={{ background: 'var(--bgColor-default)', borderRadius: 'var(--borderRadius-large)' }}>
      <Blankslate border spacious>
        <Blankslate.Visual>
          <KeyIcon size="medium" />
        </Blankslate.Visual>
        <Blankslate.Heading as="h1">Quase lá</Blankslate.Heading>
        <Blankslate.Description>Toque no botão para entrar no seu amigo oculto.</Blankslate.Description>
        <div className="mt-4 flex w-full max-w-xs flex-col gap-3">
          {error && (
            <Banner
              variant="critical"
              title="Não deu para entrar"
              description={`${error} Abra a página do grupo e peça um novo link.`}
            />
          )}
          <Button variant="primary" size="large" block loading={pending} onClick={() => run()}>
            Entrar
          </Button>
        </div>
      </Blankslate>
    </div>
  )
}
