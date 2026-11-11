import type { Icon } from '@primer/octicons-react'
import { GiftIcon, LinkIcon, PeopleIcon } from '@primer/octicons-react'
import { CreateGroupForm } from '../../domain/group/CreateGroupForm'
import { Section } from '../../ui/Section'

const steps: [Icon, string, string][] = [
  [PeopleIcon, 'Crie o grupo', 'Só um nome e o seu e-mail.'],
  [LinkIcon, 'Mande o convite', 'Cada pessoa entra pelo link.'],
  [GiftIcon, 'Sorteie', 'Cada um vê só quem tirou.'],
]

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col items-center gap-3 pt-4 text-center">
        <span
          className="flex size-14 items-center justify-center rounded-full"
          style={{ background: 'var(--bgColor-accent-muted)', color: 'var(--fgColor-accent)' }}
        >
          <GiftIcon size={28} />
        </span>
        <h1 style={{ font: 'var(--text-title-shorthand-large)' }}>Amigo oculto, sem complicação</h1>
        <p className="max-w-md" style={{ color: 'var(--fgColor-muted)' }}>
          Sem cadastro, sem senha e sem papelzinho. Funciona no celular.
        </p>
      </div>

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

      <Section title="Criar grupo">
        <CreateGroupForm />
      </Section>
    </>
  )
}
