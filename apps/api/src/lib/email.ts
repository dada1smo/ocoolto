import type { Context } from 'hono'
import type { AppEnv } from './session'
import { sha256 } from './session'

const TOKEN_MS = 15 * 60 * 1000

/** Creates a single-use login token for (email, group) and emails the magic link. */
export async function sendMagicLink(c: Context<AppEnv>, to: { email: string; name: string }, group: { id: string; name: string }) {
  const token = crypto.randomUUID()
  await c.env.DB.prepare('INSERT INTO login_tokens (hash, email, name, group_id, expires_at) VALUES (?, ?, ?, ?, ?)')
    .bind(await sha256(token), to.email, to.name, group.id, Date.now() + TOKEN_MS)
    .run()
  const link = `${new URL(c.req.url).origin}/auth?t=${token}`

  if (c.env.ENV === 'dev') {
    console.log(`\n✉️  magic link para ${to.email} (${group.name}): ${link}\n`)
    return
  }
  const groupName = escapeHtml(group.name.slice(0, 40))
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${c.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: c.env.EMAIL_FROM,
      to: to.email,
      subject: `Seu link para o amigo oculto ${group.name.slice(0, 40)}`,
      html: `<p>Clique para entrar no amigo oculto <b>${groupName}</b>:</p><p><a href="${link}">Entrar</a></p><p>O link vale por 15 minutos.</p>`,
    }),
  })
  if (!res.ok) throw new Error(`resend ${res.status}: ${await res.text()}`)
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!)
