import type { Context } from 'hono'
import type { AppEnv } from './session'
import { sha256 } from './session'

const TOKEN_MS = 15 * 60 * 1000
const LIMIT = 3 // emails per address per hour

/** Creates a single-use login token and emails the magic link. Without a group the link only logs in. */
export async function sendMagicLink(
  c: Context<AppEnv>,
  to: { email: string; name?: string },
  group?: { id: string; name: string },
) {
  // over the limit: skip silently, so the response never reveals anything about the address
  const since = Date.now() - 60 * 60 * 1000
  const sent = await c.env.DB.prepare('SELECT COUNT(*) AS n FROM email_log WHERE email = ? AND sent_at > ?')
    .bind(to.email, since)
    .first<{ n: number }>()
  if (sent!.n >= LIMIT && c.env.ENV !== 'dev') return
  await c.env.DB.prepare('INSERT INTO email_log (email, sent_at) VALUES (?, ?)').bind(to.email, Date.now()).run()

  const token = crypto.randomUUID()
  await c.env.DB.prepare('INSERT INTO login_tokens (hash, email, name, group_id, expires_at) VALUES (?, ?, ?, ?, ?)')
    .bind(await sha256(token), to.email, to.name ?? null, group?.id ?? null, Date.now() + TOKEN_MS)
    .run()
  const link = `${new URL(c.req.url).origin}/auth?t=${token}`

  if (c.env.ENV === 'dev') {
    console.log(`\n✉️  magic link para ${to.email} (${group?.name ?? 'meus grupos'}): ${link}\n`)
    return
  }
  const groupName = group && escapeHtml(group.name.slice(0, 40))
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${c.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: c.env.EMAIL_FROM,
      to: to.email,
      subject: group ? `Seu link para o amigo oculto ${group.name.slice(0, 40)}` : 'Seus grupos de amigo oculto',
      html: `<p>${group ? `Clique para entrar no amigo oculto <b>${groupName}</b>:` : 'Clique para ver os seus grupos de amigo oculto:'}</p><p><a href="${link}">Entrar</a></p><p>O link vale por 15 minutos.</p>`,
    }),
  })
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`)
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!)
