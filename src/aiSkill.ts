/** AI ability is tied to the starting rank, never the changing money ranking. */
export type SkillTier = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type SkillProfile = { minAverage: number; typicalAverage: number; peakAverage: number }

const PROFILES: Record<SkillTier, SkillProfile> = {
  1: { minAverage: 52, typicalAverage: 55, peakAverage: 58 },
  2: { minAverage: 51, typicalAverage: 54, peakAverage: 57 },
  3: { minAverage: 50, typicalAverage: 53, peakAverage: 56 },
  4: { minAverage: 49, typicalAverage: 52, peakAverage: 55 },
  5: { minAverage: 48, typicalAverage: 51, peakAverage: 54 },
  6: { minAverage: 46, typicalAverage: 50, peakAverage: 53 },
  7: { minAverage: 45, typicalAverage: 48.5, peakAverage: 52 },
}

export function skillTierFromStartingRank(rank: number): SkillTier {
  if (rank <= 8) return 1
  if (rank <= 16) return 2
  if (rank <= 32) return 3
  if (rank <= 48) return 4
  if (rank <= 64) return 5
  if (rank <= 96) return 6
  return 7
}

export function skillProfile(tier: SkillTier): SkillProfile { return PROFILES[tier] }

/** Sample a match-level target average, concentrated around the typical average. */
export function sampleTargetAverage(tier: SkillTier, random: () => number = Math.random): number {
  const profile = PROFILES[tier]
  const roll = (random() + random() + random()) / 3
  return roll < 0.5
    ? profile.minAverage + (profile.typicalAverage - profile.minAverage) * (roll / 0.5)
    : profile.typicalAverage + (profile.peakAverage - profile.typicalAverage) * ((roll - 0.5) / 0.5)
}

/** AI vs AI: adjacent bands are competitive; upsets remain possible. */
const STRONGER_WIN_PERCENT: readonly (readonly number[])[] = [
  [50, 53, 57, 61, 65, 69, 73],
  [50, 50, 53, 57, 61, 65, 69],
  [50, 50, 50, 53, 57, 61, 65],
  [50, 50, 50, 50, 53, 57, 61],
  [50, 50, 50, 50, 50, 53, 57],
  [50, 50, 50, 50, 50, 50, 53],
  [50, 50, 50, 50, 50, 50, 50],
]

export function winChanceForFirstPlayer(first: SkillTier, second: SkillTier): number {
  if (first === second) return 0.5
  if (first < second) return STRONGER_WIN_PERCENT[first - 1][second - 1] / 100
  return 1 - STRONGER_WIN_PERCENT[second - 1][first - 1] / 100
}

/** Compatibility with existing MatchScreen: 0 weakest, 1 strongest. */
export function skillStrength(tier: SkillTier): number { return (7 - tier) / 6 }
