/** Grand Slam 2026 group engine. Bracket policy is intentionally configurable:
 * 2026 uses 16 group winners advancing to the last 16.
 */
export type SlamPlayer = { id: number; rank: number }
export type SlamMatch = { a: number; b: number; aLegs: number | null; bLegs: number | null; aAgainstThrow?: number; bAgainstThrow?: number; aAverage?: number; bAverage?: number }
export type SlamGroup = { name: string; players: number[]; matches: SlamMatch[] }
export type SlamStanding = { id: number; played: number; wins: number; points: number; legsFor: number; legsAgainst: number; difference: number; againstThrow: number; average: number }
export type SlamTiebreak = { group: string; playerId: number; nineDartScore: number; extraDartScores?: number[] }
const letters = 'ABCDEFGHIJKLMNOP'
export function shuffle<T>(values: T[], rng: () => number = Math.random): T[] {
  const result = [...values]
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [result[i], result[j]] = [result[j], result[i]] }
  return result
}
export function createSlamGroups(ranking: SlamPlayer[], rng: () => number = Math.random): SlamGroup[] {
  if (ranking.length < 48) throw new Error('48 ranked players required')
  const sorted = [...ranking].sort((a, b) => a.rank - b.rank || a.id - b.id)
  const qualified = [...sorted.slice(0, 16), ...shuffle(sorted.slice(16), rng).slice(0, 32)]
  if (new Set(qualified.map(p => p.id)).size !== 48) throw new Error('Duplicate player ID')
  const pots = [qualified.slice(0, 16), shuffle(qualified.slice(16, 32), rng), shuffle(qualified.slice(32, 48), rng)]
  return Array.from({ length: 16 }, (_, i) => {
    const ids = pots.map(p => p[i].id)
    return { name: letters[i], players: ids, matches: [
      { a: ids[0], b: ids[1], aLegs: null, bLegs: null },
      { a: ids[0], b: ids[2], aLegs: null, bLegs: null },
      { a: ids[1], b: ids[2], aLegs: null, bLegs: null },
    ] }
  })
}
export function recordSlamMatch(group: SlamGroup, index: number, aLegs: number, bLegs: number, stats: Partial<SlamMatch> = {}): SlamGroup {
  const m = group.matches[index]
  if (!m) throw new Error('Unknown group match')
  if (!Number.isInteger(aLegs) || !Number.isInteger(bLegs) || (aLegs !== 5 && bLegs !== 5) || Math.min(aLegs, bLegs) < 0 || Math.max(aLegs, bLegs) !== 5 || aLegs === bLegs) throw new Error('Group matches are first to 5 legs')
  return { ...group, matches: group.matches.map((item, i) => i === index ? { ...item, ...stats, a: m.a, b: m.b, aLegs, bLegs } : item) }
}
export function slamStandings(group: SlamGroup, shootouts: SlamTiebreak[] = []): { standings: SlamStanding[]; unresolved: number[][] } {
  const standings = group.players.map(id => ({ id, played: 0, wins: 0, points: 0, legsFor: 0, legsAgainst: 0, difference: 0, againstThrow: 0, average: 0 }))
  const avgs = new Map<number, number[]>()
  for (const match of group.matches) {
    if (match.aLegs === null || match.bLegs === null) continue
    for (const [id, own, other, against, avg] of [
      [match.a, match.aLegs, match.bLegs, match.aAgainstThrow, match.aAverage],
      [match.b, match.bLegs, match.aLegs, match.bAgainstThrow, match.bAverage],
    ] as const) {
      const row = standings.find(s => s.id === id)!
      row.played++; row.legsFor += own; row.legsAgainst += other; row.difference += own - other
      row.againstThrow += against ?? 0
      if (own > other) { row.wins++; row.points += 2 }
      if (avg !== undefined) avgs.set(id, [...(avgs.get(id) ?? []), avg])
    }
  }
  for (const row of standings) { const vals = avgs.get(row.id) ?? []; row.average = vals.length ? vals.reduce((a,b) => a+b,0)/vals.length : 0 }
  const headToHead = (a: number, b: number): number => {
    const m = group.matches.find(m => (m.a === a && m.b === b) || (m.a === b && m.b === a))
    if (!m || m.aLegs === null || m.bLegs === null) return 0
    return m.aLegs > m.bLegs ? (m.a === a ? -1 : 1) : (m.b === a ? -1 : 1)
  }
  // The published 2025 rulebook is used provisionally until PDC publishes 2026 tiebreak wording.
  const primary = (a: SlamStanding, b: SlamStanding) => b.points - a.points || b.difference - a.difference
  standings.sort((a,b) => primary(a,b))
  let start = 0
  const unresolved: number[][] = []
  while (start < standings.length) {
    let end = start + 1
    while (end < standings.length && primary(standings[start], standings[end]) === 0) end++
    if (end - start > 1) {
      const tied = standings.slice(start, end)
      if (tied.length === 2) tied.sort((a,b) => headToHead(a.id,b.id))
      else tied.sort((a,b) => b.legsFor-a.legsFor || b.againstThrow-a.againstThrow || b.average-a.average)
      standings.splice(start, end-start, ...tied)
      let x = start
      while (x < end) {
        let y = x+1
        const equal = (a: SlamStanding,b: SlamStanding) => tied.length === 2 ? headToHead(a.id,b.id) === 0 : a.legsFor === b.legsFor && a.againstThrow === b.againstThrow && a.average === b.average
        while (y < end && equal(standings[x],standings[y])) y++
        if (y-x>1) {
          const subset = standings.slice(x,y)
          const results = subset.map(p => shootouts.find(s => s.group === group.name && s.playerId === p.id))
          const byId = new Map(subset.map((p,i) => [p.id, results[i]]))
          if (results.every(Boolean)) {
            subset.sort((a,b) => {
              const aa=byId.get(a.id)!
              const bb=byId.get(b.id)!
              return bb.nineDartScore-aa.nineDartScore || (bb.extraDartScores ?? []).reduce((s,v)=>s+v,0)-(aa.extraDartScores ?? []).reduce((s,v)=>s+v,0)
            })
            standings.splice(x,y-x,...subset)
            if (subset.length>1 && subset[0].id !== subset[1].id && results.every(r => r!.nineDartScore === results[0]!.nineDartScore) && results.every(r => !(r!.extraDartScores?.length))) unresolved.push(subset.map(p=>p.id))
          } else unresolved.push(subset.map(p=>p.id))
        }
        x=y
      }
    }
    start=end
  }
  return { standings, unresolved }
}
export function slamGroupFinished(group: SlamGroup): boolean { return group.matches.every(m => m.aLegs !== null && m.bLegs !== null) }
export function slamWinnerDraw(groups: SlamGroup[], shootouts: SlamTiebreak[] = []): number[] {
  if (groups.length !== 16 || groups.some(g => !slamGroupFinished(g))) throw new Error('All 16 groups must finish')
  const winners = groups.map(g => { const result = slamStandings(g,shootouts); if (result.unresolved.length) throw new Error(`Unresolved tiebreak in group ${g.name}`); return result.standings[0].id })
  // Provisional adjacent-group pairing: A-B, C-D, ... ; subject to official 2026 bracket.
  return winners
}
export function slamPrizeForGroupFinish(position: number): number { return position === 1 ? 20000 : position === 2 ? 12500 : position === 3 ? 5000 : 0 }
