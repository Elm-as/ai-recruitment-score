import { useState } from 'react'
import { Position, Candidate } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Users } from '@phosphor-icons/react'
import CreatePositionDialog from './CreatePositionDialog'
import PositionDetailView from './PositionDetailView'
import { motion } from 'framer-motion'

interface PositionsViewProps {
  positions: Position[]
  setPositions: (updater: (prev: Position[]) => Position[]) => void
  candidates: Candidate[]
  setCandidates: (updater: (prev: Candidate[]) => Candidate[]) => void
}

export default function PositionsView({
  positions,
  setPositions,
  candidates,
  setCandidates,
}: PositionsViewProps) {
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)

  const activePositions = positions.filter((p) => p.status === 'active')

  const getCandidateCount = (positionId: string) => {
    return candidates.filter((c) => c.positionId === positionId).length
  }

  if (selectedPosition) {
    return (
      <PositionDetailView
        position={selectedPosition}
        onBack={() => setSelectedPosition(null)}
        candidates={candidates.filter((c) => c.positionId === selectedPosition.id)}
        setCandidates={setCandidates}
        positions={positions}
        setPositions={setPositions}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Active Positions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {activePositions.length} {activePositions.length === 1 ? 'position' : 'positions'} open
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
          <Plus size={18} weight="bold" />
          New Position
        </Button>
      </div>

      {activePositions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Users size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No positions yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
              Create your first job position to start evaluating candidates with AI
            </p>
            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
              <Plus size={18} weight="bold" />
              Create First Position
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activePositions.map((position, index) => {
            const candidateCount = getCandidateCount(position.id)
            return (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg hover:border-accent/50 transition-all duration-300 hover:scale-[1.02]"
                  onClick={() => setSelectedPosition(position)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{position.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {position.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users size={16} />
                        <span>
                          {candidateCount} {candidateCount === 1 ? 'candidate' : 'candidates'}
                        </span>
                      </div>
                      <div className="text-accent font-medium">
                        {position.openings} {position.openings === 1 ? 'opening' : 'openings'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      <CreatePositionDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreatePosition={(position) => {
          setPositions((prev) => [...prev, position])
        }}
      />
    </div>
  )
}
