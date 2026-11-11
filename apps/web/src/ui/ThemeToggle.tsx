import { IconButton, useTheme } from '@primer/react'
import { MoonIcon, SunIcon } from '@primer/octicons-react'

export function ThemeToggle() {
  const { resolvedColorMode, setColorMode } = useTheme()
  const dark = resolvedColorMode === 'night'
  const toggle = () => {
    const next = dark ? 'day' : 'night'
    setColorMode(next)
    localStorage.setItem('colorMode', next)
    document.documentElement.dataset.colorMode = next === 'night' ? 'dark' : 'light'
  }
  return (
    <IconButton
      variant="invisible"
      icon={dark ? SunIcon : MoonIcon}
      aria-label={dark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
      onClick={toggle}
    />
  )
}
