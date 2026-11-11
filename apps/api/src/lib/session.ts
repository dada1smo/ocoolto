// lets the web app typecheck AppType, which reaches the Worker globals (Env, D1Database)
/// <reference path="../../worker-configuration.d.ts" />
import { getCookie, setCookie } from 'hono/cookie'
import { createMiddleware } from 'hono/factory'
import type { Context } from 'hono'

export type AppEnv = { Bindings: Env; Variables: { email?: string } }

const COOKIE = 'sid'
const SESSION_MS = 60 * 24 * 60 * 60 * 1000

/** Root = the logged-in email matches the ROOT_EMAIL secret (read-only access to every group). */
export const isRoot = (c: Context<AppEnv>) => {
  const email = c.get('email')
  return !!email && email === c.env.ROOT_EMAIL?.trim().toLowerCase()
}

export async function sha256(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export const session = createMiddleware<AppEnv>(async (c, next) => {
  const sid = getCookie(c, COOKIE)
  if (sid) {
    const row = await c.env.DB.prepare('SELECT email FROM sessions WHERE hash = ? AND expires_at > ?')
      .bind(await sha256(sid), Date.now())
      .first<{ email: string }>()
    if (row) c.set('email', row.email)
  }
  await next()
})

export async function startSession(c: Context<AppEnv>, email: string) {
  const sid = crypto.randomUUID()
  await c.env.DB.prepare('INSERT INTO sessions (hash, email, expires_at) VALUES (?, ?, ?)')
    .bind(await sha256(sid), email, Date.now() + SESSION_MS)
    .run()
  setCookie(c, COOKIE, sid, { httpOnly: true, secure: true, sameSite: 'Lax', path: '/', maxAge: SESSION_MS / 1000 })
}
