import { Hono } from 'hono'
import type { AppEnv } from '../lib/session'

/** Groups an email belongs to. The owner counts even before their first login made them a participant. */
export async function groupsOf(db: D1Database, email: string) {
  const { results } = await db
    .prepare(
      `SELECT id, name, drawn_at IS NOT NULL AS drawn FROM groups
       WHERE owner_email = ?1 OR id IN (SELECT group_id FROM participants WHERE email = ?1)
       ORDER BY created_at DESC`,
    )
    .bind(email)
    .all<{ id: string; name: string; drawn: number }>()
  return results.map((g) => ({ id: g.id, name: g.name, drawn: g.drawn === 1 }))
}

export const me = new Hono<AppEnv>().get('/groups', async (c) => {
  const email = c.get('email')
  if (!email) return c.json({ error: 'unauthorized' }, 401)
  return c.json(await groupsOf(c.env.DB, email))
})
