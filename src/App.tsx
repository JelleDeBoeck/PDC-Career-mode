import { premierLeagueNights, premierQuarterFinalPairs, premierFinalsPairs, PREMIER_LEAGUE_PRIZES_2026 } from './premierLeague'
import { Fragment, useEffect, useRef, useState } from 'react'
import 'flag-icons/css/flag-icons.min.css'
import { tournamentsForSeason, tournamentById, tournamentSeasonId, tournamentStart, type Round } from './data/tournaments'
import './App.css'
import './PdcTheme.css'
import './TournamentDrawEnhancements.css'
import MatchScreen from './MatchScreen'
import PremierLeagueReveal from './PremierLeagueReveal'
import { skillTierFromStartingRank, winChanceForFirstPlayer } from './aiSkill'
import { createSlamGroups, recordSlamMatch, slamStandings, slamGroupFinished, type SlamGroup, type SlamTiebreak } from './grandSlam'

type Player = {
  id: number
  rank: number
  name: string
  country: string
  image: string
}

const originalPlayers: Player[] = [
  { id: 1, rank: 1, name: 'Luke Littler', country: 'England', image: 'luke-littler' },
  { id: 2, rank: 2, name: 'Luke Humphries', country: 'England', image: 'luke-humphries' },
  { id: 3, rank: 3, name: 'Gian van Veen', country: 'Netherlands', image: 'gian-van-veen' },
  { id: 4, rank: 4, name: 'Gerwyn Price', country: 'Wales', image: 'gerwyn-price' },
  { id: 5, rank: 5, name: 'James Wade', country: 'England', image: 'james-wade' },
  { id: 6, rank: 6, name: 'Jonny Clayton', country: 'Wales', image: 'jonny-clayton' },
  { id: 7, rank: 7, name: 'Danny Noppert', country: 'Netherlands', image: 'danny-noppert' },
  { id: 8, rank: 8, name: 'Josh Rock', country: 'Northern Ireland', image: 'josh-rock' },
  { id: 9, rank: 9, name: 'Michael van Gerwen', country: 'Netherlands', image: 'michael-van-gerwen' },
  { id: 10, rank: 10, name: 'Gary Anderson', country: 'Scotland', image: 'gary-anderson' },
  { id: 11, rank: 11, name: 'Nathan Aspinall', country: 'England', image: 'nathan-aspinall' },
  { id: 12, rank: 12, name: 'Wessel Nijman', country: 'Netherlands', image: 'wessel-nijman' },
  { id: 13, rank: 13, name: 'Stephen Bunting', country: 'England', image: 'stephen-bunting' },
  { id: 14, rank: 14, name: 'Ryan Searle', country: 'England', image: 'ryan-searle' },
  { id: 15, rank: 15, name: 'Ross Smith', country: 'England', image: 'ross-smith' },
  { id: 16, rank: 16, name: 'Jermaine Wattimena', country: 'Netherlands', image: 'jermaine-wattimena' },
  { id: 17, rank: 17, name: 'Chris Dobey', country: 'England', image: 'chris-dobey' },
  { id: 18, rank: 18, name: 'Luke Woodhouse', country: 'England', image: 'luke-woodhouse' },
  { id: 19, rank: 19, name: 'Krzysztof Ratajski', country: 'Poland', image: 'krzysztof-ratajski' },
  { id: 20, rank: 20, name: 'Dirk van Duijvenbode', country: 'Netherlands', image: 'dirk-van-duijvenbode' },
  { id: 21, rank: 21, name: 'Damon Heta', country: 'Australia', image: 'damon-heta' },
  { id: 22, rank: 22, name: 'Rob Cross', country: 'England', image: 'rob-cross' },
  { id: 23, rank: 23, name: 'Martin Schindler', country: 'Germany', image: 'martin-schindler' },
  { id: 24, rank: 24, name: 'Ryan Joyce', country: 'England', image: 'ryan-joyce' },
  { id: 25, rank: 25, name: 'Cameron Menzies', country: 'Scotland', image: 'cameron-menzies' },
  { id: 26, rank: 26, name: 'Kevin Doets', country: 'Netherlands', image: 'kevin-doets' },
  { id: 27, rank: 27, name: 'Andrew Gilding', country: 'England', image: 'andrew-gilding' },
  { id: 28, rank: 28, name: 'Daryl Gurney', country: 'Northern Ireland', image: 'daryl-gurney' },
  { id: 29, rank: 29, name: 'Niels Zonneveld', country: 'Netherlands', image: 'niels-zonneveld' },
  { id: 30, rank: 30, name: 'Dave Chisnall', country: 'England', image: 'dave-chisnall' },
  { id: 31, rank: 31, name: 'Joe Cullen', country: 'England', image: 'joe-cullen' },
  { id: 32, rank: 32, name: 'Ritchie Edhouse', country: 'England', image: 'ritchie-edhouse' },
  { id: 33, rank: 33, name: 'Mike De Decker', country: 'Belgium', image: 'mike-de-decker' },
  { id: 34, rank: 34, name: 'William O\'Connor', country: 'Ireland', image: "william-o'connor" },
  { id: 35, rank: 35, name: 'Ricardo Pietreczko', country: 'Germany', image: 'ricardo-pietreczko' },
  { id: 36, rank: 36, name: 'Peter Wright', country: 'Scotland', image: 'peter-wright' },
  { id: 37, rank: 37, name: 'Niko Springer', country: 'Germany', image: 'niko-springer' },
  { id: 38, rank: 38, name: 'Michael Smith', country: 'England', image: 'michael-smith' },
  { id: 39, rank: 39, name: 'Callan Rydz', country: 'England', image: 'callan-rydz' },
  { id: 40, rank: 40, name: 'Justin Hood', country: 'England', image: 'justin-hood' },
  { id: 41, rank: 41, name: 'Martin Lukeman', country: 'England', image: 'martin-lukeman' },
  { id: 42, rank: 42, name: 'Mickey Mansell', country: 'Ireland', image: 'mickey-mansell' },
  { id: 43, rank: 43, name: 'Jeffrey de Graaf', country: 'Sweden', image: 'jeffrey-de-graaf' },
  { id: 44, rank: 44, name: 'Raymond van Barneveld', country: 'Netherlands', image: 'raymond-van-barneveld' },
  { id: 45, rank: 45, name: 'Madars Razma', country: 'Latvia', image: 'madars-razma' },
  { id: 46, rank: 46, name: 'James Hurrell', country: 'England', image: 'james-hurrell' },
  { id: 47, rank: 47, name: 'Gabriel Clemens', country: 'Germany', image: 'gabriel-clemens' },
  { id: 48, rank: 48, name: 'Karel Sedlacek', country: 'Czech Republic', image: 'karel-sedlacek' },
  { id: 49, rank: 49, name: 'Scott Williams', country: 'England', image: 'scott-williams' },
  { id: 50, rank: 50, name: 'Connor Scutt', country: 'England', image: 'connor-scutt' },
  { id: 51, rank: 51, name: 'Kim Huybrechts', country: 'Belgium', image: 'kim-huybrechts' },
  { id: 52, rank: 52, name: 'Ricky Evans', country: 'England', image: 'ricky-evans' },
  { id: 53, rank: 53, name: 'Brendan Dolan', country: 'Ireland', image: 'brendan-dolan' },
  { id: 54, rank: 54, name: 'Sebastian Bialecki', country: 'Poland', image: 'sebastian-bialecki' },
  { id: 55, rank: 55, name: 'Keane Barry', country: 'Ireland', image: 'keane-barry' },
  { id: 56, rank: 56, name: 'Mensur Suljovic', country: 'Austria', image: 'mensur-suljovic' },
  { id: 57, rank: 57, name: 'Ian White', country: 'England', image: 'ian-white' },
  { id: 58, rank: 58, name: 'Richard Veenstra', country: 'Netherlands', image: 'richard-veenstra' },
  { id: 59, rank: 59, name: 'Dimitri Van den Bergh', country: 'Belgium', image: 'dimitri-van-den-bergh' },
  { id: 60, rank: 60, name: 'Alan Soutar', country: 'Scotland', image: 'alan-soutar' },
  { id: 61, rank: 61, name: 'Rob Owen', country: 'Wales', image: 'rob-owen' },
  { id: 62, rank: 62, name: 'Bradley Brooks', country: 'England', image: 'bradley-brooks' },
  { id: 63, rank: 63, name: 'Ryan Meikle', country: 'England', image: 'ryan-meikle' },
  { id: 64, rank: 64, name: 'Lukas Wenig', country: 'Germany', image: 'lukas-wenig' },
  { id: 65, rank: 65, name: 'Max Hopp', country: 'Germany', image: 'max-hopp' },
  { id: 66, rank: 66, name: 'Nick Kenny', country: 'Wales', image: 'nick-kenny' },
  { id: 67, rank: 67, name: 'Mario Vandenbogaerde', country: 'Belgium', image: 'mario-vandenbogaerde' },
  { id: 68, rank: 68, name: 'Cam Crabtree', country: 'England', image: 'cam-crabtree' },
  { id: 69, rank: 69, name: 'Thibault Tricole', country: 'France', image: 'thibault-tricole' },
  { id: 70, rank: 70, name: 'Wesley Plaisier', country: 'Netherlands', image: 'wesley-plaisier' },
  { id: 71, rank: 71, name: 'Cristo Reyes', country: 'Spain', image: 'cristo-reyes' },
  { id: 72, rank: 72, name: 'Maik Kuivenhoven', country: 'Netherlands', image: 'maik-kuivenhoven' },
  { id: 73, rank: 73, name: 'Adam Lipscombe', country: 'England', image: 'adam-lipscombe' },
  { id: 74, rank: 74, name: 'Beau Greaves', country: 'England', image: 'beau-greaves' },
  { id: 75, rank: 75, name: 'Tom Bissell', country: 'England', image: 'tom-bissell' },
  { id: 76, rank: 76, name: 'Darryl Pilgrim', country: 'England', image: 'darryl-pilgrim' },
  { id: 77, rank: 77, name: 'Cor Dekker', country: 'Norway', image: 'cor-dekker' },
  { id: 78, rank: 78, name: 'Dominik Gruellich', country: 'Germany', image: 'dominik-gruellich' },
  { id: 79, rank: 79, name: 'Christian Kist', country: 'Netherlands', image: 'christian-kist' },
  { id: 80, rank: 80, name: 'Tom Sykes', country: 'England', image: 'tom-sykes' },
  { id: 81, rank: 81, name: 'Andy Boulton', country: 'Scotland', image: 'andy-boulton' },
  { id: 82, rank: 82, name: 'Jim Long', country: 'Canada', image: 'jim-long' },
  { id: 83, rank: 83, name: 'Oskar Lukasiak', country: 'Sweden', image: 'oskar-lukasiak' },
  { id: 84, rank: 84, name: 'Charlie Manby', country: 'England', image: 'charlie-manby' },
  { id: 85, rank: 85, name: 'Thomas Lovely', country: 'England', image: 'thomas-lovely' },
  { id: 86, rank: 86, name: 'Jimmy van Schie', country: 'Netherlands', image: 'jimmy-van-schie' },
  { id: 87, rank: 87, name: 'Leon Weber', country: 'Germany', image: 'lean-weber' },
  { id: 88, rank: 88, name: 'Darius Labanauskas', country: 'Lithuania', image: 'darius-labanauskas' },
  { id: 89, rank: 89, name: 'Marvin van Velzen', country: 'Netherlands', image: 'marvin-van-velzen' },
  { id: 90, rank: 90, name: 'Tavis Dudeney', country: 'England', image: 'tavis-dudeney' },
  { id: 91, rank: 91, name: 'Viktor Tingstrom', country: 'Sweden', image: 'viktor-tingstrom' },
  { id: 92, rank: 92, name: 'Shane McGuirk', country: 'Ireland', image: 'shane-mcguirk' },
  { id: 93, rank: 93, name: 'Alexander Merkx', country: 'Netherlands', image: 'alexander-merkx' },
  { id: 94, rank: 94, name: 'Adam Gawlas', country: 'Czech Republic', image: 'adam-gawlas' },
  { id: 95, rank: 95, name: 'Kai Gotthardt', country: 'Germany', image: 'kai-gotthardt' },
  { id: 96, rank: 96, name: 'Adam Paxton', country: 'England', image: 'adam-paxton' },
  { id: 97, rank: 97, name: 'Greg Ritchie', country: 'Scotland', image: 'greg-ritchie' },
  { id: 98, rank: 98, name: 'David Sharp', country: 'Scotland', image: 'david-sharp' },
  { id: 99, rank: 99, name: 'Jeffrey De Zwaan', country: 'Netherlands', image: 'jeffrey-de-zwaan' },
  { id: 100, rank: 100, name: 'Owen Bates', country: 'England', image: 'owen-bates' },
  { id: 101, rank: 101, name: 'Mervyn King', country: 'England', image: 'mervyn-king' },
  { id: 102, rank: 102, name: 'Adam Warner', country: 'England', image: 'adam-warner' },
  { id: 103, rank: 103, name: 'Jurjen van der Velde', country: 'Netherlands', image: 'jurjen-van-der-velde' },
  { id: 104, rank: 104, name: 'Dennie Olde Kalter', country: 'Netherlands', image: 'dennie-olde-kalter' },
  { id: 105, rank: 105, name: 'Chris Landman', country: 'Netherlands', image: 'chris-landman' },
  { id: 106, rank: 106, name: 'Benjamin Pratnemer', country: 'Slovenia', image: 'benjamin-pratnemer' },
  { id: 107, rank: 107, name: 'Stephen Burton', country: 'England', image: 'stephen-burton' },
  { id: 108, rank: 108, name: 'Jeffrey Sparidaans', country: 'Netherlands', image: 'jeffrey-sparidaans' },
  { id: 109, rank: 109, name: 'Tyler Thorpe', country: 'England', image: 'tyler-thorpe' },
  { id: 110, rank: 110, name: 'Niall Culleton', country: 'Ireland', image: 'niall-culleton' },
  { id: 111, rank: 111, name: 'Arno Merk', country: 'Germany', image: 'arno-merk' },
  { id: 112, rank: 112, name: 'Sietse Lap', country: 'Netherlands', image: 'sietse-lap' },
  { id: 113, rank: 113, name: 'Maximilian Czerwinski', country: 'Germany', image: 'maximilian-czerwinski' },
  { id: 114, rank: 114, name: 'Rhys Griffin', country: 'Wales', image: 'rhys-griffin' },
  { id: 115, rank: 115, name: 'Adam Leek', country: 'Australia', image: 'adam-leek' },
  { id: 116, rank: 116, name: 'Stephen Rosney', country: 'Ireland', image: 'stephen-rosney' },
  { id: 117, rank: 117, name: 'Stefaan Henderyck', country: 'Belgium', image: 'stefaan-henderyck' },
  { id: 118, rank: 118, name: 'Stefan Bellmont', country: 'Switzerland', image: 'stefan-bellmont' },
  { id: 119, rank: 119, name: 'Tytus Kanik', country: 'Poland', image: 'tytus-kanik' },
  { id: 120, rank: 120, name: 'Samuel Price', country: 'England', image: 'samuel-price' },
  { id: 121, rank: 121, name: 'Carl Sneyd', country: 'England', image: 'carl-sneyd' },
  { id: 122, rank: 122, name: 'Yorick Hofkens', country: 'Germany', image: 'yorick-hofkens' },
  { id: 123, rank: 123, name: 'Pascal Rupprecht', country: 'Germany', image: 'pascal-rupprecht' },
  { id: 124, rank: 124, name: 'Rusty-Jake Rodriguez', country: 'Austria', image: 'rusty-jake-rodriguez' },
  { id: 125, rank: 125, name: 'Marvin Kraft', country: 'Germany', image: 'marvin-kraft' },
  { id: 126, rank: 126, name: 'Pero Ljubic', country: 'Croatia', image: 'pero-ljubic' },
  { id: 127, rank: 127, name: 'Filip Bereza', country: 'Poland', image: 'filip-bereza' },
  { id: 128, rank: 128, name: 'Matthias Ehlers', country: 'Germany', image: 'matthias-ehlers' },
]

// The custom career occupies an existing tour-card slot, never a 129th slot.
let players: Player[] = [...originalPlayers]
const customPlayerFor = (slot: number): Player => {
  const original = originalPlayers.find(p => p.id === slot)!
  return { ...original, name: 'Jelle De Boeck', country: 'Belgium', image: 'own-player' }
}
function setCareerRoster(slot: number | null) {
  players = slot === null ? [...originalPlayers] : originalPlayers.map(p => p.id === slot ? customPlayerFor(slot) : p)
}


const countryCodes: Record<string, string> = {
  England: 'gb-eng',
  Scotland: 'gb-sct',
  Wales: 'gb-wls',
  'Northern Ireland': 'gb-nir',
  Netherlands: 'nl',
  Belgium: 'be',
  Germany: 'de',
  Poland: 'pl',
  Australia: 'au',
  Croatia: 'hr',
  Ireland: 'ie',
  Austria: 'at',
  Sweden: 'se',
  Latvia: 'lv',
  Switzerland: 'ch',
  'Czech Republic': 'cz',
  France: 'fr',
  Spain: 'es',
  Norway: 'no',
  Canada: 'ca',
  Lithuania: 'lt',
  Slovenia: 'si',
}

// Fixed knockout: seeded players never meet in round one.
// Seed 1 and seed 2 occupy opposite halves; 1 and the lowest seed share a second-round path.
function seededDraw(orderedIds: number[], size: number, shuffle: <T,>(items: T[]) => T[]): number[] {
  const seeded = orderedIds.slice(0, size / 2)
  const unseeded = shuffle(orderedIds.slice(size / 2, size))
  // Match 1 = seed 1, match 32 = seed 32, etc.
  // Later rounds pair the winners of the first and last match.
  return seeded.flatMap((seed, index) => [seed, unseeded[index]])
}

// Ranked knockout: 1 v last, 2 v second-last, etc. Mirrored in round two.
// Unlike a random seeded draw, every entrant has a fixed seed number.
function rankedKnockoutDraw(ids: number[]): number[] {
  if (ids.length % 2 !== 0) return []
  const half = ids.length / 2
  return Array.from({ length: half }, (_, i) => [ids[i], ids[ids.length - i - 1]]).flat()
}

// First-round match N contains seed N. Standard mirrored bracket from round two.
function fixedMatchOrder(count: number): number[] {
  let order = [1, 2]
  while (order.length < count) {
    const sum = order.length * 2 + 1
    order = order.flatMap(seed => [seed, sum - seed])
  }
  return order
}
function advanceFixedDraw(winners: (number | null)[], roundIndex: number): number[] {
  if (winners.some(id => id === null)) return []
  return roundIndex === 0 ? fixedMatchOrder(winners.length).map(seed => winners[seed - 1]!) : winners as number[]
}

function PlayerFlag({ country }: { country: string }) {
  const code = countryCodes[country]
  return code ? (
    <span className={`fi fi-${code}`} role="img" aria-label={country} />
  ) : (
    <span role="img" aria-label={country}>🏳️</span>
  )
}


function HubIcon({ name }: { name: 'calendar' | 'trophy' | 'inbox' | 'rankings' | 'stats' | 'settings' | 'delete' }) {
  const paths: Record<typeof name, any> = {
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h3M14 14h3M8 18h3"/></>,
    trophy: <><path d="M7 4h10v7a5 5 0 0 1-10 0V4ZM7 6H4v3a4 4 0 0 0 4 4M17 6h3v3a4 4 0 0 1-4 4M12 16v4M8 20h8"/></>,
    inbox: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m3 8 9 7 9-7"/></>,
    rankings: <><path d="M4 20V12h4v8M10 20V8h4v12M16 20V4h4v16M3 20h18"/></>,
    stats: <><path d="M4 20V10M9 20V5M14 20v-8M19 20V3M2 20h20"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/></>,
    delete: <><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/></>,
  }
  return <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const CAREER_SAVE_KEY = 'pdc-career-save-v1'

type RankingMoney = Record<number, number>

const createInitialRankingMoney = (): RankingMoney =>
  Object.fromEntries(players.map(player => [player.id, 0]))

const formatPrizeMoney = (amount: number) =>
  `£${amount.toLocaleString('en-GB')}`

// Prize tables are defined per tournament in data/tournaments.ts.
type Finish = 'last128' | 'last64' | 'last32' | 'last16' | 'quarterFinal' | 'semiFinal' | 'final' | 'winner'

type PrizeMoneyEntry = {
  tournamentId: string
  playerId: number
  earnedAt: string
  amount: number
  countsForRanking: boolean
}

function calculateEventPayouts(
  tournamentId: string,
  earnedAt: string,
  draw: number[],
  winners: (number | null)[][],
  roundDraws?: number[][],
): PrizeMoneyEntry[] {
  const tournament = tournamentById(tournamentId)
  const prizes = tournament?.prizes
  if (tournament?.category === 'eurotour') {
    if (!prizes || draw.length !== 48 || new Set(draw).size !== 48 || winners.length !== 6 ||
        winners.some((round, index) => round.length !== [16,16,8,4,2,1][index] || round.some(id => id === null))) return []
    const finishes = new Map<number, Finish | 'last48'>()
    let entrants = draw.slice(0, 32)
    for (let round = 0; round < winners.length; round++) {
      const slots = roundDraws?.[round]
      if (!slots || slots.length !== entrants.length || new Set(slots).size !== slots.length ||
          slots.some(id => !entrants.includes(id))) return []
      const next: number[] = []
      for (let match = 0; match < winners[round].length; match++) {
        const a = slots[match * 2], b = slots[match * 2 + 1], winner = winners[round][match]
        if (winner !== a && winner !== b) return []
        const loser = winner === a ? b : a
        finishes.set(loser, (['last48','last32','last16','quarterFinal','semiFinal','final'] as const)[round])
        next.push(winner!)
      }
      entrants = round === 0 ? [...next, ...draw.slice(32)] : next
    }
    finishes.set(winners[5][0]!, 'winner')
    if (finishes.size !== 48) return []
    return [...finishes].map(([playerId, finish]) => {
      const automaticQualifier = draw.slice(0, 32).some((id, index) => index % 2 === 0 && id === playerId) || draw.slice(32).includes(playerId)
      const firstMatchLoss = (finish === 'last48' && automaticQualifier) || (finish === 'last32' && draw.slice(32).includes(playerId))
      return { tournamentId, playerId, earnedAt, amount: prizes[finish] ?? 0,
        countsForRanking: (tournament.countsForRanking && !firstMatchLoss) }
    })
  }
  const expectedSize = draw.length
  const expectedRoundLengths = expectedSize === 128 ? [64, 32, 16, 8, 4, 2, 1] : expectedSize === 64 ? [32, 16, 8, 4, 2, 1]
    : expectedSize === 32 ? [16, 8, 4, 2, 1] : [8, 4, 2, 1]
  const exitFinishes: Finish[] = expectedSize === 128 ? ['last128', 'last64', 'last32', 'last16', 'quarterFinal', 'semiFinal', 'final'] : expectedSize === 64
    ? ['last64', 'last32', 'last16', 'quarterFinal', 'semiFinal', 'final']
    : expectedSize === 32
      ? ['last32', 'last16', 'quarterFinal', 'semiFinal', 'final']
      : ['last16', 'quarterFinal', 'semiFinal', 'final']
  if (!prizes || !([...exitFinishes, 'winner'] as Finish[]).every(finish => typeof prizes[finish] === 'number') ||
      ![16, 32, 64, 128].includes(expectedSize) || new Set(draw).size !== expectedSize ||
      winners.length !== expectedRoundLengths.length ||
      winners.some((round, i) => round.length !== expectedRoundLengths[i] || round.some(id => id === null))) {
    return []
  }
  let participants = [...draw]
  const finishes = new Map<number, Finish>()
  for (let round = 0; round < winners.length; round++) {
    const actualDraw = roundDraws?.[round] ?? participants
    if (actualDraw.length !== participants.length ||
        new Set(actualDraw).size !== participants.length ||
        actualDraw.some(id => !participants.includes(id))) return []
    const next: number[] = []
    for (let match = 0; match < actualDraw.length / 2; match++) {
      const a = actualDraw[match * 2]
      const b = actualDraw[match * 2 + 1]
      const winner = winners[round][match]
      if (winner !== a && winner !== b) return []
      finishes.set(winner === a ? b : a, exitFinishes[round])
      next.push(winner)
    }
    participants = next
  }
  finishes.set(participants[0], 'winner')
  return [...finishes].map(([playerId, finish]) => ({
    tournamentId, playerId, earnedAt, amount: prizes[finish] ?? 0, countsForRanking: tournament?.countsForRanking ?? false,
  }))
}

function withinOneYearRankingWindow(earnedAt: string, currentDate: string): boolean {
  const cutoff = new Date(`${currentDate}T12:00:00`)
  cutoff.setFullYear(cutoff.getFullYear() - 1)
  return earnedAt > cutoff.toISOString().slice(0, 10) && earnedAt <= currentDate
}

function withinTwoYearRankingWindow(earnedAt: string, currentDate: string): boolean {
  const cutoff = new Date(`${currentDate}T12:00:00`)
  cutoff.setFullYear(cutoff.getFullYear() - 2)
  return earnedAt > cutoff.toISOString().slice(0, 10) && earnedAt <= currentDate
}


// Every prize entry expires at the START of the same event two seasons later.
// The original World Championship may finish in January, so use the event ID,
// not the calendar year of earnedAt, to find the defending edition.
function rankingEntryActive(entry: PrizeMoneyEntry, asOf: string): boolean {
  if (entry.earnedAt > asOf) return false
  const match = entry.tournamentId.match(/-(\d{4})$/)
  if (!match) return withinTwoYearRankingWindow(entry.earnedAt, asOf)
  const defendingId = `${tournamentSeasonId(entry.tournamentId)}-${Number(match[1]) + 2}`
  const expires = tournamentStart(defendingId)
  return !expires || asOf < expires
}

// Imported legacy balances have no per-event history. We cannot reconstruct
// their precise defending dates. By 1 January 2028 all pre-2026 ranking
// money must have expired; new ledger entries continue to expire per event.
function legacyRankingMoneyAsOf(legacy: RankingMoney, asOf: string): RankingMoney {
  return asOf >= '2028-01-01'
    ? Object.fromEntries(Object.keys(legacy).map(id => [Number(id), 0]))
    : { ...legacy }
}

type HeadToHeadRecord = { wins: number; losses: number }
type HeadToHeadHistory = Record<string, HeadToHeadRecord>

type FinalScore = { winnerId: number; loserId: number; winnerScore: number; loserScore: number; unit: 'legs' | 'sets' }
type CareerMail = { id: string; date: string; subject: string; preview: string; body: string; read: boolean }

type CareerSave = {
  inbox?: CareerMail[]
  dismissedMailIds?: string[]
  finalScores?: Record<string, FinalScore>
  headToHead?: HeadToHeadHistory
  premierLineups?: Record<number, number[]>
  premierResults?: Record<string, { rounds: number[][]; scores: [number,number][][] }>
  selectedPlayer: number
  aiDifficulty?: number
  customPlayerSlot?: number | null
  gameDate: string
  calendarMonth: number
  calendarYear: number
  activeTournamentId: string | null
  tournamentDraw: number[]
  slamGroups?: SlamGroup[]
  slamGroupStageDone?: boolean
  slamShootouts?: SlamTiebreak[]
  roundWinners: (number | null)[][]
  roundDraws?: number[][]
  tournamentChampionId: number | null
  showTournamentChampion: boolean
  rankingMoney?: RankingMoney
  legacyRankingMoney?: RankingMoney
  prizeMoneyEntries?: PrizeMoneyEntry[]
  awardedPrizeTournamentIds?: string[]
  careerTitles?: number
  careerEarnings?: number
  careerEnded?: boolean
  bestWorldRank?: number
  awardedTitleTournamentIds?: string[]
  screen: 'menu' | 'calendar' | 'tournament' | 'match-preview' | 'career-over'
}

function loadCareer(): CareerSave | null {
  try {
    const raw = window.localStorage.getItem(CAREER_SAVE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as CareerSave
    if (!originalPlayers.some(player => player.id === data.selectedPlayer)) return null
    if (data.customPlayerSlot != null && (!originalPlayers.some(p => p.id === data.customPlayerSlot) || data.selectedPlayer !== data.customPlayerSlot)) return null
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.gameDate)) return null
    if (!Array.isArray(data.tournamentDraw) || !Array.isArray(data.roundWinners)) return null
    const sizes = data.tournamentDraw.length === 128 ? [64, 32, 16, 8, 4, 2, 1] : data.tournamentDraw.length === 64 ? [32, 16, 8, 4, 2, 1] : data.tournamentDraw.length === 32 ? [16, 8, 4, 2, 1] : [8, 4, 2, 1]
    if (data.roundWinners.length !== sizes.length ||
        sizes.some((size, index) => !Array.isArray(data.roundWinners[index]) || data.roundWinners[index].length !== size)) return null
    if (data.tournamentDraw.length >= 64 && (!Array.isArray(data.roundDraws) || data.roundDraws[0]?.length !== data.tournamentDraw.length)) return null
    return data
  } catch {
    return null
  }
}

const initialCareer = loadCareer()
setCareerRoster(initialCareer?.customPlayerSlot ?? null)

const calendarLogo = (name: string, category?: string): string | null => {
    const n = name.toLowerCase()
    const file = /winmau world masters/.test(n) ? 'winmau-world-masters.webp'
      : /players? championship finals/.test(n) ? 'pc-finals.webp'
      : /players? championship|^pc\s*\d/.test(n) ? 'players-championship.webp'
      : /premier league/.test(n) ? 'premier-league.webp'
      : /european championship/.test(n) ? 'european-championship.webp'
      : category === 'eurotour' || /european tour|euro(pean)? tour|^et\s*[-\d]/.test(n) ? 'eurotour.png'
      : /grand slam/.test(n) ? 'grand-slam.webp'
      : /uk open/.test(n) ? 'uk-open.webp'
      : /world grand prix/.test(n) ? 'world-grand-prix.webp'
      : /world matchplay/.test(n) ? 'world-matchplay.webp'
      : /world darts championship|world championship|pdc world/.test(n) ? 'world-championship.webp'
      : null
    return file ? `${import.meta.env.BASE_URL}tournament-logo/${file}` : null
  }

function App() {
  const [headToHead, setHeadToHead] = useState<HeadToHeadHistory>(initialCareer?.headToHead ?? {})
  const recordHeadToHead = (opponentId: number, winnerId: number) => {
    if (selectedPlayer === null || opponentId === selectedPlayer) return
    setHeadToHead(previous => {
      const key = String(opponentId)
      const old = previous[key] ?? { wins: 0, losses: 0 }
      return { ...previous, [key]: {
        wins: old.wins + (winnerId === selectedPlayer ? 1 : 0),
        losses: old.losses + (winnerId === opponentId ? 1 : 0),
      } }
    })
  }
  const [deleteCareerConfirmation, setDeleteCareerConfirmation] = useState(false)
  const [careerEnded, setCareerEnded] = useState(initialCareer?.careerEnded ?? false)
  const [bestWorldRank, setBestWorldRank] = useState(initialCareer?.bestWorldRank ?? 128)
  const [careerTitles, setCareerTitles] = useState(initialCareer?.careerTitles ?? 0)
  const [careerEarnings, setCareerEarnings] = useState(initialCareer?.careerEarnings ?? 0)
  const [awardedTitleTournamentIds, setAwardedTitleTournamentIds] = useState<string[]>(
    initialCareer?.awardedTitleTournamentIds ?? []
  )

  const [gameDate, setGameDate] = useState(initialCareer?.gameDate ?? '2026-01-01')
  const seasonYear = Number(gameDate.slice(0, 4))
  const seasonEvents = [...new Set([Math.max(2026, seasonYear - 1), seasonYear, seasonYear + 1])].flatMap(year => tournamentsForSeason(year))
  // Legacy balance allows old saves to keep their ranking money without
  // counting the new ledger twice on subsequent reloads.
  const [legacyRankingMoney, setLegacyRankingMoney] = useState<RankingMoney>(() => ({
    ...createInitialRankingMoney(),
    ...(initialCareer?.legacyRankingMoney ?? initialCareer?.rankingMoney ?? {}),
  }))
  const [prizeMoneyEntries, setPrizeMoneyEntries] = useState<PrizeMoneyEntry[]>(
    initialCareer?.prizeMoneyEntries ?? []
  )
  const [awardedPrizeTournamentIds, setAwardedPrizeTournamentIds] = useState<string[]>(
    initialCareer?.awardedPrizeTournamentIds ?? []
  )
  const finishingTournamentRef = useRef<string | null>(null)
  const advanceOneDayRef = useRef(false)

  const rankingMoney: RankingMoney = legacyRankingMoneyAsOf(legacyRankingMoney, gameDate)
  for (const entry of prizeMoneyEntries) {
    if (entry.countsForRanking && rankingEntryActive(entry, gameDate)) {
      rankingMoney[entry.playerId] = (rankingMoney[entry.playerId] ?? 0) + entry.amount
    }
  }

  const rankingTable = [...players].sort((a, b) => {
    const moneyDifference =
      (rankingMoney[b.id] ?? 0) - (rankingMoney[a.id] ?? 0)

    return moneyDifference !== 0
      ? moneyDifference
      : a.rank - b.rank || a.id - b.id
  })

  const getWorldRank = (playerId: number) =>
    rankingTable.findIndex(player => player.id === playerId) + 1
  // ProTour includes floor and (when introduced) European Tour events only.
  const proTourMoney: RankingMoney = createInitialRankingMoney()
  const pcMoney: RankingMoney = createInitialRankingMoney()
  for (const entry of prizeMoneyEntries) {
    if (!entry.countsForRanking || !withinOneYearRankingWindow(entry.earnedAt, gameDate)) continue
    const category = tournamentById(entry.tournamentId)?.category
    if (category === 'floor' || category === 'eurotour')
      proTourMoney[entry.playerId] = (proTourMoney[entry.playerId] ?? 0) + entry.amount
    if (category === 'floor' && entry.earnedAt.slice(0,4) === gameDate.slice(0,4))
      pcMoney[entry.playerId] = (pcMoney[entry.playerId] ?? 0) + entry.amount
  }
  const proTourTable = [...players].sort((a,b) => (proTourMoney[b.id] ?? 0) - (proTourMoney[a.id] ?? 0) || a.rank - b.rank)
  const pcTable = [...players].sort((a,b) => (pcMoney[b.id] ?? 0) - (pcMoney[a.id] ?? 0) || a.rank - b.rank)
  const etMoney: RankingMoney = createInitialRankingMoney()
  for (const entry of prizeMoneyEntries) {
    if (entry.countsForRanking && entry.earnedAt.startsWith(String(seasonYear)) &&
        tournamentById(entry.tournamentId)?.category === 'eurotour')
      etMoney[entry.playerId] = (etMoney[entry.playerId] ?? 0) + entry.amount
  }
  const etTable = [...players].sort((a,b) => (etMoney[b.id] ?? 0) - (etMoney[a.id] ?? 0) || a.rank - b.rank)

  // Qualification snapshots are derived from the actual saved prize ledger.
  // Never insert the human player into a draw unless they earned a place.
  const raceEditionYear = (eventId: string) => {
    const mainId = eventId === 'players-championship-24' ? 'world-matchplay' : eventId === 'european-tour-13' ? 'world-grand-prix' : eventId === 'european-tour-15' ? 'european-championship' : 'players-championship-finals'
    const edition = tournamentById(`${mainId}-${seasonYear}`)
    return edition && gameDate > edition.endDate ? seasonYear + 1 : seasonYear
  }
  // The cut-off is the last ranking event BEFORE the major, not a fixed
  // calendar date. Repeated seasons inherit the same weekday pattern as the
  // tournament calendar (tournamentsForSeason).
  const raceCutoff = (majorId: string, mode: 'dual' | 'et' | 'pc') => {
    const edition = raceEditionYear(majorId === 'world-matchplay' ? 'players-championship-24' :
      majorId === 'world-grand-prix' ? 'european-tour-13' :
      majorId === 'european-championship' ? 'european-tour-15' : 'players-championship-34')
    const major = tournamentById(`${majorId}-${edition}`)
    if (!major) return `${edition}-12-31`
    const eligible = tournamentsForSeason(edition).filter(event =>
      event.countsForRanking && event.endDate < major.startDate &&
      (mode === 'et' ? event.category === 'eurotour' :
       mode === 'pc' ? event.category === 'floor' :
       event.category === 'floor' || event.category === 'eurotour'))
    return eligible.reduce((latest, event) => event.endDate > latest ? event.endDate : latest, `${edition}-01-01`)
  }
  const raceConfigs = {
    matchplay: { name: 'WORLD MATCHPLAY RACE', cutoff: raceCutoff('world-matchplay', 'dual'), places: 32, mode: 'dual' },
    grandprix: { name: 'WORLD GRAND PRIX RACE', cutoff: raceCutoff('world-grand-prix', 'dual'), places: 32, mode: 'dual' },
    european: { name: 'EUROPEAN CHAMPIONSHIP RACE', cutoff: raceCutoff('european-championship', 'et'), places: 32, mode: 'et' },
    pcfinals: { name: 'PLAYER CHAMPIONSHIPS FINALS RACE', cutoff: raceCutoff('players-championship-finals', 'pc'), places: 64, mode: 'pc' },
  } as const
  type RaceKey = keyof typeof raceConfigs
  // Once a cut-off passes, rebuild the relevant standings as they stood
  // on that date, not from prize money earned at later tournaments.
  const cutoffCache = new Map<RaceKey, ReturnType<typeof computeCutoffStandings>>()
  function computeCutoffStandings(key: RaceKey) {
    const cutoff = raceConfigs[key].cutoff
    if (gameDate <= cutoff) return {
      world: rankingTable, tour: proTourTable, pc: pcTable, et: etTable,
      worldMoney: rankingMoney, tourMoney: proTourMoney, pcMoney, etMoney,
    }
    const worldMoney: RankingMoney = legacyRankingMoneyAsOf(legacyRankingMoney, cutoff)
    const tourMoney: RankingMoney = createInitialRankingMoney()
    const pcMoneyAtCut: RankingMoney = createInitialRankingMoney()
    const etMoneyAtCut: RankingMoney = createInitialRankingMoney()
    for (const entry of prizeMoneyEntries) {
      if (!entry.countsForRanking || entry.earnedAt > cutoff) continue
      const category = tournamentById(entry.tournamentId)?.category
      if (rankingEntryActive(entry, cutoff))
        worldMoney[entry.playerId] = (worldMoney[entry.playerId] ?? 0) + entry.amount
      if (withinOneYearRankingWindow(entry.earnedAt, cutoff) && (category === 'floor' || category === 'eurotour'))
        tourMoney[entry.playerId] = (tourMoney[entry.playerId] ?? 0) + entry.amount
      if (category === 'floor' && entry.earnedAt.startsWith(cutoff.slice(0,4)))
        pcMoneyAtCut[entry.playerId] = (pcMoneyAtCut[entry.playerId] ?? 0) + entry.amount
      if (category === 'eurotour' && entry.earnedAt.startsWith(cutoff.slice(0,4)))
        etMoneyAtCut[entry.playerId] = (etMoneyAtCut[entry.playerId] ?? 0) + entry.amount
    }
    const sort = (money: RankingMoney) => [...players].sort((a,b) =>
      (money[b.id] ?? 0) - (money[a.id] ?? 0) || a.rank - b.rank)
    return { world: sort(worldMoney), tour: sort(tourMoney),
      pc: sort(pcMoneyAtCut), et: sort(etMoneyAtCut),
      worldMoney, tourMoney, pcMoney: pcMoneyAtCut, etMoney: etMoneyAtCut }
  }
  const cutoffStandings = (key: RaceKey) => {
    if (!cutoffCache.has(key)) cutoffCache.set(key, computeCutoffStandings(key))
    return cutoffCache.get(key)!
  }
  const fieldCache = new Map<RaceKey, number[]>()
  const raceField = (key: RaceKey): number[] => {
    if (fieldCache.has(key)) return fieldCache.get(key)!
    const standings = cutoffStandings(key)
    const combine = (worldPlaces: number, tourPlaces: number) => {
      const primary = standings.world.slice(0, worldPlaces).map(p => p.id)
      return [...primary, ...standings.tour.map(p => p.id)
        .filter(id => !primary.includes(id)).slice(0, tourPlaces)]
    }
    const field = key === 'matchplay' || key === 'grandprix' ? combine(16, 16) :
      key === 'european' ? standings.et.slice(0, 32).map(p => p.id) :
      key === 'pcfinals' ? standings.pc.slice(0, 64).map(p => p.id) : []
    fieldCache.set(key, field)
    return field
  }
  const raceMoney = (key: RaceKey): RankingMoney => {
    const standings = cutoffStandings(key)
    return key === 'european' ? standings.etMoney :
      key === 'pcfinals' ? standings.pcMoney : standings.worldMoney
  }
  const raceTable = (key: RaceKey) => {
    const standings = cutoffStandings(key)
    if (key === 'european') return standings.et
    if (key === 'pcfinals') return standings.pc
    // Two distinct qualification routes. Remove the World OoM top 16
    // BEFORE taking the first 16 eligible players from the Pro Tour OoM.
    const worldSeeds = standings.world.slice(0, 16)
    const seedIds = new Set(worldSeeds.map(player => player.id))
    const eligibleTour = standings.tour.filter(player => !seedIds.has(player.id))
    const tourQualifiers = eligibleTour.slice(0, 16)
    return [...worldSeeds, ...tourQualifiers, ...eligibleTour.slice(16)]
  }
  const dualRaceMoney = (key: RaceKey, index: number, playerId: number) => {
    const standings = cutoffStandings(key)
    return index < 16 ? standings.worldMoney[playerId] ?? 0 : standings.tourMoney[playerId] ?? 0
  }
  // Qualification badges reflect the current field only. No speculative
  // mathematical guarantee is displayed before the actual cut-off.
  const [rankingView, setRankingView] = useState<'world' | 'protour' | 'pc' | 'et' | RaceKey>('world')
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(initialCareer?.selectedPlayer ?? null)
  const [customPlayerSlot, setCustomPlayerSlot] = useState<number | null>(initialCareer?.customPlayerSlot ?? null)
  const [showReplacePicker, setShowReplacePicker] = useState(false)
  const [replaceSearch, setReplaceSearch] = useState('')
  const [aiDifficulty, setAiDifficulty] = useState(() => {
    const value = initialCareer?.aiDifficulty
    return typeof value === 'number' && value >= 1 && value <= 4 ? value : 3
  })
  const [screen, setScreen] = useState<
    'select' | 'menu' | 'calendar' | 'rankings' | 'premier-table' | 'tournament' | 'match-preview' | 'match' | 'premier-night' | 'premier-match' | 'career-over' | 'player-stats' | 'history' | 'inbox'
  >(initialCareer ? (initialCareer.screen === 'match-preview' ? 'tournament' : initialCareer.screen) : 'select')
  const [inbox, setInbox] = useState<CareerMail[]>(() => {
    if (initialCareer?.inbox) return initialCareer.inbox
    if (!initialCareer?.selectedPlayer) return []
    const player = players.find(p => p.id === initialCareer.selectedPlayer)
    return player ? [{id:'welcome',date:initialCareer.gameDate,subject:`Welcome Mail`,preview:`Your journey starts at world number ${player.rank}.`,body:`Welcome to PDC Career Mode, ${player.name}!\n\nYou begin your journey ranked world number ${player.rank}. Compete on the professional circuit, qualify for the biggest events and climb the Order of Merit.\n\nEvery match, tournament and season shapes your career. Win titles, chase records and build a legacy that lasts.\n\nGood luck at the oche!`,read:false}] : []
  })
  // Every newly started career receives its own welcome mail, regardless of
  // which player was selected in the previous (deleted) career.
  const createWelcomeMail = (player: { name: string; rank: number }, date: string): CareerMail => ({
    id: 'welcome',
    date,
    subject: `Welcome Mail`,
    preview: `Your journey starts at world number ${player.rank}.`,
    body: `Welcome to PDC Career Mode, ${player.name}!\n\nYou begin your journey ranked world number ${player.rank}. Compete on the professional circuit, qualify for the biggest events and climb the Order of Merit.\n\nEvery match, tournament and season shapes your career. Win titles, chase records and build a legacy that lasts.\n\nGood luck at the oche!`,
    read: false,
  })
  // Inbox is a seasonal news archive: on 1 January, older seasons disappear.
  // Also handles fast-forwarding across more than one calendar year.
  useEffect(() => {
    setInbox(previous => previous.every(mail => mail.date.slice(0, 4) === gameDate.slice(0, 4))
      ? previous : previous.filter(mail => mail.date.slice(0, 4) === gameDate.slice(0, 4)))
    setOpenedMailId(previous => previous && inbox.some(mail => mail.id === previous && mail.date.slice(0, 4) === gameDate.slice(0, 4)) ? previous : null)
  }, [gameDate.slice(0, 4)])
  const [finalScores, setFinalScores] = useState<Record<string, FinalScore>>(initialCareer?.finalScores ?? {})
  // Simulated scorelines are generated at the moment the final is decided and
  // persisted. Played finals supply their actual scoreboard from MatchScreen.
  const saveSimulatedFinal = (eventId: string, winnerId: number, loserId: number) => {
    const event = tournamentById(eventId)
    if (!event) return
    const format = event.formats.final
    if (!format) return
    const target = format.firstTo
    const loserScore = Math.max(0, Math.min(target - 1, Math.floor(target * (0.45 + Math.random() * 0.5))))
    setFinalScores(prev => prev[eventId] ? prev : {
      ...prev, [eventId]: { winnerId, loserId, winnerScore: target, loserScore,
        unit: format.mode === 'sets' ? 'sets' : 'legs' }
    })
  }
  // Tombstones prevent result-sync effects from resurrecting deleted messages.
  const [dismissedMailIds, setDismissedMailIds] = useState<string[]>(initialCareer?.dismissedMailIds ?? [])
  const dismissedMailIdsRef = useRef<Set<string>>(new Set(initialCareer?.dismissedMailIds ?? []))
  const isMailDismissed = (id: string) => dismissedMailIdsRef.current.has(id)
  const dismissMail = (id: string) => {
    dismissedMailIdsRef.current.add(id)
    setDismissedMailIds(previous => previous.includes(id) ? previous : [...previous, id])
  }
  const sortedInbox = [...inbox].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
  const [openedMailId, setOpenedMailId] = useState<string | null>(null)
  const unreadMailCount = inbox.filter(mail => !mail.read).length
  const openMail = (id: string) => {
    setOpenedMailId(id)
    setInbox(previous => previous.map(mail => mail.id === id ? {...mail, read: true} : mail))
  }
  const deleteMail = (id: string) => {
    dismissMail(id)
    const remaining = sortedInbox.filter(mail => mail.id !== id)
    const deletedIndex = sortedInbox.findIndex(mail => mail.id === id)
    setInbox(remaining.map(mail => mail.id === (remaining[Math.min(Math.max(deletedIndex, 0), remaining.length - 1)]?.id) ? { ...mail, read: true } : mail))
    if (openedMailId === id) setOpenedMailId(remaining[Math.min(Math.max(deletedIndex, 0), remaining.length - 1)]?.id ?? null)
  }
  // Annual early-November Tour Card warning, starting in 2027.
  // Use the simulator's own Grand Slam schedule (seven days before its start),
  // not a fixed November date that would drift across seasons.
  useEffect(() => {
    if (seasonYear < 2027 || selectedPlayer === null || careerEnded) return
    const grandSlam = tournamentsForSeason(seasonYear).find(event => tournamentSeasonId(event.id) === 'grand-slam')
    if (!grandSlam) return
    const start = new Date(`${grandSlam.startDate}T12:00:00Z`)
    start.setUTCDate(start.getUTCDate() - 7)
    const warningDate = start.toISOString().slice(0, 10)
    if (gameDate < warningDate || gameDate >= grandSlam.startDate) return
    const currentRank = getWorldRank(selectedPlayer)
    if (currentRank <= 64) return
    const mailId = `tour-card-risk-${seasonYear}`
    if (isMailDismissed(mailId)) return
    const selected = players.find(player => player.id === selectedPlayer)
    const cutoffPlayer = rankingTable[63]
    if (!selected || !cutoffPlayer) return
    const playerMoney = rankingMoney[selectedPlayer] ?? 0
    const cutoffMoney = rankingMoney[cutoffPlayer.id] ?? 0
    const deficit = Math.max(0, cutoffMoney - playerMoney)
    const pounds = (amount: number) => `£${amount.toLocaleString('en-GB')}`
    const mail: CareerMail = {
      id: mailId,
      date: gameDate,
      subject: 'Tour Card At Risk',
      preview: `World No. ${currentRank} — ${pounds(deficit)} behind the top 64...`,
      body: `Dear ${selected.name},\n\nYou are currently ranked world number ${currentRank} on the PDC Order of Merit, outside the top 64.\n\nYour ranking prize money: ${pounds(playerMoney)}\nWorld No. 64 (${cutoffPlayer.name}): ${pounds(cutoffMoney)}\nGap to 64th place: ${pounds(deficit)}\n\nWith the season nearing its conclusion, your Tour Card could be at risk when your eligibility is assessed. There is still time to improve your position — every ranking match counts.\n\nPDC Board`,
      read: false,
    }
    setInbox(previous => previous.some(item => item.id === mailId) ? previous : [mail, ...previous])
  }, [gameDate, selectedPlayer, careerEnded, prizeMoneyEntries, legacyRankingMoney])

  const [statsTab, setStatsTab] = useState<'overview' | 'trophies' | 'hall' | 'legends'>('overview')
  const [recordBookTab, setRecordBookTab] = useState<'ingame' | 'reallife'>('ingame')
  const [historyYear, setHistoryYear] = useState(2026)
  const [calendarMonth, setCalendarMonth] = useState(initialCareer?.calendarMonth ?? 0)
  const [calendarYear, setCalendarYear] = useState(initialCareer?.calendarYear ?? 2026)
  const [activeTournamentId, setActiveTournamentId] = useState<string | null>(initialCareer?.activeTournamentId ?? null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [fastForwardWorldsId, setFastForwardWorldsId] = useState<string | null>(null)
  const [calendarTargetDate, setCalendarTargetDate] = useState<string | null>(null)
  const [calendarStopRequested, setCalendarStopRequested] = useState(false)
  const premierStandingsOrderRef = useRef<number[]>([])
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null)
  const [calendarSimConfirmation, setCalendarSimConfirmation] = useState<{ target: string; mode: 'selected' | 'next' } | null>(null)
  const [premierLineups, setPremierLineups] = useState<Record<number, number[]>>(initialCareer?.premierLineups ?? {})
  const [premierResults, setPremierResults] = useState<Record<string, { rounds: number[][]; scores: [number,number][][] }>>(initialCareer?.premierResults ?? {})
  const [premierChampionPopupId, setPremierChampionPopupId] = useState<string | null>(null)
  const [premierPlaying, setPremierPlaying] = useState<{a:number;b:number;round:number;match:number} | null>(null)
  const [premierNightIntro, setPremierNightIntro] = useState<{night:number; city:string} | null>(null)
  const [premReveal, setPremReveal] = useState<{ year: number; playerIds: number[] } | null>(null)
  const premRevealShownYears = useRef<Set<number>>(new Set())
  const [showTournamentIntro, setShowTournamentIntro] = useState(false)
  const [tournamentDraw, setTournamentDraw] = useState<number[]>(initialCareer?.tournamentDraw ?? [])
  const [roundWinners, setRoundWinners] = useState<(number | null)[][]>(
    () => initialCareer?.roundWinners ?? [Array(8).fill(null), Array(4).fill(null), Array(2).fill(null), [null]]
  )
  const [slamGroups, setSlamGroups] = useState<SlamGroup[]>(initialCareer?.slamGroups ?? [])
  const [slamGroupStageDone, setSlamGroupStageDone] = useState(initialCareer?.slamGroupStageDone ?? false)
  const [slamShootouts, setSlamShootouts] = useState<SlamTiebreak[]>(initialCareer?.slamShootouts ?? [])
  const [slamPlaying, setSlamPlaying] = useState<{gi:number;mi:number} | null>(null)
  const [roundDraws, setRoundDraws] = useState<number[][]>(initialCareer?.roundDraws ?? [])
  const [viewedUkRound, setViewedUkRound] = useState<number | null>(null)
  const [viewedPremierRound, setViewedPremierRound] = useState<number | null>(null)
  const [premierOnlyMine, setPremierOnlyMine] = useState(false)
  const [drawOnlyMine, setDrawOnlyMine] = useState(false)
  const [devMode, setDevMode] = useState(false)
  const [devChooserOpen, setDevChooserOpen] = useState(false)
  const [devPreview, setDevPreview] = useState(false)
  const devSnapshot = useRef<null | {
    screen: typeof screen; activeTournamentId: string | null; tournamentDraw: number[];
    roundDraws: number[][]; roundWinners: (number | null)[][];
    slamGroups: SlamGroup[]; slamGroupStageDone: boolean; slamShootouts: SlamTiebreak[];
    tournamentChampionId: number | null; showTournamentChampion: boolean;
    coinTossWinnerId: number | null; slamPlaying: {gi:number;mi:number} | null;
  }>(null)
  const previewLock = useRef(false)
  useEffect(() => {
    if (selectedPlayer !== null && !previewLock.current)
      setBestWorldRank(previous => Math.min(previous, getWorldRank(selectedPlayer)))
  }, [selectedPlayer, gameDate, prizeMoneyEntries, careerEnded])

  const [tournamentChampionId, setTournamentChampionId] = useState<number | null>(initialCareer?.tournamentChampionId ?? null)
  const [showTournamentChampion, setShowTournamentChampion] = useState(initialCareer?.showTournamentChampion ?? false)
  const [coinTossWinnerId, setCoinTossWinnerId] = useState<number | null>(null)
  const [coinTossSpinning, setCoinTossSpinning] = useState(false)
  const [coinTossHighlight, setCoinTossHighlight] = useState<number | null>(null)
  // Autosave all persistent career progress after every change.
  // Never persist transient match/intro screens; resume at the tournament bracket.
  useEffect(() => {
    if (selectedPlayer === null || previewLock.current) return
    const save: CareerSave = {
      inbox, dismissedMailIds, finalScores, selectedPlayer, aiDifficulty, customPlayerSlot, gameDate, calendarMonth, calendarYear, headToHead, premierLineups, premierResults, rankingMoney,
      legacyRankingMoney, prizeMoneyEntries, awardedPrizeTournamentIds,
      careerTitles, careerEarnings, careerEnded, bestWorldRank, awardedTitleTournamentIds,
      activeTournamentId, tournamentDraw, roundWinners, roundDraws, slamGroups, slamGroupStageDone, slamShootouts,
      tournamentChampionId, showTournamentChampion,
      screen: careerEnded ? 'career-over' : screen === 'calendar' ? 'calendar' :
        screen === 'menu' ? 'menu' :
        activeTournamentId ? 'tournament' : 'menu',
    }
    try {
      window.localStorage.setItem(CAREER_SAVE_KEY, JSON.stringify(save))
    } catch (error) {
      console.error('Career autosave failed:', error)
    }
  }, [inbox, dismissedMailIds, finalScores, selectedPlayer, aiDifficulty, customPlayerSlot, gameDate, calendarMonth, calendarYear,
      activeTournamentId, tournamentDraw, roundWinners, roundDraws, slamGroups, slamGroupStageDone, slamShootouts,
      tournamentChampionId, showTournamentChampion, screen, rankingMoney,
      careerTitles, careerEarnings, careerEnded, bestWorldRank, awardedTitleTournamentIds,
      legacyRankingMoney, prizeMoneyEntries, awardedPrizeTournamentIds, headToHead, premierLineups, premierResults])

  const deleteCareer = (skipConfirmation = false) => {
    if (!skipConfirmation) { setDeleteCareerConfirmation(true); return }
    setDeleteCareerConfirmation(false)
    try { window.localStorage.removeItem(CAREER_SAVE_KEY) } catch (error) {
      console.error('Could not remove career save:', error)
      return
    }
    setIsSimulating(false)
    setFastForwardWorldsId(null)
    setCalendarTargetDate(null)
    setSelectedCalendarDate(null)
    setInbox([])
    dismissedMailIdsRef.current.clear()
    setDismissedMailIds([])
    setOpenedMailId(null)
    setPremReveal(null)
    setPremierLineups({})
    setPremierResults({})
    setPremierPlaying(null)
    setPremierNightIntro(null)
    premRevealShownYears.current.clear()
    setShowTournamentIntro(false)
    setSelectedPlayer(null)
    setCustomPlayerSlot(null)
    setShowReplacePicker(false)
    setCareerRoster(null)
    setHeadToHead({})
    setLegacyRankingMoney(createInitialRankingMoney())
    setPrizeMoneyEntries([])
    setAwardedPrizeTournamentIds([])
    finishingTournamentRef.current = null
    setCareerEnded(false)
    setAiDifficulty(3)
    setBestWorldRank(128)
    setCareerTitles(0)
    setCareerEarnings(0)
    setAwardedTitleTournamentIds([])
    setCalendarMonth(0)
    setCalendarYear(2026)
    setGameDate('2026-01-01')
    setActiveTournamentId(null)
    setTournamentDraw([])
    setSlamGroups([])
    setSlamGroupStageDone(false)
    setSlamShootouts([])
    setRoundDraws([])
    setViewedUkRound(null)
    setRoundWinners([Array(8).fill(null), Array(4).fill(null), Array(2).fill(null), [null]])
    setTournamentChampionId(null)
    setShowTournamentChampion(false)
    setCoinTossWinnerId(null)
    setCoinTossSpinning(false)
    setScreen('select')
  }

  useEffect(() => {
    if (!isSimulating || activeTournamentId || careerEnded) return
    const timer = window.setTimeout(() => {
      if (calendarTargetDate && gameDate >= calendarTargetDate) {
        setIsSimulating(false)
        setFastForwardWorldsId(null)
        setCalendarTargetDate(null)
        return
      }
      const nextDate = new Date(`${gameDate}T12:00:00`)
      nextDate.setDate(nextDate.getDate() + 1)
      const nextDateString = [
        nextDate.getFullYear(),
        String(nextDate.getMonth() + 1).padStart(2, '0'),
        String(nextDate.getDate()).padStart(2, '0'),
      ].join('-')
      // A calendar fast-forward must pause on the DAY BEFORE the annual reveal.
      // The reveal itself is triggered by the normal one-day advance afterwards.
      const upcomingRevealEves = awardedPrizeTournamentIds
        .filter(id => tournamentSeasonId(id) === 'world-championship')
        .map(id => tournamentById(id))
        .filter((event): event is NonNullable<typeof event> => Boolean(event))
        .filter(event => Number(event.id.slice(-4)) + 1 >= 2027 && !premierLineups[Number(event.id.slice(-4)) + 1])
        .map(event => {
          const eve = new Date(`${event.endDate}T12:00:00`)
          eve.setDate(eve.getDate() + 6)
          return `${eve.getFullYear()}-${String(eve.getMonth()+1).padStart(2,'0')}-${String(eve.getDate()).padStart(2,'0')}`
        })
      const revealEve = upcomingRevealEves.find(date => date === nextDateString)
      // A selected date anywhere inside a tournament means: stop at its FIRST day.
      // Only dates strictly after the tournament's final day skip/auto-simulate it.
      const selectedEventStart = calendarTargetDate && seasonEvents.find(event =>
        !awardedPrizeTournamentIds.includes(event.id) &&
        event.startDate === nextDateString &&
        event.startDate <= calendarTargetDate && calendarTargetDate <= event.endDate
      )
      const stopAtTarget = calendarTargetDate !== null && nextDateString >= calendarTargetDate
      const stopForSelectedEvent = Boolean(selectedEventStart)
      // Stopping while a tournament is in progress must reopen it at its first day.
      const stopAtRunningEvent = calendarStopRequested && seasonEvents.find(event =>
        !awardedPrizeTournamentIds.includes(event.id) &&
        event.startDate <= nextDateString && nextDateString <= event.endDate
      )
      if (stopAtRunningEvent && stopAtRunningEvent.startDate !== nextDateString) {
        const prior = new Date(`${stopAtRunningEvent.startDate}T12:00:00`)
        prior.setDate(prior.getDate() - 1)
        setGameDate(`${prior.getFullYear()}-${String(prior.getMonth()+1).padStart(2,'0')}-${String(prior.getDate()).padStart(2,'0')}`)
        setCalendarStopRequested(false)
        setCalendarTargetDate(stopAtRunningEvent.startDate)
        setFastForwardWorldsId(null)
        return
      }
      if (stopForSelectedEvent) {
        setFastForwardWorldsId(null)
      }
      if (stopAtRunningEvent) {
        setCalendarStopRequested(false)
        setFastForwardWorldsId(null)
        setCalendarTargetDate(null)
      }
      if (calendarStopRequested && !stopAtRunningEvent) {
        setCalendarStopRequested(false)
        setFastForwardWorldsId(null)
        setCalendarTargetDate(null)
        setIsSimulating(false)
      }
      if (revealEve || stopAtTarget || stopForSelectedEvent || stopAtRunningEvent) {
        setIsSimulating(false)
        setFastForwardWorldsId(null)
        setCalendarTargetDate(null)
      }
      // Seven days after the Worlds final: lock the eight invitees for this season.
      const completedWorlds = awardedPrizeTournamentIds
        .filter(id => tournamentSeasonId(id) === 'world-championship')
        .map(id => tournamentById(id))
        .filter((event): event is NonNullable<typeof event> => Boolean(event))
        .find(event => {
          const revealDate = new Date(`${event.endDate}T12:00:00`)
          revealDate.setDate(revealDate.getDate() + 7)
          return revealDate.toISOString().slice(0, 10) === nextDateString
        })
      if (completedWorlds && Number(completedWorlds.id.slice(-4)) + 1 >= 2027 && !premierLineups[Number(completedWorlds.id.slice(-4)) + 1] && !premRevealShownYears.current.has(Number(completedWorlds.id.slice(-4)) + 1)) {
        const revealYear = Number(completedWorlds.id.slice(-4)) + 1
        premRevealShownYears.current.add(revealYear)
        const automatic = rankingTable.slice(0, 4).map(player => player.id)
        const candidates = rankingTable.slice(4, 16).map(player => player.id)
        for (let i = candidates.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
        }
        const invitees = [...automatic, ...candidates.slice(0, 4)]
        const revealedNames = invitees.map((id) => `• ${players.find(player => player.id === id)?.name ?? 'Unknown player'}`).join('\n')
        const revealMail: CareerMail = {
          id: `premier-reveal-${revealYear}`,
          date: nextDateString,
          subject: `Premier League ${revealYear}: Lineup Reveal`,
          preview: `The eight Premier League players have been announced...`,
          body: `The Premier League ${revealYear} lineup is here!\n\nThese eight players have earned their spot in the Premier League and will battle it out across 16 thrilling league nights for four places at Finals Night.\n\n${revealedNames}\n\nOnly the top four will advance to Finals Night. Who will lift the trophy?`,
          read: false,
        }
        setInbox(previous => isMailDismissed(revealMail.id) || previous.some(mail => mail.id === revealMail.id) ? previous : [revealMail, ...previous])
        setPremierLineups(previous => ({ ...previous, [revealYear]: invitees }))
        setPremReveal({ year: revealYear, playerIds: invitees })
        setIsSimulating(false)
        setFastForwardWorldsId(null)
        setScreen('calendar')
      }
      const arrivingPremierNight = premierLeagueNights(nextDate.getFullYear()).find(night => night.date === nextDateString)
      // Fast-forward also plays Premier League nights instead of pausing on them.
      if (arrivingPremierNight && fastForwardWorldsId && premierLineups[nextDate.getFullYear()]?.length === 8 && !premierResults[arrivingPremierNight.id]) {
        const lineup = premierLineups[nextDate.getFullYear()]
        const order = premierStandingsOrderRef.current.length === 8 ? premierStandingsOrderRef.current : lineup
        const pairs = arrivingPremierNight.finals
          ? premierFinalsPairs(order)
          : premierQuarterFinalPairs(arrivingPremierNight.night, lineup, order)
        const rounds: number[][] = [pairs.flat()]
        const scores: [number, number][][] = []
        while (rounds[rounds.length - 1].length > 1) {
          const entrants = rounds[rounds.length - 1]
          const round = rounds.length - 1
          const target = arrivingPremierNight.finals ? (round === 0 ? 10 : 11) : 6
          const results: [number, number][] = []
          const winners: number[] = []
          for (let i = 0; i < entrants.length; i += 2) {
            const a = entrants[i], b = entrants[i + 1]
            const winner = simulateWinner(a, b)
            const loserLegs = Math.floor(Math.random() * target)
            results.push(winner === a ? [target, loserLegs] : [loserLegs, target])
            winners.push(winner)
          }
          scores.push(results)
          rounds.push(winners)
        }
        setPremierResults(previous => ({ ...previous, [arrivingPremierNight.id]: { rounds, scores } }))
        // Deliver the champion report in the simulation path as well as the played-match path.
        // The calendar may advance immediately, so don't depend on a later render effect.
        if (arrivingPremierNight.finals && rounds.length === 3 && rounds[2]?.length === 1 && scores[1]?.[0]) {
          const championId = rounds[2][0]
          const runnerUpId = rounds[1].find(id => id !== championId)
          if (runnerUpId !== undefined) {
            const championName = players.find(player => player.id === championId)?.name ?? 'Unknown player'
            const runnerUpName = players.find(player => player.id === runnerUpId)?.name ?? 'Unknown player'
            const [aLegs, bLegs] = scores[1][0]
            const scoreText = `${Math.max(aLegs, bLegs)} - ${Math.min(aLegs, bLegs)}`
            const mailId = `premier-results-${arrivingPremierNight.id}`
            const mail: CareerMail = {
              id: mailId,
              date: arrivingPremierNight.date,
              subject: `Results: Premier League ${nextDate.getFullYear()} Finals Night`,
              preview: `${championName} defeats ${runnerUpName} ${scoreText}...`,
              body: `${championName} is the Premier League ${nextDate.getFullYear()} champion!\n\n${championName} defeats ${runnerUpName} ${scoreText} in the final at Finals Night.`,
              read: false,
            }
            setInbox(previous => isMailDismissed(mailId) || previous.some(item => item.id === mailId) ? previous : [mail, ...previous])
          }
        }
        const winner = rounds[rounds.length - 1][0]
        if (!arrivingPremierNight.finals && winner === selectedPlayer) {
          setCareerEarnings(previous => previous + PREMIER_LEAGUE_PRIZES_2026.nightlyWinner)
        }
        if (arrivingPremierNight.finals && selectedPlayer !== null) {
          const place = order.indexOf(selectedPlayer)
          const finalPrize = selectedPlayer === winner ? PREMIER_LEAGUE_PRIZES_2026.champion
            : rounds[1]?.includes(selectedPlayer) ? PREMIER_LEAGUE_PRIZES_2026.runnerUp
            : place >= 0 && place < 4 ? PREMIER_LEAGUE_PRIZES_2026.semiFinalist
            : [PREMIER_LEAGUE_PRIZES_2026.fifth, PREMIER_LEAGUE_PRIZES_2026.sixth,
               PREMIER_LEAGUE_PRIZES_2026.seventh, PREMIER_LEAGUE_PRIZES_2026.eighth][place - 4]
          if (finalPrize) setCareerEarnings(previous => previous + finalPrize)
        }
      }
      if (arrivingPremierNight && !fastForwardWorldsId && premierLineups[nextDate.getFullYear()]?.length === 8) {
        setPremierNightIntro({ night: arrivingPremierNight.night, city: arrivingPremierNight.city })
        setIsSimulating(false)
        setFastForwardWorldsId(null)
        setScreen('calendar')
      }
      setGameDate(nextDateString)
      if (advanceOneDayRef.current) {
        advanceOneDayRef.current = false
        setIsSimulating(false)
      }
      // Laat de kalender automatisch meeschuiven.
      setCalendarMonth(nextDate.getMonth())
      setCalendarYear(nextDate.getFullYear())
      // The selected destination is a stopping point, not a new tournament start.
      if (revealEve || (stopAtTarget && !stopForSelectedEvent)) return
      // Controleer of vandaag een toernooi begint.
      const startingTournament = seasonEvents.find(
        tournament => tournament.startDate === nextDateString &&
          !awardedPrizeTournamentIds.includes(tournament.id)
      )
    if (startingTournament) {
      // Elke major: jouw speler + 15 unieke tegenstanders.
      // De top 16 krijgt 8 plaatsen als jij buiten de top 16 staat,
      // anders 7. De overige plaatsen komen uit het bredere roster.
      const shuffle = <T,>(items: T[]): T[] => {
        const result = [...items]
        for (let i = result.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[result[i], result[j]] = [result[j], result[i]]
        }
        return result
      }
      const selected = players.find(player => player.id === selectedPlayer)
      if (!selected) {
        setIsSimulating(false)
        return
      }
      if (tournamentSeasonId(startingTournament.id ?? '') === 'grand-slam') {
        // Snapshot the CURRENT in-game Order of Merit at tournament start.
        // Never force the human player into the top 48.
        setSlamGroups(createSlamGroups(rankingTable.map((p, i) => ({ id: p.id, rank: i + 1 }))))
        setSlamGroupStageDone(false)
        setSlamShootouts([])
        setTournamentDraw([])
        setRoundDraws([])
        setRoundWinners([Array(8).fill(null), Array(4).fill(null), Array(2).fill(null), [null]])
        setTournamentChampionId(null)
        setShowTournamentChampion(false)
        if (!fastForwardWorldsId || stopForSelectedEvent || stopAtRunningEvent) setIsSimulating(false)
        setActiveTournamentId(startingTournament.id)
        setShowTournamentIntro(!fastForwardWorldsId || stopForSelectedEvent || Boolean(stopAtRunningEvent))
        return
      }
      const isFloor = startingTournament.category === 'floor'
      const isEuroTour = startingTournament.category === 'eurotour'
      const isUkOpen = tournamentSeasonId(startingTournament.id ?? '') === 'uk-open'
      const isPlayersFinals = tournamentSeasonId(startingTournament.id ?? '') === 'players-championship-finals'
      const isWorlds = tournamentSeasonId(startingTournament.id ?? '') === 'world-championship'
       const isMasters = tournamentSeasonId(startingTournament.id ?? '') === 'world-masters'
       const isMatchplay = tournamentSeasonId(startingTournament.id ?? '') === 'world-matchplay'
       const isGrandPrix = tournamentSeasonId(startingTournament.id ?? '') === 'world-grand-prix'
       const isEuropean = tournamentSeasonId(startingTournament.id ?? '') === 'european-championship'
       const isFixed32 = isMasters || isMatchplay || isGrandPrix || isEuropean
       const eventSize = isFloor || isUkOpen || isWorlds ? 128 : isEuroTour ? 48 : isPlayersFinals ? 64 : isFixed32 ? 32 : 16
       const ordered = rankingTable.map(p => p.id)
       const draw = isEuroTour ? (() => {
         const seeds = ordered.slice(0, 16) // World OOM seeds receive round-one byes.
         const autoQualifiers = proTourTable.map(p => p.id).filter(id => !seeds.includes(id)).slice(0, 16)
         const qualifierPool = shuffle(ordered.filter(id => !seeds.includes(id) && !autoQualifiers.includes(id)))
         const qualifiers = qualifierPool.slice(0, 16) // Placeholder qualifiers until qualification events exist.
         const shuffledAutoQualifiers = shuffle(autoQualifiers)
         const firstRound = shuffledAutoQualifiers.flatMap((id, index) => [id, qualifiers[index]])
         return [...firstRound, ...seeds]
       })() : isFloor ? (() => {
         // PDC: 32 seeds (one-year ProTour OOM), 96 other Tour Card holders.
         // Each seed occupies a distinct first-round match. Standard mirrored
         // 64-match bracket positions ensure seeds meet only at the proper stage.
         const seeds = proTourTable.slice(0, 32).map(p => p.id)
         const unseeded = shuffle(ordered.filter(id => !seeds.includes(id)))
         const firstRoundMatches: number[][] = Array.from({ length: 64 }, () => [])
         // Match positions use the same mirrored bracket as advanceFixedDraw.
         // A seed is put in exactly one of the 64 first-round matches.
         for (let seedIndex = 0; seedIndex < 32; seedIndex++) {
           firstRoundMatches[seedIndex] = [seeds[seedIndex], unseeded[seedIndex]]
         }
         for (let matchIndex = 32; matchIndex < 64; matchIndex++) {
           const offset = 32 + (matchIndex - 32) * 2
           firstRoundMatches[matchIndex] = [unseeded[offset], unseeded[offset + 1]]
         }
         return firstRoundMatches.flat()
       })() : isUkOpen ? shuffle(ordered) : (() => {
         // Qualification is frozen at each event's ranking cut-off.
         const eligible = isMatchplay ? raceField('matchplay') :
           isGrandPrix ? raceField('grandprix') :
           isEuropean ? raceField('european') :
           isPlayersFinals ? raceField('pcfinals') :
           ordered
         if (isPlayersFinals) {
           // All 64 are seeded by the Players Championship Order of Merit.
           return rankedKnockoutDraw(eligible)
         }
         if (isEuropean) {
           // European Tour OOM: 1 v 32, 2 v 31, ... 16 v 17.
           return rankedKnockoutDraw(eligible)
         }
         if (isMasters) {
           // Top 24 World OOM plus eight random remaining players.
           const automatic = ordered.slice(0, 24)
           const qualifiers = shuffle(ordered.slice(24)).slice(0, 8)
           const seeds = automatic.slice(0, 16)
           return seededDraw([...seeds, ...shuffle([...automatic.slice(16), ...qualifiers])], 32, shuffle)
         }
         if (isMatchplay || isGrandPrix) {
           // World OOM top 16 seeded; 16 ProTour qualifiers unseeded.
           const seeds = cutoffStandings(isMatchplay ? 'matchplay' : 'grandprix').world.slice(0, 16).map(p => p.id)
           const qualifiers = eligible.filter(id => !seeds.includes(id))
           return seededDraw([...seeds, ...qualifiers], 32, shuffle)
         }
         return seededDraw(eligible.slice(0, eventSize), eventSize, shuffle)
       })()
       setTournamentDraw(draw)
       setRoundDraws(tournamentSeasonId(startingTournament.id ?? '') !== 'grand-slam' ? [isEuroTour ? draw.slice(0, 32) : draw] : [])
      setViewedUkRound(null)
       setRoundWinners(isEuroTour ? [Array(16).fill(null), Array(16).fill(null), Array(8).fill(null), Array(4).fill(null), Array(2).fill(null), [null]]
         : isFloor || isUkOpen || isWorlds
         ? [Array(64).fill(null), Array(32).fill(null), Array(16).fill(null), Array(8).fill(null), Array(4).fill(null), Array(2).fill(null), [null]]
         : isPlayersFinals ? [Array(32).fill(null), Array(16).fill(null), Array(8).fill(null), Array(4).fill(null), Array(2).fill(null), [null]]
          : isFixed32 ? [Array(16).fill(null), Array(8).fill(null), Array(4).fill(null), Array(2).fill(null), [null]]
         : [Array(8).fill(null), Array(4).fill(null), Array(2).fill(null), [null]])
      setTournamentChampionId(null)
      setShowTournamentChampion(false)
      if (!fastForwardWorldsId || stopForSelectedEvent || stopAtRunningEvent) setIsSimulating(false)
      setActiveTournamentId(startingTournament.id)
      setShowTournamentIntro(!fastForwardWorldsId || stopForSelectedEvent || Boolean(stopAtRunningEvent))
    }
    }, 140)
    return () => window.clearTimeout(timer)
  }, [isSimulating, gameDate, activeTournamentId, selectedPlayer, careerEnded, fastForwardWorldsId, calendarTargetDate, premierLineups, premierResults, awardedPrizeTournamentIds])
  useEffect(() => {
    if (!showTournamentIntro || fastForwardWorldsId) return
    const timer = window.setTimeout(() => {
      setShowTournamentIntro(false)
      setScreen('menu')
    }, 2800)
    return () => window.clearTimeout(timer)
  }, [showTournamentIntro, fastForwardWorldsId])
  useEffect(() => {
    if (!premierNightIntro) return
    const timer = window.setTimeout(() => { setPremierNightIntro(null); setScreen('menu') }, 2800)
    return () => window.clearTimeout(timer)
  }, [premierNightIntro])
  const stopDevPreview = () => {
    const old = devSnapshot.current
    if (!old) return
    setScreen('menu')
    setActiveTournamentId(old.activeTournamentId)
    setTournamentDraw(old.tournamentDraw)
    setRoundDraws(old.roundDraws)
    setRoundWinners(old.roundWinners)
    setSlamGroups(old.slamGroups)
    setSlamGroupStageDone(old.slamGroupStageDone)
    setSlamShootouts(old.slamShootouts)
    setTournamentChampionId(old.tournamentChampionId)
    setShowTournamentChampion(old.showTournamentChampion)
    setCoinTossWinnerId(old.coinTossWinnerId)
    setSlamPlaying(old.slamPlaying)
    setDevPreview(false)
    devSnapshot.current = null
    // Restore normal autosave only after React has committed the restored state.
    window.setTimeout(() => { previewLock.current = false }, 100)
  }
  const openDevPreview = (id: string, target: 'tournament' | 'match-preview' | 'match' | 'champion' | 'groups') => {
    if (!devSnapshot.current) devSnapshot.current = {
      screen, activeTournamentId, tournamentDraw, roundDraws, roundWinners,
      slamGroups, slamGroupStageDone, slamShootouts,
      tournamentChampionId, showTournamentChampion, coinTossWinnerId, slamPlaying,
    }
    previewLock.current = true
    const is128 = ['uk-open', 'world-championship'].includes(tournamentSeasonId(id)) || id.startsWith('players-championship-')
    const isEuroTour = id.startsWith('european-tour-')
    const is64 = tournamentSeasonId(id ?? '') === 'players-championship-finals'
    const is32 = ['world-masters', 'world-matchplay', 'world-grand-prix', 'european-championship'].includes(tournamentSeasonId(id))
    const size = is128 ? 128 : is64 ? 64 : isEuroTour ? 48 : is32 ? 32 : 16
    const previewShuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5)
    const previewOrdered = rankingTable.map(p => p.id)
    const ids = isEuroTour ? [...previewOrdered.slice(16,48), ...previewOrdered.slice(0,16)] : tournamentSeasonId(id ?? '') === 'uk-open'
      ? previewShuffle(previewOrdered).slice(0, size)
      : seededDraw(previewOrdered.slice(0, size), size, previewShuffle)
    const winners = Array.from({length:isEuroTour ? 6 : Math.log2(size)}, (_,i) => Array(isEuroTour ? [16,16,8,4,2,1][i] : size / (2 ** (i+1))).fill(null) as (number|null)[])
    setActiveTournamentId(id)
    setTournamentDraw(ids)
    setRoundDraws(tournamentSeasonId(id ?? '') !== 'grand-slam' ? [isEuroTour ? ids.slice(0,32) : ids] : [])
    setRoundWinners(winners)
    setViewedUkRound(null)
    setSlamGroupStageDone(target !== 'groups')
    setSlamGroups(target === 'groups' ? createSlamGroups(rankingTable.map((p,i) => ({id:p.id,rank:i+1}))) : [])
    setSlamShootouts([])
    setTournamentChampionId(target === 'champion' ? (selectedPlayer ?? 1) : null)
    setShowTournamentChampion(target === 'champion')
    setCoinTossWinnerId(target === 'match' ? (selectedPlayer ?? 1) : null)
    setSlamPlaying(null)
    setDevPreview(true)
    setDevChooserOpen(false)
    setScreen(target === 'match' ? 'match' : target === 'match-preview' ? 'match-preview' : 'tournament')
  }
  useEffect(() => {
    if (!devPreview) return
    const button = document.createElement('button')
    button.textContent = '← EXIT PREVIEW'
    button.className = 'dev-preview-exit'
    button.addEventListener('click', stopDevPreview)
    document.body.appendChild(button)
    return () => { button.removeEventListener('click', stopDevPreview); button.remove() }
  }, [devPreview])
  useEffect(() => {
    if (!devPreview) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') stopDevPreview() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [devPreview])
  const currentPremier = premierLeagueNights(seasonYear).find(n => n.date === gameDate)
  const premierId = currentPremier?.id ?? ''
  const premierLineup = premierLineups[seasonYear] ?? []
  // Table points are awarded only when a complete league night has concluded.
  // Play-off finals (night 17) never change the league table.
  const premierLeagueNightsList = premierLeagueNights(seasonYear).filter(n => !n.finals)
  const completedPremierNights = premierLeagueNightsList.filter(n => {
    const result = premierResults[n.id]
    return !!result && result.rounds.length === 4 && result.rounds[3]?.length === 1
  })
  const premierStanding = premierLineup.map(id => {
    let pts = 0, wins = 0, diff = 0, legsWon = 0, nightsWon = 0
    for (const night of completedPremierNights) {
      const result = premierResults[night.id]
      if (!result.rounds[0]?.includes(id)) continue
      const champion = result.rounds[3]?.[0] === id
      if (champion) nightsWon++
      const finalist = result.rounds[2]?.includes(id)
      const semi = result.rounds[1]?.includes(id)
      pts += champion ? 5 : finalist ? 3 : semi ? 2 : 0
      for (let r = 0; r < 3; r++) {
        const entrants = result.rounds[r] ?? []
        for (let i = 0; i < entrants.length; i += 2) {
          const a = entrants[i], b = entrants[i + 1]
          if (a !== id && b !== id) continue
          const score = result.scores[r]?.[i / 2]
          if (!score) continue
          const forLegs = a === id ? score[0] : score[1]
          const againstLegs = a === id ? score[1] : score[0]
          legsWon += forLegs
          diff += forLegs - againstLegs
          if (forLegs > againstLegs) wins++
        }
      }
    }
    return { id, pts, wins, diff, legsWon, nightsWon }
  }).sort((a,b) => b.pts-a.pts || b.nightsWon-a.nightsWon || b.wins-a.wins || b.diff-a.diff || b.legsWon-a.legsWon || premierLineup.indexOf(a.id)-premierLineup.indexOf(b.id))
  premierStandingsOrderRef.current = premierStanding.map(row => row.id)
  // Every completed Premier League night produces one persistent inbox story,
  // whether played manually or simulated in the calendar.
  useEffect(() => {
    const fresh: CareerMail[] = []
    for (const [yearString, lineup] of Object.entries(premierLineups)) {
      const year = Number(yearString)
      if (year !== Number(gameDate.slice(0, 4)) || lineup.length !== 8) continue
      const nights = premierLeagueNights(year)
      const nameOf = (id: number | undefined) => players.find(p => p.id === id)?.name ?? 'Unknown player'
      for (const night of nights) {
        const result = premierResults[night.id]
        const lastRound = night.finals ? 2 : 3
        if (!result || result.rounds.length !== lastRound + 1 || result.rounds[lastRound]?.length !== 1) continue
        const winner = result.rounds[lastRound][0]
        const finalists = result.rounds[lastRound - 1]
        if (!finalists || finalists.length !== 2 || !finalists.includes(winner)) continue
        const loser = finalists.find(id => id !== winner)
        const finalScore = result.scores[lastRound - 1]?.[0]
        const score = finalScore ? ` ${Math.max(...finalScore)} - ${Math.min(...finalScore)}` : ''
        const subject = night.finals ? `Results: Premier League ${year} Finals Night` : `Results: Premier League Night ${night.night}`
        const intro = night.finals ? `${nameOf(winner)} is the Premier League ${year} champion!` : `${nameOf(winner)} wins Premier League Night ${night.night} in ${night.city}!`
        const detail = `${nameOf(winner)} defeats ${nameOf(loser)}${score} in the final${night.finals ? ' at Finals Night' : ` in ${night.city}`}.`
        fresh.push({ id: `premier-results-${night.id}`, date: night.date, subject,
          preview: `${nameOf(winner)} defeats ${nameOf(loser)}${score}...`, body: `${intro}\n\n${detail}`, read: false })
      }
      const regular = nights.filter(n => !n.finals)
      if (regular.every(n => premierResults[n.id]?.rounds[3]?.length === 1)) {
        const tally = lineup.map(id => {
          let points = 0, nightWins = 0, matchWins = 0
          for (const n of regular) {
            const r = premierResults[n.id]
            if (!r.rounds[0]?.includes(id)) continue
            const champ = r.rounds[3]?.[0] === id
            const finalist = r.rounds[2]?.includes(id)
            const semifinalist = r.rounds[1]?.includes(id)
            points += champ ? 5 : finalist ? 3 : semifinalist ? 2 : 0
            if (champ) nightWins++
            for (let round = 0; round < 3; round++) {
              const entrants = r.rounds[round] ?? []
              for (let i = 0; i < entrants.length; i += 2) {
                const a = entrants[i], b = entrants[i + 1]
                if (a !== id && b !== id) continue
                const sc = r.scores[round]?.[i / 2]
                if (sc && (a === id ? sc[0] > sc[1] : sc[1] > sc[0])) matchWins++
              }
            }
          }
          return { id, points, nightWins, matchWins }
        }).sort((a,b) => b.points-a.points || b.nightWins-a.nightWins || b.matchWins-a.matchWins || lineup.indexOf(a.id)-lineup.indexOf(b.id))
        const top = tally.slice(0, 4).map((p,i) => `• ${nameOf(p.id)}${i === 0 ? ' (league leader)' : ''}`).join('\n')
        fresh.push({id:`premier-final-four-${year}`,date:regular[15].date,
          subject:`Premier League ${year}: Finals Night Lineup`,
          preview:'The four Finals Night contenders are confirmed...',
          body:`Sixteen league nights have decided the final four!\n\n${top}\n\nThese four players will battle for the Premier League title at Finals Night.`,read:false})
      }
    }
    if (fresh.length) setInbox(previous => {
      const existing = new Set(previous.map(mail => mail.id))
      const additions = fresh.filter(mail => !existing.has(mail.id) && !isMailDismissed(mail.id) && mail.date.slice(0, 4) === gameDate.slice(0, 4))
      return additions.length ? [...additions.reverse(), ...previous] : previous
    })
  }, [premierResults, premierLineups, gameDate.slice(0, 4)])
  const premierRemainingNights = 16 - completedPremierNights.length
  // Conservative mathematical clinch: an opponent may gain 5 points per remaining
  // night. Treat equal final points as unsafe, since leg-difference can still change.
  const premierGuaranteedTopFour = (id: number) => {
    const player = premierStanding.find(row => row.id === id)
    if (!player) return false
    if (premierRemainingNights === 0) return premierStanding.findIndex(row => row.id === id) < 4
    return premierStanding.filter(other => other.id !== id && other.pts + 5 * premierRemainingNights >= player.pts).length < 4
  }
  const premierMathematicallyOut = (id: number) => {
    const player = premierStanding.find(row => row.id === id)
    if (!player) return false
    if (premierRemainingNights === 0) return premierStanding.findIndex(row => row.id === id) >= 4
    // At least four other players are already strictly beyond the maximum
    // attainable points of this player, even with every remaining night won.
    return premierStanding.filter(other => other.id !== id && other.pts > player.pts + 5 * premierRemainingNights).length >= 4
  }
  const premierExisting = premierResults[premierId]
  const premierIsFinals = currentPremier?.finals ?? false
  const premierRound0 = currentPremier && premierLineup.length===8
    ? (premierIsFinals ? premierFinalsPairs(premierStanding.map(x=>x.id))
       : premierQuarterFinalPairs(currentPremier.night,premierLineup,premierStanding.map(x=>x.id))).flat()
    : []
  const premierNightState = premierExisting ?? {rounds:[premierRound0],scores:[] as [number,number][][]}
  const premierRound = premierNightState.rounds.length-1
  const premierEntrants = premierNightState.rounds[premierRound] ?? []
  const premierScores = premierNightState.scores[premierRound] ?? []
  const premierDone = premierNightState.rounds.length === (premierIsFinals ? 3 : 4)
  const premierNightPending = Boolean(currentPremier && premierLineup.length === 8 && !premierDone)
  const premierNextMatch = !premierDone ? premierScores.length : -1
  const premierA = premierEntrants[premierNextMatch*2]
  const premierB = premierEntrants[premierNextMatch*2+1]
  const recordPremierMatch = (a:number,b:number,round:number,match:number,winner:number,losingLegs:number) => {
    const base = premierResults[premierId] ?? {rounds:[premierRound0],scores:[] as [number,number][][]}
    if (base.scores[round]?.[match] || base.rounds[round]?.[match*2]!==a || base.rounds[round]?.[match*2+1]!==b) return
    const target = premierIsFinals ? (round===0?10:11) : 6
    const scores=base.scores.map(row=>[...row])
    while(scores.length<=round) scores.push([])
    scores[round][match]=winner===a?[target,losingLegs]:[losingLegs,target]
    const rounds=base.rounds.map(row=>[...row])
    if(scores[round].length===rounds[round].length/2) {
      const winners=rounds[round].filter((_,i)=>i%2===0).map((id,i)=>scores[round][i][0]>scores[round][i][1]?id:rounds[round][i*2+1])
      rounds.push(winners)
      if(winners.length===1) {
        setPremierChampionPopupId(premierId)
        if (!premierIsFinals && winner===selectedPlayer) setCareerEarnings(v=>v+PREMIER_LEAGUE_PRIZES_2026.nightlyWinner)
        if (premierIsFinals && selectedPlayer!==null) {
          const place=premierStanding.findIndex(x=>x.id===selectedPlayer)
          const finalPrize=selectedPlayer===winners[0]?PREMIER_LEAGUE_PRIZES_2026.champion
            : rounds[1]?.includes(selectedPlayer)?PREMIER_LEAGUE_PRIZES_2026.runnerUp
            : place<4?PREMIER_LEAGUE_PRIZES_2026.semiFinalist
            : [PREMIER_LEAGUE_PRIZES_2026.fifth,PREMIER_LEAGUE_PRIZES_2026.sixth,PREMIER_LEAGUE_PRIZES_2026.seventh,PREMIER_LEAGUE_PRIZES_2026.eighth][place-4]
          if(finalPrize) setCareerEarnings(v=>v+finalPrize)
        }
      }
    }
    setPremierResults(prev=>({...prev,[premierId]:{rounds,scores}}))
    // Commit the Finals Night report at the exact moment the decisive match ends.
    // This avoids depending on a later calendar render to deliver the champion mail.
    if (premierIsFinals && rounds.length === 3 && rounds[2]?.length === 1 && scores[1]?.[0]) {
      const champion = rounds[2][0]
      const runnerUp = rounds[1].find(id => id !== champion)
      const finalScore = scores[1][0]
      if (runnerUp !== undefined) {
        const championName = players.find(p => p.id === champion)?.name ?? 'Unknown player'
        const runnerUpName = players.find(p => p.id === runnerUp)?.name ?? 'Unknown player'
        const scoreText = `${Math.max(...finalScore)} - ${Math.min(...finalScore)}`
        const mailId = `premier-results-${premierId}`
        const year = currentPremier?.year ?? seasonYear
        const mail: CareerMail = {
          id: mailId, date: gameDate,
          subject: `Results: Premier League ${year} Finals Night`,
          preview: `${championName} defeats ${runnerUpName} ${scoreText}...`,
          body: `${championName} is the Premier League ${year} champion!\n\n${championName} defeats ${runnerUpName} ${scoreText} in the final at Finals Night.`,
          read: false,
        }
        setInbox(previous => isMailDismissed(mailId) || previous.some(item => item.id === mailId) ? previous : [mail, ...previous])
      }
    }
  }
  const chosenPlayer = players.find(player => player.id === selectedPlayer)
  const qualifiedForEvent = tournamentDraw.includes(selectedPlayer ?? -1)
  const qualifiedForActiveTournament = activeTournamentId !== null && (tournamentSeasonId(activeTournamentId) === 'grand-slam' ? slamGroups.some(group => group.players.includes(selectedPlayer ?? -1)) : qualifiedForEvent)
  const unqualifiedPremierNight = premierNightPending && selectedPlayer !== null && !premierLineup.includes(selectedPlayer)
  const unqualifiedActiveEvent = Boolean(activeTournamentId && !qualifiedForActiveTournament)
  const continueUnqualifiedEvent = () => {
    setCalendarTargetDate(null)
    setCalendarStopRequested(false)
    setShowTournamentIntro(false)
    setScreen('calendar')
    if (unqualifiedActiveEvent) {
      // Reuse the exact bracket simulation and payout commit pipeline.
      // Only this event is auto-played; afterwards normal SIMULATE resumes.
      setFastForwardWorldsId('__unqualified_continue__')
      setIsSimulating(true)
    } else if (unqualifiedPremierNight) {
      // A non-invited player watches the league from the calendar.
      setFastForwardWorldsId(null)
      setIsSimulating(true)
    }
  }
  const isEuroTourDraw = activeTournamentId?.startsWith('european-tour-') ?? false
  const is128Draw = tournamentDraw.length === 128
  const is64Draw = tournamentDraw.length === 64
  const isFixedKnockout = tournamentSeasonId(activeTournamentId ?? '') !== 'uk-open' && (tournamentSeasonId(activeTournamentId ?? '') !== 'grand-slam' || slamGroupStageDone)
  const isLargeDraw = isEuroTourDraw || is128Draw || is64Draw || (isFixedKnockout && (tournamentDraw.length === 32 || tournamentDraw.length === 16))
  const isOpen64Draw = tournamentSeasonId(activeTournamentId ?? '') === 'uk-open'
  const is32Draw = tournamentDraw.length === 32
  const roundKeys: Round[] = isEuroTourDraw ? ['last32', 'last32', 'last16', 'quarterFinal', 'semiFinal', 'final'] : is128Draw ? ['last64', 'last64', 'last32', 'last16', 'quarterFinal', 'semiFinal', 'final']
    : is64Draw
    ? ['last64', 'last32', 'last16', 'quarterFinal', 'semiFinal', 'final']
    : is32Draw ? ['last32', 'last16', 'quarterFinal', 'semiFinal', 'final']
    : ['last16', 'quarterFinal', 'semiFinal', 'final']
  const roundLabels = isEuroTourDraw ? ['LAST 48', 'LAST 32', 'LAST 16', 'QUARTER-FINAL', 'SEMI-FINAL', 'FINAL'] : is128Draw ? ['LAST 128', 'LAST 64', 'LAST 32', 'LAST 16', 'QUARTER-FINAL', 'SEMI-FINAL', 'FINAL']
    : is64Draw
    ? ['LAST 64', 'LAST 32', 'LAST 16', 'QUARTER-FINAL', 'SEMI-FINAL', 'FINAL']
    : is32Draw ? ['LAST 32', 'LAST 16', 'QUARTER-FINAL', 'SEMI-FINAL', 'FINAL']
    : ['LAST 16', 'QUARTER-FINAL', 'SEMI-FINAL', 'FINAL']
  const activeTournamentFormat = tournamentById(activeTournamentId ?? '')
  const activeRoundIndex = roundWinners.findIndex(round => round.some(winner => winner === null))
  const currentFormat = activeTournamentFormat?.formats[roundKeys[Math.max(0, activeRoundIndex)]]
  const roundSlots: (number | null)[][] = isFixedKnockout || isLargeDraw
    ? roundWinners.map((_, index) => roundDraws[index] ?? [])
    : [tournamentDraw, ...roundWinners.slice(0, -1)]
  const currentRound = roundWinners.findIndex(round => round.some(winner => winner === null))
  const yourRoundMatch = currentRound >= 0
    ? Math.floor(roundSlots[currentRound].indexOf(selectedPlayer ?? -1) / 2)
    : -1
  const youStillPlaying = currentRound >= 0 &&
    roundSlots[currentRound].includes(selectedPlayer)
  const currentOpponentId = youStillPlaying && yourRoundMatch >= 0
    ? roundSlots[currentRound][yourRoundMatch * 2 +
      (roundSlots[currentRound][yourRoundMatch * 2] === selectedPlayer ? 1 : 0)]
    : null
  const simulateWinner = (a: number, b: number) => {
    const first = players.find(player => player.id === a)
    const second = players.find(player => player.id === b)
    if (!first || !second) return Math.random() < 0.5 ? a : b
    const chance = winChanceForFirstPlayer(
      skillTierFromStartingRank(first.rank),
      skillTierFromStartingRank(second.rank),
    )
    return Math.random() < chance ? a : b
  }
  const advanceEventDraw = (roundWinnersForAdvance: (number | null)[], roundIndex: number): number[] => {
    if (isEuroTourDraw && roundIndex === 0) {
      const seeds = tournamentDraw.slice(32)
      const firstRoundWinners = roundWinnersForAdvance as number[]
      return seeds.flatMap((seed, i) => [seed, firstRoundWinners[i]])
    }
    return advanceFixedDraw(roundWinnersForAdvance, isEuroTourDraw ? roundIndex - 1 : roundIndex)
  }
  const completeRound = (winnerId: number, playedScore?: { youScore: number; rivalScore: number; unit: 'legs' | 'sets' }) => {
    if (currentRound < 0 || yourRoundMatch < 0 || !youStillPlaying) return
    const next = roundWinners.map(round => [...round])
    const slots = roundSlots[currentRound]
    for (let index = 0; index < next[currentRound].length; index++) {
      const first = slots[index * 2]
      const second = slots[index * 2 + 1]
      if (first == null || second == null) return
      next[currentRound][index] = index === yourRoundMatch
        ? winnerId
        : simulateWinner(first, second)
    }
    if ((isFixedKnockout || isLargeDraw) && currentRound < next.length - 1) {
      const advancing = next[currentRound].filter((id): id is number => id !== null)
      const shuffled = isOpen64Draw ? [...advancing] : advanceEventDraw(next[currentRound], currentRound)
      if (isOpen64Draw) for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      setRoundDraws(previous => [...previous.slice(0, currentRound + 1), shuffled])
    }
    if (selectedPlayer !== null && currentOpponentId !== null &&
        (winnerId === selectedPlayer || winnerId === currentOpponentId)) {
      recordHeadToHead(currentOpponentId, winnerId)
    }
    setRoundWinners(next)
    setViewedUkRound(null)
    if (currentRound === next.length - 1) {
      if (activeTournamentId && currentOpponentId !== null && selectedPlayer !== null && playedScore) {
        const winnerScore = winnerId === selectedPlayer ? playedScore.youScore : playedScore.rivalScore
        const loserScore = winnerId === selectedPlayer ? playedScore.rivalScore : playedScore.youScore
        setFinalScores(prev => ({ ...prev, [activeTournamentId]: {
          winnerId, loserId: winnerId === selectedPlayer ? currentOpponentId : selectedPlayer,
          winnerScore, loserScore, unit: playedScore.unit
        } }))
      } else if (activeTournamentId) {
        const finalists = slots.filter((id): id is number => id !== null)
        const loser = finalists.find(id => id !== winnerId)
        if (loser !== undefined) saveSimulatedFinal(activeTournamentId, winnerId, loser)
      }
      setTournamentChampionId(next[next.length - 1][0])
      setShowTournamentChampion(true)
    }
    setCoinTossWinnerId(null)
    setCoinTossSpinning(false)
    setScreen('tournament')
  }
  // Test controls use the same round-completion path as a played match.
  const devFinishMatch = (playerWins: boolean) => {
    if (!youStillPlaying || currentOpponentId === null || selectedPlayer === null) return
    completeRound(playerWins ? selectedPlayer : currentOpponentId)
  }
  const devSimulateRound = () => {
    if (currentRound < 0) return
    const slots = roundSlots[currentRound]
    if (!slots || slots.length !== roundWinners[currentRound].length * 2) return
    const next = roundWinners.map(round => [...round])
    for (let i = 0; i < next[currentRound].length; i++) {
      if (next[currentRound][i] !== null) continue
      const a = slots[i * 2]
      const b = slots[i * 2 + 1]
      if (a == null || b == null) return
      next[currentRound][i] = simulateWinner(a, b)
    }
    if ((isFixedKnockout || isLargeDraw) && currentRound < next.length - 1) {
      const advancing = next[currentRound].filter((id): id is number => id !== null)
      if (isOpen64Draw) for (let i = advancing.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[advancing[i], advancing[j]] = [advancing[j], advancing[i]]
      }
      setRoundDraws(previous => [...previous.slice(0, currentRound + 1), isOpen64Draw ? advancing : advanceEventDraw(next[currentRound], currentRound)])
    }
    setRoundWinners(next)
    setViewedUkRound(null)
    if (currentRound === next.length - 1) {
      const winner = next[next.length - 1][0]
      const loser = slots.find(id => id !== null && id !== winner)
      if (activeTournamentId && winner !== null && loser != null) saveSimulatedFinal(activeTournamentId, winner, loser)
      setTournamentChampionId(next[next.length - 1][0])
      setShowTournamentChampion(true)
    }
  }
  // Repair saves made by the earlier broken Grand Slam build, which started
  // the event without creating any groups. Only repairs an EMPTY group stage.
  useEffect(() => {
    if (tournamentSeasonId(activeTournamentId ?? '') === 'grand-slam' && !slamGroupStageDone && slamGroups.length === 0) {
      setSlamGroups(createSlamGroups(rankingTable.map((p, i) => ({ id: p.id, rank: i + 1 }))))
    }
  }, [activeTournamentId, slamGroupStageDone, slamGroups.length])
  const slamActive = tournamentSeasonId(activeTournamentId ?? '') === 'grand-slam'
  const slamInGroups = slamActive && !slamGroupStageDone
  const slamUserQualified = slamGroups.some(g => g.players.includes(selectedPlayer ?? -1))
  const slamNextMatch = slamGroups.flatMap((g, gi) => g.matches.map((m, mi) => ({ g, gi, m, mi }))).find(x => x.m.aLegs === null)
  const slamUserNextMatch = slamGroups.flatMap((g, gi) => g.matches.map((m, mi) => ({ g, gi, m, mi }))).find(x => x.m.aLegs === null && (x.m.a === selectedPlayer || x.m.b === selectedPlayer))
  const slamSimScore = (a: number, b: number): [number, number] => {
    const winner = simulateWinner(a, b)
    const loserLegs = Math.floor(Math.random() * 5)
    return winner === a ? [5, loserLegs] : [loserLegs, 5]
  }
  const slamRecord = (gi: number, mi: number, aLegs: number, bLegs: number) => {
    // Finish the same matchday in all groups when the player's match is played
    // or resolved through the developer win/lose controls.
    setSlamGroups(previous => previous.map((group, index) => {
      let updated = group
      if (index === gi && updated.matches[mi]?.aLegs === null) {
        updated = recordSlamMatch(updated, mi, aLegs, bLegs)
      }
      // All groups play fixture 1 before fixture 2, and fixture 2 before 3.
      // This also fills any unfinished earlier fixtures in other groups.
      for (let fixtureIndex = 0; fixtureIndex <= mi; fixtureIndex++) {
        const fixture = updated.matches[fixtureIndex]
        if (!fixture || fixture.aLegs !== null) continue
        // Never simulate the user's other future match in their own group.
        if (index === gi && (fixture.a === selectedPlayer || fixture.b === selectedPlayer)) continue
        const [simA, simB] = slamSimScore(fixture.a, fixture.b)
        updated = recordSlamMatch(updated, fixtureIndex, simA, simB)
      }
      return updated
    }))
  }
  const slamSimAll = () => {
    setSlamGroups(previous => previous.map(g => g.matches.reduce((updated, m, i) => {
      if (m.aLegs !== null) return updated
      const [a, b] = slamSimScore(m.a, m.b)
      return recordSlamMatch(updated, i, a, b)
    }, g)))
  }
  const slamSimToEnd = () => {
    // Finish ALL groups first, including the human's matches when requested.
    const completed = slamGroups.map(g => g.matches.reduce((updated, m, i) => {
      if (m.aLegs !== null) return updated
      const [a, b] = slamSimScore(m.a, m.b)
      return recordSlamMatch(updated, i, a, b)
    }, g))
    if (completed.length !== 16) return
    const shootouts: SlamTiebreak[] = [...slamShootouts]
    for (const g of completed) {
      const ties = slamStandings(g, shootouts).unresolved.flat()
      for (const id of ties) {
        if (!shootouts.some(s => s.group === g.name && s.playerId === id))
          shootouts.push({ group: g.name, playerId: id, nineDartScore: Math.floor(Math.random() * 541) })
      }
    }
    const winners = completed.map(g => slamStandings(g, shootouts).standings[0].id)
    const bracket = fixedMatchOrder(8).flatMap(seed => [winners[seed - 1], winners[16 - seed]])
    const next: (number | null)[][] = [Array(8).fill(null), Array(4).fill(null), Array(2).fill(null), [null]]
    let entrants = bracket
    const completedDraws: number[][] = [bracket]
    for (let round = 0; round < next.length; round++) {
      const advancing: number[] = []
      for (let i = 0; i < entrants.length; i += 2) advancing.push(simulateWinner(entrants[i], entrants[i + 1]))
      next[round] = advancing
      if (round < next.length - 1) {
        entrants = advanceFixedDraw(advancing, round)
        completedDraws.push(entrants)
      } else {
        entrants = advancing
      }
    }
    const finalWinner = entrants[0]
    const finalLoser = completedDraws[completedDraws.length - 1]?.find(id => id !== finalWinner)
    if (activeTournamentId && finalLoser !== undefined) saveSimulatedFinal(activeTournamentId, finalWinner, finalLoser)
    setSlamGroups(completed)
    setSlamShootouts(shootouts)
    setTournamentDraw(bracket)
    setRoundDraws(completedDraws)
    setRoundWinners(next)
    setSlamGroupStageDone(true)
    setTournamentChampionId(entrants[0])
    setShowTournamentChampion(true)
  }
  const slamAdvance = () => {
    if (!slamGroups.every(slamGroupFinished)) return
    const standings = slamGroups.map(g => slamStandings(g, slamShootouts))
    if (standings.some(x => x.unresolved.length)) return
    // Career Mode mirrored bracket: A/P, B/O, C/N etc.; official 2026 knockout mapping is not confirmed here.
    const winners = standings.map(x => x.standings[0].id)
    const bracket: number[] = []
    for (const seed of fixedMatchOrder(8)) bracket.push(winners[seed - 1], winners[16 - seed])
    setTournamentDraw(bracket)
    setRoundDraws([bracket])
    setRoundWinners([Array(8).fill(null), Array(4).fill(null), Array(2).fill(null), [null]])
    setSlamGroupStageDone(true)
  }
  const finishTournament = () => {
    if (!activeTournamentId || finishingTournamentRef.current === activeTournamentId) return
    // Only finish once the bracket has a valid champion and all rounds are resolved.
    const groupPayouts = tournamentSeasonId(activeTournamentId ?? '') === 'grand-slam' && slamGroupStageDone
      ? slamGroups.flatMap(g => {
          const standings = slamStandings(g, slamShootouts)
          return standings.standings.slice(1).map((row, i): PrizeMoneyEntry => ({
            tournamentId: activeTournamentId, playerId: row.id,
            earnedAt: tournamentById(activeTournamentId ?? '')?.endDate ?? gameDate,
            amount: i === 0 ? 12500 : 5000, countsForRanking: true,
          }))
        }) : []
    // Recover old Grand Slam saves whose simulated rounds were not persisted in roundDraws.
    // The knockout draw can be deterministically rebuilt from the recorded winners.
    const recoveredSlamDraws: number[][] = [tournamentDraw]
    if (tournamentSeasonId(activeTournamentId ?? '') === 'grand-slam' && slamGroupStageDone) {
      for (let round = 0; round < roundWinners.length - 1; round++) {
        const winners = roundWinners[round]
        if (winners.some(id => id === null)) break
        recoveredSlamDraws.push(advanceFixedDraw(winners as number[], round))
      }
    }
    const payoutDraws = tournamentSeasonId(activeTournamentId ?? '') === 'grand-slam' && slamGroupStageDone
      ? recoveredSlamDraws
      : (isFixedKnockout || isLargeDraw) ? roundDraws : undefined
    const payouts = [...calculateEventPayouts(
      activeTournamentId,
      tournamentById(activeTournamentId ?? '')?.endDate ?? gameDate,
      tournamentDraw,
      roundWinners,
      payoutDraws,
    ), ...groupPayouts]
    if (payouts.length !== (tournamentSeasonId(activeTournamentId ?? '') === 'grand-slam' ? 48 : tournamentDraw.length) || tournamentChampionId !== roundWinners[roundWinners.length - 1][0]) return
    // First card check after the 2027 Worlds, then after EVERY World Championship.
    // Evaluate the complete payout ledger including the tournament just finished.
    const eventYear = Number(activeTournamentId.slice(-4))
    const isWorldChampionship = tournamentSeasonId(activeTournamentId) === 'world-championship'
    const endingDate = tournamentById(activeTournamentId)?.endDate ?? gameDate
    if (isWorldChampionship && eventYear >= 2027 && selectedPlayer !== null) {
      const allEntries = awardedPrizeTournamentIds.includes(activeTournamentId)
        ? prizeMoneyEntries : [...prizeMoneyEntries, ...payouts]
      const projectedMoney = legacyRankingMoneyAsOf(legacyRankingMoney, endingDate)
      for (const entry of allEntries) {
        if (entry.countsForRanking && rankingEntryActive(entry, endingDate))
          projectedMoney[entry.playerId] = (projectedMoney[entry.playerId] ?? 0) + entry.amount
      }
      const finalStandings = [...players].sort((a,b) =>
        (projectedMoney[b.id] ?? 0) - (projectedMoney[a.id] ?? 0) || a.rank - b.rank)
      if (finalStandings.findIndex(player => player.id === selectedPlayer) >= 64) {
        setCareerEnded(true)
      }
    }
    finishingTournamentRef.current = activeTournamentId
    // Generate exactly one results mail when the tournament is first committed.
    // The final opponent is taken from the completed bracket, never inferred
    // from prize money. Older match scorelines are not persisted by the game.
    if (!awardedPrizeTournamentIds.includes(activeTournamentId)) {
      const finishedEvent = tournamentById(activeTournamentId)
      const champion = players.find(player => player.id === tournamentChampionId)
      const finalSlots = roundSlots[roundSlots.length - 1] ?? []
      const runnerUpId = finalSlots.find(id => id !== null && id !== tournamentChampionId)
      const runnerUp = players.find(player => player.id === runnerUpId)
      if (finishedEvent && champion) {
        const recordedFinal = finalScores[activeTournamentId]
        const scoreline = recordedFinal && recordedFinal.winnerId === champion.id &&
          recordedFinal.loserId === runnerUpId
          ? ` ${recordedFinal.winnerScore} - ${recordedFinal.loserScore} in ${recordedFinal.unit}` : ''
        const finalSentence = runnerUp
          ? `${champion.name} defeats ${runnerUp.name}${scoreline} in the final of the ${finishedEvent.name}.`
          : `${champion.name} wins the ${finishedEvent.name}.`
        const newMail: CareerMail = {
          id: `results-${activeTournamentId}`,
          date: finishedEvent.endDate,
          subject: `Results: ${finishedEvent.name}`,
          preview: `${champion.name} defeats ${runnerUp?.name ?? 'the field'}${scoreline}...`,
          body: `${champion.name} wins the ${finishedEvent.name}!\n\n${finalSentence}`,
          read: false,
        }
        setInbox(previous => isMailDismissed(newMail.id) || previous.some(mail => mail.id === newMail.id) ? previous : [newMail, ...previous])
      }
    }
    if (!awardedPrizeTournamentIds.includes(activeTournamentId)) {
      setPrizeMoneyEntries(previous => [...previous, ...payouts])
      setAwardedPrizeTournamentIds(previous => [...previous, activeTournamentId])
      const yourPayout = payouts.find(payout => payout.playerId === selectedPlayer)
      if (yourPayout) setCareerEarnings(previous => previous + yourPayout.amount)
    }
    if (tournamentChampionId === selectedPlayer &&
        !awardedTitleTournamentIds.includes(activeTournamentId)) {
      setCareerTitles(previous => previous + 1)
      setAwardedTitleTournamentIds(previous => [...previous, activeTournamentId])
    }
    const tournament = tournamentById(activeTournamentId ?? '')
    if (tournament) {
      // Stay on the event's LAST day. The user explicitly advances to the next
      // day, so back-to-back Players Championships never auto-simulate.
      setGameDate(tournament.endDate)
      const finalDay = new Date(`${tournament.endDate}T12:00:00`)
      setCalendarMonth(finalDay.getMonth())
      setCalendarYear(finalDay.getFullYear())
    }
    setActiveTournamentId(null)
    advanceOneDayRef.current = false
    if (calendarTargetDate && tournament && tournament.endDate >= calendarTargetDate) {
      setCalendarTargetDate(null)
      setFastForwardWorldsId(null)
      setIsSimulating(false)
    } else if (fastForwardWorldsId && activeTournamentId === fastForwardWorldsId) {
      setFastForwardWorldsId(null)
      setIsSimulating(false)
    } else if (!fastForwardWorldsId) {
      setIsSimulating(false)
    }
    if (fastForwardWorldsId === '__unqualified_continue__') {
      setFastForwardWorldsId(null)
      setIsSimulating(true)
    }
    setShowTournamentIntro(false)
    setShowTournamentChampion(false)
    setTournamentChampionId(null)
    setTournamentDraw([])
    setSlamGroups([])
    setSlamGroupStageDone(false)
    setSlamShootouts([])
    setRoundDraws([])
    setViewedUkRound(null)
    setRoundWinners([
      Array(8).fill(null),
      Array(4).fill(null),
      Array(2).fill(null),
      [null]
    ])
    setCoinTossWinnerId(null)
    // Keep the calendar mounted while selected-day fast-forward commits completed
    // tournament brackets, rankings and prize money in the background.
    if (fastForwardWorldsId && !careerEnded) {
      setScreen('calendar')
      return
    }
    setScreen(isWorldChampionship && eventYear >= 2027 && selectedPlayer !== null && (() => {
      const entries = awardedPrizeTournamentIds.includes(activeTournamentId) ? prizeMoneyEntries : [...prizeMoneyEntries, ...payouts]
      const money = legacyRankingMoneyAsOf(legacyRankingMoney, endingDate); for (const e of entries) if (e.countsForRanking && rankingEntryActive(e, endingDate)) money[e.playerId] = (money[e.playerId] ?? 0) + e.amount;
      return [...players].sort((a,b) => (money[b.id] ?? 0) - (money[a.id] ?? 0) || a.rank - b.rank).findIndex(p => p.id === selectedPlayer) >= 64
    })() ? 'career-over' : 'menu')
  }
  const simulateToEnd = () => {
    const next = roundWinners.map(round => [...round])
    const draws = isFixedKnockout || isLargeDraw ? roundDraws.map(draw => [...draw]) : []
    for (let roundIndex = 0; roundIndex < next.length; roundIndex++) {
      const slots = isFixedKnockout || isLargeDraw ? draws[roundIndex] : roundIndex === 0 ? tournamentDraw : next[roundIndex - 1]
      if (!slots || slots.length !== next[roundIndex].length * 2) return
      for (let index = 0; index < next[roundIndex].length; index++) {
        if (next[roundIndex][index] !== null) continue
        const first = slots[index * 2]
        const second = slots[index * 2 + 1]
        if (first == null || second == null) return
        next[roundIndex][index] = simulateWinner(first, second)
      }
      if ((isFixedKnockout || isLargeDraw) && roundIndex < next.length - 1 && !draws[roundIndex + 1]) {
        const advancing = next[roundIndex].filter((id): id is number => id !== null)
        if (isOpen64Draw) for (let i = advancing.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[advancing[i], advancing[j]] = [advancing[j], advancing[i]]
        }
        draws.push(isOpen64Draw ? advancing : advanceEventDraw(next[roundIndex], roundIndex))
      }
    }
    const finalWinner = next[next.length - 1][0]
    const finalSlotsForScore = (isFixedKnockout || isLargeDraw) ? draws[draws.length - 1] : next[next.length - 2]
    const finalLoser = finalSlotsForScore?.find(id => id !== null && id !== finalWinner)
    if (activeTournamentId && finalWinner !== null && finalLoser != null) saveSimulatedFinal(activeTournamentId, finalWinner, finalLoser)
    if (isFixedKnockout || isLargeDraw) setRoundDraws(draws)
    setViewedUkRound(null)
    setRoundWinners(next)
    setTournamentChampionId(next[next.length - 1][0])
    setShowTournamentChampion(true)
  }

  // Test-only fast forward uses the SAME draw, match simulation and payout
  // functions as the normal SIM TO END button. Each event is committed before
  // moving to the next date; no direct ranking balance manipulation.
  useEffect(() => {
    if (!fastForwardWorldsId || careerEnded || !activeTournamentId) return
    const timer = window.setTimeout(() => {
      if (tournamentChampionId !== null) {
        finishTournament()
      } else if (tournamentSeasonId(activeTournamentId) === 'grand-slam' && !slamGroupStageDone) {
        slamSimToEnd()
      } else {
        simulateToEnd()
      }
    }, 20)
    return () => window.clearTimeout(timer)
  }, [fastForwardWorldsId, careerEnded, activeTournamentId, tournamentChampionId,
      slamGroupStageDone, roundWinners, tournamentDraw, roundDraws, slamGroups])

if ((screen === 'career-over' || careerEnded) && chosenPlayer) {
  return (
    <main
      className="career-screen"
      role="button"
      tabIndex={0}
      aria-label="Tour Card lost. Press anywhere to start a new career."
      onClick={() => deleteCareer(true)}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          deleteCareer(true)
        }
      }}
      style={{
        minHeight: '100vh', width: '100%', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(24px, 5vw, 64px)', boxSizing: 'border-box',
        background: 'radial-gradient(ellipse at 50% 18%, #183453 0%, #0a192e 48%, #050d1a 100%)',
        color: '#f5f8ff', textAlign: 'center',
      }}
    >
      <section aria-labelledby="tour-card-lost-title" style={{ width: '100%', maxWidth: 920 }}>
        <div style={{ color: '#f8bc52', fontSize: 12, fontWeight: 900, letterSpacing: 4, marginBottom: 24 }}>PDC CAREER MODE</div>
        <div style={{ width: 74, height: 2, background: '#f8bc52', margin: '0 auto 26px' }} />
        <h1 id="tour-card-lost-title" style={{ fontSize: 'clamp(42px, 7vw, 82px)', lineHeight: 1, fontWeight: 950, letterSpacing: 1.5, margin: '0 0 20px' }}>
          TOUR CARD <span style={{ color: '#f8bc52' }}>LOST</span>
        </h1>
        <div style={{ fontSize: 'clamp(21px, 3vw, 30px)', fontWeight: 850, marginBottom: 12 }}>{chosenPlayer.name}</div>
        <p style={{ color: '#b6cbe2', fontSize: 'clamp(14px, 1.8vw, 17px)', lineHeight: 1.6, maxWidth: 560, margin: '0 auto 44px' }}>
          You finished outside the World Order of Merit top 64 after the World Championship.
          Your career has come to an end.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 0, maxWidth: 800, margin: '0 auto 56px' }}>
          {[
            ['BEST WORLD RANK', `#${bestWorldRank}`],
            ['CAREER EARNINGS', formatPrizeMoney(careerEarnings)],
            ['TITLES WON', String(careerTitles)],
            ['SEASONS PLAYED', String(Number(gameDate.slice(0, 4)) - 2025)],
          ].map(([label, value], index) => (
            <div key={label} style={{ padding: '8px 10px', minWidth: 0, borderLeft: index ? '1px solid rgba(248,188,82,.38)' : 'none' }}>
              <div style={{ fontSize: 'clamp(9px, 1.2vw, 11px)', color: '#a9c5e2', fontWeight: 800, letterSpacing: 1.3, marginBottom: 12 }}>{label}</div>
              <div style={{ fontSize: 'clamp(17px, 2.8vw, 30px)', fontWeight: 900, overflowWrap: 'anywhere' }}>{value}</div>
            </div>
          ))}
        </div>
        <div className="tournament-continue" style={{ display: 'block', color: '#f8bc52', fontWeight: 900, letterSpacing: 2.4, fontSize: 'clamp(11px, 1.5vw, 15px)' }}>
          PRESS ANYWHERE TO CONTINUE
        </div>
        <div style={{ color: '#839ebc', fontSize: 12, marginTop: 16 }}>Return to player selection · Start a fresh career</div>
      </section>
    </main>
  )
}
if (screen === 'calendar' && chosenPlayer) {
  const premierCalendarNights = premierLeagueNights(calendarYear)
  const premierRevealDates = [calendarYear - 1, calendarYear, calendarYear + 1]
    .flatMap(year => tournamentsForSeason(year))
    .filter(event => tournamentSeasonId(event.id) === 'world-championship' && Number(event.id.slice(-4)) + 1 >= 2027)
    .map(event => {
      const reveal = new Date(`${event.endDate}T12:00:00`)
      reveal.setDate(reveal.getDate() + 7)
      return `${reveal.getFullYear()}-${String(reveal.getMonth()+1).padStart(2,'0')}-${String(reveal.getDate()).padStart(2,'0')}`
    })
  const firstDay = new Date(calendarYear, calendarMonth, 1)
  // Maandag = eerste dag van de week
  const offset = (firstDay.getDay() + 6) % 7
  const calendarDays = Array.from(
    { length: 42 },
    (_, index) => {
      const date = new Date(calendarYear, calendarMonth, index - offset + 1)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return {
        day: date.getDate(),
        date: `${year}-${month}-${day}`,
        currentMonth: date.getMonth() === calendarMonth,
      }
    }
  )
  const nextCalendarTournament = [...seasonEvents]
    .filter(tournament => tournament.endDate >= gameDate)
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0]
  const nextSimTournament = [...seasonEvents]
    .filter(tournament => tournament.startDate > gameDate && !awardedPrizeTournamentIds.includes(tournament.id))
    .sort((a, b) => a.startDate.localeCompare(b.startDate))[0]
  const daysUntilNextTournament = nextCalendarTournament
    ? Math.max(0, Math.round((
        Date.parse(`${nextCalendarTournament.startDate}T12:00:00`) -
        Date.parse(`${gameDate}T12:00:00`)
      ) / 86400000))
    : null
  const changeMonth = (direction: number) => {
    const next = new Date(calendarYear, calendarMonth + direction, 1)
    setCalendarMonth(next.getMonth())
    setCalendarYear(next.getFullYear())
  }
  return (
    <main className="career-screen calendar-screen">
      <div className="calendar-container">
        <header className="calendar-header">
          <div>
            <span className="eyebrow">PDC CAREER MODE</span>
            <h1>CALENDAR</h1>
          </div>
          <div className="calendar-month-nav">
            <button type="button" onClick={() => changeMonth(-1)}>‹</button>
            <strong>
              {firstDay.toLocaleDateString('en-GB', {
                month: 'long',
                year: 'numeric',
              }).toUpperCase()}
            </strong>
            <button type="button" onClick={() => changeMonth(1)}>›</button>
          </div>
        </header>
        <div className="hub-divider" />
        <div className="calendar-layout">
          <section className="calendar-left">
            <div className="calendar-weekdays">
              {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="calendar-grid">
              {calendarDays.map(day => {
                const events = seasonEvents.filter(tournament =>
                  day.date >= tournament.startDate && day.date <= tournament.endDate
                )
                const premierNight = premierCalendarNights.find(night => night.date === day.date)
                const isReveal = premierRevealDates.includes(day.date)
                const category = isReveal ? 'reveal' : premierNight ? 'premier' : events[0]?.category === 'floor' ? 'floor' : events[0]?.category === 'eurotour' ? 'eurotour' : events.length ? 'major' : null
                return (
                  <div
                    key={day.date}
                    className={[
                      'calendar-day',
                      day.currentMonth ? '' : 'outside-month',
                      category ? `has-event calendar-category-${category}` : '',
                      day.date === gameDate ? 'game-today' : '',
                      day.date === selectedCalendarDate ? 'calendar-selected-target' : '',
                    ].join(' ')}
                    role="button"
                    tabIndex={0}
                    aria-label={`Select ${day.date} as simulation destination`}
                    onClick={() => setSelectedCalendarDate(day.date > gameDate ? day.date : null)}
                    onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedCalendarDate(day.date > gameDate ? day.date : null) } }}
                    title={[...events.map(event => event.name), ...(premierNight ? [`Premier League ${premierNight.finals ? 'Finals Night' : `Night ${premierNight.night}`} · ${premierNight.city}`] : [])].join(' / ')}
                  >
                    <span className="calendar-day-number">{day.day}</span>
                    <div className="calendar-day-events">
                      {isReveal && <span className="calendar-day-event-icon calendar-reveal-icon" title="Premier League lineup reveal"><img src={`${import.meta.env.BASE_URL}tournament-logo/premier-league.webp`} alt="Premier League" /><small>REVEAL</small></span>}
                      {premierNight && <span className="calendar-day-event-icon" title={`Premier League Night ${premierNight.night}`} aria-label={`Premier League Night ${premierNight.night}`}><img src={`${import.meta.env.BASE_URL}tournament-logo/premier-league.webp`} alt="Premier League" /></span>}
                      {events.map(event => (
                        <span key={event.id} className="calendar-day-event-icon" title={event.name} aria-label={event.name}>
                          {calendarLogo(event.name, event.category)
                            ? <img src={calendarLogo(event.name, event.category)!} alt={event.name} />
                            : <span className="calendar-day-fallback">{event.category === 'floor' ? 'PC' : event.category === 'eurotour' ? 'ET' : '🏆'}</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
          <aside className="calendar-next-overview" aria-label="Next tournament overview">
            <span className="calendar-next-eyebrow">UP NEXT</span>
            <div className="calendar-next-middle">
              <div className="calendar-next-trophy" aria-hidden="true">
                {nextCalendarTournament && calendarLogo(nextCalendarTournament.name, nextCalendarTournament.category)
                  ? <img src={calendarLogo(nextCalendarTournament.name, nextCalendarTournament.category)!} alt="" className="calendar-overview-logo" />
                  : '🏆'}
              </div>
              {nextCalendarTournament ? (
                <>
                  <h2>{nextCalendarTournament.name}</h2>
                  <span className="calendar-next-label">{nextCalendarTournament.startDate === nextCalendarTournament.endDate ? 'TOURNAMENT DATE' : 'TOURNAMENT DATES'}</span>
                  <p className="calendar-next-dates">
                    {nextCalendarTournament.startDate !== nextCalendarTournament.endDate && (
                      <>
                        {new Date(`${nextCalendarTournament.startDate}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).toUpperCase()}
                        {' — '}
                      </>
                    )}
                    {new Date(`${nextCalendarTournament.endDate}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
                  </p>
                </>
              ) : (
                <>
                  <h2>SEASON COMPLETE</h2>
                  <p className="calendar-next-dates">No upcoming tournaments</p>
                </>
              )}
            </div>
            {nextCalendarTournament && (
              <div className="calendar-next-countdown">
                <strong>{daysUntilNextTournament === 0 ? 'NOW' : daysUntilNextTournament}</strong>
                <span>{daysUntilNextTournament === 0 ? 'TOURNAMENT DAY' : 'DAYS TO GO'}</span>
              </div>
            )}
          </aside>
        </div>
        <footer className="hub-footer calendar-footer">
          <button
            type="button"
            className="hub-back"
            onClick={() => {
              setIsSimulating(false)
              setScreen('menu')
            }}
          >
            ← BACK TO CAREER HUB
          </button>
          <div className="calendar-footer-actions calendar-target-actions">
            <span className="calendar-date-indicator">IN-GAME DATE <strong>{gameDate}</strong></span>
            {!isSimulating && (
              <button
                type="button"
                className="calendar-simulate-button calendar-sim-next"
                disabled={!nextSimTournament || Boolean(activeTournamentId) || careerEnded}
                onClick={() => {
                  if (!nextSimTournament) return
                  // Use the normal day-by-day simulation: tournament intro then career hub.
                  // No date target or fast-forward mode, so the event is not auto-played.
                  setCalendarSimConfirmation(null)
                  setCalendarTargetDate(null)
                  setFastForwardWorldsId(null)
                  setIsSimulating(true)
                }}
              >SIMULATE <span aria-hidden="true">→</span></button>
            )}
            {selectedCalendarDate && selectedCalendarDate > gameDate && !isSimulating && (
              <button
                type="button"
                className="calendar-simulate-button calendar-sim-to-date"
                disabled={Boolean(activeTournamentId) || careerEnded}
                onClick={() => setCalendarSimConfirmation({ target: selectedCalendarDate, mode: 'selected' })}
              >SIM TO SELECTED DAY <span aria-hidden="true">→</span></button>
            )}
            {isSimulating && (
              <button type="button" className="calendar-simulate-button calendar-stop-button" onClick={() => {
                // Allow the current tournament day to be handled before stopping.
                setCalendarStopRequested(true)
              }}>STOP SIMULATION</button>
            )}
          </div>
        </footer>
      </div>
      {calendarSimConfirmation && (
        <div className="calendar-confirm-backdrop" onClick={() => setCalendarSimConfirmation(null)}>
          <section className="calendar-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="calendar-confirm-title" onClick={event => event.stopPropagation()}>
            <span className="calendar-confirm-eyebrow">CAREER CALENDAR</span>
            <h2 id="calendar-confirm-title">SIMULATE AHEAD?</h2>
            <p>Simulate to <strong>{calendarSimConfirmation.target}</strong>{calendarSimConfirmation.mode === 'next' && nextSimTournament ? ` · ${nextSimTournament.name}` : ''}?</p>
            <p className="calendar-confirm-note">Events along the way will be simulated automatically. Simulation pauses before the Premier League reveal.</p>
            <div className="calendar-confirm-actions">
              <button type="button" className="calendar-confirm-no" onClick={() => setCalendarSimConfirmation(null)}>NO, CANCEL</button>
              <button type="button" className="calendar-confirm-yes" onClick={() => {
                const target = calendarSimConfirmation.target
                setCalendarSimConfirmation(null)
                setCalendarStopRequested(false)
                setCalendarTargetDate(target)
                setFastForwardWorldsId('__calendar_target__')
                setIsSimulating(true)
              }}>YES, SIMULATE</button>
            </div>
          </section>
        </div>
      )}
      {premReveal && (
        <PremierLeagueReveal
          year={premReveal.year}
          players={premReveal.playerIds.map(id => players.find(player => player.id === id)!).filter(Boolean)}
          pool={players}
          onClose={() => setPremReveal(null)}
        />
      )}
      {premierNightIntro && (
        <div className="tournament-intro-overlay">
          <div className="tournament-intro-content">
            <span className="tournament-intro-date">{new Date(`${gameDate}T12:00:00`).toLocaleDateString('en-GB', {day:'numeric',month:'long',year:'numeric'}).toUpperCase()}</span>
            <div className="tournament-intro-logo"><img className="calendar-intro-event-logo" src={`${import.meta.env.BASE_URL}tournament-logo/premier-league.webp`} alt="Premier League" /></div>
            <h2>PREMIER LEAGUE</h2>
            <span className="tournament-intro-subtitle">NIGHT {premierNightIntro.night} · {premierNightIntro.city.toUpperCase()}</span>
          </div>
        </div>
      )}
      {showTournamentIntro && activeTournamentId && (
        <div className="tournament-intro-overlay">
          <div className="tournament-intro-content">
            <span className="tournament-intro-date">
              {new Date(`${gameDate}T12:00:00`).toLocaleDateString(
                'en-GB',
                {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }
              ).toUpperCase()}
            </span>
            <div className="tournament-intro-logo">
              {(() => {
                const name = tournamentById(activeTournamentId ?? '')?.name ?? ''
                const logo = calendarLogo(name, tournamentById(activeTournamentId ?? '')?.category)
                return logo ? <img className="calendar-intro-event-logo" src={logo} alt={name} /> : '🏆'
              })()}
            </div>
            <h2>
              {tournamentById(activeTournamentId ?? '')?.name}
            </h2>
            <span className="tournament-intro-subtitle">
              TOURNAMENT STARTING
            </span>
          </div>
        </div>
      )}
    </main>
  )
}
if (screen === 'premier-match' && premierPlaying && chosenPlayer) {
  const opponent = players.find(p=>p.id===(premierPlaying.a===selectedPlayer?premierPlaying.b:premierPlaying.a))
  if (opponent) return <div className=""><MatchScreen you={chosenPlayer} rival={opponent}
    rivalSkillTier={skillTierFromStartingRank(opponent.rank)} aiDifficulty={aiDifficulty}
    firstThrowId={Math.random()<.5?chosenPlayer.id:opponent.id}
    tournamentName={`Premier League · Night ${currentPremier?.night} · ${currentPremier?.city}`}
    format={{mode:'legs',firstTo:premierIsFinals?(premierPlaying.round===0?10:11):6}}
    roundLabel={premierIsFinals?(premierPlaying.round===0?'SEMI-FINAL':'FINAL'):(['QUARTER-FINAL','SEMI-FINAL','FINAL'][premierPlaying.round])}
    skipFinalMatchResult={premierIsFinals ? premierPlaying.round === 1 : premierPlaying.round === 2}
    onComplete={winner=>{
      recordPremierMatch(premierPlaying.a,premierPlaying.b,premierPlaying.round,premierPlaying.match,winner,
        Math.floor(Math.random()*(premierIsFinals?(premierPlaying.round===0?10:11):6)))
      recordHeadToHead(opponent.id,winner)
      setPremierPlaying(null);setScreen('premier-night')
    }} onBack={()=>{setPremierPlaying(null);setScreen('premier-night')}} /></div>
}
if (screen === 'premier-night' && currentPremier) {
  const labels = premierIsFinals ? ['SEMI-FINALS', 'FINAL'] : ['QUARTER-FINALS', 'SEMI-FINALS', 'FINAL']
  const latest = Math.min(premierRound, labels.length - 1)
  const shown = viewedPremierRound !== null && viewedPremierRound <= latest ? viewedPremierRound : latest
  const slots = premierNightState.rounds[shown] ?? []
  const eligible = premierLineup.includes(selectedPlayer ?? -1)
  return <main className="career-screen tournament-screen">
    <div className="tournament-container">
      <header className="tournament-header">
        <span className="eyebrow">PDC CAREER MODE</span>
        <h1>PREMIER LEAGUE</h1>
        <p>NIGHT {currentPremier.night} · {currentPremier.city.toUpperCase()} · {premierIsFinals ? 'FINALS NIGHT' : '8 PLAYERS · 7 MATCHES'}</p>
      </header>
      <div className="hub-divider" />
      <section className="tournament-bracket">
        <div className="bracket-title"><span>TOURNAMENT DRAW</span>
          <h2>{premierIsFinals ? 'FINALS NIGHT' : `NIGHT ${currentPremier.night} · ${currentPremier.city.toUpperCase()}`}</h2>
        </div>
        <div className="bracket-scroll">
          <div className="uk-open-draw pdc-large-draw">
            <div className="uk-open-round-tabs" aria-label="Premier League rounds">
              {labels.map((label,index)=><button type="button" key={label} disabled={index>latest || !premierNightState.rounds[index]?.length}
                className={shown===index?'uk-open-round-current':''} onClick={()=>setViewedPremierRound(index)}>{label}</button>)}
            </div>
            <div className="uk-open-static-heading">
              <p className="uk-open-note">{premierIsFinals ? 'TOP FOUR · PLAY-OFFS' : 'PREMIER LEAGUE · KNOCKOUT NIGHT'}</p>
              <h3>{labels[shown]} <small>{slots.length / 2} {slots.length / 2 === 1 ? 'MATCH' : 'MATCHES'}</small></h3>
            </div>
            <div className="pdc-draw-toolbar">
              <span className="pdc-draw-count">ALL MATCHES · {slots.length/2} FIXTURES</span>
              <button type="button" className={premierOnlyMine&&eligible?'pdc-draw-filter active':'pdc-draw-filter'}
                disabled={!eligible} onClick={()=>setPremierOnlyMine(v=>!v)} aria-pressed={premierOnlyMine&&eligible}>
                {premierOnlyMine?'✓ MY MATCH':'◎ FIND MY MATCH'}
              </button>
            </div>
            <div className="uk-open-match-scroll"><section className="uk-open-round"><div className="uk-open-matches">
              {Array.from({length:slots.length/2},(_,i)=>i)
                .filter(i=>!premierOnlyMine||!eligible||slots[i*2]===selectedPlayer||slots[i*2+1]===selectedPlayer)
                .map(i=>{
                  const a=slots[i*2],b=slots[i*2+1],score=premierNightState.scores[shown]?.[i]
                  const winner=score?(score[0]>score[1]?a:b):null
                  return <div className={`uk-open-match ${a===selectedPlayer||b===selectedPlayer?'uk-open-your-match':''}`} key={i}>
                    <span className="uk-open-match-number">MATCH {i+1}</span>
                    {[a,b].map((id,slot)=>{
                      const player=players.find(p=>p.id===id)
                      return <div className={`uk-open-player ${winner===id?'uk-open-winner':''}`} key={slot}>
                        {player&&<img src={`${import.meta.env.BASE_URL}players/${player.image}.png`} alt="" />}
                        <span>{player?.name??'TBD'}</span>
                        {id===selectedPlayer&&<b>YOU</b>}
                        {score&&<strong>{score[slot]}</strong>}
                      </div>
                    })}
                  </div>
                })}
              {premierOnlyMine&&eligible&&!slots.includes(selectedPlayer!)&&<p className="pdc-draw-empty">YOUR PLAYER IS NOT IN THIS ROUND. SELECT ALL MATCHES TO SEE THE FULL DRAW.</p>}
            </div></section></div>
          </div>
        </div>
      </section>
      <div className="tournament-play-area">
        {!premierDone && premierA!==undefined && premierB!==undefined &&
          (premierA===selectedPlayer || premierB===selectedPlayer
            ? <button type="button" className="tournament-play-button" onClick={()=>{setViewedPremierRound(null);setPremierPlaying({a:premierA,b:premierB,round:premierRound,match:premierNextMatch});setScreen('premier-match')}}><span className="action-button-icon" aria-hidden="true">▶</span><span className="action-button-label">PLAY NEXT MATCH</span></button>
            : <button type="button" className="tournament-play-button" onClick={()=>{
                const win=Math.random()<.5?premierA:premierB
                recordPremierMatch(premierA,premierB,premierRound,premierNextMatch,win,Math.floor(Math.random()*(premierIsFinals?(premierRound===0?10:11):6)))
                setViewedPremierRound(null)
              }}>▶ SIMULATE NEXT MATCH</button>)}

      </div>
      {premierDone && premierChampionPopupId === premierId && (() => {
        const champion = players.find(p => p.id === premierNightState.rounds[premierNightState.rounds.length - 1]?.[0])
        return champion ? <div className="tournament-champion-overlay"
          role="button" tabIndex={0} onClick={() => { setPremierChampionPopupId(null); setScreen('menu') }}
          onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { setPremierChampionPopupId(null); setScreen('menu') } }}>
          <div className="tournament-champion-content">
            <span className="eyebrow">{premierIsFinals ? 'PREMIER LEAGUE CHAMPION' : `NIGHT ${currentPremier.night} CHAMPION`}</span>
            <img src={`${import.meta.env.BASE_URL}players/${champion.image}.png`} alt="" />
            <h2>WINNER</h2>
            <h3>{champion.name}</h3>
            <p>PREMIER LEAGUE · {currentPremier.city.toUpperCase()}</p>
            <span className="tournament-continue">PRESS ANYWHERE TO CONTINUE</span>
          </div>
        </div> : null
      })()}
      <footer className="hub-footer">
        <button type="button" className="hub-back" onClick={()=>setScreen('menu')}>← BACK TO CAREER HUB</button>
        <span>IN-GAME DATE: {gameDate}</span>
      </footer>
    </div>
  </main>
}
if (screen === 'tournament' && slamInGroups && chosenPlayer) {
  const finished = slamGroups.every(slamGroupFinished)
  const unresolved = finished && slamGroups.some(g => slamStandings(g, slamShootouts).unresolved.length > 0)
  return <main className="career-screen slam-screen">
    <div className="slam-container">
      <header className="tournament-header"><span className="eyebrow">PDC CAREER MODE · {gameDate.slice(0,4)}</span>
        <h1>GRAND SLAM OF DARTS</h1><p>48 PLAYERS · 16 GROUPS · FIRST TO 5 LEGS</p>
      </header>
      <div className="slam-groups">
        {slamGroups.map(g => {
          const { standings, unresolved: tied } = slamStandings(g, slamShootouts)
          return <section className={`slam-group ${g.players.includes(selectedPlayer ?? -1) ? 'slam-group-yours' : ''}`} key={g.name}>
            <h3><span>GROUP {g.name}</span><small>{tied.length ? 'TIEBREAK REQUIRED' : '1ST PLACE ADVANCES'}</small></h3>
            <table><thead><tr><th>PLAYER</th><th>P</th><th>W</th><th>LF</th><th>LA</th><th>+/-</th><th>PTS</th></tr></thead>
              <tbody>{standings.map((row, i) => <tr key={row.id} className={(row.id === selectedPlayer ? 'slam-you ' : '') + (i === 0 ? 'slam-leading' : '')}>
                <td><span className="slam-standing-place">{i + 1}</span> <span className="slam-standing-name">{players.find(p => p.id === row.id)?.name}</span></td><td>{row.played}</td><td>{row.wins}</td><td>{row.legsFor}</td><td>{row.legsAgainst}</td><td>{row.difference > 0 ? '+' : ''}{row.difference}</td><td>{row.points}</td>
              </tr>)}</tbody></table>
            <div className="slam-fixtures"><div className="slam-fixtures-title">GROUP FIXTURES</div>{g.matches.map((m, i) => <div className={`slam-fixture ${m.aLegs !== null ? 'slam-fixture-finished' : ''}`} key={i}>
              <span>{players.find(p => p.id === m.a)?.name}</span><strong>{m.aLegs === null ? 'VS' : `${m.aLegs} – ${m.bLegs}`}</strong><span>{players.find(p => p.id === m.b)?.name}</span>
            </div>)}</div>
          </section>
        })}
      </div>
      <div className="slam-actions">
        <button type="button" className="slam-dev-toggle" onClick={() => setDevMode(v => !v)}>{devMode ? 'CLOSE DEV MODE' : 'DEV MODE'}</button>
        {devMode && <span className="slam-dev-hint">TEST ONLY · CHANGES ARE AUTOSAVED</span>}
        {slamUserQualified && slamUserNextMatch && <>
          <button onClick={() => {setSlamPlaying({gi:slamUserNextMatch.gi,mi:slamUserNextMatch.mi});setScreen('match')}}>PLAY NEXT GROUP MATCH</button>
          {devMode && <button onClick={() => { const m = slamUserNextMatch.m; slamRecord(slamUserNextMatch.gi, slamUserNextMatch.mi, m.a === selectedPlayer ? 5 : Math.floor(Math.random()*5), m.b === selectedPlayer ? 5 : Math.floor(Math.random()*5)) }}>WIN NEXT MATCH (TEST)</button>}
          {devMode && <button onClick={() => { const m = slamUserNextMatch.m; slamRecord(slamUserNextMatch.gi, slamUserNextMatch.mi, m.a === selectedPlayer ? Math.floor(Math.random()*5) : 5, m.b === selectedPlayer ? Math.floor(Math.random()*5) : 5) }}>LOSE NEXT MATCH (TEST)</button>}
        </>}
        {devMode && <button disabled={!slamNextMatch} onClick={() => { if (!slamNextMatch) return; const [a,b] = slamSimScore(slamNextMatch.m.a, slamNextMatch.m.b); slamRecord(slamNextMatch.gi, slamNextMatch.mi, a, b) }}>SIM NEXT MATCH</button>}
        {devMode && <button disabled={!slamNextMatch} onClick={slamSimAll}>SIM ALL GROUP MATCHES</button>}
        <button disabled={!finished || unresolved} onClick={slamAdvance}>CONTINUE TO LAST 16</button>
        <button disabled={slamGroups.length !== 16} onClick={slamSimToEnd}>{slamUserQualified ? 'SIM TO END (GROUPS + KNOCKOUT)' : '▶ SIMULATE TOURNAMENT'}</button>
      </div>
      {unresolved && <div className="slam-warning">Nine-dart shoot-out vereist:
        {slamGroups.filter(g => slamStandings(g, slamShootouts).unresolved.length).map(g => <div key={g.name}>
          Group {g.name} — <button onClick={() => {
            const tied = slamStandings(g, slamShootouts).unresolved.flat()
            setSlamShootouts(previous => [...previous.filter(x => x.group !== g.name), ...tied.map(id => ({group:g.name, playerId:id, nineDartScore:Math.floor(Math.random()*541)}))])
          }}>SIMULATE NINE-DART SHOOT-OUT</button>
        </div>)}
      </div>}
      <footer className="slam-footer">
        <button className="slam-back" onClick={() => setScreen('menu')}>← BACK TO CAREER HUB</button>
        <span>IN-GAME DATE: {gameDate}</span>
      </footer>
    </div>
  </main>
}
if (
  screen === 'match' &&
  chosenPlayer &&
  activeTournamentId &&
  coinTossWinnerId !== null
) {
  const matchOpponent = players.find(
    player => player.id === currentOpponentId
  )
  const matchTournament = seasonEvents.find(
    tournament => tournament.id === activeTournamentId
  )
  if (!matchOpponent) {
    return (
      <main className="career-screen">
        <p>Opponent not found.</p        >
        <button onClick={() => setScreen('tournament')}>
          BACK TO BRACKET
        </button>
      </main>
    )
  }
  return (
    <MatchScreen
      you={chosenPlayer}
      rival={matchOpponent}
      rivalSkillTier={skillTierFromStartingRank(matchOpponent.rank)} aiDifficulty={aiDifficulty}
      firstThrowId={coinTossWinnerId}
      tournamentName={matchTournament?.name ?? 'TOURNAMENT'}
      format={currentFormat ?? { mode: 'sets', firstTo: 3, legsPerSet: 2 }}
      roundLabel={roundLabels[currentRound] ?? 'MATCH'}
      skipFinalMatchResult={roundLabels[currentRound] === 'FINAL'}
      onComplete={completeRound}
      onBack={() => setScreen('match-preview')}
    />
  )
}
if (screen === 'match-preview' && chosenPlayer && activeTournamentId) {
  const opponent = players.find(
    player => player.id === currentOpponentId
  )
  const activeTournament = seasonEvents.find(
    tournament => tournament.id === activeTournamentId
  )
  if (!opponent || !youStillPlaying) {
    return (
      <main className="career-screen">
        <p>Match not found.</p>
        <button onClick={() => setScreen('tournament')}>
          BACK TO BRACKET
        </button>
      </main>
    )
  }
  return (
    <main className="career-screen match-preview-screen">
      <div className="match-preview-container">
        <header className="match-preview-header">
          <span className="eyebrow">PDC CAREER MODE</span>
          <h1>{activeTournament?.name}</h1>
          <p>{roundLabels[currentRound]} • MATCH PREVIEW</p>
        </header>
        <section className="match-preview-stage">
          <div className={`match-preview-competitor match-preview-left ${coinTossHighlight === chosenPlayer.id || (!coinTossSpinning && coinTossWinnerId === chosenPlayer.id) ? 'match-preview-toss-highlight' : ''}`}>
            <img
              src={`${import.meta.env.BASE_URL}players/${chosenPlayer.image}.png`}
              alt={chosenPlayer.name}
            />
            <div className="match-preview-player-info">
              <span>YOUR PLAYER</span>
              <h2>{chosenPlayer.name}</h2>
              <p>WORLD RANK #{getWorldRank(chosenPlayer.id)}</p>
            </div>
          </div>
          <div className="match-preview-center">
            <div className="match-preview-center-top">
              <span className="match-preview-center-subtitle">{roundLabels[currentRound]}</span>
            </div>
            <div className="match-preview-details">
              <div className="match-preview-detail-row">
                <span>WORLD RANKING</span>
                <div className="match-preview-rank-pair">
                  <strong>#{getWorldRank(chosenPlayer.id)}</strong>
                  <em>—</em>
                  <strong>#{getWorldRank(opponent.id)}</strong>
                </div>
              </div>
              <div className="match-preview-detail-row">
                <span>HEAD-TO-HEAD</span>
                <div className="match-preview-rank-pair">
                  <strong>{headToHead[String(opponent.id)]?.wins ?? 0}</strong><em>—</em><strong>{headToHead[String(opponent.id)]?.losses ?? 0}</strong>
                </div>
              </div>
              <div className="match-preview-detail-row match-preview-format">
                <span>MATCH FORMAT</span>
                <div className="match-preview-format-lines">
                  {currentFormat ? (
                    currentFormat.mode === 'sets' ? (
                      <>
                        <div><span>FIRST TO</span><strong>{currentFormat.firstTo} SETS</strong></div>
                        <div><span>FIRST TO</span><strong>{currentFormat.legsPerSet} LEGS</strong></div>
                        {currentFormat.doubleIn && <div><span>RULE</span><strong>DOUBLE IN / OUT</strong></div>}
                      </>
                    ) : (
                      <>
                        <div><span>FIRST TO</span><strong>{currentFormat.firstTo} LEGS</strong></div>
                        {currentFormat.winByTwo && <div><span>RULE</span><strong>WIN BY 2</strong></div>}
                      </>
                    )
                  ) : <strong>FORMAT TO BE CONFIRMED</strong>}
                </div>
              </div>
            </div>
          </div>
          <div className={`match-preview-competitor match-preview-right ${coinTossHighlight === opponent.id || (!coinTossSpinning && coinTossWinnerId === opponent.id) ? 'match-preview-toss-highlight' : ''}`}>
            <img
              src={`${import.meta.env.BASE_URL}players/${opponent.image}.png`}
              alt={opponent.name}
            />
            <div className="match-preview-player-info">
              <span>OPPONENT</span>
              <h2>{opponent.name}</h2>
              <p>WORLD RANK #{getWorldRank(opponent.id)}</p>
            </div>
          </div>
        </section>
        <section className="match-preview-actions">
          {coinTossWinnerId === null ? (
            <button
              type="button"
              className="match-preview-primary-button"
              disabled={coinTossSpinning}
              onClick={() => {
                if (coinTossSpinning) return
                setCoinTossSpinning(true)
                const winnerId = Math.random() < 0.5 ? chosenPlayer.id : opponent.id
                // Alternating gold borders slow down and settle on the winner.
                const delays = [100, 110, 125, 145, 170, 205, 250, 310, 380, 470]
                let elapsed = 0
                let current = opponent.id
                delays.forEach((delay, index) => {
                  elapsed += delay
                  const last = index === delays.length - 1
                  current = last ? winnerId : (current === chosenPlayer.id ? opponent.id : chosenPlayer.id)
                  const highlighted = current
                  window.setTimeout(() => {
                    setCoinTossHighlight(highlighted)
                    if (last) {
                      setCoinTossWinnerId(winnerId)
                      setCoinTossSpinning(false)
                    }
                  }, elapsed)
                })
              }}
            >
              <span className="action-button-label">{coinTossSpinning ? 'TOSSING…' : 'COIN TOSS'}</span>
            </button>
          ) : (
            <button
              type="button"
              className="match-preview-primary-button"
              onClick={() => setScreen('match')}
            >
              <span className="action-button-label">START MATCH</span><span className="action-button-icon" aria-hidden="true">→</span>
            </button>
          )}
        </section>
        <footer className="hub-footer">
          <button
            type="button"
            className="hub-back"
            onClick={() => {
              if (!coinTossSpinning) {
                setScreen('tournament')
              }
            }}
          >
            ← BACK TO BRACKET
          </button>
          <span>IN-GAME DATE: {gameDate}</span>
        </footer>
      </div>
    </main>
  )
}
if (screen === 'tournament' && chosenPlayer && activeTournamentId) {
  const activeTournament = seasonEvents.find(
    tournament => tournament.id === activeTournamentId
  )
  return (
    <main className="career-screen tournament-screen">
      <div className="tournament-container">
        <header className="tournament-header">
          <span className="eyebrow">PDC CAREER MODE</span>
          <h1>{activeTournament?.name ?? 'TOURNAMENT'}</h1>
          <p>{isEuroTourDraw ? 'LAST 48 • 48 PLAYERS • 16 SEEDED BYES' : is128Draw ? `LAST 128 • 128 PLAYERS • ${isOpen64Draw ? 'OPEN DRAW' : 'FIXED DRAW'}` : is64Draw ? `LAST 64 • 64 PLAYERS • ${isOpen64Draw ? 'OPEN DRAW' : 'FIXED DRAW'}` : is32Draw ? 'LAST 32 • 32 PLAYERS' : 'LAST 16 • 16 PLAYERS'}</p>
        </header>
        <div className="hub-divider" />
        <section className="tournament-bracket">
          <div className="bracket-title">
            <span>TOURNAMENT DRAW</span>
            <h2>{activeTournament?.name}</h2>
          </div>
          <div className="bracket-scroll">
            {isLargeDraw ? (
              <div className="uk-open-draw pdc-large-draw">
                {isFixedKnockout && (
                  <div className="pdc-fixed-path">
                    <div className="pdc-fixed-path-heading">
                      <span>FIXED BRACKET · YOUR ROUTE</span>
                      <small>Elke ronde blijft gekoppeld aan dezelfde kant van het schema</small>
                    </div>
                    <div className="pdc-fixed-path-track" style={{ '--pdc-route-columns': roundLabels.length - 1 } as React.CSSProperties}>
                      {roundLabels.map((label, ri) => {
                        const initialIndex = tournamentDraw.indexOf(selectedPlayer ?? -1)
                        if (initialIndex < 0) return null
                        // ET seeds enter at Last 32, not Last 48. Each seed
                        // occupies one of the 16 second-round match slots.
                        const entryRound = isEuroTourDraw && initialIndex >= 32 ? 1 : 0
                        if (ri === 0 || ri < entryRound) return null
                        const entryMatch = isEuroTourDraw
                          ? (entryRound === 1 ? initialIndex - 32 : Math.floor(initialIndex / 2))
                          : Math.floor(initialIndex / 2)
                        const firstOrder = fixedMatchOrder(isEuroTourDraw ? 16 : tournamentDraw.length / 2)
                        const bracketPosition = firstOrder.indexOf(entryMatch + 1)
                        if (bracketPosition < 0) return null
                        // The ET Last 48 feeds directly into Last 32. The
                        // standard mirrored bracket starts only after Last 32.
                        const knockoutStep = isEuroTourDraw ? ri - 1 : ri
                        const myMatch = knockoutStep === 0 ? entryMatch : Math.floor(bracketPosition / (2 ** knockoutStep))
                        const feederIndex = knockoutStep > 0 ? Math.floor(bracketPosition / (2 ** (knockoutStep - 1))) ^ 1 : -1
                        const feederWinner = feederIndex >= 0 ? roundWinners[ri - 1]?.[feederIndex] : null
                        const feederName = feederWinner == null ? null : players.find(p => p.id === feederWinner)?.name
                        const feederMatchNumber = knockoutStep === 1 ? firstOrder[feederIndex] : feederIndex + 1
                        const currentWinner = roundWinners[ri]?.[myMatch]
                        const eliminated = ri > entryRound &&
                          roundWinners[ri - 1]?.every(w => w !== null) &&
                          !roundWinners[ri - 1].includes(selectedPlayer)
                        const actualSlots = roundSlots[ri] ?? []
                        const actualOpponent = actualSlots[myMatch * 2] === selectedPlayer
                          ? actualSlots[myMatch * 2 + 1]
                          : actualSlots[myMatch * 2 + 1] === selectedPlayer
                            ? actualSlots[myMatch * 2] : null
                        const actualOpponentName = players.find(p => p.id === actualOpponent)?.name
                        const opponent = actualOpponentName ?? feederName ?? (knockoutStep === 0 ? 'WINNER FROM LAST 48' : `WINNER OF MATCH ${feederMatchNumber}`)
                        const opponentKnown = Boolean(actualOpponentName || feederName)
                        const routeRound = ri
                        const routeActive = currentRound >= 0 && routeRound === currentRound
                        const routePast = currentRound >= 0 && routeRound < currentRound
                        return <div className={`pdc-path-round ${routeActive ? 'pdc-path-active' : ''} ${routePast ? 'pdc-path-past' : ''} ${eliminated ? 'pdc-path-eliminated' : ''}`} key={`${ri}-${label}`}>
                          <span className="pdc-path-label">{label} <span>MATCH {myMatch + 1}</span></span>
                          <strong>IF YOU ADVANCE</strong>
                          <span className="pdc-path-vs">WILL FACE</span>
                          <strong className={opponentKnown ? 'pdc-path-known' : ''}>{opponent}</strong>
                          <small>{currentWinner === selectedPlayer ? 'ROUND WON' : currentWinner !== null && currentWinner !== undefined ? 'ROUND COMPLETED' : `From ${roundLabels[ri - 1]}`}</small>
                        </div>
                      })}
                    </div>
                  </div>
                )}
                <div className="uk-open-round-tabs" aria-label="Tournament rounds">
                  {roundLabels.map((label, index) => {
                    const latest = currentRound < 0 ? roundLabels.length - 1 : currentRound
                    const available = index <= latest && (roundSlots[index]?.length ?? 0) > 0
                    return (
                      <button type="button" key={label} disabled={!available}
                        className={(viewedUkRound ?? latest) === index ? 'uk-open-round-current' : ''}
                        onClick={() => setViewedUkRound(index)}>
                        {label}
                      </button>
                    )
                  })}
                </div>
                <div className="uk-open-static-heading">
                  <p className="uk-open-note">{isOpen64Draw ? 'OPEN DRAW · NEW RANDOM DRAW AFTER EVERY ROUND' : 'FIXED DRAW · WINNERS ADVANCE IN BRACKET ORDER'}</p>
                  <h3>{roundLabels[viewedUkRound ?? (currentRound < 0 ? roundLabels.length - 1 : currentRound)]} <small>{(roundSlots[viewedUkRound ?? (currentRound < 0 ? roundLabels.length - 1 : currentRound)]?.length ?? 0) / 2} {((roundSlots[viewedUkRound ?? (currentRound < 0 ? roundLabels.length - 1 : currentRound)]?.length ?? 0) / 2) === 1 ? 'MATCH' : 'MATCHES'}</small></h3>
                </div>
                <div className="pdc-draw-toolbar">
                  <span className="pdc-draw-count">ALL MATCHES · {Math.floor((roundSlots[viewedUkRound ?? (currentRound < 0 ? roundLabels.length - 1 : currentRound)]?.length ?? 0) / 2)} FIXTURES</span>
                  <button type="button" className={drawOnlyMine && qualifiedForEvent ? 'pdc-draw-filter active' : 'pdc-draw-filter'} onClick={() => setDrawOnlyMine(value => !value)} disabled={!qualifiedForEvent} aria-pressed={drawOnlyMine && qualifiedForEvent}>
                    {drawOnlyMine ? '✓ MY MATCH' : '◎ FIND MY MATCH'}
                  </button>
                </div>
                <div className="uk-open-match-scroll">
                {roundSlots.map((slots, roundIndex) => slots.length > 0 && roundIndex === (viewedUkRound ?? (currentRound < 0 ? roundLabels.length - 1 : currentRound)) && (
                  <section className="uk-open-round" key={roundIndex}>
                    <div className="uk-open-matches">
                      {Array.from({ length: slots.length / 2 }, (_, matchIndex) => matchIndex)
                        .filter(matchIndex => !drawOnlyMine || !qualifiedForEvent || slots[matchIndex * 2] === selectedPlayer || slots[matchIndex * 2 + 1] === selectedPlayer)
                        .map(matchIndex => {
                        const firstId = slots[matchIndex * 2]
                        const secondId = slots[matchIndex * 2 + 1]
                        const winnerId = roundWinners[roundIndex][matchIndex]
                        return (
                          <div className={`uk-open-match ${firstId === selectedPlayer || secondId === selectedPlayer ? 'uk-open-your-match' : ''}`} key={matchIndex}>
                            <span className="uk-open-match-number">MATCH {matchIndex + 1}</span>
                            {[firstId, secondId].map((id, slot) => {
                              const player = players.find(item => item.id === id)
                              return <div className={`uk-open-player ${winnerId === id ? 'uk-open-winner' : ''}`} key={slot}>
                                {player && <img src={`${import.meta.env.BASE_URL}players/${player.image}.png`} alt="" />}
                                <span>{player?.name ?? 'TBD'}</span>
                                {id === selectedPlayer && <b>YOU</b>}
                                {winnerId === id && <strong>✓</strong>}
                              </div>
                            })}
                          </div>
                        )
                      })}
                      {drawOnlyMine && qualifiedForEvent && !slots.includes(selectedPlayer) && <p className="pdc-draw-empty">YOUR PLAYER IS NOT IN THIS ROUND. SELECT ALL MATCHES TO SEE THE FULL DRAW.</p>}
                    </div>
                  </section>
                ))}
                </div>
              </div>
            ) : is32Draw ? (
              <div className="masters-bracket" aria-label="32-player fixed tournament bracket">
                <svg className="masters-bracket-lines" viewBox="0 0 1600 1100" preserveAspectRatio="none" aria-hidden="true">
                  {[0, 1, 2].flatMap(roundIndex => {
                    const step = 130 * 2 ** roundIndex
                    const nextStep = step * 2
                    const center = 70 + (step - 130) / 2
                    const nextCenter = 70 + (nextStep - 130) / 2
                    const pairsPerSide = 4 / 2 ** roundIndex
                    return [false, true].flatMap(right =>
                      Array.from({ length: pairsPerSide }, (_, index) => {
                        const upperY = center + 2 * index * step
                        const lowerY = upperY + step
                        const targetY = nextCenter + index * nextStep
                        const xCurrent = (right ? [1435, 1255, 1075] : [5, 185, 365])[roundIndex]
                        const xNext = (right ? [1255, 1075, 895] : [185, 365, 545])[roundIndex]
                        const fromX = right ? xCurrent : xCurrent + 160
                        const toX = right ? xNext + 160 : xNext
                        const joinX = (fromX + toX) / 2
                        return (
                          <g key={`${roundIndex}-${right}-${index}`}>
                            <path d={`M ${fromX} ${upperY} H ${joinX} V ${lowerY} H ${fromX}`} />
                            <path d={`M ${joinX} ${targetY} H ${toX}`} />
                          </g>
                        )
                      })
                    )
                  })}
                  <path d="M 705 525 H 720 M 895 525 H 880" />
                </svg>
                {roundSlots.slice(0, 4).flatMap((slots, roundIndex) => {
                  const matchCount = slots.length / 2
                  const perSide = matchCount / 2
                  const step = 130 * Math.pow(2, roundIndex)
                  const firstCenter = 70 + (step - 130) / 2
                  const xLeft = [5, 185, 365, 545][roundIndex]
                  const xRight = [1435, 1255, 1075, 895][roundIndex]
                  return Array.from({ length: matchCount }, (_, matchIndex) => {
                    const right = matchIndex >= perSide
                    const localIndex = right ? matchIndex - perSide : matchIndex
                    const y = firstCenter + localIndex * step
                    const firstId = slots[matchIndex * 2]
                    const secondId = slots[matchIndex * 2 + 1]
                    const winnerId = roundWinners[roundIndex][matchIndex]
                    return (
                      <div
                        key={`${roundIndex}-${matchIndex}`}
                        className={`masters-match masters-positioned ${firstId === selectedPlayer || secondId === selectedPlayer ? 'masters-your-match' : ''}`}
                        style={{ left: `${((right ? xRight : xLeft) / 1600) * 100}%`, top: y - 32 }}
                        title={`${roundLabels[roundIndex]} — match ${matchIndex + 1}`}
                      >
                        {[firstId, secondId].map((id, slot) => {
                          const player = players.find(item => item.id === id)
                          return (
                            <div key={slot} className={`masters-player ${player && winnerId === id ? 'masters-winner' : ''} ${id === selectedPlayer ? 'masters-you' : ''}`}>
                              {player ? <><span className="masters-face"><img src={`${import.meta.env.BASE_URL}players/${player.image}.png`} alt="" /></span><span className="masters-name">{player.name}</span>{winnerId === id ? ' ✓' : ''}</> : 'TBD'}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })
                })}
                {(() => {
                  const slots = roundSlots[4]
                  const winnerId = roundWinners[4][0]
                  return <div className="masters-match masters-positioned masters-final" style={{ left: "45%", top: 493 }}>
                    {slots.slice(0, 2).map((id, slot) => {
                      const player = players.find(item => item.id === id)
                      return <div key={slot} className={`masters-player ${player && winnerId === id ? 'masters-winner' : ''} ${id === selectedPlayer ? 'masters-you' : ''}`}>
                        {player ? <><span className="masters-face"><img src={`${import.meta.env.BASE_URL}players/${player.image}.png`} alt="" /></span><span className="masters-name">{player.name}</span>{winnerId === id ? ' ✓' : ''}</> : 'TBD'}
                      </div>
                    })}
                  </div>
                })()}
                <div className="masters-round-heading" style={{ left: "0.3125%" }}>LAST 32</div>
                <div className="masters-round-heading" style={{ left: "11.5625%" }}>LAST 16</div>
                <div className="masters-round-heading" style={{ left: "22.8125%" }}>QUARTER-FINAL</div>
                <div className="masters-round-heading" style={{ left: "34.0625%" }}>SEMI-FINAL</div>
                <div className="masters-round-heading" style={{ left: "45.0%" }}>FINAL 🏆</div>
                <div className="masters-round-heading" style={{ left: "55.9375%" }}>SEMI-FINAL</div>
                <div className="masters-round-heading" style={{ left: "67.1875%" }}>QUARTER-FINAL</div>
                <div className="masters-round-heading" style={{ left: "78.4375%" }}>LAST 16</div>
                <div className="masters-round-heading" style={{ left: "89.6875%" }}>LAST 32</div>
              </div>
            ) : (
            <div className="bracket-tree">
              {/* Exacte verbindingen: alle punten liggen op het midden van de matchboxes. */}
              <svg className="bracket-lines" viewBox="0 0 1600 640" aria-hidden="true">
                {/* Links: Last 16 naar kwartfinales */}
                <path d="M220 80 H255 V160 H290 M220 240 H255 V160" />
                <path d="M220 400 H255 V480 H290 M220 560 H255 V480" />
                {/* Links: kwartfinales naar halve finale */}
                <path d="M450 160 H485 V320 H520 M450 480 H485 V320" />
                {/* Links: halve finale naar finale */}
                <path d="M680 320 H725" />
                {/* Rechts: Last 16 naar kwartfinales */}
                <path d="M1380 80 H1345 V160 H1310 M1380 240 H1345 V160" />
                <path d="M1380 400 H1345 V480 H1310 M1380 560 H1345 V480" />
                {/* Rechts: kwartfinales naar halve finale */}
                <path d="M1150 160 H1115 V320 H1080 M1150 480 H1115 V320" />
                {/* Rechts: halve finale naar finale */}
                <path d="M920 320 H875" />
              </svg>
              {([8, 4, 2, 1] as const).flatMap((count, roundIndex) =>
                Array.from({ length: count }, (_, matchIndex) => {
                  const firstId = roundSlots[roundIndex][matchIndex * 2]
                  const secondId = roundSlots[roundIndex][matchIndex * 2 + 1]
                  const winnerId = roundWinners[roundIndex][matchIndex]
                  const first = players.find(player => player.id === firstId)
                  const second = players.find(player => player.id === secondId)
                  const isYourMatch = !winnerId &&
                    (firstId === chosenPlayer.id || secondId === chosenPlayer.id)
                  const roundClass = ['bracket-r16', 'bracket-qf', 'bracket-sf', 'bracket-final-game'][roundIndex]
                  return (
                    <div
                      key={`${roundIndex}-${matchIndex}`}
                      className={[
                        'bracket-game',
                        roundIndex > 0 ? 'bracket-empty' : '',
                        roundClass,
                        roundIndex < 3 ? `${roundClass}-${matchIndex + 1}` : '',
                        isYourMatch ? 'bracket-your-match' : ''
                      ].filter(Boolean).join(' ')}
                    >
                      {[first, second].map((player, slot) => (
                        <div
                          className={player ? 'bracket-player' : 'bracket-empty-player'}
                          key={slot}
                        >
                          {player ? (
                            <>
                              <div className="bracket-player-face">
                                <img src={`${import.meta.env.BASE_URL}players/${player.image}.png`} alt="" />
                              </div>
                              <span className="bracket-player-name" style={{
                                color: winnerId === player.id ? '#facc15' : undefined,
                                opacity: winnerId && winnerId !== player.id ? 0.5 : 1
                              }}>
                                {player.name}
                              </span>
                              {player.id === chosenPlayer.id && (
                                <span className="bracket-you">YOU</span>
                              )}
                              {winnerId === player.id && <span className="bracket-win-mark">✓</span>}
                            </>
                          ) : 'TBD'}
                        </div>
                      ))}
                    </div>
                  )
                })
              )}
              <div className="bracket-final-label">FINAL</div>
              <div className="bracket-final-trophy">🏆</div>
            </div>
            )}
          </div>
        </section>
        <div className="dev-tools">
          <button type="button" className="dev-toggle" onClick={() => setDevMode(value => !value)}>
            {devMode ? 'CLOSE DEV MODE' : 'DEV MODE'}
          </button>
          {devMode && <div className="dev-actions">
            <span>TEST ONLY · CHANGES ARE AUTOSAVED</span>
            <button type="button" disabled={!youStillPlaying} onClick={() => devFinishMatch(true)}>WIN MATCH</button>
            <button type="button" disabled={!youStillPlaying} onClick={() => devFinishMatch(false)}>LOSE MATCH</button>
            <button type="button" disabled={currentRound < 0} onClick={devSimulateRound}>SIMULATE ROUND</button>
            <button type="button" disabled={currentRound < 0} onClick={simulateToEnd}>SIM TO END</button>
          </div>}
        </div>
        <div className="tournament-play-area">
          {youStillPlaying && currentOpponentId !== null ? (
            <button
              type="button"
              className="tournament-play-button"
              onClick={() => {
                setCoinTossWinnerId(null)
                setCoinTossSpinning(false)
                setScreen('match-preview')
              }}
            >
              <span className="action-button-icon" aria-hidden="true">▶</span><span className="action-button-label">PLAY {roundLabels[currentRound]}</span>
            </button>
          ) : tournamentChampionId === null ? (
            <button
              type="button"
              className="tournament-play-button"
              onClick={isEuroTourDraw && qualifiedForEvent && currentRound === 0 ? devSimulateRound : simulateToEnd}
            >
              <span className="action-button-icon" aria-hidden="true">▶</span><span className="action-button-label">{isEuroTourDraw && qualifiedForEvent && currentRound === 0 ? 'SIMULATE LAST 48' : 'SIM TO END'}</span>
            </button>
          ) : (
            <button
              type="button"
              className="tournament-play-button"
              onClick={finishTournament}
            >
              <span className="action-button-icon" aria-hidden="true">▶</span><span className="action-button-label">CONTINUE</span>
            </button>
          )}
        </div>
        {showTournamentChampion && tournamentChampionId !== null && (
          <div
            className="tournament-champion-overlay"
            role="button"
            tabIndex={0}
            onClick={finishTournament}
            onKeyDown={event => {
              if (event.key === 'Enter' || event.key === ' ') {
                finishTournament()
              }
            }}
          >
            <div className="tournament-champion-content">
              <span className="eyebrow">TOURNAMENT CHAMPION</span>
              <img
                src={`${import.meta.env.BASE_URL}players/${players.find(player => player.id === tournamentChampionId)?.image}.png`}
                alt=""
              />
              <h2>WINNER</h2>
              <h3>{players.find(player => player.id === tournamentChampionId)?.name}</h3>
              <p>{activeTournament?.name}</p>
              <span className="tournament-continue">PRESS ANYWHERE TO CONTINUE</span>
            </div>
          </div>
        )}
        <footer className="hub-footer">
          <button
            type="button"
            className="hub-back"
            onClick={() => setScreen('menu')}
          >
            ← BACK TO CAREER HUB
          </button>
          <span>IN-GAME DATE: {gameDate}</span>
        </footer>
      </div>
    </main>
  )
}

if (screen === 'premier-table' && chosenPlayer) {
  return (
    <main className="career-screen rankings-screen premier-table-screen">
      <div className="rankings-container">
        <header className="hub-heading">
          <span className="eyebrow">PDC CAREER MODE</span>
          <h1>PREMIER LEAGUE TABLE</h1>
          <p>LEAGUE STANDINGS • {seasonYear} • TOP 4 REACH THE PLAY-OFFS</p>
        </header>
        <div className="hub-divider" />
        <p className="race-description">
          {completedPremierNights.length === 16 ? 'FINAL LEAGUE TABLE' : 'LIVE PROVISIONAL TABLE'}
          {' · '}{completedPremierNights.length} OF 16 NIGHTS COMPLETED
          {' · '}{premierRemainingNights} REMAINING
        </p>
        <div className="rankings-table premier-standings-table">
          <div className="rankings-row rankings-header">
            <span>RANK</span><span>PLAYER</span><span>PTS</span><span>NIGHTS WON</span><span>MATCHES WON</span><span>LEG +/-</span>
          </div>
          {premierStanding.map((entry, index) => {
            const player = players.find(p => p.id === entry.id)
            if (!player) return null
            const topFour = index < 4
            const guaranteed = premierGuaranteedTopFour(entry.id)
            const out = premierMathematicallyOut(entry.id)
            return <div key={entry.id} className={`rankings-row ${player.id === chosenPlayer.id ? 'rankings-your-player' : ''} ${index === 3 ? 'premier-playoff-cut' : ''} ${topFour ? 'premier-playoff-place' : ''}`}>
              <span className="rankings-position">{index + 1}</span>
              <div className="rankings-player">
                <PlayerFlag country={player.country} />
                <span>{player.name}</span>
                {player.id === chosenPlayer.id && <span className="rankings-you">YOU</span>}
                <span className={'race-status ' + (guaranteed ? 'race-locked' : out ? 'race-out' : topFour ? 'race-provisional' : 'race-out')}>
                  {guaranteed ? '✓ QUALIFIED' : out ? 'ELIMINATED' : topFour ? '● PROVISIONAL' : 'OUTSIDE TOP 4'}
                </span>
              </div>
              <span className="rankings-money">{entry.pts}</span>
              <span className="rankings-money">{entry.nightsWon}</span>
              <span className="rankings-money">{entry.wins}</span>
              <span className="rankings-money">{entry.diff > 0 ? '+' : ''}{entry.diff}</span>
            </div>
          })}
        </div>
        <p className="premier-table-footnote">TIEBREAK: POINTS → NIGHTS WON → MATCHES WON. LEG DIFFERENCE SHOWN FOR REFERENCE. Qualification is only guaranteed when mathematically certain.</p>
        <footer className="hub-footer">
          <button type="button" className="hub-back" onClick={() => setScreen('menu')}>← BACK TO CAREER HUB</button>
          <span>IN-GAME DATE: {gameDate}</span>
        </footer>
      </div>
    </main>
  )
}

if (screen === 'rankings' && chosenPlayer) {
  return (
    <main className="career-screen rankings-screen">
      <div className="rankings-container">
        <header className="hub-heading">
          <span className="eyebrow">PDC CAREER MODE</span>
          <h1>{rankingView === 'world' ? 'ORDER OF MERIT' : rankingView === 'protour' ? 'PRO TOUR ORDER OF MERIT' : rankingView === 'pc' ? 'PLAYERS CHAMPIONSHIP ORDER OF MERIT' : rankingView === 'et' ? 'EUROPEAN TOUR ORDER OF MERIT' : raceConfigs[rankingView as RaceKey].name}</h1>
          <p>{rankingView === 'world' ? 'WORLD RANKINGS' : rankingView === 'protour' ? 'FLOOR + EUROPEAN TOUR' : rankingView === 'pc' ? 'PLAYERS CHAMPIONSHIPS ONLY' : rankingView === 'et' ? 'EUROPEAN TOUR ONLY' : 'QUALIFICATION RACE'} • {gameDate.slice(0, 4)}</p>
        </header>

        <div className="hub-divider" />

        <div className="ranking-tabs">
          <button className={rankingView === 'world' ? 'active' : ''} onClick={() => setRankingView('world')}>ORDER OF MERIT</button>
          <button className={rankingView === 'protour' ? 'active' : ''} onClick={() => setRankingView('protour')}>PRO TOUR ORDER OF MERIT</button>
          <button className={rankingView === 'pc' ? 'active' : ''} onClick={() => setRankingView('pc')}>PC ORDER OF MERIT</button>
          <button className={rankingView === 'et' ? 'active' : ''} onClick={() => setRankingView('et')}>EURO TOUR ORDER OF MERIT</button>
          {(Object.keys(raceConfigs) as RaceKey[]).map(key => (
            <button key={key} className={rankingView === key ? 'active' : ''} onClick={() => setRankingView(key)}>{key === 'pcfinals' ? 'PC FINALS' : raceConfigs[key].name.replace(' RACE','')}</button>
          ))}
        </div>
        {rankingView in raceConfigs && (
          <p className="race-description">
            CUT-OFF: {raceConfigs[rankingView as RaceKey].cutoff} ·
            {gameDate >= raceConfigs[rankingView as RaceKey].cutoff ? ' FINAL FIELD' : ' LIVE QUALIFICATION FIELD'} ·
            {raceConfigs[rankingView as RaceKey].places} SPOTS
          </p>
        )}
        <div className="rankings-table">
          <div className="rankings-row rankings-header">
            <span>RANK</span>
            <span>PLAYER</span>
            <span>PRIZE MONEY</span>
          </div>

          {(rankingView === 'world' ? rankingTable : rankingView === 'protour' ? proTourTable : rankingView === 'pc' ? pcTable : rankingView === 'et' ? etTable : rankingView in raceConfigs ? raceTable(rankingView as RaceKey) : rankingTable).map((player, index) => (
            <Fragment key={player.id}>
            {(rankingView === 'matchplay' || rankingView === 'grandprix') && (index === 0 || index === 16 || index === 32) && (
              <div className="rankings-row rankings-header" style={{ gridTemplateColumns: '1fr', color: '#a9c6de', letterSpacing: '0.08em' }}>
                <span>{index === 0 ? 'WORLD ORDER OF MERIT · 16 SEEDED PLACES' : index === 16 ? 'PRO TOUR ORDER OF MERIT · 16 ADDITIONAL PLACES' : 'OUTSIDE THE CURRENT FIELD · PRO TOUR ORDER OF MERIT'}</span>
              </div>
            )}
            <div
              className={`rankings-row ${
                player.id === chosenPlayer.id
                  ? 'rankings-your-player'
                  : ''
              }`}
            >
              <span className="rankings-position">
                {index + 1}
              </span>

              <div className="rankings-player">
                <PlayerFlag country={player.country} />
                <span>{player.name}</span>

                {player.id === chosenPlayer.id && (
                  <span className="rankings-you">YOU</span>
                )}
                {rankingView in raceConfigs && (() => {
                  const raceKey = rankingView as RaceKey
                  const insideCut = raceField(raceKey).includes(player.id)
                  const cutoffPassed = gameDate >= raceConfigs[raceKey].cutoff
                  return (
                    <span className={'race-status ' + (insideCut
                      ? cutoffPassed ? 'race-locked' : 'race-provisional'
                      : 'race-out')}>
                      {insideCut ? cutoffPassed ? '✓ QUALIFIED' : '● PROVISIONAL' : 'OUTSIDE CUT'}
                    </span>
                  )
                })()}
              </div>

              <span className="rankings-money">
                {formatPrizeMoney((rankingView === 'matchplay' || rankingView === 'grandprix') ? dualRaceMoney(rankingView, index, player.id) : (rankingView === 'world' ? rankingMoney : rankingView === 'protour' ? proTourMoney : rankingView === 'pc' ? pcMoney : rankingView === 'et' ? etMoney : rankingView in raceConfigs ? raceMoney(rankingView as RaceKey) : rankingMoney)[player.id] ?? 0)}
              </span>
            </div>
            </Fragment>
          ))}
        </div>

        <footer className="hub-footer">
          <button
            type="button"
            className="hub-back"
            onClick={() => setScreen('menu')}
          >
            ← BACK TO CAREER HUB
          </button>

          <span>IN-GAME DATE: {gameDate}</span>
        </footer>
      </div>
    </main>
  )
}

if ((screen === 'player-stats' || screen === 'history') && chosenPlayer) {
  const completedEvents = awardedPrizeTournamentIds.map(id => {
    const event = tournamentById(id)
    const payouts = prizeMoneyEntries.filter(entry => entry.tournamentId === id)
    const highest = payouts.length ? Math.max(...payouts.map(entry => entry.amount)) : 0
    const championEntry = payouts.filter(entry => entry.amount === highest)
    return event ? { id, event, winner: highest > 0 && championEntry.length === 1 ? players.find(p => p.id === championEntry[0].playerId) : null } : null
  }).filter((entry): entry is NonNullable<typeof entry> => entry !== null)
  const myRecord = Object.values(headToHead).reduce((acc, record) => ({ wins: acc.wins + record.wins, losses: acc.losses + record.losses }), { wins: 0, losses: 0 })
  const played = myRecord.wins + myRecord.losses
  const trophyGroups = awardedTitleTournamentIds.reduce<Record<string, number>>((groups, id) => {
    const event = tournamentById(id)
    if (!event) return groups
    const key = event.category === 'floor' ? 'Players Championships' : event.name.toLowerCase().includes('premier league') ? 'Premier League' : event.name
    groups[key] = (groups[key] ?? 0) + 1
    return groups
  }, {})
  const yearOptions = [...new Set([...completedEvents.map(item => Number(item.id.slice(-4))), seasonYear, 2026])].sort((a,b) => a-b)
  const historyEvents = completedEvents.filter(item => Number(item.id.slice(-4)) === historyYear).sort((a,b) => a.event.startDate.localeCompare(b.event.startDate))
  // Milestones use existing saved career counters; no artificial progress is awarded.
  const milestoneWorldTitles = awardedTitleTournamentIds.filter(id => tournamentSeasonId(id) === 'world-championship').length
  const milestoneEuroTitles = awardedTitleTournamentIds.filter(id => tournamentById(id)?.category === 'eurotour').length
  const milestoneFloorTitles = awardedTitleTournamentIds.filter(id => tournamentById(id)?.category === 'floor').length
  const milestoneMajorTitles = awardedTitleTournamentIds.filter(id => tournamentById(id)?.category === 'major').length
  const milestonePremierTitles = awardedTitleTournamentIds.filter(id => tournamentSeasonId(id) === 'premier-league').length
  const recordTargets = [
    { label: 'First career title', current: careerTitles, target: 1 },
    { label: '5 career titles', current: careerTitles, target: 5 },
    { label: '10 career titles', current: careerTitles, target: 10 },
    { label: '25 career titles', current: careerTitles, target: 25 },
    { label: '50 career titles', current: careerTitles, target: 50 },
    { label: '100 career titles', current: careerTitles, target: 100 },
    { label: 'First recorded match win', current: myRecord.wins, target: 1 },
    { label: '25 recorded match wins', current: myRecord.wins, target: 25 },
    { label: '50 recorded match wins', current: myRecord.wins, target: 50 },
    { label: '100 recorded match wins', current: myRecord.wins, target: 100 },
    { label: '250 recorded match wins', current: myRecord.wins, target: 250 },
    { label: '500 recorded match wins', current: myRecord.wins, target: 500 },
    { label: 'First World Championship title', current: milestoneWorldTitles, target: 1 },
    { label: '3 World Championship titles', current: milestoneWorldTitles, target: 3 },
    { label: '5 World Championship titles', current: milestoneWorldTitles, target: 5 },
    { label: 'First European Tour title', current: milestoneEuroTitles, target: 1 },
    { label: '5 European Tour titles', current: milestoneEuroTitles, target: 5 },
    { label: '10 European Tour titles', current: milestoneEuroTitles, target: 10 },
    { label: 'First Players Championship title', current: milestoneFloorTitles, target: 1 },
    { label: '10 Players Championship titles', current: milestoneFloorTitles, target: 10 },
    { label: '20 Players Championship titles', current: milestoneFloorTitles, target: 20 },
    { label: 'First major title', current: milestoneMajorTitles, target: 1 },
    { label: '5 major titles', current: milestoneMajorTitles, target: 5 },
    { label: 'First Premier League title', current: milestonePremierTitles, target: 1 },
    { label: '3 Premier League titles', current: milestonePremierTitles, target: 3 },
  ]
  // Only count champions that can be identified from actual saved payouts.
  const recordedChampions = completedEvents.filter(item => item.winner !== null)
  const recordCategories = [
    { label: 'Most recorded tournament titles', matches: (_event: typeof completedEvents[number]['event']) => true, perSeason: false },
    { label: 'Most European Tour titles', matches: (event: typeof completedEvents[number]['event']) => event.category === 'eurotour', perSeason: false },
    { label: 'Most European Tour titles in one season', matches: (event: typeof completedEvents[number]['event']) => event.category === 'eurotour', perSeason: true },
    { label: 'Most Players Championship titles in one season', matches: (event: typeof completedEvents[number]['event']) => event.category === 'floor', perSeason: true },
    { label: 'Most recorded World Championship titles', matches: (event: typeof completedEvents[number]['event']) => tournamentSeasonId(event.id) === 'world-championship', perSeason: false },
  ]
  const inGameRecords = recordCategories.map(category => {
    const counts = new Map<string, { name: string; count: number; year?: string }>()
    for (const result of recordedChampions) {
      if (!result.winner || !category.matches(result.event)) continue
      const year = result.event.startDate.slice(0, 4)
      const key = `${result.winner.id}${category.perSeason ? `-${year}` : ''}`
      const previous = counts.get(key)
      counts.set(key, { name: result.winner.name, count: (previous?.count ?? 0) + 1, year: category.perSeason ? year : undefined })
    }
    // Your titles are authoritative in awardedTitleTournamentIds; prize payouts alone
    // cannot reliably identify your wins (e.g. equal or missing champion payouts).
    const ownWins = awardedTitleTournamentIds.map(id => tournamentById(id)).filter((event): event is NonNullable<typeof event> => Boolean(event && category.matches(event)))
    const ownCountBySeason = new Map<string, number>()
    for (const event of ownWins) {
      const year = event.startDate.slice(0, 4)
      ownCountBySeason.set(year, (ownCountBySeason.get(year) ?? 0) + 1)
    }
    // Replace payout-inferred values for your player with awarded titles, not add
    // them, to avoid counting the same tournament twice.
    for (const key of [...counts.keys()]) {
      if (key === String(chosenPlayer.id) || key.startsWith(`${chosenPlayer.id}-`)) counts.delete(key)
    }
    if (category.perSeason) {
      for (const [year, count] of ownCountBySeason) counts.set(`${chosenPlayer.id}-${year}`, { name: chosenPlayer.name, count, year })
    } else if (ownWins.length) {
      counts.set(String(chosenPlayer.id), { name: chosenPlayer.name, count: ownWins.length })
    }
    const leaders = [...counts.values()].sort((a,b) => b.count - a.count || a.name.localeCompare(b.name))
    const myCount = category.perSeason ? Math.max(0, ...ownCountBySeason.values()) : ownWins.length
    return { label: category.label, leader: leaders[0] ?? null, tied: leaders.filter(item => item.count === leaders[0]?.count), myCount }
  })
  // A tie is different from holding a record outright. Only use confirmed payout winners.
  const recordStatus = (record: typeof inGameRecords[number]) => {
    if (!record.leader || !record.myCount || record.myCount < record.leader.count) return null
    const myLeader = record.tied.some(item => item.name === chosenPlayer.name)
    if (!myLeader) return null
    return record.tied.length > 1 ? 'JOINT RECORD HOLDER' : 'RECORD HOLDER'
  }
  const majorRecordCounts = new Map<number, number>()
  for (const item of recordedChampions) {
    if (item.winner && item.event.category === 'major') majorRecordCounts.set(item.winner.id, (majorRecordCounts.get(item.winner.id) ?? 0) + 1)
  }
  // As above, use awarded titles as the source of truth for the chosen player.
  const ownMajorTitles = awardedTitleTournamentIds.filter(id => tournamentById(id)?.category === 'major').length
  majorRecordCounts.delete(chosenPlayer.id)
  if (ownMajorTitles) majorRecordCounts.set(chosenPlayer.id, ownMajorTitles)
  const majorRecordLeaders = [...majorRecordCounts.entries()].sort((a,b) => b[1]-a[1]).map(([id,count]) => ({name:players.find(p=>p.id===id)?.name ?? 'Unknown',count}))
  const majorRecord = {
    label: 'Most major titles',
    leader: majorRecordLeaders[0] ?? null,
    tied: majorRecordLeaders.filter(item => item.count === majorRecordLeaders[0]?.count),
    myCount: majorRecordCounts.get(chosenPlayer.id) ?? 0
  }
  const myChampionshipWins = awardedTitleTournamentIds.filter(id => tournamentSeasonId(id) === 'world-championship')
  const myTitlesFor = (id: string) => awardedTitleTournamentIds.filter(tournamentId => tournamentSeasonId(tournamentId) === id).length
  const worldWinningYears = new Set(myChampionshipWins.map(id => Number(tournamentById(id)?.startDate.slice(0,4) ?? id.slice(-4))))
  let currentWorldStreak = 0
  let longestWorldStreak = 0
  for (const year of [...worldWinningYears].sort((a,b) => a-b)) {
    currentWorldStreak = worldWinningYears.has(year-1) ? currentWorldStreak+1 : 1
    longestWorldStreak = Math.max(longestWorldStreak,currentWorldStreak)
  }
  // Benchmarks are the first total that BEATS the historical record, not the existing record itself.
  const realLifeRecords = [
    {label:'Most World Championship titles',holder:'Phil Taylor',record:16,target:17,current:myChampionshipWins.length},
    {label:'Most World Matchplay titles',holder:'Phil Taylor',record:16,target:17,current:myTitlesFor('world-matchplay')},
    {label:'Most World Grand Prix titles',holder:'Phil Taylor',record:11,target:12,current:myTitlesFor('world-grand-prix')},
    {label:'Most Premier League titles',holder:'Michael van Gerwen',record:7,target:8,current:myTitlesFor('premier-league')},
    {label:'Most Grand Slam titles',holder:'Phil Taylor',record:6,target:7,current:myTitlesFor('grand-slam')},
    {label:'Most consecutive World titles',holder:'Phil Taylor',record:8,target:9,current:longestWorldStreak},
  ]
  const upcomingMilestones = [...recordTargets].filter(item => item.current < item.target).sort((a,b) => (b.current / b.target) - (a.current / a.target)).slice(0,4)
  return <main className="career-screen archive-screen"><div className="archive-container">
    <header className="archive-heading"><span className="eyebrow">PDC CAREER MODE</span><h1>{screen === 'history' ? 'TOURNAMENT HISTORY' : 'PLAYER STATS'}</h1><p>{screen === 'history' ? 'Every completed season, all in one place.' : chosenPlayer.name + ' · Career performance and legacy'}</p></header>
    {screen === 'player-stats' ? <>
      <nav className="archive-tabs" aria-label="Player stats sections">{([['overview','OVERVIEW'],['trophies','TROPHY CABINET'],['hall','HALL OF FAME'],['legends','RECORDS']] as const).map(([key,label]) => <button key={key} className={statsTab === key ? 'active' : ''} onClick={() => setStatsTab(key)}>{label}</button>)}</nav>
      {statsTab === 'overview' && <div className="archive-overview">
        <div className="archive-stat-grid">
          {[['WIN RATE', played ? `${(myRecord.wins / played * 100).toFixed(1)}%` : '—'],['MATCH RECORD', `${myRecord.wins}W – ${myRecord.losses}L`],['TITLES', String(careerTitles)],['HIGHEST RANKING', `#${bestWorldRank}`]].map(([label,value]) => <div className="archive-stat" key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </div>
        <div className="archive-overview-lower">
          <section className="archive-panel archive-overview-summary">
            <div className="archive-section-heading"><h2>CAREER SNAPSHOT</h2><span>YOUR JOURNEY</span></div>
            <div className="archive-summary-row"><span>CAREER EARNINGS</span><strong>{formatPrizeMoney(careerEarnings)}</strong></div>
            <div className="archive-summary-row"><span>SEASONS PLAYED</span><strong>{Math.max(1, Number(gameDate.slice(0,4)) - 2025)}</strong></div>
            <div className="archive-summary-row"><span>RECORDED MATCHES</span><strong>{played}</strong></div>
            <div className="archive-summary-row"><span>TOURNAMENT TITLES</span><strong>{careerTitles}</strong></div>
          </section>
          <section className="archive-panel archive-overview-progress">
            <div className="archive-section-heading"><h2>NEXT MILESTONES</h2><span>HALL OF FAME</span></div>
            {upcomingMilestones.map(item => <div className="archive-progress-item" key={item.label}><div className="archive-progress-caption"><strong>{item.label}</strong><span>{item.current} / {item.target}</span></div><div className="archive-progress-track"><div style={{width: `${Math.min(100, item.current / item.target * 100)}%`}} /></div></div>)}
          </section>
        </div>
        <p className="archive-note">Match record uses saved head-to-head results. Older or automatically simulated matches without a saved result are not estimated.</p>
      </div>}
      {statsTab === 'trophies' && <section className="archive-panel archive-full-panel"><div className="archive-section-heading"><h2>YOUR TROPHY CABINET</h2><span>{awardedTitleTournamentIds.length} RECORDED TITLES</span></div><div className="archive-trophy-list">{Object.entries(trophyGroups).length ? Object.entries(trophyGroups).sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0])).map(([name,count]) => <div className="archive-list-row" key={name}><span>{name}</span><strong>{count}×</strong></div>) : <p className="archive-empty">Your first trophy will appear here.</p>}</div><p className="archive-note archive-note-bottom">Only titles awarded in your saved career are listed here.</p></section>}
      {statsTab === 'hall' && <section className="archive-panel archive-full-panel"><div className="archive-section-heading"><h2>CAREER MILESTONES</h2><span>YOUR PROGRESS</span></div><div className="archive-hall-list">{[...recordTargets.filter(item => item.current < item.target).sort((a,b) => b.current/b.target-a.current/a.target), ...recordTargets.filter(item => item.current >= item.target)].map(item => <div className={`archive-progress-item${item.current >= item.target ? ' archive-milestone-complete' : ''}`} key={item.label}><div className="archive-progress-caption"><strong>{item.label}</strong><span>{item.current} / {item.target}</span></div><div className="archive-progress-track"><div style={{width: `${Math.min(100, item.current / item.target * 100)}%`}} /></div>{item.current >= item.target && <span className="archive-milestone-done">✓ COMPLETED</span>}</div>)}</div><p className="archive-note archive-note-bottom">Milestones are based on your saved career titles and recorded match results. Completed milestones move to the bottom of this list.</p></section>}
      {statsTab === 'legends' && <section className="archive-panel archive-full-panel archive-records-panel">
        <div className="archive-section-heading"><h2>RECORD BOOK</h2><span>CAREER SAVE &amp; DARTS HISTORY</span></div>
        <nav className="archive-record-tabs" aria-label="Record book categories">
          <button type="button" className={recordBookTab === 'ingame' ? 'active' : ''} onClick={() => setRecordBookTab('ingame')}>IN-GAME</button>
          <button type="button" className={recordBookTab === 'reallife' ? 'active' : ''} onClick={() => setRecordBookTab('reallife')}>REAL-LIFE</button>
        </nav>
        {recordBookTab === 'ingame' ? <div className="archive-record-grid">
          {[...inGameRecords, majorRecord].map(record => <div className={`archive-record-card${recordStatus(record) ? ' archive-record-card-holder' : ''}`} key={record.label}>
            <div className="archive-record-card-head"><strong>{record.label}</strong><span>{record.leader ? `${record.leader.count}×` : '—'}</span></div>
            <small>{record.leader ? `${record.leader.name}${'year' in record.leader && record.leader.year ? ` · ${record.leader.year}` : ''}` : 'No recorded champion yet'}</small>
            <div className="archive-record-progress-label"><span>YOUR BEST</span><strong>{record.myCount} / {record.leader?.count ?? '—'}</strong></div>
            <div className="archive-progress-track"><div style={{width:`${record.leader?.count ? Math.min(100,record.myCount/record.leader.count*100) : 0}%`}} /></div>
            {recordStatus(record) && <span className="archive-record-achieved">★ {recordStatus(record)}</span>}
          </div>)}
        </div> : <div className="archive-record-grid">
          {realLifeRecords.map(record => <div className={`archive-record-card${record.current >= record.target ? ' archive-record-card-holder' : ''}`} key={record.label}>
            <div className="archive-record-card-head"><strong>{record.label}</strong><span>{record.target}×</span></div>
            <small>{record.holder} · {record.record} (historical record)</small>
            <div className="archive-record-progress-label"><span>YOUR PROGRESS</span><strong>{record.current} / {record.target}</strong></div>
            <div className="archive-progress-track"><div style={{width:`${Math.min(100,record.current/record.target*100)}%`}} /></div>
            {record.current >= record.target ? <span className="archive-record-achieved">★ NEW RECORD HOLDER</span> : record.current === record.record ? <span className="archive-record-equal">RECORD EQUALED</span> : null}
          </div>)}
        </div>}
        <p className="archive-note archive-note-bottom">In-game records use identifiable winners from saved payouts. Real-life targets show the total needed to break the historical record; older unrecorded results are not estimated.</p>
      </section>}
    </> : <>
      <nav className="archive-years" aria-label="Season selection">{yearOptions.map(year => <button key={year} className={historyYear === year ? 'active' : ''} onClick={() => setHistoryYear(year)}>{year}</button>)}</nav>
      <section className="archive-panel archive-history-panel"><div className="archive-section-heading"><h2>{historyYear} SEASON</h2><span>{historyEvents.length} COMPLETED EVENTS</span></div>
      <div className="archive-history-list">{historyEvents.length ? historyEvents.map(({id,event,winner}) => <div className="archive-history-row" key={id}><div className="archive-history-event">{calendarLogo(event.name,event.category) && <img src={calendarLogo(event.name,event.category)!} alt="" />}<div><strong>{event.name}</strong><small>{event.endDate}</small></div></div><div className="archive-history-winner"><span>WINNER</span><strong>{winner?.name ?? 'Not recorded'}</strong></div></div>) : <p className="archive-empty">No completed tournament results recorded for this season yet.</p>}</div>
      <p className="archive-note archive-note-bottom">Winners are derived from saved prize payouts when unambiguous. Finalists and final scores are not reconstructed from missing historical match data.</p></section>
    </>}
    <footer className="hub-footer archive-footer"><button className="hub-back" type="button" onClick={() => setScreen('menu')}>← BACK TO CAREER HUB</button><span>IN-GAME DATE: {gameDate}</span></footer>
  </div></main>
}
if (screen === 'inbox' && chosenPlayer) {
  const selectedMail = inbox.find(mail => mail.id === openedMailId) ?? null
  return <main className="career-screen calendar-screen inbox-screen">
    <div className="calendar-container">
      <header className="calendar-header"><div><span className="eyebrow">PDC CAREER MODE</span><h1>INBOX</h1></div><span className="inbox-header-count">{unreadMailCount ? `${unreadMailCount} UNREAD` : 'ALL CAUGHT UP'}</span></header>
      <div className="hub-divider" />
      <div className="inbox-panel">
        <aside className="inbox-list-pane">
          <div className="inbox-pane-title"><strong>MESSAGES</strong><span>{inbox.length}</span></div>
          <div className="inbox-message-list">
            {sortedInbox.length ? sortedInbox.map(mail => <button type="button" key={mail.id} className={`inbox-message ${mail.id === selectedMail?.id ? 'is-selected' : ''} ${mail.read ? 'is-read' : 'is-unread'}`} onClick={() => openMail(mail.id)}>
              <span className="inbox-message-heading"><strong>{mail.subject}</strong>{!mail.read && <i className="inbox-unread-dot" />}</span>
              <span className="inbox-message-preview">{mail.preview}</span><time>{mail.date}</time>
            </button>) : <p className="inbox-empty">No messages yet.</p>}
          </div>
        </aside>
        <section className="inbox-reading-pane">
          {selectedMail ? <>
            <div className="inbox-mail-top"><div className="inbox-mail-details">
              <div className="inbox-mail-detail"><span>DATE</span><strong>{selectedMail.date}</strong></div>
              <div className="inbox-mail-detail"><span>FROM</span><strong>PDC BOARD</strong></div>
              <div className="inbox-mail-detail"><span>TO</span><strong>{chosenPlayer.name}</strong></div>
              <div className="inbox-mail-detail"><span>SUBJECT</span><strong>{selectedMail.subject}</strong></div>
            </div><button type="button" className="inbox-delete" onClick={() => deleteMail(selectedMail.id)}>DELETE MESSAGE</button></div>
            <div className="inbox-mail-body">{selectedMail.body}</div>
          </> : <div className="inbox-reading-empty"><span>✉</span><h2>NO MESSAGE SELECTED</h2><p>Select a message from the archive to read it.</p></div>}
        </section>
      </div>
      <footer className="hub-footer calendar-footer"><button type="button" className="hub-back" onClick={() => setScreen('menu')}>← BACK TO CAREER HUB</button><span>IN-GAME DATE: {gameDate}</span></footer>
    </div>
  </main>
}
if (screen === 'menu' && chosenPlayer) {
  return (
    <main className="career-screen hub-screen">
      <div className="hub-container">
        <header className="hub-heading">
          <span className="eyebrow">PDC CAREER MODE</span>
          <h1>CAREER HUB</h1>
        </header>
        <div className="dev-chooser-entry">
          <button type="button" className="dev-chooser-open" aria-label="Open Developer Mode" title="Developer Mode" onClick={() => setDevChooserOpen(true)}>
            <span aria-hidden="true">⌘</span>
          </button>
        </div>
        {devChooserOpen && (
          <div className="dev-chooser-backdrop" onClick={() => setDevChooserOpen(false)}>
            <section className="dev-chooser-panel" role="dialog" aria-modal="true" aria-label="Developer screen chooser" onClick={event => event.stopPropagation()}>
              <header className="dev-chooser-heading">
                <div><span className="eyebrow">PDC CAREER MODE</span><h2>SCREEN CHOOSER</h2></div>
                <button type="button" className="dev-chooser-close" onClick={() => setDevChooserOpen(false)}>✕</button>
              </header>
              <p className="dev-chooser-help">Open any existing screen. Tournament previews are temporary and do not overwrite your career. Press ESC to exit a preview.</p>
              <div className="dev-chooser-grid">
                {([
                  ['select', 'SELECT YOUR PLAYER', 'Player selection'],
                  ['menu', 'CAREER HUB', 'Main dashboard'],
                  ['calendar', 'CALENDAR', 'Schedule & next event'],
                  ['rankings', 'ORDER OF MERIT', 'World rankings'],
                ] as const).map(([target, title, description]) => (
                  <button key={target} type="button" className="dev-chooser-tile" onClick={() => { if (devPreview) stopDevPreview(); setDevChooserOpen(false); setScreen(target) }}>
                    <strong>{title}</strong><span>{description}</span>
                  </button>
                ))}
              </div>
              <h3 className="dev-chooser-subtitle">ALL 8 MAJORS · TOURNAMENT SCREENS</h3>
              <div className="dev-chooser-events">
                {tournamentsForSeason(seasonYear).filter(event => event.category === 'major').map(event => (
                  <div className="dev-chooser-event" key={event.id}>
                    <strong>{event.name}</strong>
                    <div className="dev-chooser-actions">
                      <button type="button" onClick={() => openDevPreview(event.id,'tournament')}>BRACKET</button>
                      {tournamentSeasonId(event.id) === 'grand-slam' && <button type="button" onClick={() => openDevPreview(event.id,'groups')}>GROUPS</button>}
                      <button type="button" onClick={() => openDevPreview(event.id,'match-preview')}>PREVIEW</button>
                      <button type="button" onClick={() => openDevPreview(event.id,'match')}>LIVE MATCH</button>
                      <button type="button" onClick={() => openDevPreview(event.id,'champion')}>CHAMPION</button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="dev-chooser-note">ESC exits a tournament preview and restores the original tournament state. Live matches are playable; their results are for testing only.</p>
            </section>
          </div>
        )}
        <section className="hub-hero" aria-label="Career overview">
          <div className="hub-portrait-panel">
            <img className="hub-player-photo" src={`${import.meta.env.BASE_URL}players/${chosenPlayer.image}.png`} alt={chosenPlayer.name} />
          </div>
          <div className="hub-flag-marker"><PlayerFlag country={chosenPlayer.country} /></div>
          <div className="hub-identity">
            <span className="hub-small-label">YOUR PLAYER</span>
            <h2>{chosenPlayer.name}</h2>

            <div className="hub-ranking-pill"><span>WORLD RANKING</span><strong>#{getWorldRank(chosenPlayer.id)}</strong></div>
          </div>
          <div className="hub-season-info">
            <div className="hub-season-stat"><span>SEASON</span><strong>{gameDate.slice(0, 4)}</strong></div>
            <div className="hub-season-stat"><span>TITLES</span><strong>{careerTitles}</strong></div>
            <div className="hub-season-stat"><span>CAREER EARNINGS</span><strong>{formatPrizeMoney(careerEarnings)}</strong></div>
            <div className="hub-season-stat"><span>RANKING MONEY</span><strong>{formatPrizeMoney(rankingMoney[chosenPlayer.id] ?? 0)}</strong></div>
          </div>
        </section>
        <div className="hub-divider" />
        <section className="hub-tiles">
        {(unqualifiedActiveEvent || unqualifiedPremierNight) ? (
          <div className="hub-tile hub-calendar hub-tournament-ready hub-not-qualified" aria-label="Tournament qualification status">
            <span className="hub-tile-icon"><HubIcon name="trophy" /></span>
            <div className="hub-not-qualified-content">
              <h3>NOT QUALIFIED</h3>
              <p>{unqualifiedPremierNight ? 'You were not selected for the Premier League.' : `${seasonEvents.find(event => event.id === activeTournamentId)?.name ?? 'This tournament'} · You did not qualify.`}</p>
              <button type="button" className="hub-continue-sim" onClick={continueUnqualifiedEvent}>
                <span>CONTINUE SIM</span><span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        ) : (
        <button
          type="button"
          className={`hub-tile hub-calendar ${
            (activeTournamentId || premierNightPending) ? 'hub-tournament-ready' : ''
          }`}
          onClick={() => {
            if (premierNightPending) { setScreen('premier-night'); return }
            if (activeTournamentId) {
              setScreen('tournament')
              return
            }
            setScreen('calendar')
          }}
        >
          <span className="hub-tile-icon">
            {(activeTournamentId || premierNightPending) ? <HubIcon name="trophy" /> : <HubIcon name="calendar" />}
          </span>
          <div>
            <h3>
              {premierNightPending ? 'PLAY PREMIER LEAGUE' : activeTournamentId ? 'START TOURNAMENT' : 'CALENDAR'}
            </h3>
            <p>
              {premierNightPending ? `NIGHT ${currentPremier?.night ?? "—"} · ${currentPremier?.city ?? ""}` : activeTournamentId
                ? seasonEvents.find(
                    tournament => tournament.id === activeTournamentId
                  )?.name
                : 'Upcoming tournaments'}
            </p>
          </div>
        </button>
        )}
          <button type="button" className="hub-tile hub-inbox" onClick={() => { setOpenedMailId(sortedInbox[0]?.id ?? null); if (sortedInbox[0]) openMail(sortedInbox[0].id); setScreen('inbox') }}>
            {unreadMailCount > 0 && <span className="hub-inbox-badge">{unreadMailCount > 9 ? '9+' : unreadMailCount}</span>}
            <span className="hub-tile-icon"><HubIcon name="inbox" /></span>
            <div>
              <h3>INBOX</h3>
              <p>Messages and invitations</p>
            </div>
          </button>
          <button
            type="button"
            className="hub-tile hub-rankings"
            onClick={() => setScreen(premierNightPending ? 'premier-table' : 'rankings')}
          >
            <span className="hub-tile-icon"><HubIcon name="rankings" /></span>
            <div>
              <h3>{premierNightPending ? 'PREMIER LEAGUE TABLE' : 'RANKINGS'}</h3>
              <p>{premierNightPending ? 'League standings · Top 4 playoffs' : 'PDC Order of Merit'}</p>
            </div>
          </button>
          <button type="button" className="hub-tile hub-stats" onClick={() => setScreen('player-stats')}>
            <span className="hub-tile-icon"><HubIcon name="stats" /></span>
            <div>
              <h3>PLAYER STATS</h3>
              <p>Career performance</p>
            </div>
          </button>
          <button type="button" className="hub-tile hub-settings" onClick={() => { setHistoryYear(seasonYear); setScreen('history') }}>
            <span className="hub-tile-icon"><HubIcon name="calendar" /></span>
            <div>
              <h3>HISTORY</h3>
              <p>Seasons &amp; tournament winners</p>
            </div>
          </button>
          <button type="button" className="hub-tile hub-delete" onClick={() => deleteCareer()}>
            <span className="hub-tile-icon"><HubIcon name="delete" /></span>
            <div>
              <h3>DELETE CAREER</h3>
              <p>Erase progress &amp; choose a new player</p>
            </div>
          </button>
        </section>

      </div>
      {deleteCareerConfirmation && (
        <div className="calendar-confirm-backdrop" onClick={() => setDeleteCareerConfirmation(false)}>
          <section className="calendar-confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-career-title" aria-describedby="delete-career-description" onClick={event => event.stopPropagation()}>
            <span className="calendar-confirm-eyebrow">PDC CAREER MODE</span>
            <h2 id="delete-career-title">DELETE CAREER?</h2>
            <p id="delete-career-description">Are you sure you want to delete your entire career?</p>
            <p className="calendar-confirm-note">All progress, tournament results, rankings, records and inbox messages will be permanently deleted. This cannot be undone.</p>
            <div className="calendar-confirm-actions">
              <button type="button" className="calendar-confirm-no" onClick={() => setDeleteCareerConfirmation(false)}>NO, CANCEL</button>
              <button type="button" className="calendar-confirm-yes delete-career-confirm-yes" onClick={() => deleteCareer(true)}>YES, DELETE</button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
  return (
    <main className="career-screen picker-screen">
      <div className="picker-container">
      <header className="page-header" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'nowrap' }}>
        <div>
          <span className="eyebrow">PDC CAREER MODE</span>
          <h1>SELECT YOUR PLAYER</h1>
          <p>Choose a professional darts player and take control of their career.</p>
        </div>
        <div className="picker-header-actions">
          <button type="button" className={`own-player-trigger ${customPlayerSlot !== null ? 'is-active' : ''}`} onClick={() => setShowReplacePicker(true)} aria-label="Use your own player">
            <span className="own-player-icon" aria-hidden="true">✦</span>
            <span>USE OWN PLAYER<small>CREATE YOUR CAREER</small></span>
          </button>
        <div style={{ width: 230, maxWidth: '100%', flexShrink: 0, textAlign: 'right' }}>
          <label htmlFor="ai-difficulty" style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: 1.5, opacity: .7, marginBottom: 8 }}>AI DIFFICULTY <span style={{ color: '#e8b44a', opacity: 1 }}>{aiDifficulty} / 4</span></label>
          <input id="ai-difficulty" type="range" min="1" max="4" step="1" value={aiDifficulty} onChange={event => setAiDifficulty(Number(event.target.value))} style={{ display: 'block', width: '100%', margin: 0, accentColor: '#e8b44a', cursor: 'pointer' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5, fontSize: 10, letterSpacing: .6, opacity: .55 }}><span>EASY</span><span>HARD</span></div>
        </div>
        </div>
      </header>
      {showReplacePicker && (
        <div className="own-player-backdrop" onClick={() => setShowReplacePicker(false)}>
          <section className="own-player-dialog" role="dialog" aria-modal="true" aria-labelledby="own-player-title" onClick={event => event.stopPropagation()}>
            <div className="own-player-dialog-topline" />
            <div className="own-player-dialog-heading">
              <div>
                <span className="own-player-kicker">PDC CAREER MODE <span> / </span> CUSTOM PLAYER</span>
                <h2 id="own-player-title">REPLACE A PLAYER</h2>
                <p>Choose whose Tour Card "Jelle De Boeck" will take. That player will be removed from this career.</p>
              </div>
              <button type="button" className="own-player-close" aria-label="Close" onClick={() => setShowReplacePicker(false)}>×</button>
            </div>
            <div className="own-player-dialog-toolbar">
              <label className="own-player-search">
                <span aria-hidden="true">⌕</span>
                <input type="search" placeholder="Search player or country..." aria-label="Search players" value={replaceSearch} onChange={event => setReplaceSearch(event.target.value)} />
              </label>
              <span className="own-player-count">{originalPlayers.filter(player => `${player.name} ${player.country} ${player.rank}`.toLowerCase().includes(replaceSearch.trim().toLowerCase())).length} PLAYERS</span>
            </div>
            <div className="own-player-replacement-list">
              {originalPlayers.filter(player => `${player.name} ${player.country} ${player.rank}`.toLowerCase().includes(replaceSearch.trim().toLowerCase())).map(player => (
                <button type="button" key={player.id} className="own-player-replacement" onClick={() => {
                  setCareerRoster(player.id)
                  setCustomPlayerSlot(player.id)
                  setSelectedPlayer(player.id)
                  setShowReplacePicker(false)
                  setReplaceSearch('')
                }}>
                  <span className="own-player-replacement-rank">{String(player.rank).padStart(3, '0')}</span>
                  <img src={`${import.meta.env.BASE_URL}players/${player.image}.png`} alt="" loading="lazy" />
                  <span className="own-player-replacement-info"><strong>{player.name}</strong><small>{player.country}</small></span>
                  <span className="own-player-replacement-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
              {originalPlayers.filter(player => `${player.name} ${player.country} ${player.rank}`.toLowerCase().includes(replaceSearch.trim().toLowerCase())).length === 0 && <div className="own-player-empty">No players found. Try another name.</div>}
            </div>
            <div className="own-player-dialog-footer">
              <span><span className="own-player-footer-dot" /> 128 TOUR CARDS · 1 REPLACEMENT</span>
              <button type="button" className="own-player-cancel" onClick={() => setShowReplacePicker(false)}>CANCEL</button>
            </div>
          </section>
        </div>
      )}
      <div className="picker-roster" role="region" aria-label="Player roster" tabIndex={0}>
      <section className="player-grid">
        {players.map(player => (
          <button
            type="button"
            key={player.id}
            className={`player-card ${selectedPlayer === player.id ? 'selected' : ''}`}
            onClick={() => { if (customPlayerSlot !== null && player.id !== customPlayerSlot) { setCareerRoster(null); setCustomPlayerSlot(null) } setSelectedPlayer(player.id) }}
            aria-pressed={selectedPlayer === player.id}
          >
            <div className="player-image">
              <img
                className="player-photo"
                src={`${import.meta.env.BASE_URL}players/${player.image}.png`}
                alt={player.name}
                onError={(event) => {
                  event.currentTarget.style.visibility = 'hidden'
                }}
              />
              <span className="rank">#{player.rank}</span>
            </div>
            <div className="player-details">
              <strong>{player.name}</strong>
              <span className="player-country">
                <PlayerFlag country={player.country} />
                {player.country}
              </span>
            </div>
            {selectedPlayer === player.id && (
              <span className="selected-label">✓ SELECTED</span>
            )}
          </button>
        ))}
      </section>
      </div>
      <footer className="career-footer">
        <div className="selection-info">
          {chosenPlayer
            ? `Selected player: ${chosenPlayer.name}`
            : 'Select a player to continue'}
        </div>
        <button
          type="button"
          className="start-button"
          disabled={!chosenPlayer}
          onClick={() => {
            if (chosenPlayer) {
              // A new career always starts with a fresh welcome message.
              // This selection screen is also used after deleting an older save.
              dismissedMailIdsRef.current.clear()
      setDismissedMailIds([])
      setInbox([createWelcomeMail(chosenPlayer, gameDate)])
              setOpenedMailId(null)
              setScreen('menu')
            }
          }}
        >
          <span className="action-button-label">START CAREER</span><span className="action-button-icon" aria-hidden="true">→</span>
        </button>
      </footer>
      </div>
    </main>
  )
}
export default App
