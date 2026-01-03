import { Candidate, Language } from '@/lib/types'
import { Star, Trophy } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'

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
  const averageScore = candidate.scoreBreakdown?.length > 0
    ? Math.round(
        candidate.scoreBreakdown.reduce((sum, item) => sum + item.score, 0) /
          candidate.scoreBreakdown.length
      )
    : candidate.score

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-2">
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">
          #{rank}
        </h3>

        {isTopPick && (
          rank === 1 ? (
            <Trophy size={20} weight="fill" className="text-amber-500" />
          ) : (
            <Star size={20} weight="fill" className="text-accent" />
          )
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <Badge variant="default" className="bg-primary text-primary-foreground font-semibold text-xs sm:text-sm px-2 py-0.5">
          {language === 'fr' ? 'Score' : 'Score'}: {candidate.score}/100
        </Badge>

        <Badge variant="secondary" className="font-medium text-xs sm:text-sm px-2 py-0.5">
          {language === 'fr' ? 'Moy.' : 'Avg.'}: {averageScore}/100
        </Badge>
      </div>
    </div>
  )
}

CandidateHeader.defaultProps = {
  isTopPick: false,
}
