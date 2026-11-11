import { useSearchParams } from 'react-router'
import { IncompleteLink } from '../../domain/auth/IncompleteLink'
import { LoginPrompt } from '../../domain/auth/LoginPrompt'

export default function AuthPage() {
  const token = useSearchParams()[0].get('t')
  return token ? <LoginPrompt token={token} /> : <IncompleteLink />
}
