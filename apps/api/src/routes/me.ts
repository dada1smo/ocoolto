import { Hono } from 'hono'
import { isRoot, type AppEnv } from '../lib/session'

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

export const me = new Hono<AppEnv>()
  .get('/groups', async (c) => {
    const email = c.get('email')
    if (!email) return c.json({ error: 'unauthorized' }, 401)
    return c.json(await groupsOf(c.env.DB, email))
  })

  // every group, root only. shortcut: no pagination, add it when the list outgrows one screen
  .get('/root', async (c) => {
    if (!isRoot(c)) return c.json({ error: 'forbidden' }, 403)
    const { results } = await c.env.DB.prepare(
      `SELECT id, name, owner_email AS ownerEmail, drawn_at IS NOT NULL AS drawn,
              (SELECT COUNT(*) FROM participants WHERE group_id = groups.id) AS participants
       FROM groups ORDER BY created_at DESC`,
    ).all<{ id: string; name: string; ownerEmail: string; drawn: number; participants: number }>()
    return c.json(results.map((g) => ({ ...g, drawn: g.drawn === 1 })))
  })
