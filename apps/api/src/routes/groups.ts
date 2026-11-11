import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { draw } from '../lib/draw'
import { sendMagicLink } from '../lib/email'
import type { AppEnv } from '../lib/session'

type Group = { id: string; name: string; owner_email: string; drawn_at: number | null }
type Participant = {
  id: string
  email: string
  name: string
  target_id: string | null
  wishes: string | null
  wishes_at: number | null
}

const person = z.object({
  name: z.string().trim().min(1).max(60),
  email: z.email().trim().toLowerCase(),
  turnstile: z.string().optional(), // verified in phase 4
})

const getGroup = (db: D1Database, id: string) =>
  db.prepare('SELECT id, name, owner_email, drawn_at FROM groups WHERE id = ?').bind(id).first<Group>()

export const groups = new Hono<AppEnv>()
  .post('/', zValidator('json', person.extend({ groupName: z.string().trim().min(1).max(80) })), async (c) => {
    const { groupName, name, email } = c.req.valid('json')
    const id = crypto.randomUUID()
    await c.env.DB.prepare('INSERT INTO groups (id, name, owner_email, created_at) VALUES (?, ?, ?, ?)')
      .bind(id, groupName, email, Date.now())
      .run()
    await sendMagicLink(c, { email, name }, { id, name: groupName })
    return c.json({ ok: true }, 201)
  })

  .get('/:id', async (c) => {
    const group = await getGroup(c.env.DB, c.req.param('id'))
    if (!group) return c.json({ error: 'not_found' }, 404)
    const base = { name: group.name, drawn: group.drawn_at !== null }
    // `member` discriminates the two views (otherwise TS collapses the union to the smaller one)
    const anon = { ...base, member: false as const }
    const email = c.get('email')
    if (!email) return c.json(anon)

    const { results } = await c.env.DB.prepare(
      'SELECT id, email, name, target_id, wishes, wishes_at FROM participants WHERE group_id = ? ORDER BY rowid',
    )
      .bind(group.id)
      .all<Participant>()
    const me = results.find((p) => p.email === email)
    if (!me) return c.json(anon)

    const isOwner = email === group.owner_email
    const nameOf = (id: string | null) => results.find((p) => p.id === id)?.name ?? null
    const target = nameOf(me.target_id)
    return c.json({
      ...base,
      member: true as const,
      isOwner,
      meId: me.id,
      participants: results.map((p) => ({
        id: p.id,
        name: p.name,
        isOwner: p.email === group.owner_email,
        // only the owner sees emails and, after the draw, every pair
        email: isOwner ? p.email : null,
        targetName: isOwner ? nameOf(p.target_id) : null,
        wishes: p.wishes,
        wishesAt: p.wishes_at,
      })),
      target: target ? { name: target } : null,
    })
  })

  .put('/:id/me/wishes', zValidator('json', z.object({ wishes: z.string().trim().max(1000) })), async (c) => {
    const group = await getGroup(c.env.DB, c.req.param('id'))
    if (!group) return c.json({ error: 'not_found' }, 404)
    const email = c.get('email')
    if (!email) return c.json({ error: 'unauthorized' }, 401)
    const { wishes } = c.req.valid('json')
    // empty text clears the suggestion
    const { meta } = await c.env.DB.prepare(
      'UPDATE participants SET wishes = ?, wishes_at = ? WHERE group_id = ? AND email = ?',
    )
      .bind(wishes || null, Date.now(), group.id, email)
      .run()
    if (meta.changes === 0) return c.json({ error: 'not_member' }, 403)
    return c.json({ ok: true })
  })

  .post('/:id/join', zValidator('json', person), async (c) => {
    const group = await getGroup(c.env.DB, c.req.param('id'))
    if (!group) return c.json({ error: 'not_found' }, 404)
    const { name, email } = c.req.valid('json')
    // after the draw only existing participants may log in again
    if (group.drawn_at !== null) {
      const known = await c.env.DB.prepare('SELECT 1 FROM participants WHERE group_id = ? AND email = ?')
        .bind(group.id, email)
        .first()
      if (!known) return c.json({ error: 'already_drawn' }, 409)
    }
    await sendMagicLink(c, { email, name }, group)
    return c.json({ ok: true })
  })

  .post('/:id/participants', zValidator('json', person), async (c) => {
    const group = await getGroup(c.env.DB, c.req.param('id'))
    if (!group) return c.json({ error: 'not_found' }, 404)
    if (c.get('email') !== group.owner_email) return c.json({ error: 'forbidden' }, 403)
    if (group.drawn_at !== null) return c.json({ error: 'already_drawn' }, 409)
    const { name, email } = c.req.valid('json')
    // no email is sent: the person logs in later through the invite link with this same email
    const { meta } = await c.env.DB.prepare(
      'INSERT INTO participants (id, group_id, email, name) VALUES (?, ?, ?, ?) ON CONFLICT (group_id, email) DO NOTHING',
    )
      .bind(crypto.randomUUID(), group.id, email, name)
      .run()
    if (meta.changes === 0) return c.json({ error: 'already_in' }, 409)
    return c.json({ ok: true }, 201)
  })

  .post('/:id/draw', async (c) => {
    const group = await getGroup(c.env.DB, c.req.param('id'))
    if (!group) return c.json({ error: 'not_found' }, 404)
    if (c.get('email') !== group.owner_email) return c.json({ error: 'forbidden' }, 403)
    if (group.drawn_at !== null) return c.json({ error: 'already_drawn' }, 409)
    const { results } = await c.env.DB.prepare('SELECT id FROM participants WHERE group_id = ?')
      .bind(group.id)
      .all<{ id: string }>()
    if (results.length < 3) return c.json({ error: 'too_few' }, 409)

    const db = c.env.DB
    await db.batch([
      // drawn_at guard makes a concurrent second draw a no-op instead of overwriting pairs
      db.prepare('UPDATE groups SET drawn_at = ? WHERE id = ? AND drawn_at IS NULL').bind(Date.now(), group.id),
      ...draw(results.map((p) => p.id)).map(([giver, receiver]) =>
        db.prepare('UPDATE participants SET target_id = ? WHERE id = ? AND target_id IS NULL').bind(receiver, giver),
      ),
    ])
    return c.json({ ok: true })
  })

  .delete('/:id/draw', async (c) => {
    const group = await getGroup(c.env.DB, c.req.param('id'))
    if (!group) return c.json({ error: 'not_found' }, 404)
    if (c.get('email') !== group.owner_email) return c.json({ error: 'forbidden' }, 403)
    if (group.drawn_at === null) return c.json({ error: 'not_drawn' }, 409)
    const db = c.env.DB
    await db.batch([
      db.prepare('UPDATE participants SET target_id = NULL WHERE group_id = ?').bind(group.id),
      db.prepare('UPDATE groups SET drawn_at = NULL WHERE id = ?').bind(group.id),
    ])
    return c.json({ ok: true })
  })

  .delete('/:id/participants/:pid', async (c) => {
    const group = await getGroup(c.env.DB, c.req.param('id'))
    if (!group) return c.json({ error: 'not_found' }, 404)
    if (c.get('email') !== group.owner_email) return c.json({ error: 'forbidden' }, 403)
    if (group.drawn_at !== null) return c.json({ error: 'already_drawn' }, 409)
    const { meta } = await c.env.DB.prepare('DELETE FROM participants WHERE id = ? AND group_id = ? AND email != ?')
      .bind(c.req.param('pid'), group.id, group.owner_email)
      .run()
    if (meta.changes === 0) return c.json({ error: 'not_found' }, 404)
    return c.json({ ok: true })
  })
