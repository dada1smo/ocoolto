import type { Context } from 'hono'
import type { AppEnv } from './session'

/** Anti-bot + per-IP limit for endpoints that send email. Returns an error response, or undefined when allowed. */
export async function guard(c: Context<AppEnv>, turnstile: string | undefined) {
  const form = new FormData()
  form.set('secret', c.env.TURNSTILE_SECRET)
  form.set('response', turnstile ?? '')
  const ip = c.req.header('cf-connecting-ip')
  if (ip) form.set('remoteip', ip)
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form })
  if (!res.ok || !((await res.json()) as { success: boolean }).success) return c.json({ error: 'turnstile' }, 400)

  if (!(await c.env.IP_LIMITER.limit({ key: ip ?? 'local' })).success) return c.json({ error: 'rate_limited' }, 429)
}

export const MAX_PARTICIPANTS = 50

export async function isFull(db: D1Database, groupId: string) {
  const row = await db
    .prepare('SELECT COUNT(*) AS n FROM participants WHERE group_id = ?')
    .bind(groupId)
    .first<{ n: number }>()
  return row!.n >= MAX_PARTICIPANTS
}
