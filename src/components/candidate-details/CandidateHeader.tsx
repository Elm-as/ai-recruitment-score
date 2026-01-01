import { Candidate } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { User, Envelope } from '@phosphor-icons/react'

interface CandidateHeaderProps {
  candidate: Candidate
  rank: number
  isTopPick: boolean
  language: 'fr' | 'en'
}

export default function CandidateHeader({ candidate, rank, isTopPick, language }: CandidateHeaderProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-300'
    if (score >= 60) return 'bg-yellow-100 border-yellow-300'
    return 'bg-red-100 border-red-300'
  }

  const getRankBadgeVariant = (rank: number) => {
    if (rank === 1) return 'default'
    if (rank === 2) return 'secondary'
    if (rank === 3) return 'outline'
    return 'outline'
  }

  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
      <div className="flex items-start gap-3 flex-1 min-w-0 w-full sm:w-auto">
        <div className="flex flex-row sm:flex-col gap-1">
          <Badge variant={getRankBadgeVariant(rank)} className="w-fit text-xs">
            #{rank}
          </Badge>
          {isTopPick && (
            <Badge className="bg-accent text-accent-foreground w-fit text-xs">
              {language === 'fr' ? 'Top Choix' : 'Top Pick'}
            </Badge>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <User size={14} className="text-muted-foreground shrink-0" />
            <h3 className="font-semibold text-base sm:text-lg break-words">{candidate.name}</h3>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Envelope size={12} className="shrink-0" />
            <span className="truncate">{candidate.email}</span>
          </div>
        </div>
      </div>
      <div
        className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 ${getScoreBgColor(
          candidate.score
        )} shrink-0`}
      >
        <div className="text-center">
          <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(candidate.score)}`}>
            {candidate.score}
          </div>
          <div className="text-xs text-muted-foreground">/ 100</div>
        </div>
      </div>
    </div>
  )
}
