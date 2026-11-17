import { useEffect, useRef, useState } from 'react'
import './MatchScreen.css'
import './MatchTheme.css'
import { describeFormat, type MatchFormat } from './data/tournaments'
import { type SkillTier } from './aiSkill'

type PlayerInfo = {
  id: number
  name: string
  image: string
}

type Side = 'you' | 'bot'

type Score = {
  remaining: number
  sets: number
  legs: number
  totalLegs: number
  opened: boolean
  darts: number
  matchDarts: number
  matchScored: number
  last: number | null
}

type Game = {
  you: Score
  bot: Score
  turn: Side
  starter: Side
  finished: boolean
  winner: Side | null
  message: string
}

type BotVisit = {
  points: number
  darts: number
  checkout: boolean
  opened: boolean
}

type TurnRecord = {
  before: Game
  after: Game
  botResponse?: BotVisit
}

const fresh = (): Score => ({
  remaining: 501, sets: 0, legs: 0, totalLegs: 0, opened: false, darts: 0,
  matchDarts: 0, matchScored: 0, last: null
})

const other = (side: Side): Side => side === 'you' ? 'bot' : 'you'

const average = (score: Score) =>
  score.matchDarts ? (score.matchScored * 3 / score.matchDarts).toFixed(1) : '0.0'

function canCheckout(remaining: number): boolean {
  return remaining >= 2 && remaining <= 170 &&
    ![169, 168, 166, 165, 163, 162, 159].includes(remaining)
}
// Common checkout paths: treble (T), double (D), single (S), bull (B).
// Routes are attempted dart-by-dart so missed trebles and doubles leave
// plausible remaining scores rather than random numbers.
const checkoutRoutes: Record<number, string[]> = {
  170: ['T20', 'T20', 'B'],
  167: ['T20', 'T19', 'B'],
  164: ['T20', 'T18', 'B'],
  161: ['T20', 'T17', 'B'],
  160: ['T20', 'T20', 'D20'],
  158: ['T20', 'T20', 'D19'],
  157: ['T20', 'T19', 'D20'],
  156: ['T20', 'T20', 'D18'],
  155: ['T20', 'T19', 'D19'],
  154: ['T20', 'T18', 'D20'],
  153: ['T20', 'T19', 'D18'],
  152: ['T20', 'T20', 'D16'],
  151: ['T20', 'T17', 'D20'],
  150: ['T20', 'T18', 'D18'],
  149: ['T20', 'T19', 'D16'],
  148: ['T20', 'T16', 'D20'],
  147: ['T20', 'T17', 'D18'],
  146: ['T20', 'T18', 'D16'],
  145: ['T20', 'T15', 'D20'],
  144: ['T20', 'T20', 'D12'],
  143: ['T20', 'T17', 'D16'],
  142: ['T20', 'T14', 'D20'],
  141: ['T20', 'T19', 'D12'],
  140: ['T20', 'T20', 'D10'],
  139: ['T20', 'T13', 'D20'],
  138: ['T20', 'T18', 'D12'],
  137: ['T20', 'T19', 'D10'],
  136: ['T20', 'T20', 'D8'],
  135: ['T20', 'T17', 'D12'],
  134: ['T20', 'T14', 'D16'],
  133: ['T20', 'T19', 'D8'],
  132: ['T20', 'T16', 'D12'],
  131: ['T20', 'T13', 'D16'],
  130: ['T20', 'T20', 'D5'],
  129: ['T19', 'T16', 'D12'],
  128: ['T18', 'T14', 'D16'],
  127: ['T20', 'T17', 'D8'],
  126: ['T19', 'T19', 'D6'],
  125: ['T20', 'T15', 'D10'],
  124: ['T20', 'T16', 'D8'],
  123: ['T19', 'T16', 'D9'],
  122: ['T18', 'T20', 'D4'],
  121: ['T20', 'T11', 'D14'],
  120: ['T20', 'S20', 'D20'],
  119: ['T19', 'T12', 'D13'],
  118: ['T20', 'S18', 'D20'],
  117: ['T20', 'S17', 'D20'],
  116: ['T20', 'S16', 'D20'],
  115: ['T20', 'S15', 'D20'],
  114: ['T20', 'S14', 'D20'],
  113: ['T20', 'S13', 'D20'],
  112: ['T20', 'S12', 'D20'],
  111: ['T20', 'S11', 'D20'],
  110: ['T20', 'B'],
  109: ['T19', 'S12', 'D20'],
  108: ['T20', 'S8', 'D20'],
  107: ['T19', 'S10', 'D20'],
  106: ['T20', 'S6', 'D20'],
  105: ['T20', 'S5', 'D20'],
  104: ['T18', 'S10', 'D20'],
  103: ['T19', 'S6', 'D20'],
  102: ['T20', 'S10', 'D16'],
  101: ['T17', 'S10', 'D20'],
  100: ['T20', 'D20'],
  99: ['T19', 'S10', 'D16'],
  98: ['T20', 'D19'],
  97: ['T19', 'D20'],
  96: ['T20', 'D18'],
  95: ['T19', 'D19'],
  94: ['T18', 'D20'],
  93: ['T19', 'D18'],
  92: ['T20', 'D16'],
  91: ['T17', 'D20'],
  90: ['T18', 'D18'],
  89: ['T19', 'D16'],
  88: ['T16', 'D20'],
  87: ['T17', 'D18'],
  86: ['T18', 'D16'],
  85: ['T15', 'D20'],
  84: ['T20', 'D12'],
  83: ['T17', 'D16'],
  82: ['T14', 'D20'],
  81: ['T19', 'D12'],
  80: ['T20', 'D10'],
  79: ['T13', 'D20'],
  78: ['T18', 'D12'],
  77: ['T19', 'D10'],
  76: ['T20', 'D8'],
  75: ['T17', 'D12'],
  74: ['T14', 'D16'],
  73: ['T19', 'D8'],
  72: ['T16', 'D12'],
  71: ['T13', 'D16'],
  70: ['T18', 'D8'],
  69: ['T19', 'D6'],
  68: ['T20', 'D4'],
  67: ['T17', 'D8'],
  66: ['T14', 'D12'],
  65: ['S25', 'D20'],
  64: ['T16', 'D8'],
  63: ['T13', 'D12'],
  62: ['T10', 'D16'],
  61: ['T15', 'D8'],
  60: ['S20', 'D20'],
  59: ['S19', 'D20'],
  58: ['S18', 'D20'],
  57: ['S17', 'D20'],
  56: ['S16', 'D20'],
  55: ['S15', 'D20'],
  54: ['S14', 'D20'],
  53: ['S13', 'D20'],
  52: ['S12', 'D20'],
  51: ['S11', 'D20'],
  50: ['S10', 'D20'],
  49: ['S9', 'D20'],
  48: ['S8', 'D20'],
  47: ['S7', 'D20'],
  46: ['S6', 'D20'],
  45: ['S5', 'D20'],
  44: ['S4', 'D20'],
  43: ['S3', 'D20'],
  42: ['S2', 'D20'],
  41: ['S1', 'D20']
}

function routeFor(remaining: number): string[] {
  if (remaining <= 40 && remaining % 2 === 0) {
    return [`D${remaining / 2}`]
  }
  if (remaining <= 40 && remaining % 2 === 1) {
    const single = remaining >= 33 ? remaining - 32 : remaining >= 17 ? remaining - 16 : remaining >= 9 ? remaining - 8 : remaining - 2
    return [`S${single}`, `D${(remaining - single) / 2}`]
  }
  return checkoutRoutes[remaining] ?? ['T20']
}

// Independent AI form: a player's level is sampled once per match.
// Human scores never affect scoring or finishing probabilities.
// Tier 1 = rank 1-4, tier 2 = 5-8, tier 3 = 9-16,
// tier 4 = 17-32, tier 5 = 33-64, tier 6 = 65-96, tier 7 = 97-129.
// Desired MATCH averages (including checkout darts):
// 52-58, 51-57, 50-56, 49-55, 48-54, 47-53, 46-52.
// Scoring visits run a little higher to account for time spent on doubles.
const SCORING_RANGES: Record<SkillTier, [number, number]> = {
  1: [59, 65], 2: [58, 64], 3: [57, 63], 4: [56, 62],
  5: [55, 61], 6: [54, 60], 7: [53, 59],
}
const DOUBLE_RANGES: Record<SkillTier, [number, number]> = {
  1: [0.27, 0.32], 2: [0.26, 0.31], 3: [0.25, 0.30],
  4: [0.24, 0.29], 5: [0.23, 0.28], 6: [0.22, 0.27],
  7: [0.21, 0.26],
}
// Hard ceiling on the opponent's running 3-dart MATCH average.
// Level 3 keeps the original ranking ranges; easier/harder levels shift them.
const MATCH_AVERAGE_CAPS: Record<number, number[]> = {
  1: [52, 51, 50, 49, 48, 47, 46],
  2: [54, 53, 52, 51, 50, 49, 48],
  3: [58, 57, 56, 55, 54, 53, 52],
  4: [66, 65, 64, 63, 62, 61, 60],
}

function capBotVisit(bot: Score, visit: BotVisit, maxAverage: number): BotVisit {
  const permitted = Math.max(0, Math.floor(maxAverage * (bot.matchDarts + visit.darts) / 3 - bot.matchScored))
  if (visit.points <= permitted) return visit
  // A checkout cannot be partly scored: postpone it until the average allows it.
  if (visit.checkout) return { points: 0, darts: 3, checkout: false, opened: true }
  const points = Math.min(visit.points, permitted)
  return { ...visit, points: bot.remaining - points === 1 ? Math.max(0, points - 1) : points }
}

type BotForm = {
  scoring: number
  doubleChance: number
  offsets: number[]
}
function createBotForm(tier: SkillTier, difficulty: number): BotForm {
  const scoring = SCORING_RANGES[tier]
  const doubles = DOUBLE_RANGES[tier]
  const roll = (Math.random() + Math.random() + Math.random()) / 3
  return {
    scoring: scoring[0] + (scoring[1] - scoring[0]) * roll + ({ 1: -6, 2: -4, 3: 0, 4: 8 }[difficulty] ?? 0),
    doubleChance: Math.max(0.08, Math.min(0.7, doubles[0] + (doubles[1] - doubles[0]) * roll + ({ 1: -0.055, 2: -0.035, 3: 0, 4: 0.075 }[difficulty] ?? 0))),
    offsets: Array.from({ length: 32 }, () => (Math.random() - 0.5) * 2),
  }
}

function generateBotVisit(bot: Score, form: BotForm, needsDoubleIn: boolean, legIndex: number): BotVisit {
  const left = bot.remaining
  const legPace = form.scoring + form.offsets[legIndex % form.offsets.length]
  const variance = (Math.random() + Math.random() + Math.random() - 1.5) * 40
  const rawScore = Math.round(legPace + variance)

  if (needsDoubleIn) {
    for (let dart = 1; dart <= 3; dart++) {
      if (Math.random() < form.doubleChance) {
        // A double-in opens the leg; don't award an entire scoring visit here.
        return { points: 40, darts: 3, checkout: false, opened: true }
      }
    }
    return { points: 0, darts: 3, checkout: false, opened: false }
  }

  if (left <= 170 && canCheckout(left)) {
    const route = routeFor(left)
    // High finishes remain difficult; finishing on a standing double gives
    // three real attempts, rather than one chance for the whole visit.
    const onDouble = left <= 40 && left % 2 === 0
    const finishChance = onDouble ? form.doubleChance : form.doubleChance * (left > 100 ? 0.10 : left > 60 ? 0.30 : 0.60)
    const attempts = onDouble ? 3 : 1
    for (let dart = 1; dart <= attempts; dart++) {
      if (Math.random() < finishChance) {
        return { points: left, darts: onDouble ? dart : route.length, checkout: true, opened: true }
      }
    }
    if (onDouble) return { points: 0, darts: 3, checkout: false, opened: true }

    // When the finish misses, set up a familiar double instead of repeatedly
    // trying an impossible or low-probability big checkout.
    const preferred = left > 60 ? 40 : left > 40 ? 32 : 16
    const setup = left - preferred
    if (setup > 0 && setup <= 180) {
      return { points: setup, darts: 3, checkout: false, opened: true }
    }
  }

  // Scoring is generated independently of the match average and human score.
  // Allow occasional high visits without a hard 100-point ceiling.
  let points = Math.max(0, Math.min(180, rawScore))
  points = Math.min(points, Math.max(0, left - 2))
  if (left - points === 1) points = Math.max(0, points - 1)
  return { points, darts: 3, checkout: false, opened: true }
}

function applyVisit(
  previous: Game,
  side: Side,
  points: number,
  darts: number,
  checkout: boolean,
  format: MatchFormat,
  openedThisTurn = false
): Game {
  const next: Game = {
    ...previous,
    you: { ...previous.you },
    bot: { ...previous.bot }
  }
  const player = next[side]
  const left = player.remaining - points
  const bust = points > player.remaining || left < 0 || left === 1 ||
    (left === 0 && !checkout)
  const credited = bust ? 0 : points
  player.darts += darts
  player.matchDarts += darts
  player.matchScored += credited
  player.last = credited
  if (!format.doubleIn || openedThisTurn) player.opened = true
  if (!bust) player.remaining = left
  if (left === 0 && checkout && !bust) {
    player.legs += 1
    player.totalLegs += 1
    const setComplete = format.mode === 'sets' && player.legs >= (format.legsPerSet ?? 2)
    if (setComplete) {
      player.sets += 1
      next.you.legs = 0
      next.bot.legs = 0
    }
    const opponent = next[other(side)]
    const matchComplete = format.mode === 'sets'
      ? player.sets >= format.firstTo
      : player.totalLegs >= format.firstTo && (
          !format.winByTwo ||
          player.totalLegs - opponent.totalLegs >= 2 ||
          player.totalLegs >= (format.suddenDeathAt ?? Infinity) + 1
        )
    if (matchComplete) {
      next.finished = true
      next.winner = side
      next.message = `${side === 'you' ? 'YOU' : 'OPPONENT'} WON THE MATCH`
      return next
    }
    next.starter = other(previous.starter)
    next.turn = next.starter
    next.you.remaining = 501
    next.bot.remaining = 501
    next.you.opened = !format.doubleIn
    next.bot.opened = !format.doubleIn
    next.you.darts = 0
    next.bot.darts = 0
    next.you.last = null
    next.bot.last = null
    next.message = `${side === 'you' ? 'YOU' : 'OPPONENT'} WON THE LEG`
    return next
  }
  next.turn = other(side)
  next.message = bust ? 'BUST — 0 SCORED' : ''
  return next
}

export default function MatchScreen({
  you, rival, rivalSkillTier = 7, aiDifficulty = 3, firstThrowId, tournamentName, onBack, onComplete, roundLabel = 'LAST 16', format, skipFinalMatchResult = false
}: {
  you: PlayerInfo
  rival: PlayerInfo
  rivalSkillTier?: SkillTier
  aiDifficulty?: number
  firstThrowId: number
  tournamentName: string
  onBack: () => void
  onComplete: (winnerId: number, score?: { youScore: number; rivalScore: number; unit: 'legs' | 'sets' }) => void
  roundLabel?: string
  format: MatchFormat
  skipFinalMatchResult?: boolean
}) {
  const initialSide: Side = firstThrowId === you.id ? 'you' : 'bot'
  // Sample once per match, not after each human turn or according to who is winning.
  const [botForm] = useState(() => createBotForm(rivalSkillTier, aiDifficulty))
  const botAverageCap = (MATCH_AVERAGE_CAPS[aiDifficulty] ?? MATCH_AVERAGE_CAPS[3])[rivalSkillTier - 1]
  const [game, setGame] = useState<Game>(() => ({
    you: fresh(), bot: fresh(), turn: initialSide, starter: initialSide,
    finished: false, winner: null, message: ''
  }))
  const [input, setInput] = useState('')
  const [records, setRecords] = useState<TurnRecord[]>([])
  const [botBusy, setBotBusy] = useState(false)
  // Cache each AI decision against its own board state, even across repeated undo.
  // Human scores never influence the generated visit.
  const botVisitCache = useRef<Map<string, BotVisit>>(new Map())
  const inputRef = useRef<HTMLInputElement>(null)
  const finalResultForwarded = useRef(false)
  // Finals go directly to the existing tournament/night champion overlay.
  // The guard also prevents duplicate completion in React Strict Mode.
  useEffect(() => {
    if (!skipFinalMatchResult || !game.finished || !game.winner || finalResultForwarded.current) return
    finalResultForwarded.current = true
    onComplete(game.winner === 'you' ? you.id : rival.id, { youScore: format.mode === 'sets' ? game.you.sets : game.you.legs, rivalScore: format.mode === 'sets' ? game.bot.sets : game.bot.legs, unit: format.mode })
  }, [skipFinalMatchResult, game.finished, game.winner, onComplete, you.id, rival.id])

  useEffect(() => {
    if (game.finished || game.turn !== 'bot') return
    setBotBusy(true)
    const timer = window.setTimeout(() => {
      const key = JSON.stringify([game.bot.remaining, game.bot.darts, game.bot.matchDarts,
        game.bot.matchScored, game.bot.totalLegs, game.bot.sets, game.bot.opened])
      let visit = botVisitCache.current.get(key)
      if (!visit) {
        visit = generateBotVisit(
          game.bot, botForm,
          format.doubleIn === true && !game.bot.opened,
          game.bot.totalLegs + game.you.totalLegs
        )
        visit = capBotVisit(game.bot, visit, botAverageCap)
        botVisitCache.current.set(key, visit)
      }
      const after = applyVisit(game, 'bot', visit.points, visit.darts, visit.checkout, format, visit.opened)
      setRecords(old => [...old, { before: game, after }])
      setGame(after)
      setBotBusy(false)
    }, 900)
    return () => window.clearTimeout(timer)
  }, [game, format, botForm])
  useEffect(() => {
    if (game.turn === 'you' && !game.finished) inputRef.current?.focus()
  }, [game.turn, game.finished])
  const submit = () => {
    const raw = input.trim()
    if (game.turn !== 'you' || game.finished || botBusy || !/^\d{1,3}$/.test(raw)) return
    const points = Number(raw)
    // 0 is how the user registers a bust; an exact finish is automatically a checkout.
    if (points > 180 || points > game.you.remaining) return
    if (points !== 0 && game.you.remaining - points === 1) return
    if (points === game.you.remaining && !canCheckout(points)) return
    const after = applyVisit(
      game, 'you', points, 3, points === game.you.remaining, format, points > 0
    )
    setRecords(old => [...old, { before: game, after }])
    setGame(after)
    setInput('')
  }
  const undo = () => {
    if (botBusy || game.finished || records.length === 0) return
    // Undo the last HUMAN visit, including the bot's subsequent response.
    const lastHumanIndex = records.map(r => r.before.turn).lastIndexOf('you')
    if (lastHumanIndex < 0) return
    // The bot cache persists, so returning to this exact AI state reproduces
    // the same visit even if the human changes their previous score.
    setRecords(old => old.slice(0, lastHumanIndex))
    setGame(records[lastHumanIndex].before)
    setInput('')
  }
  const playerPanel = (side: Side, player: PlayerInfo) => {
    const score = game[side]
    return (
      <div className={`match501-side match501-${side}`}>
        <div className={`match501-player ${game.turn === side && !game.finished ? 'match501-active' : ''}`}>
          <div className="match501-identity">
            <span>{side === 'you' ? 'YOU' : 'OPPONENT'}</span>
            <h2>{player.name}</h2>
          </div>
          <div className="match501-rounds">
            <div><span>SETS</span><strong>{score.sets}</strong></div>
            <div><span>LEGS</span><strong>{score.legs}</strong></div>
          </div>
          <div className="match501-remaining">{score.remaining}</div>
          <div className="match501-stats">
            <div><span>LAST SCORE</span><strong>{score.last ?? '—'}</strong></div>
            <div><span>3-DART AVG · MATCH</span><strong>{average(score)}</strong></div>
            <div><span>DARTS THIS LEG</span><strong>{score.darts}</strong></div>
          </div>
          <div className="match501-turn">
            {game.turn === side && !game.finished ? '● THROWING' : 'WAITING'}
          </div>
        </div>
        <img className="match501-render" src={`${import.meta.env.BASE_URL}players/${player.image}.png`} alt={player.name} />
      </div>
    )
  }
  if (skipFinalMatchResult && game.finished) return null

  return (
    <main className="career-screen match501-screen">
      <div className="match501-container">
        <header className="match501-header">
          <span className="eyebrow">PDC CAREER MODE</span>
          <h1>{tournamentName}</h1>
          <p>{roundLabel} · {describeFormat(format)}</p>
        </header>
        {game.finished && game.winner ? (
          <section
              className="match501-winner match501-winner-clickable"
              role="button"
              tabIndex={0}
              onClick={() => onComplete(game.winner === 'you' ? you.id : rival.id, { youScore: format.mode === 'sets' ? game.you.sets : game.you.legs, rivalScore: format.mode === 'sets' ? game.bot.sets : game.bot.legs, unit: format.mode })}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  onComplete(game.winner === 'you' ? you.id : rival.id, { youScore: format.mode === 'sets' ? game.you.sets : game.you.legs, rivalScore: format.mode === 'sets' ? game.bot.sets : game.bot.legs, unit: format.mode })
                }
              }}
            >
            <span className="match501-winner-label">MATCH RESULT</span>
            <img
              src={`${import.meta.env.BASE_URL}players/${game.winner === 'you' ? you.image : rival.image}.png`}
              alt=""
            />
            <h2>WINNER</h2>
            <h3>{game.winner === 'you' ? you.name : rival.name}</h3>
            <p>{format.mode === 'sets' ? `${game.you.sets} — ${game.bot.sets} SETS` : `${game.you.totalLegs} — ${game.bot.totalLegs} LEGS`}</p>
              <span className="match501-continue">PRESS ANYWHERE TO CONTINUE</span>
          </section>
        ) : (
          <>
            <section className="match501-board">
              {playerPanel('you', you)}
              <div className="match501-vs">VS</div>
              {playerPanel('bot', rival)}
            </section>
            <div className="match501-status" role="status">
              {botBusy ? `${rival.name} is throwing...` :
                game.message || (game.turn === 'you'
                  ? 'YOUR TURN — ENTER YOUR 3-DART SCORE'
                  : 'OPPONENT TO THROW')}
            </div>
            <form className="match501-entry" onSubmit={event => {
              event.preventDefault()
              submit()
            }}>
              <button
                type="button"
                className="match501-undo"
                onClick={undo}
                disabled={botBusy || !records.some(r => r.before.turn === 'you')}
                title="Undo your previous visit"
              >
                ↶ <span>UNDO</span>
              </button>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                placeholder="Enter score and press Enter"
                value={input}
                onChange={event => setInput(event.target.value.replace(/\D/g, '').slice(0, 3))}
                disabled={game.turn !== 'you' || botBusy}
                aria-label="Your score"
              />
              <button
                type="submit"
                className="match501-send"
                disabled={game.turn !== 'you' || botBusy || !input}
              >
                SEND ↵
              </button>
            </form>
          </>
        )}
        <footer className="match501-footer">
          <button onClick={onBack}>← BACK TO PREVIEW</button>
          <span>501 · {format.doubleIn ? 'DOUBLE IN / DOUBLE OUT' : 'DOUBLE OUT'}</span>
        </footer>
      </div>
    </main>
  )
}
