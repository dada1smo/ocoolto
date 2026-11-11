import { Heading, Text } from '@primer/react'
import { CreateGroupForm } from '../../domain/group/CreateGroupForm'
import { Section } from '../../ui/Section'

export default function HomePage() {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Heading as="h1">Amigo oculto, sem complicação</Heading>
        <Text style={{ color: 'var(--fgColor-muted)' }}>
          Crie o grupo, mande o link e sorteie. Cada pessoa vê só quem ela tirou.
        </Text>
      </div>
      <Section title="Criar grupo">
        <CreateGroupForm />
      </Section>
    </>
  )
}
