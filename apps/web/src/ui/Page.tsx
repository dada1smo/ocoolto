import type { ReactNode } from 'react'
import { Link } from 'react-router'

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-4 py-8">
      <header>
        <Link to="/" className="text-2xl font-bold no-underline" style={{ color: 'var(--fgColor-default)' }}>
          🎁 ocoolto
        </Link>
      </header>
      <main className="flex flex-col gap-6">{children}</main>
    </div>
  )
}
