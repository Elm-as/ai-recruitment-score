import { Candidate, Language } from '@/lib/types'
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
  return (
    <div className="flex items-center gap-2">
      <h3 className="text-lg font-semibold">
        #{rank}
      </h3>

      {isTopPick && (
        rank === 1 ? <Trophy /> : <Star />
      )}
    </div>
  )
}

CandidateHeader.defaultProps = {
  isTopPick: false,
}
