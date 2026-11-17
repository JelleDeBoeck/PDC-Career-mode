import { useEffect, useRef, useState } from 'react'

type RevealPlayer = { id: number; name: string; image: string }
type Props = { year: number; players: RevealPlayer[]; pool?: RevealPlayer[]; onClose: () => void }

// Presentation only: the eight players are picked by App; no Premier League data is saved.
export default function PremierLeagueReveal({ year, players, pool = players, onClose }: Props) {
  const [revealed, setRevealed] = useState<number[]>([])
  const [spinningIndex, setSpinningIndex] = useState<number | null>(null)
  const [preview, setPreview] = useState<RevealPlayer | null>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const spinningRef = useRef(false)
  const autoQueue = useRef<number[]>([])
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoStarted = useRef(false)

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current)
    if (finishTimer.current) clearTimeout(finishTimer.current)
    if (autoTimer.current) clearTimeout(autoTimer.current)
  }, [])

  const reveal = (index: number) => {
    if (spinningRef.current || revealed.includes(index) || !players[index]) return
    spinningRef.current = true
    setSpinningIndex(index)
    const candidates = pool.length ? pool : players
    // Around 38 fast, random face changes in three seconds; then an instant stop.
    let changes = 0
    setPreview(candidates[Math.floor(Math.random() * candidates.length)])
    timer.current = setInterval(() => {
      changes += 1
      setPreview(candidates[Math.floor(Math.random() * candidates.length)])
      if (changes >= 38 && timer.current) {
        clearInterval(timer.current)
        timer.current = null
      }
    }, 80)
    finishTimer.current = setTimeout(() => {
      if (timer.current) clearInterval(timer.current)
      timer.current = null
      setPreview(players[index])
      setRevealed(current => [...current, index])
      setSpinningIndex(null)
      spinningRef.current = false
      const next = autoQueue.current.shift()
      if (next !== undefined) autoTimer.current = setTimeout(() => reveal(next), 1000)
    }, 3050)
  }

  const startReveal = (index: number) => {
    if (autoStarted.current || !players[index]) return
    autoStarted.current = true
    // Fisher-Yates shuffle: no fixed row or rank order.
    const remaining = players.map((_, i) => i).filter(i => i !== index)
    for (let i = remaining.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[remaining[i], remaining[j]] = [remaining[j], remaining[i]]
    }
    autoQueue.current = remaining
    reveal(index)
  }

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      if ((event.target as HTMLElement)?.tagName === 'BUTTON') return
      event.preventDefault()
      if (revealed.length === players.length && !spinningRef.current) onClose()
      else if (!spinningRef.current) {
        const next = players.findIndex((_, index) => !revealed.includes(index))
        if (next !== -1) startReveal(next)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  })

  return (
    <div onClick={() => { if (revealed.length === players.length && spinningIndex === null) onClose() }} style={{ position: 'fixed', inset: 0, zIndex: 9999, overflowY: 'auto', color: '#fff',
      background: 'radial-gradient(ellipse at 50% 25%, #806128 0%, #29251b 42%, #0d0e12 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', boxSizing: 'border-box', textAlign: 'center' }}>
      <div style={{ width: '100%', maxWidth: 850 }}>
        <div style={{ color: '#e8ca83', fontSize: 12, fontWeight: 900, letterSpacing: 4 }}>PDC CAREER MODE</div>
        <div style={{ width: 72, height: 2, background: '#c8a452', margin: '18px auto' }} />
        <div style={{ fontSize: 12, letterSpacing: 3, color: '#dfc27b', fontWeight: 800 }}>THE OFFICIAL LINEUP REVEAL</div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 60px)', margin: '10px 0 4px', lineHeight: 1.05 }}>PREMIER LEAGUE <span style={{ color: '#e6c477' }}>{year}</span></h1>
        <p style={{ color: '#c1b395', fontSize: 13, margin: '12px 0 28px' }}>
          {revealed.length === players.length ? 'YOUR PREMIER LEAGUE LINEUP' : `${revealed.length} OF ${players.length} PLAYERS REVEALED`}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'clamp(8px, 1.5vw, 16px)', maxWidth: 790, margin: '0 auto 28px' }}>
          {players.map((player, index) => {
            const isRevealed = revealed.includes(index)
            const isSpinning = spinningIndex === index
            const shown = isSpinning ? preview : isRevealed ? player : null
            return <button key={`${player.id}-${index}`} type="button" onClick={() => startReveal(index)}
              disabled={isRevealed || spinningIndex !== null}
              aria-label={isRevealed ? player.name : `Reveal player ${index + 1}`}
              style={{ appearance: 'none', font: 'inherit', color: '#fff', cursor: isRevealed || spinningIndex !== null ? 'default' : 'pointer',
                border: `2px solid ${isSpinning ? '#ffe7a0' : isRevealed ? '#cba65c' : '#6c603f'}`,
                background: isSpinning ? '#755b29' : isRevealed ? 'rgba(178,139,59,.23)' : 'rgba(12,13,17,.72)',
                borderRadius: 13, padding: 9, minWidth: 0, boxSizing: 'border-box',
                boxShadow: isSpinning ? '0 0 34px rgba(230,188,95,.65)' : 'none', transition: 'border-color .15s, box-shadow .15s' }}>
              <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 9, overflow: 'hidden',
                background: 'linear-gradient(145deg, #80622d, #15171b)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {shown ? <img src={`/players/${shown.image}.png`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 18%' }} />
                  : <span style={{ fontSize: 'clamp(40px, 7vw, 78px)', color: '#d9b96e', fontWeight: 800 }}>?</span>}
              </div>
              <div style={{ height: 31, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 7,
                fontSize: 'clamp(10px, 1.3vw, 13px)', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase' }}>
                {isSpinning ? '••••••' : isRevealed ? player.name : 'REVEAL'}
              </div>
            </button>
          })}
        </div>
        {/* Fixed-height action area: switching to the continue tag never shifts the lineup. */}
        <div style={{ height: 44, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {revealed.length === players.length && spinningIndex === null ? (
            <button type="button" onClick={event => { event.stopPropagation(); onClose() }}
              style={{ appearance: 'none', fontFamily: 'inherit', background: 'rgba(205,166,89,.09)',
                color: '#e8ca83', border: '1px solid rgba(232,202,131,.34)', borderRadius: 8,
                padding: '9px 18px', fontSize: 11, fontWeight: 900, letterSpacing: 1.7,
                lineHeight: '16px', cursor: 'pointer' }}>
              PRESS ANYWHERE TO CONTINUE
            </button>
          ) : (
            <div style={{ color: '#e8ca83', fontWeight: 900, fontSize: 13, letterSpacing: 2 }}>
              {autoStarted.current ? (spinningIndex !== null ? 'SELECTING PLAYER...' : '') : 'SELECT ONE BOX TO START THE REVEAL'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
