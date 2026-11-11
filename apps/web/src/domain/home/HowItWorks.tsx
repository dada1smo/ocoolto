import type { Icon } from '@primer/octicons-react'
import { GiftIcon, LinkIcon, PeopleIcon } from '@primer/octicons-react'

const steps: [Icon, string, string][] = [
  [PeopleIcon, 'Crie o grupo', 'Só um nome e o seu e-mail.'],
  [LinkIcon, 'Mande o convite', 'Entre direto pelo link.'],
  [GiftIcon, 'Sorteie', 'Cada um vê só quem tirou.'],
]

export function HowItWorks() {
  return (
    <ol className="grid gap-3 sm:grid-cols-3">
      {steps.map(([StepIcon, title, text], i) => (
        <li
          key={title}
          className="flex items-start gap-3 border p-3 sm:flex-col"
          style={{
            background: 'var(--bgColor-default)',
            borderColor: 'var(--borderColor-muted)',
            borderRadius: 'var(--borderRadius-large)',
          }}
        >
          <span style={{ color: 'var(--fgColor-accent)' }}>
            <StepIcon size={20} />
          </span>
          <div>
            <div className="font-semibold">
              {i + 1}. {title}
            </div>
            <div className="text-sm" style={{ color: 'var(--fgColor-muted)' }}>
              {text}
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}
