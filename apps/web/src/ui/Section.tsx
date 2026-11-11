import type { ReactNode } from 'react'
import { Heading } from '@primer/react'

/** Card with a header row (title + optional actions) and a body. */
export function Section({ title, actions, children }: { title: ReactNode; actions?: ReactNode; children: ReactNode }) {
  return (
    <section
      className="overflow-hidden border"
      style={{
        borderColor: 'var(--borderColor-default)',
        borderRadius: 'var(--borderRadius-large)',
        background: 'var(--bgColor-default)',
      }}
    >
      <div
        className="flex min-h-14 items-center justify-between gap-4 border-b px-4 py-2"
        style={{ borderColor: 'var(--borderColor-muted)', background: 'var(--bgColor-muted)' }}
      >
        <Heading as="h2" style={{ font: 'var(--text-title-shorthand-small)' }}>
          {title}
        </Heading>
        {actions}
      </div>
      <div className="flex flex-col gap-4 p-4">{children}</div>
    </section>
  )
}
