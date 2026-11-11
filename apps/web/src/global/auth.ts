import { api, request } from './api'

/** Spends the magic-link token; the API sets the session cookie. */
export const login = (token: string) => request(api.auth.$post({ json: { token } }))
