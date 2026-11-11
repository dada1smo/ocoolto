import { GiftIcon } from '@primer/octicons-react'

export function Hero() {
  return (
    <div className="flex flex-col items-center gap-3 pt-4 text-center">
      <span
        className="flex size-14 items-center justify-center rounded-full"
        style={{ background: 'var(--bgColor-accent-muted)', color: 'var(--fgColor-accent)' }}
      >
        <GiftIcon size={28} />
      </span>
      <h1 style={{ font: 'var(--text-title-shorthand-large)' }}>Amigo oculto pra lá de legal</h1>
      <p className="max-w-md" style={{ color: 'var(--fgColor-muted)' }}>
        Sem cadastro, sem senha e sem papelzinho.
      </p>
    </div>
  )
}
