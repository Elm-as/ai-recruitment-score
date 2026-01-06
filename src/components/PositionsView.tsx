import { useState } from 'react'
import { Position, Candidate, Language } from '@/lib/types'
import { t, pluralize } from '@/lib/translations'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Users, Archive } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import CreatePositionDialog from './CreatePositionDialog'
import PositionDetailView from './PositionDetailView'
import DateRangeFilter from './DateRangeFilter'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

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
  const [showArchived, setShowArchived] = useState(false)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  const filterByDateRange = (position: Position) => {
    if (!dateRange.from && !dateRange.to) return true
    
    const positionDate = new Date(position.createdAt)
    
    if (dateRange.from && dateRange.to) {
      const from = new Date(dateRange.from)
      from.setHours(0, 0, 0, 0)
      const to = new Date(dateRange.to)
      to.setHours(23, 59, 59, 999)
      return positionDate >= from && positionDate <= to
    }
    
    if (dateRange.from) {
      const from = new Date(dateRange.from)
      from.setHours(0, 0, 0, 0)
      return positionDate >= from
    }
    
    return true
  }

  const activePositions = positions.filter((p) => (p.status === 'active' || !p.status) && filterByDateRange(p))
  const archivedPositions = positions.filter((p) => p.status === 'archived' && filterByDateRange(p))
  
  const displayPositions = showArchived ? archivedPositions : activePositions

  const getCandidateCount = (positionId: string) => {
    return candidates.filter((c) => c.positionId === positionId).length
  }

  const unarchivePosition = (position: Position, e: React.MouseEvent) => {
    e.stopPropagation()
    
    const restoredPosition = { ...position, status: 'active' as const, archivedAt: undefined }
    
    setPositions((prev) => prev.map((p) => (p.id === position.id ? restoredPosition : p)))
    
    toast.success(t('positions.unarchiveSuccess', language), {
      action: {
        label: t('common.undo', language),
        onClick: () => {
          setPositions((prev) => prev.map((p) => (p.id === position.id ? position : p)))
          toast.success(t('common.undoAction', language))
        },
      },
      duration: 5000,
    })
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
    <div className="space-y-4 sm:space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-3 sm:gap-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="w-full sm:w-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground">
              {showArchived ? t('positions.archived', language) : t('positions.title', language)}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
              {showArchived
                ? pluralize('positions.count', archivedPositions.length, language)
                : pluralize('positions.count', activePositions.length, language)
              }
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {archivedPositions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowArchived(!showArchived)}
                className="gap-2 flex-1 sm:flex-initial h-10"
              >
                <Archive size={18} weight="duotone" />
                <span className="hidden xs:inline">{showArchived ? t('positions.hideArchived', language) : t('positions.viewArchived', language)}</span>
                <span className="xs:hidden">{showArchived ? 'Actifs' : 'Archives'}</span>
              </Button>
            )}
            <Button onClick={() => setCreateDialogOpen(true)} size="sm" className="gap-2 hover:scale-105 transition-transform flex-1 sm:flex-initial h-10">
              <Plus size={18} weight="bold" />
              <span className="hidden xs:inline">{t('positions.newPosition', language)}</span>
              <span className="xs:hidden">Nouveau</span>
            </Button>
          </div>
        </div>

        <div className="w-full">
          <DateRangeFilter
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            language={language}
          />
        </div>
      </motion.div>

      {displayPositions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-10 sm:py-12 md:py-16 px-4">
              <div className="rounded-full bg-gradient-to-br from-accent/20 to-primary/20 p-5 sm:p-6 mb-4">
                {showArchived ? (
                  <Archive size={36} className="sm:hidden text-accent" weight="duotone" />
                ) : (
                  <Users size={36} className="sm:hidden text-accent" weight="duotone" />
                )}
                {showArchived ? (
                  <Archive size={40} className="hidden sm:block text-accent" weight="duotone" />
                ) : (
                  <Users size={40} className="hidden sm:block text-accent" weight="duotone" />
                )}
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-center">
                {showArchived ? 'Aucun poste archivé' : t('positions.noPositions', language)}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground text-center max-w-sm mb-4">
                {showArchived 
                  ? 'Les postes archivés apparaîtront ici'
                  : t('positions.noPositionsDesc', language)
                }
              </p>
              {!showArchived && (
                <Button onClick={() => setCreateDialogOpen(true)} className="gap-2" size="sm">
                  <Plus size={18} weight="bold" />
                  {t('positions.createFirst', language)}
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {displayPositions.map((position, index) => {
            const candidateCount = getCandidateCount(position.id)
            return (
              <motion.div
                key={position.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer hover:shadow-xl hover:border-accent/50 transition-all duration-300 h-full ${
                    showArchived ? 'bg-gradient-to-br from-muted/50 to-muted/30' : 'bg-gradient-to-br from-card to-card/50'
                  }`}
                  onClick={() => setSelectedPosition(position)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base sm:text-lg break-words line-clamp-2 leading-snug">{position.title}</CardTitle>
                      {showArchived && (
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {t('positions.archived', language)}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2 text-xs sm:text-sm leading-relaxed">
                      {position.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users size={16} weight="duotone" />
                        <span>
                          {candidateCount} {candidateCount === 1 ? t('positions.candidates', language) : t('positions.candidates_plural', language)}
                        </span>
                      </div>
                      {showArchived ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => unarchivePosition(position, e)}
                          className="gap-1.5 text-xs w-full xs:w-auto h-8"
                        >
                          <Archive size={14} weight="bold" />
                          {t('positions.unarchive', language)}
                        </Button>
                      ) : (
                        <div className="text-accent font-medium px-2.5 sm:px-3 py-1 bg-accent/10 rounded-full text-xs whitespace-nowrap">
                          {position.openings} {position.openings === 1 ? t('positions.openings', language) : t('positions.openings_plural', language)}
                        </div>
                      )}
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
