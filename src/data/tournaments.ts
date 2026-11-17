export type Round = 'last64' | 'last32' | 'last16' | 'quarterFinal' | 'semiFinal' | 'final'
export type PrizeFinish = 'last128' | 'last96' | 'last64' | 'last48' | 'last32' | 'last16' | 'quarterFinal' | 'semiFinal' | 'final' | 'winner' | 'groupThird' | 'groupSecond' | 'prelimLast64' | 'prelimLast32' | 'prelimLast16'
export type PrizeTable = Partial<Record<PrizeFinish, number>>
export type MatchFormat = {
  mode: 'sets' | 'legs'
  firstTo: number
  legsPerSet?: number
  doubleIn?: boolean
  winByTwo?: boolean
  suddenDeathAt?: number
}
export type Tournament = {
  id: string
  name: string
  startDate: string
  endDate: string
  category: 'major' | 'eurotour' | 'floor'
  players: number // Currently simulated bracket size; real event sizes are noted below.
  realPlayers: number
  totalPrizeFund: number
  countsForRanking: boolean
  prizes: PrizeTable
  formats: Record<Exclude<Round, 'last64' | 'last32'>, MatchFormat> & Partial<Pick<Record<Round, MatchFormat>, 'last64' | 'last32'>>
}
const sets = (firstTo: number, legsPerSet: number, doubleIn = false): MatchFormat => ({ mode: 'sets', firstTo, legsPerSet, doubleIn })
const legs = (firstTo: number, suddenDeathAt?: number): MatchFormat => ({ mode: 'legs', firstTo, ...(suddenDeathAt ? { winByTwo: true, suddenDeathAt } : {}) })


const playersChampionshipDates2026 = [
'2026-02-09', '2026-02-10', '2026-02-16', '2026-02-17', '2026-02-24', '2026-02-25', '2026-03-30', '2026-03-31', '2026-04-13', '2026-04-14', '2026-04-27', '2026-04-28', '2026-05-04', '2026-05-05', '2026-05-12', '2026-05-13', '2026-05-18', '2026-05-19', '2026-06-02', '2026-06-03', '2026-06-16', '2026-06-17', '2026-07-06', '2026-07-07', '2026-07-28', '2026-07-29', '2026-08-25', '2026-08-26', '2026-09-22', '2026-09-23', '2026-10-28', '2026-10-29', '2026-11-04', '2026-11-05'
]
const playersChampionships2026: Tournament[] = playersChampionshipDates2026.map((date, index) => ({
  id: `players-championship-${String(index + 1).padStart(2, '0')}-2026`,
  name: `Players Championship ${index + 1}`,
  startDate: date, endDate: date, category: 'floor',
  players: 128, realPlayers: 128, totalPrizeFund: 150000, countsForRanking: true,
  prizes: { last128: 0, last64: 1250, last32: 2000, last16: 3000,
    quarterFinal: 4000, semiFinal: 6500, final: 10000, winner: 15000 },
  formats: { last64: legs(6), last32: legs(6), last16: legs(6),
    quarterFinal: legs(6), semiFinal: legs(7), final: legs(8) },
}))


// 2026 European Tour: 16 world OOM seeds enter in round two; 32 play round one.
const europeanTourDates2026: [string, string, string][] = [
  ['Poland Darts Open','02-20','02-22'],
  ['European Darts Trophy','03-13','03-15'],
  ['Belgian Darts Open','03-20','03-22'],
  ['German Darts Grand Prix','04-04','04-06'],
  ['European Darts Grand Prix','04-17','04-19'],
  ['Austrian Darts Open','05-08','05-10'],
  ['International Darts Open','05-22','05-24'],
  ['Baltic Sea Darts Open','05-29','05-31'],
  ['Slovak Darts Open','06-19','06-21'],
  ['European Darts Open','07-10','07-12'],
  ['Hungarian Darts Trophy','08-28','08-30'],
  ['Czech Darts Open','09-04','09-06'],
  ['Flanders Darts Trophy','09-11','09-13'],
  ['Swiss Darts Trophy','10-09','10-11'],
  ['Dutch Darts Championship','10-16','10-18']
]
const europeanTours2026: Tournament[] = europeanTourDates2026.map(([name, start, end], index) => ({
  id: `european-tour-${String(index + 1).padStart(2, '0')}-2026`, name,
  startDate: `2026-${start}`, endDate: `2026-${end}`, category: 'eurotour',
  players: 48, realPlayers: 48, totalPrizeFund: 230000, countsForRanking: true,
  prizes: { last48: 2000, last32: 3500, last16: 5000, quarterFinal: 8000, semiFinal: 10000, final: 15000, winner: 35000 },
  formats: { last32: legs(6), last16: legs(6), quarterFinal: legs(6), semiFinal: legs(7), final: legs(8) },
}))

const majorTournaments2026: Tournament[] = [
  {
    id: 'world-masters-2026', name: 'Winmau World Masters', startDate: '2026-01-29', endDate: '2026-02-01', category: 'major', players: 32, realPlayers: 32, totalPrizeFund: 500000, countsForRanking: true,
    prizes: { prelimLast64: 750, prelimLast32: 1000, prelimLast16: 2500, last32: 5000, last16: 10000, quarterFinal: 17500, semiFinal: 30000, final: 50000, winner: 100000 },
    formats: { last32: sets(3, 2), last16: sets(4, 2), quarterFinal: sets(4, 2), semiFinal: sets(5, 2), final: sets(6, 2) }
  },
  {
    id: 'uk-open-2026', name: 'UK Open', startDate: '2026-03-06', endDate: '2026-03-08', category: 'major', players: 128, realPlayers: 160, totalPrizeFund: 750000, countsForRanking: true,
    prizes: { last128: 1250, last96: 2000, last64: 3000, last32: 7500, last16: 12500, quarterFinal: 20000, semiFinal: 35000, final: 60000, winner: 120000 },
    formats: { last64: legs(6), last32: legs(6), last16: legs(10), quarterFinal: legs(10), semiFinal: legs(11), final: legs(11) }
  },
  {
    id: 'world-matchplay-2026', name: 'World Matchplay', startDate: '2026-07-18', endDate: '2026-07-26', category: 'major', players: 32, realPlayers: 32, totalPrizeFund: 1000000, countsForRanking: true,
    prizes: { last32: 12500, last16: 22500, quarterFinal: 35000, semiFinal: 65000, final: 125000, winner: 225000 },
    formats: { last32: legs(10, 12), last16: legs(11, 13), quarterFinal: legs(16, 18), semiFinal: legs(17, 19), final: legs(18, 20) }
  },
  {
    id: 'world-grand-prix-2026', name: 'World Grand Prix', startDate: '2026-09-28', endDate: '2026-10-04', category: 'major', players: 32, realPlayers: 32, totalPrizeFund: 750000, countsForRanking: true,
    prizes: { last32: 7500, last16: 20000, quarterFinal: 35000, semiFinal: 50000, final: 80000, winner: 150000 },
    formats: { last32: sets(2, 3, true), last16: sets(3, 3, true), quarterFinal: sets(3, 3, true), semiFinal: sets(5, 3, true), final: sets(6, 3, true) }
  },
  {
    id: 'european-championship-2026', name: 'European Championship', startDate: '2026-10-22', endDate: '2026-10-25', category: 'major', players: 32, realPlayers: 32, totalPrizeFund: 750000, countsForRanking: true,
    prizes: { last32: 7500, last16: 20000, quarterFinal: 35000, semiFinal: 50000, final: 80000, winner: 150000 },
    formats: { last32: legs(6), last16: legs(10), quarterFinal: legs(10), semiFinal: legs(11), final: legs(11) }
  },
  {
    id: 'grand-slam-2026', name: 'Grand Slam of Darts', startDate: '2026-11-14', endDate: '2026-11-22', category: 'major', players: 16, realPlayers: 48, totalPrizeFund: 1000000, countsForRanking: true,
    // 2026: 16 groups of three; group runners-up and third-placed players also earn prize money.
    prizes: { groupThird: 5000, groupSecond: 12500, last16: 20000, quarterFinal: 35000, semiFinal: 60000, final: 100000, winner: 200000 },
    formats: { last16: legs(10), quarterFinal: legs(16), semiFinal: legs(16), final: legs(16) }
  },
  {
    id: 'players-championship-finals-2026', name: 'Players Championship Finals', startDate: '2026-11-27', endDate: '2026-11-29', category: 'major', players: 64, realPlayers: 64, totalPrizeFund: 750000, countsForRanking: true,
    prizes: { last64: 4000, last32: 7000, last16: 15000, quarterFinal: 27500, semiFinal: 40000, final: 70000, winner: 130000 },
    formats: { last64: legs(6), last32: legs(6), last16: legs(10), quarterFinal: legs(10), semiFinal: legs(11), final: legs(11) }
  },
  {
    id: 'world-championship-2026', name: 'World Championship', startDate: '2026-12-11', endDate: '2027-01-03', category: 'major', players: 128, realPlayers: 128, totalPrizeFund: 5000000, countsForRanking: true,
    prizes: { last128: 15000, last64: 25000, last32: 35000, last16: 60000, quarterFinal: 100000, semiFinal: 200000, final: 400000, winner: 1000000 },
    formats: { last64: sets(3, 3), last32: sets(4, 3), last16: sets(4, 3), quarterFinal: sets(5, 3), semiFinal: sets(6, 3), final: sets(7, 3) }
  }

 ]
const baseTournaments2026: Tournament[] = [
  ...majorTournaments2026, ...playersChampionships2026, ...europeanTours2026,
].sort((a, b) => a.startDate.localeCompare(b.startDate))

// Keep the original 2026 fixtures, then repeat each event on the same weekday
// and occurrence within its month (e.g. second Monday, third Friday).
// For events spanning two months/years, preserve the original event duration.
const asLocalDate = (value: string): Date => new Date(`${value}T12:00:00`)
const isoDate = (date: Date): string => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
function repeatStart(base: string, year: number): Date {
  const original = asLocalDate(base)
  const month = original.getMonth()
  const occurrence = Math.floor((original.getDate() - 1) / 7)
  const weekday = original.getDay()
  const first = new Date(year, month, 1, 12)
  const firstMatching = 1 + (weekday - first.getDay() + 7) % 7
  let day = firstMatching + occurrence * 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  if (day > daysInMonth) day -= 7 // fifth weekday does not exist every year
  return new Date(year, month, day, 12)
}
function repeatTournament(base: Tournament, year: number): Tournament {
  if (year === 2026) return base
  const start = repeatStart(base.startDate, year)
  const duration = Math.round((asLocalDate(base.endDate).getTime() - asLocalDate(base.startDate).getTime()) / 86400000)
  const end = new Date(start)
  end.setDate(end.getDate() + duration)
  return { ...base, id: base.id.replace(/-2026$/, `-${year}`), startDate: isoDate(start), endDate: isoDate(end) }
}
const yearCache = new Map<number, Tournament[]>()
export function tournamentsForSeason(year: number): Tournament[] {
  if (!yearCache.has(year)) yearCache.set(year, baseTournaments2026.map(event => repeatTournament(event, year)).sort((a,b) => a.startDate.localeCompare(b.startDate)))
  return yearCache.get(year)!
}
// Mutable cache of nearby seasons is avoided: App can request all past event
// definitions to look up payout categories, and future seasons on demand.
export const tournaments: Tournament[] = baseTournaments2026
export function tournamentById(id: string): Tournament | undefined {
  const match = id.match(/-(\d{4})$/)
  const year = match ? Number(match[1]) : 2026
  return tournamentsForSeason(year).find(event => event.id === id)
}
export function tournamentSeasonId(id: string): string { return id.replace(/-\d{4}$/, '') }
export function tournamentStart(id: string): string | undefined { return tournamentById(id)?.startDate }
export function describeFormat(format: MatchFormat): string {
  if (format.mode === 'sets') return `FIRST TO ${format.firstTo} SETS · FIRST TO ${format.legsPerSet} LEGS PER SET${format.doubleIn ? ' · DOUBLE IN / DOUBLE OUT' : ''}`
  return `FIRST TO ${format.firstTo} LEGS${format.winByTwo ? ` · WIN BY 2 (DECIDER AT ${format.suddenDeathAt}–${format.suddenDeathAt})` : ''}`
}
