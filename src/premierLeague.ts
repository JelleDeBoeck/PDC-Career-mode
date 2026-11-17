/** Premier League career calendar: 2027 official route, 2026 competition rules. */
export const PREMIER_LEAGUE_CITIES = [
  'Glasgow', 'Berlin', 'Newcastle', 'Belfast', 'Cardiff', 'Nottingham',
  'Dublin', 'Antwerp', 'Brighton', 'Manchester', 'Rotterdam', 'Liverpool',
  'Birmingham', 'Leeds', 'Aberdeen', 'Sheffield', 'London',
] as const
export type PremierNight = { year: number; night: number; date: string; city: string; finals: boolean; id: string }
const iso = (date: Date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
/** 2027 begins on first Thursday in February; every later season uses the same Thursday cadence. */
export function premierLeagueNights(year: number): PremierNight[] {
  if (year < 2027) return []
  const first = new Date(year, 1, 1, 12)
  first.setDate(1 + (4 - first.getDay() + 7) % 7)
  return PREMIER_LEAGUE_CITIES.map((city, index) => {
    const date = new Date(first)
    date.setDate(first.getDate() + 7 * index)
    return { year, night: index + 1, date: iso(date), city, finals: index === 16, id: `premier-league-night-${index+1}-${year}` }
  })
}
export const PREMIER_LEAGUE_PRIZES_2026 = {
  champion: 350000, runnerUp: 170000, semiFinalist: 110000,
  fifth: 95000, sixth: 90000, seventh: 85000, eighth: 80000,
  nightlyWinner: 10000,
} as const
export const PREMIER_LEAGUE_POINTS = { champion: 5, finalist: 3, semiFinalist: 2, quarterFinalist: 0 } as const
/** Round-robin quarter-final opponents for nights 1-7 and 9-15.
 * The caller must supply a fixed, saved order of the eight invited players.
 * On nights 8/16 the caller must instead use the CURRENT table order.
 */
export function premierQuarterFinalPairs(night: number, lineup: number[], tableOrder?: number[]): [number, number][] {
  if (lineup.length !== 8 || new Set(lineup).size !== 8) throw new Error('Premier League requires eight unique invitees')
  if (night === 8 || night === 16) {
    if (!tableOrder || tableOrder.length !== 8) throw new Error('Current league table required on nights 8 and 16')
    return [[tableOrder[0],tableOrder[7]],[tableOrder[1],tableOrder[6]],
      [tableOrder[2],tableOrder[5]],[tableOrder[3],tableOrder[4]]]
  }
  if (night < 1 || night > 15) throw new Error('Invalid regular league night')
  const roundRobinRound = (night <= 7 ? night - 1 : night - 9)
  const rotated = [...lineup]
  for (let i = 0; i < roundRobinRound; i++) rotated.splice(1, 0, rotated.pop()!)
  return Array.from({length: 4}, (_, i) => [rotated[i],rotated[7-i]] as [number,number])
}
export function premierFinalsPairs(tableOrder: number[]): [number, number][] {
  if (tableOrder.length < 4) throw new Error('Finals require top four')
  return [[tableOrder[0],tableOrder[3]],[tableOrder[1],tableOrder[2]]]
}
