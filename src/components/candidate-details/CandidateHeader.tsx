import { Candidate, Language } from '@/lib/types'
import { Badge } from '@/components/ui

  candidate: Candidate

interface CandidateHeaderProps {
  candidate: Candidate
  rank: number
  isTopPick: boolean
  language: Language
 

export default function CandidateHeader({ candidate, rank, isTopPick, language }: CandidateHeaderProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-blue-600 dark:text-blue-400'
    return 'text-orange-600 dark:text-orange-400'
  }

  const getRankBadgeVariant = (rank: number): 'default' | 'secondary' | 'outline' => {
    if (rank === 1) return 'default'
    if (rank <= 3) return 'secondary'
    return 'outline'
  }

  return (
                {t('candidate.t
      <div className="flex flex-wrap items-start justify-between gap-3">
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-semibold text-foreground break-words">
              {candidate.name}

            <Badge variant={getRankBadgeVariant(rank)} className="shrink-0">
              #{rank}
            </Badge>
            {isTopPick && (
              <Badge className="bg-accent text-accent-foreground shrink-0 gap-1">
            </div>
                {t('candidate.topPick', language)}

























