import { useState } from 'react'
import { Position, Candidate, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Funnel } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import AddCandidateDialog from './AddCandidateDialog'
import CandidateCard from './CandidateCard'
import { motion } from 'framer-motion'

interface PositionDetailViewProps {
  position: Position
  onBack: () => void
  candidates: Candidate[]
  setCandidates: (updater: (prev: Candidate[]) => Candidate[]) => void
  positions: Position[]
  setPositions: (updater: (prev: Position[]) => Position[]) => void
  language: Language
}

export default function PositionDetailView({
  position,
  onBack,
  candidates,
  setCandidates,
  positions,
  setPositions,
  language,
}: PositionDetailViewProps) {
  const [addCandidateOpen, setAddCandidateOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const sortedCandidates = [...candidates].sort((a, b) => b.score - a.score)
  
  const filteredCandidates = sortedCandidates.filter((c) => {
    if (filterStatus === 'all') return true
    return c.status === filterStatus
  })

  const topPicksCount = Math.min(position.openings, candidates.length)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex-1 w-full">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 mb-4 -ml-2 hover:scale-105 transition-transform"
          >
            <ArrowLeft size={18} weight="bold" />
            {t('positionDetail.back', language)}
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{position.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{position.description}</p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <Badge variant="outline" className="gap-1.5">
                {position.openings} {position.openings === 1 ? t('positions.openings', language) : t('positions.openings_plural', language)}
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                {candidates.length} {candidates.length === 1 ? t('positions.candidates', language) : t('positions.candidates_plural', language)}
              </Badge>
            </div>
          </div>
        </div>
        <Button onClick={() => setAddCandidateOpen(true)} className="gap-2 shrink-0 hover:scale-105 transition-transform">
          <Plus size={18} weight="bold" />
          {t('positionDetail.addCandidate', language)}
        </Button>
      </div>

      {candidates.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3"
        >
          <Funnel size={18} className="text-muted-foreground" weight="duotone" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder={t('history.filterAll', language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('history.filterAll', language)}</SelectItem>
              <SelectItem value="scored">{t('status.scored', language)}</SelectItem>
              <SelectItem value="selected">{t('history.filterSelected', language)}</SelectItem>
              <SelectItem value="rejected">{t('history.filterRejected', language)}</SelectItem>
              <SelectItem value="analyzing">{t('status.analyzing', language)}</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      )}

      {filteredCandidates.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-2 border-dashed rounded-lg p-12 text-center bg-muted/20"
        >
          <p className="text-muted-foreground text-lg">
            {candidates.length === 0
              ? t('positionDetail.noCandidates', language)
              : 'Aucun candidat ne correspond au filtre sélectionné.'}
          </p>
          {candidates.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {t('positionDetail.noCandidatesDesc', language)}
            </p>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredCandidates.map((candidate, index) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CandidateCard
                candidate={candidate}
                rank={index + 1}
                isTopPick={index < topPicksCount}
                setCandidates={setCandidates}
                position={position}
                positions={positions}
                language={language}
              />
            </motion.div>
          ))}
        </div>
      )}

      <AddCandidateDialog
        open={addCandidateOpen}
        onOpenChange={setAddCandidateOpen}
        position={position}
        setCandidates={setCandidates}
        positions={positions}
        language={language}
      />
    </div>
  )
}
