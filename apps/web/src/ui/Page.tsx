import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { ActionList, ActionMenu, Button, IconButton } from '@primer/react'
import { GiftIcon, PeopleIcon, PersonIcon, SignOutIcon } from '@primer/octicons-react'
import { ThemeToggle } from './ThemeToggle'
import { useMyGroups } from '../domain/group/useMyGroups'
import { logout } from '../global/auth'
import { useAction } from '../global/useAction'

const container = 'mx-auto w-full max-w-2xl px-4'

export function Page({ children }: { children: ReactNode }) {
  const { groups, reload } = useMyGroups()
  const loggedIn = !!groups
  const navigate = useNavigate()
  const { run: signOut } = useAction(async () => {
    await logout()
    await reload()
    navigate('/')
  })
  return (
    <div className="flex min-h-screen flex-col">
      <header
        className="border-b"
        style={{ background: 'var(--bgColor-default)', borderColor: 'var(--borderColor-muted)' }}
      >
        <div className={`${container} flex h-14 items-center`}>
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold no-underline!"
            style={{ color: 'var(--fgColor-default)', font: 'var(--text-title-shorthand-small)' }}
          >
            <span style={{ color: 'var(--fgColor-accent)' }}>
              <GiftIcon size={20} />
            </span>
            ocoolto
          </Link>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            {!loggedIn && (
              <Button as={Link} to="/entrar" variant="invisible">
                Entrar
              </Button>
            )}
            {loggedIn && (
              <ActionMenu>
                <ActionMenu.Anchor>
                  <IconButton variant="invisible" icon={PersonIcon} aria-label="Minha conta" />
                </ActionMenu.Anchor>
                <ActionMenu.Overlay align="end">
                  <ActionList>
                    <ActionList.LinkItem as={Link} to="/meus-grupos">
                      <ActionList.LeadingVisual>
                        <PeopleIcon />
                      </ActionList.LeadingVisual>
                      Meus grupos
                    </ActionList.LinkItem>
                    <ActionList.Item onSelect={() => signOut()}>
                      <ActionList.LeadingVisual>
                        <SignOutIcon />
                      </ActionList.LeadingVisual>
                      Sair
                    </ActionList.Item>
                  </ActionList>
                </ActionMenu.Overlay>
              </ActionMenu>
            )}
          </div>
        </div>
      </header>
      <main className={`${container} flex flex-1 flex-col gap-6 py-8`}>{children}</main>
      <footer className={`${container} py-6 text-sm`} style={{ color: 'var(--fgColor-muted)' }}>
        ocoolto · amigo oculto pra lá de legal
      </footer>
    </div>
  )
}
