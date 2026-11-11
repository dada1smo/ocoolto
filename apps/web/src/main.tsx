import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BaseStyles, ThemeProvider } from '@primer/react'
import App from './app/App'
import './index.css'

// resolved once so the explicit-mode CSS in theme.css always applies; toggle persists the choice
const night = (localStorage.getItem('colorMode') ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day')) === 'night'
document.documentElement.dataset.colorMode = night ? 'dark' : 'light'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider colorMode={night ? 'night' : 'day'}>
      <BaseStyles>
        <App />
      </BaseStyles>
    </ThemeProvider>
  </StrictMode>,
)
