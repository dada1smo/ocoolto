import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { sendMagicLink } from '../lib/email'
import { sha256, startSession, type AppEnv } from '../lib/session'
import { groupsOf } from './me'

type Token = { email: string; name: string | null; group_id: string | null }

export const auth = new Hono<AppEnv>()
  // "find my groups": same answer whether or not the email has groups, so it can't be used to probe emails
  .post('/request', zValidator('json', z.object({ email: z.email().trim().toLowerCase() })), async (c) => {
    const { email } = c.req.valid('json')
    if ((await groupsOf(c.env.DB, email)).length > 0) await sendMagicLink(c, { email })
    return c.json({ ok: true })
  })

  .post('/', zValidator('json', z.object({ token: z.string().min(1) })), async (c) => {
    const db = c.env.DB
    // marks the token used and returns it in one statement, so it can't be spent twice
    const tok = await db
      .prepare(
        'UPDATE login_tokens SET used_at = ?1 WHERE hash = ?2 AND used_at IS NULL AND expires_at > ?1 RETURNING email, name, group_id',
      )
      .bind(Date.now(), await sha256(c.req.valid('json').token))
      .first<Token>()
    if (!tok) return c.json({ error: 'invalid_token' }, 400)
    if (tok.group_id === null) {
      // login-only token (find my groups): no group to join
      await startSession(c, tok.email)
      return c.json({ groupId: null })
    }

    const group = await db
      .prepare('SELECT drawn_at FROM groups WHERE id = ?')
      .bind(tok.group_id)
      .first<{ drawn_at: number | null }>()
    if (!group) return c.json({ error: 'not_found' }, 404)
    if (group.drawn_at === null) {
      await db
        .prepare(
          'INSERT INTO participants (id, group_id, email, name) VALUES (?, ?, ?, ?) ON CONFLICT (group_id, email) DO UPDATE SET name = excluded.name',
        )
        .bind(crypto.randomUUID(), tok.group_id, tok.email, tok.name ?? '')
        .run()
    } else {
      // after the draw nobody new gets in; existing participants just log back in
      const known = await db
        .prepare('SELECT 1 FROM participants WHERE group_id = ? AND email = ?')
        .bind(tok.group_id, tok.email)
        .first()
      if (!known) return c.json({ error: 'already_drawn' }, 409)
    }
    await startSession(c, tok.email)
    return c.json({ groupId: tok.group_id })
  })
