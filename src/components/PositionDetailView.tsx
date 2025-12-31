import { useState } from 'react'
import { Position, Candidate } from '@/lib/types'
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
}

export default function PositionDetailView({
  position,
  onBack,
  candidates,
  setCandidates,
  positions,
  setPositions,
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
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 mb-4 -ml-2"
          >
            <ArrowLeft size={18} />
            Back to Positions
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-foreground">{position.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{position.description}</p>
            <div className="flex items-center gap-3 mt-3">
              <Badge variant="outline" className="gap-1.5">
                {position.openings} {position.openings === 1 ? 'opening' : 'openings'}
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                {candidates.length} {candidates.length === 1 ? 'candidate' : 'candidates'}
              </Badge>
            </div>
          </div>
        </div>
        <Button onClick={() => setAddCandidateOpen(true)} className="gap-2 shrink-0">
          <Plus size={18} weight="bold" />
          Add Candidate
        </Button>
      </div>

      {candidates.length > 0 && (
        <div className="flex items-center gap-3">
          <Funnel size={18} className="text-muted-foreground" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Candidates</SelectItem>
              <SelectItem value="scored">Scored</SelectItem>
              <SelectItem value="selected">Selected</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="analyzing">Analyzing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {filteredCandidates.length === 0 ? (
        <div className="border-2 border-dashed rounded-lg p-12 text-center">
          <p className="text-muted-foreground">
            {candidates.length === 0
              ? 'No candidates yet. Add your first candidate to start the evaluation process.'
              : 'No candidates match the selected filter.'}
          </p>
        </div>
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
      />
    </div>
  )
}
