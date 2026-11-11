import { hc } from 'hono/client'
import type { AppType } from '@ocoolto/api'

export const api = hc<AppType>('/').api

const messages: Record<string, string> = {
  not_found: 'Não encontrado.',
  forbidden: 'Só o organizador pode fazer isso.',
  not_member: 'Você não participa deste grupo.',
  unauthorized: 'Entre no grupo para continuar.',
  already_drawn: 'O sorteio deste grupo já foi feito.',
  already_in: 'Essa pessoa já está no grupo.',
  too_few: 'O sorteio precisa de pelo menos 3 pessoas.',
  invalid_token: 'Link inválido ou expirado. Peça um novo.',
}

type SuccessBody<R> = R extends { ok: false } ? never : R extends { json(): Promise<infer T> } ? T : never

/** Awaits a typed Hono call; returns the success body or throws an Error with a pt-BR message. */
export async function request<R extends { ok: boolean; json(): Promise<unknown> }>(call: Promise<R>) {
  const res = await call
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: unknown }
    const msg = typeof body.error === 'string' ? messages[body.error] : undefined
    throw new Error(msg ?? 'Algo deu errado. Tente de novo.')
  }
  return (await res.json()) as SuccessBody<R>
}
