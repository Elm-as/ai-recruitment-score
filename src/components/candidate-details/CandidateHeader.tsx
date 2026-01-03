import { Candidate } from '@/lib/types'
import { User, Envelope } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

interface CandidateHeaderProps {
  candidate: Candidate
  rank: number
  isTopPick: boolean
  language: 'fr' | 'en'
}

export default function CandidateHeader({ candidate, rank, isTopPick, language }: CandidateHeaderProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-blue-600 dark:text-blue-400'
    return 'text-orange-600 dark:text-orange-400'
  }

  const getRankBadgeVariant = (rank: number) => {
    if (rank === 1) return 'default'
    if (rank === 2) return 'secondary'
    return 'outline'
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={20} weight="duotone" className="text-primary" />
          </div>
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-base sm:text-lg text-foreground break-words">
              {candidate.name}
            </h3>
            <Badge variant={getRankBadgeVariant(rank)} className="text-xs shrink-0">
              #{rank}
            </Badge>
            {isTopPick && (
              <Badge className="bg-accent text-accent-foreground text-xs shrink-0">
                {language === 'fr' ? 'Top Choix' : 'Top Pick'}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 mt-1 text-xs sm:text-sm text-muted-foreground">
            <Envelope size={14} weight="duotone" />
            <span className="break-all">{candidate.email}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div
          className={`
            flex items-center gap-1.5 px-3 py-2 rounded-lg
            bg-secondary/50 border border-border
          `}
        >
          <div className="flex flex-col items-end">
            <div className={`text-2xl font-bold ${getScoreColor(candidate.score)}`}>
              {candidate.score}
            </div>
            <div className="text-xs text-muted-foreground">/ 100</div>
          </div>
        </div>
      </div>
    </div>
  )
}
