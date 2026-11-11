import { Banner } from '@primer/react'

export function TargetCard({ name }: { name: string | null }) {
  if (!name) return <Banner variant="info" title="Aguardando sorteio" description="O organizador ainda não sorteou." />
  return <Banner variant="success" title="Você tirou" description={<span className="text-2xl font-bold">{name}</span>} />
}
