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
