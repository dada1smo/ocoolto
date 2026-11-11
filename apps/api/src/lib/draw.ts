/** Shuffles ids (Fisher-Yates, crypto RNG) and returns [giver, receiver] pairs forming one cycle. */
export function draw(ids: string[]): [string, string][] {
  const a = [...ids]
  for (let i = a.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a.map((id, i) => [id, a[(i + 1) % a.length]])
}
