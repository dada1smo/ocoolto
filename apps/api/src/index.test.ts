import { expect, test } from 'vitest'
import app from './index'

test('GET /api/health', async () => {
  const res = await app.request('/api/health')
  expect(res.status).toBe(200)
  expect(await res.json()).toEqual({ status: 'ok' })
})

test('GET /api/me/root is forbidden without a root session', async () => {
  const res = await app.request('/api/me/root')
  expect(res.status).toBe(403)
})

test('POST /api/auth/logout works without a session and clears the cookie', async () => {
  const res = await app.request('/api/auth/logout', { method: 'POST' })
  expect(res.status).toBe(200)
  expect(res.headers.get('set-cookie')).toContain('sid=;')
})
