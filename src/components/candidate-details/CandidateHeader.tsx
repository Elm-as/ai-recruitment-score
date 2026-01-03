import { Candidate, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { Badge } from '@/components/ui/badge'
import { User, Envelope, Trophy } from '@phosphor-icons/react'

interface CandidateHeaderProps {
  candidate: Candidate
  rank: number
  isTopPick: boolean
  language: Language
}

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
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-semibold text-foreground break-words">
              {candidate.name}
            </h3>
            <Badge variant={getRankBadgeVariant(rank)} className="shrink-0">
              #{rank}
            </Badge>
            {isTopPick && (
              <Badge className="bg-accent text-accent-foreground shrink-0 gap-1">
                <Trophy size={12} weight="fill" />
                {t('candidate.topPick', language)}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-1">
            <Envelope size={14} weight="duotone" />
            <span className="break-all">{candidate.email}</span>
          </div>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted/50 shrink-0 ${getScoreColor(
            candidate.score
          )}`}
        >
          <div className="text-right">
            <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(candidate.score)}`}>
              {candidate.score}
            </div>
            <div className="text-xs text-muted-foreground">{t('candidate.score', language)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
