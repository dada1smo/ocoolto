import { readFileSync, readdirSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { beforeEach, expect, test, vi } from 'vitest'
import app from './index'
import { sha256 } from './lib/session'

// minimal D1 stand-in over node:sqlite: just the calls the app makes
function fakeD1() {
  const db = new DatabaseSync(':memory:')
  for (const f of readdirSync('migrations').sort()) db.exec(readFileSync(`migrations/${f}`, 'utf8'))
  const prepare = (sql: string, args: unknown[] = []) => ({
    bind: (...a: unknown[]) => prepare(sql, a),
    first: async () => db.prepare(sql).get(...(args as never[])) ?? null,
    all: async () => ({ results: db.prepare(sql).all(...(args as never[])) }),
    run: async () => ({ meta: { changes: Number(db.prepare(sql).run(...(args as never[])).changes) } }),
  })
  return { db, DB: { prepare } as unknown as D1Database }
}

let d1: ReturnType<typeof fakeD1>
let env: Record<string, unknown>
let turnstileOk: boolean
beforeEach(() => {
  d1 = fakeD1()
  turnstileOk = true
  env = {
    DB: d1.DB,
    ENV: 'dev', // magic link goes to console.log instead of Resend
    TURNSTILE_SECRET: 's',
    GLOBAL_EMAIL_LIMIT: '90',
    IP_LIMITER: { limit: async () => ({ success: true }) },
  }
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.stubGlobal('fetch', async () => Response.json({ success: turnstileOk }))
})

const post = (path: string, body: object) =>
  app.request(
    path,
    { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) },
    env,
  )
const create = (email: string) => post('/api/groups', { groupName: 'g', name: 'n', email, turnstile: 't' })
const emails = () => d1.db.prepare('SELECT COUNT(*) AS n FROM email_log').get()!.n

test('invalid turnstile is rejected and sends nothing', async () => {
  turnstileOk = false
  expect((await create('a@x.com')).status).toBe(400)
  expect(emails()).toBe(0)
})

test('find-my-groups also checks turnstile', async () => {
  turnstileOk = false
  expect((await post('/api/auth/request', { email: 'a@x.com', turnstile: 't' })).status).toBe(400)
})

test('per-IP limit answers 429', async () => {
  env.IP_LIMITER = { limit: async () => ({ success: false }) }
  expect((await create('a@x.com')).status).toBe(429)
})

test('2nd email to the same address within 2 minutes is blocked', async () => {
  await create('a@x.com')
  await create('a@x.com')
  expect(emails()).toBe(1)
})

test('5 per address per day', async () => {
  for (let i = 0; i < 5; i++)
    d1.db.prepare('INSERT INTO email_log VALUES (?, ?)').run('a@x.com', Date.now() - 3 * 60_000 * (i + 1))
  await create('a@x.com')
  expect(emails()).toBe(5)
})

test('global cap lowered to 2 blocks the 3rd send', async () => {
  env.GLOBAL_EMAIL_LIMIT = '2'
  for (const e of ['a@x.com', 'b@x.com', 'c@x.com']) await create(e)
  expect(emails()).toBe(2)
})

test('group joins stop at 50 participants', async () => {
  d1.db.prepare("INSERT INTO groups VALUES ('g1', 'g', 'o@x.com', NULL, 0)").run()
  for (let i = 0; i < 50; i++)
    d1.db
      .prepare("INSERT INTO participants (id, group_id, email, name) VALUES (?, 'g1', ?, 'n')")
      .run(`p${i}`, `p${i}@x.com`)
  const res = await post('/api/groups/g1/join', { name: 'n', email: 'new@x.com', turnstile: 't' })
  expect(res.status).toBe(409)
  expect(emails()).toBe(0)
})

test('login token is single-use and expires', async () => {
  const add = (token: string, expires: number) =>
    sha256(token).then((h) =>
      d1.db
        .prepare(
          "INSERT INTO login_tokens (hash, email, name, group_id, expires_at) VALUES (?, 'a@x.com', NULL, NULL, ?)",
        )
        .run(h, expires),
    )
  await add('ok', Date.now() + 60_000)
  await add('old', Date.now() - 1)
  expect((await post('/api/auth', { token: 'ok' })).status).toBe(200)
  expect((await post('/api/auth', { token: 'ok' })).status).toBe(400)
  expect((await post('/api/auth', { token: 'old' })).status).toBe(400)
})
