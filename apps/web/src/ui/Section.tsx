import type { ReactNode } from 'react'
import { Heading } from '@primer/react'

/** Bordered card with a title. */
export function Section({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <section
      className="flex flex-col gap-4 rounded-md border p-4"
      style={{ borderColor: 'var(--borderColor-default)', background: 'var(--bgColor-default)' }}
    >
      <Heading as="h2" className="text-lg">
        {title}
      </Heading>
      {children}
    </section>
  )
}
