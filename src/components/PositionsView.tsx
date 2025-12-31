import { useState } from 'react'
import { Position, Candidate, Language } from '@/lib/types'
import { t, pluralize } from '@/lib/translations'
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
  language: Language
}

export default function PositionsView({
  positions,
  setPositions,
  candidates,
  setCandidates,
  language,
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
        language={language}
      />
    )
  }

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{t('positions.title', language)}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {pluralize('positions.count', activePositions.length, language)}
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} className="gap-2 hover:scale-105 transition-transform">
          <Plus size={18} weight="bold" />
          {t('positions.newPosition', language)}
        </Button>
      </motion.div>

      {activePositions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-gradient-to-br from-accent/20 to-primary/20 p-6 mb-4">
                <Users size={40} className="text-accent" weight="duotone" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('positions.noPositions', language)}</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm mb-4">
                {t('positions.noPositionsDesc', language)}
              </p>
              <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                <Plus size={18} weight="bold" />
                {t('positions.createFirst', language)}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
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
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-xl hover:border-accent/50 transition-all duration-300 h-full bg-gradient-to-br from-card to-card/50"
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
                        <Users size={16} weight="duotone" />
                        <span>
                          {candidateCount} {candidateCount === 1 ? t('positions.candidates', language) : t('positions.candidates_plural', language)}
                        </span>
                      </div>
                      <div className="text-accent font-medium px-3 py-1 bg-accent/10 rounded-full">
                        {position.openings} {position.openings === 1 ? t('positions.openings', language) : t('positions.openings_plural', language)}
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
        language={language}
      />
    </div>
  )
}
