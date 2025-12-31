import { useState } from 'react'
import { Position, Candidate, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Funnel, Trash, Archive, CheckSquare, Square } from '@phosphor-icons/react'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import AddCandidateDialog from './AddCandidateDialog'
import CandidateCard from './CandidateCard'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'

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
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(new Set())
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)

  const sortedCandidates = [...candidates].sort((a, b) => b.score - a.score)
  
  const filteredCandidates = sortedCandidates.filter((c) => {
    if (filterStatus === 'all') return true
    return c.status === filterStatus
  })

  const topPicksCount = Math.min(position.openings, candidates.length)

  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidateIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(candidateId)) {
        newSet.delete(candidateId)
      } else {
        newSet.add(candidateId)
      }
      return newSet
    })
  }

  const selectAllCandidates = () => {
    setSelectedCandidateIds(new Set(filteredCandidates.map((c) => c.id)))
  }

  const deselectAllCandidates = () => {
    setSelectedCandidateIds(new Set())
  }

  const bulkDeleteCandidates = () => {
    const deletedCandidates = candidates.filter((c) => selectedCandidateIds.has(c.id))
    
    setCandidates((prev) => prev.filter((c) => !selectedCandidateIds.has(c.id)))
    
    const count = selectedCandidateIds.size
    toast.success(t('positionDetail.bulkDeleteSuccess', language, { count }), {
      action: {
        label: t('common.undo', language),
        onClick: () => {
          setCandidates((prev) => [...prev, ...deletedCandidates].sort((a, b) => b.createdAt - a.createdAt))
          toast.success(t('common.undoAction', language))
        },
      },
      duration: 5000,
    })
    
    setSelectedCandidateIds(new Set())
    setBulkDeleteDialogOpen(false)
  }

  const deletePosition = () => {
    const deletedPosition = position
    const deletedCandidates = candidates
    
    setPositions((prev) => prev.filter((p) => p.id !== position.id))
    setCandidates((prev) => prev.filter((c) => c.positionId !== position.id))
    
    toast.success(t('positions.deleteSuccess', language), {
      action: {
        label: t('common.undo', language),
        onClick: () => {
          setPositions((prev) => [...prev, deletedPosition].sort((a, b) => b.createdAt - a.createdAt))
          setCandidates((prev) => [...prev, ...deletedCandidates].sort((a, b) => b.createdAt - a.createdAt))
          toast.success(t('common.undoAction', language))
        },
      },
      duration: 5000,
    })
    
    onBack()
  }

  const archivePosition = () => {
    const archivedPosition = { ...position, status: 'archived' as const, archivedAt: Date.now() }
    
    setPositions((prev) => prev.map((p) => (p.id === position.id ? archivedPosition : p)))
    
    toast.success(t('positions.archiveSuccess', language), {
      action: {
        label: t('common.undo', language),
        onClick: () => {
          setPositions((prev) => prev.map((p) => (p.id === position.id ? position : p)))
          toast.success(t('common.undoAction', language))
        },
      },
      duration: 5000,
    })
    
    setArchiveDialogOpen(false)
    onBack()
  }

  const allFilteredSelected = filteredCandidates.length > 0 && filteredCandidates.every((c) => selectedCandidateIds.has(c.id))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="w-full">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 mb-4 -ml-2 hover:scale-105 transition-transform"
          >
            <ArrowLeft size={18} weight="bold" />
            {t('positionDetail.back', language)}
          </Button>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground break-words">{position.title}</h2>
            <p className="text-sm text-muted-foreground mt-1 break-words">{position.description}</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3">
              <Badge variant="outline" className="gap-1.5 text-xs">
                {position.openings} {position.openings === 1 ? t('positions.openings', language) : t('positions.openings_plural', language)}
              </Badge>
              <Badge variant="secondary" className="gap-1.5 text-xs">
                {candidates.length} {candidates.length === 1 ? t('positions.candidates', language) : t('positions.candidates_plural', language)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-muted-foreground text-muted-foreground hover:bg-muted gap-2">
                <Archive size={16} weight="bold" />
                <span className="hidden xs:inline">{t('positions.archive', language)}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base sm:text-lg">{t('positions.archiveConfirmTitle', language)}</AlertDialogTitle>
                <AlertDialogDescription className="text-sm">
                  {t('positions.archiveConfirmDescription', language, { title: position.title })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="w-full sm:w-auto">{t('positions.cancel', language)}</AlertDialogCancel>
                <AlertDialogAction onClick={archivePosition} className="w-full sm:w-auto">
                  {t('positions.confirmArchive', language)}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-destructive text-destructive hover:bg-destructive/10 gap-2">
                <Trash size={16} weight="bold" />
                <span className="hidden xs:inline">{t('positions.delete', language)}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base sm:text-lg">{t('positions.deleteConfirmTitle', language)}</AlertDialogTitle>
                <AlertDialogDescription className="text-sm">
                  {t('positions.deleteConfirmDescription', language, { title: position.title, count: candidates.length })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="w-full sm:w-auto">{t('positions.cancel', language)}</AlertDialogCancel>
                <AlertDialogAction onClick={deletePosition} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto">
                  {t('positions.confirmDelete', language)}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button onClick={() => setAddCandidateOpen(true)} size="sm" className="gap-2 hover:scale-105 transition-transform flex-1 sm:flex-initial">
            <Plus size={16} weight="bold" />
            {t('positionDetail.addCandidate', language)}
          </Button>
        </div>
      </div>

      {candidates.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-2 overflow-x-auto">
            <Funnel size={18} className="text-muted-foreground shrink-0" weight="duotone" />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px] sm:w-[200px]">
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
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedCandidateIds.size > 0 && (
              <>
                <Badge variant="secondary" className="gap-1.5 text-xs">
                  {selectedCandidateIds.size === 1 
                    ? t('positionDetail.selectedCount', language, { count: selectedCandidateIds.size })
                    : t('positionDetail.selectedCount_plural', language, { count: selectedCandidateIds.size })
                  }
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBulkDeleteDialogOpen(true)}
                  className="gap-1.5 border-destructive text-destructive hover:bg-destructive/10 text-xs sm:text-sm"
                >
                  <Trash size={14} weight="bold" />
                  <span className="hidden xs:inline">{t('positionDetail.bulkDelete', language)}</span>
                  <span className="xs:hidden">Supprimer</span>
                </Button>
              </>
            )}
            {filteredCandidates.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={allFilteredSelected ? deselectAllCandidates : selectAllCandidates}
                className="gap-1.5 text-xs sm:text-sm"
              >
                {allFilteredSelected ? (
                  <>
                    <Square size={14} weight="bold" />
                    <span className="hidden xs:inline">{t('positionDetail.deselectAll', language)}</span>
                    <span className="xs:hidden">Désélect.</span>
                  </>
                ) : (
                  <>
                    <CheckSquare size={14} weight="bold" />
                    <span className="hidden xs:inline">{t('positionDetail.selectAll', language)}</span>
                    <span className="xs:hidden">Tout</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {filteredCandidates.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-2 border-dashed rounded-lg p-8 sm:p-12 text-center bg-muted/20"
        >
          <p className="text-muted-foreground text-base sm:text-lg">
            {candidates.length === 0
              ? t('positionDetail.noCandidates', language)
              : 'Aucun candidat ne correspond au filtre sélectionné.'}
          </p>
          {candidates.length === 0 && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
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
              className="flex items-start gap-2 sm:gap-3"
            >
              <div className="pt-4 sm:pt-6">
                <Checkbox
                  checked={selectedCandidateIds.has(candidate.id)}
                  onCheckedChange={() => toggleCandidateSelection(candidate.id)}
                  className="h-5 w-5 sm:h-5 sm:w-5"
                />
              </div>
              <div className="flex-1 min-w-0">
                <CandidateCard
                  candidate={candidate}
                  rank={index + 1}
                  isTopPick={index < topPicksCount}
                  setCandidates={setCandidates}
                  position={position}
                  positions={positions}
                  language={language}
                />
              </div>
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

      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">{t('positionDetail.bulkDeleteConfirmTitle', language)}</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {t('positionDetail.bulkDeleteConfirmDescription', language, { count: selectedCandidateIds.size })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">{t('positions.cancel', language)}</AlertDialogCancel>
            <AlertDialogAction onClick={bulkDeleteCandidates} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto">
              {t('positions.confirmDelete', language)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
