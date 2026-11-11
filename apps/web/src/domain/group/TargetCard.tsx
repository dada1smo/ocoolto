import { useState } from 'react'
import { Button } from '@primer/react'
import { Blankslate } from '@primer/react/experimental'
import { ClockIcon, EyeClosedIcon, EyeIcon, GiftIcon } from '@primer/octicons-react'

/** The participant's own result; hidden until they tap, in case someone is looking at the screen. */
export function TargetCard({ name }: { name: string | null }) {
  const [revealed, setRevealed] = useState(false)

  if (!name)
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
        {revealed ? name : '••••••••'}
      </p>
      <Button leadingVisual={revealed ? EyeClosedIcon : EyeIcon} onClick={() => setRevealed(!revealed)}>
        {revealed ? 'Esconder' : 'Revelar'}
      </Button>
    </section>
  )
}
