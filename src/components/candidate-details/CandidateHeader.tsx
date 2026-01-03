import { Candidate, Language } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Star, Trophy } from '@phosphor-icons/react'

interface CandidateHeaderProps {
  candidate: Candidate
  rank: number
  isTopPick: boolean
  language: Language
}

export default function CandidateHeader({
  candidate,
  rank,
  isTopPick,
  language,
}: CandidateHeaderProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-orange-500'
    return 'text-red-500'
  }

  const getRankBadgeVariant = (rank: number): 'default' | 'secondary' | 'outline' => {
    if (rank === 1) return 'default'
    if (rank <= 3) return 'secondary'
    return 'outline'
  }

  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-base sm:text-lg font-semibold text-foreground break-words">
          {candidate.name}
        </h3>
        <Badge variant={getRankBadgeVariant(rank)} className="shrink-0">
          #{rank}
        </Badge>
        {isTopPick && (
          <Badge className="bg-accent text-accent-foreground gap-1 shrink-0">
            {rank === 1 ? <Trophy size={12} weight="fill" /> : <Star size={12} weight="fill" />}
            {language === 'fr' ? 'Top candidat' : 'Top Pick'}
          </Badge>
        )}
      </div>
      <div className="shrink-0">
        <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(candidate.score)}`}>
          {candidate.score}/100
        </div>
      </div>
    </div>
  )
}
