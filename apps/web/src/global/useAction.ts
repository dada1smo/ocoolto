import { useState } from 'react'

/** Wraps an async action with pending/error state for buttons and forms. */
export function useAction<A extends unknown[], T>(fn: (...args: A) => Promise<T>) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string>()
  const run = async (...args: A) => {
    setPending(true)
    setError(undefined)
    try {
      return await fn(...args)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setPending(false)
    }
  }
  return { run, pending, error }
}
