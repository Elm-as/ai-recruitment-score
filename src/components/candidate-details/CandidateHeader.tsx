import { Candidate, Language } from '@/lib/types'
import { Badge } from '@/components/ui/badge'


  isTopPick: boolean
}
export default
    if (score >= 80)
    return 'text-ora


    return 'outline'

    <div className="flex flex-wrap items-start justify-between g
        <h3 className="text-base sm:text-lg font-semibold text
        </h3>
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













