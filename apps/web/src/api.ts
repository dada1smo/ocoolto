import { hc } from 'hono/client'
import type { AppType } from '@ocoolto/api'

export const api = hc<AppType>('/').api
