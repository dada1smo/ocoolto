import { api, request } from './api'

/** Spends the magic-link token; the API sets the session cookie. `groupId` is null for "find my groups" links. */
export const login = (token: string) => request(api.auth.$post({ json: { token } }))

/** Emails a login link if the address has groups; the answer is the same either way. */
export const requestLink = (email: string) => request(api.auth.request.$post({ json: { email } }))
