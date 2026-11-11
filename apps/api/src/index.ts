import { Hono } from 'hono'
import { session, type AppEnv } from './lib/session'
import { groups } from './routes/groups'
import { auth } from './routes/auth'

const app = new Hono<AppEnv>().basePath('/api')

const routes = app
  .use(session)
  .get('/health', (c) => c.json({ status: 'ok' }))
  .route('/groups', groups)
  .route('/auth', auth)

export type AppType = typeof routes
export default app
