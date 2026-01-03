import { Candidate } from '@/lib/types'
import { User, Envelope } from '@phosphor-icons/react'
interface CandidateHeaderProps {

interface CandidateHeaderProps {
  candidate: Candidate
  rank: number
  isTopPick: boolean
  const getScoreColor =
}

export default function CandidateHeader({ candidate, rank, isTopPick, language }: CandidateHeaderProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-blue-600 dark:text-blue-400'
    return 'text-orange-600 dark:text-orange-400'
   

              {candidate.name}
            <Badge variant={getRankB
            </Badge>
              <Badge
   

          
            <span className="break-all">{candidate.email}</span>
        </div>

        <div
            flex items-center gap-1.5 px-3 py-2 rounded-lg
          `}
          <div
        
            <div className="text-xs text
        </div>
    </div>
}




































