import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { GiftIcon } from '@primer/octicons-react'
import { useMyGroups } from '../domain/group/useMyGroups'

const container = 'mx-auto w-full max-w-2xl px-4'

export function Page({ children }: { children: ReactNode }) {
  const loggedIn = !!useMyGroups().groups
  return (
    <div className="flex min-h-screen flex-col">
      <header
        className="border-b"
        style={{ background: 'var(--bgColor-default)', borderColor: 'var(--borderColor-muted)' }}
      >
        <div className={`${container} flex h-14 items-center`}>
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold no-underline"
            style={{ color: 'var(--fgColor-default)', font: 'var(--text-title-shorthand-small)' }}
          >
            <span style={{ color: 'var(--fgColor-accent)' }}>
              <GiftIcon size={20} />
            </span>
            ocoolto
          </Link>
          {loggedIn && (
            <Link to="/meus-grupos" className="ml-auto text-sm">
              Meus grupos
            </Link>
          )}
        </div>
      </header>
      <main className={`${container} flex flex-1 flex-col gap-6 py-8`}>{children}</main>
      <footer className={`${container} py-6 text-sm`} style={{ color: 'var(--fgColor-muted)' }}>
        ocoolto · amigo oculto sem complicação
        {!loggedIn && (
          <>
            {' · '}
            <Link to="/meus-grupos">Encontrar meus grupos</Link>
          </>
        )}
      </footer>
    </div>
  )
}
