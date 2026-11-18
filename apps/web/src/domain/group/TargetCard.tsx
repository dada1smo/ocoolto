import { useState } from 'react'
import { Button } from '@primer/react'
import { Blankslate } from '@primer/react/experimental'
import { ClockIcon, EyeClosedIcon, EyeIcon, GiftIcon } from '@primer/octicons-react'
import { WishesDialog } from './WishesDialog'
import type { MemberView } from './useGroup'

/** The participant's own result; hidden until they tap, in case someone is looking at the screen. */
export function TargetCard({ target }: { target: MemberView['target'] }) {
  const [revealed, setRevealed] = useState(false)
  const [viewing, setViewing] = useState(false)

  if (!target)
    return (
      <div style={{ background: 'var(--bgColor-default)', borderRadius: 'var(--borderRadius-large)' }}>
        <Blankslate border>
          <Blankslate.Visual>
            <ClockIcon size="medium" />
          </Blankslate.Visual>
          <Blankslate.Heading as="h2">Aguardando o sorteio</Blankslate.Heading>
          <Blankslate.Description>Depois do sorteio você verá o nome do seu amigo secreto aqui.</Blankslate.Description>
        </Blankslate>
      </div>
    )

  return (
    <section
      aria-labelledby="target-title"
      className="flex flex-col items-center gap-4 border px-6 py-10 text-center"
      style={{
        background: 'var(--bgColor-accent-muted)',
        borderColor: 'var(--borderColor-accent-muted)',
        borderRadius: 'var(--borderRadius-large)',
      }}
    >
      <span style={{ color: 'var(--fgColor-accent)' }}>
        <GiftIcon size={32} />
      </span>
      <h2 id="target-title" style={{ font: 'var(--text-title-shorthand-small)', color: 'var(--fgColor-muted)' }}>
        Você tirou
      </h2>
      <p
        aria-live="polite"
        className={revealed ? '' : 'select-none blur-md'}
        style={{ font: 'var(--text-display-shorthand)', color: 'var(--fgColor-default)' }}
      >
        {revealed ? target.name : '••••••••'}
      </p>
      <Button leadingVisual={revealed ? EyeClosedIcon : EyeIcon} onClick={() => setRevealed(!revealed)}>
        {revealed ? 'Esconder' : 'Revelar'}
      </Button>
      <footer
        className="flex w-full flex-col items-center gap-3 border-t pt-4 text-sm"
        style={{ borderColor: 'var(--borderColor-accent-muted)', color: 'var(--fgColor-muted)' }}
      >
        {!revealed ? (
          <p>Revele o nome do seu amigo oculto para ver a lista de desejos</p>
        ) : target.wishes ? (
          <Button leadingVisual={GiftIcon} onClick={() => setViewing(true)}>
            Lista de desejos
          </Button>
        ) : (
          <p>
            Seu amigo oculto ainda não preencheu sua lista de desejos :(
            <br />
            Que tal mandar um lembrete geral?
          </p>
        )}
      </footer>
      {revealed && viewing && target.wishes && (
        <WishesDialog
          name={target.name}
          wishes={target.wishes}
          wishesAt={target.wishesAt}
          onClose={() => setViewing(false)}
        />
      )}
    </section>
  )
}
