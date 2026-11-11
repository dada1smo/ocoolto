import { Link, Navigate } from 'react-router'
import { Banner } from '@primer/react'
import { Section } from '../../ui/Section'
import { JoinGroupForm } from './JoinGroupForm'
import type { GroupData } from './useGroup'

export function VisitorView({ groupId, group }: { groupId: string; group: GroupData }) {
  if (group.drawn) return <Navigate to="/entrar" replace />
  return (
    <Section title="Entrar no grupo">
      <JoinGroupForm groupId={groupId} drawn={false} />
      <Banner
        className="mt-4"
        variant="info"
        title="Já aceitou o convite?"
        description="Entre direto com seu e-mail."
        secondaryAction={
          <Banner.SecondaryAction as={Link} to="/entrar">
            Entrar
          </Banner.SecondaryAction>
        }
      />
    </Section>
  )
}
