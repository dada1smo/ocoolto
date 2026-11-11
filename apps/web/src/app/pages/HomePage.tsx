import { Hero } from '../../domain/home/Hero'
import { HowItWorks } from '../../domain/home/HowItWorks'
import { CreateGroupForm } from '../../domain/group/CreateGroupForm'
import { Section } from '../../ui/Section'

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Section title="Criar grupo">
        <CreateGroupForm />
      </Section>
    </>
  )
}
