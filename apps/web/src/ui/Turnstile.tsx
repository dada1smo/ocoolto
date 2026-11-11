import { useEffect, useRef } from 'react'

type TurnstileApi = { render: (el: HTMLElement, o: { sitekey: string }) => string; remove: (id: string) => void }
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
// Cloudflare's test key (always passes); production sets VITE_TURNSTILE_SITE_KEY
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA'

let loading: Promise<TurnstileApi> | undefined
const load = () =>
  (loading ??= new Promise((resolve) => {
    const s = document.createElement('script')
    s.src = SCRIPT
    s.onload = () => resolve((window as unknown as { turnstile: TurnstileApi }).turnstile)
    document.head.appendChild(s)
  }))

/** Renders the widget; inside a <form> it adds a hidden `cf-turnstile-response` field. Remount (key) to get a new token. */
export function Turnstile() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let id: string | undefined
    let gone = false
    load().then((t) => {
      if (!gone && ref.current) id = t.render(ref.current, { sitekey: SITE_KEY })
    })
    return () => {
      gone = true
      if (id) load().then((t) => t.remove(id!))
    }
  }, [])
  return <div ref={ref} />
}
