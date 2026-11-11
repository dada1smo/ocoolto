import { expect, test } from 'vitest'
import { draw } from './draw'

test('draw is a single cycle with no self-pick, for N from 3 to 50', () => {
  for (let n = 3; n <= 50; n++) {
    const ids = Array.from({ length: n }, (_, i) => `p${i}`)
    const pairs = new Map(draw(ids))
    // permutation: everyone gives once and receives once
    expect([...pairs.keys()].sort()).toEqual([...ids].sort())
    expect([...pairs.values()].sort()).toEqual([...ids].sort())
    for (const [giver, receiver] of pairs) expect(giver).not.toBe(receiver)
    // single cycle: walking from p0 visits all n before returning
    let cur = ids[0]
    for (let step = 1; step < n; step++) {
      cur = pairs.get(cur)!
      expect(cur).not.toBe(ids[0])
    }
    expect(pairs.get(cur)).toBe(ids[0])
  }
})
