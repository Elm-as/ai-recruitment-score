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
        <div className="flex gap-2 shrink-0">
          <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="border-muted-foreground text-muted-foreground hover:bg-muted">
                <Archive size={18} weight="bold" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('positions.archiveConfirmTitle', language)}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('positions.archiveConfirmDescription', language, { title: position.title })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('positions.cancel', language)}</AlertDialogCancel>
                <AlertDialogAction onClick={archivePosition}>
                  {t('positions.confirmArchive', language)}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="border-destructive text-destructive hover:bg-destructive/10">
                <Trash size={18} weight="bold" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('positions.deleteConfirmTitle', language)}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('positions.deleteConfirmDescription', language, { title: position.title, count: candidates.length })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('positions.cancel', language)}</AlertDialogCancel>
                <AlertDialogAction onClick={deletePosition} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {t('positions.confirmDelete', language)}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Button onClick={() => setAddCandidateOpen(true)} className="gap-2 hover:scale-105 transition-transform">
            <Plus size={18} weight="bold" />
            {t('positionDetail.addCandidate', language)}
          </Button>
        </div>
      </div>

      {candidates.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
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
          </div>

          <div className="flex items-center gap-2">
            {selectedCandidateIds.size > 0 && (
              <>
                <Badge variant="secondary" className="gap-1.5">
                  {selectedCandidateIds.size === 1 
                    ? t('positionDetail.selectedCount', language, { count: selectedCandidateIds.size })
                    : t('positionDetail.selectedCount_plural', language, { count: selectedCandidateIds.size })
                  }
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBulkDeleteDialogOpen(true)}
                  className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
                >
                  <Trash size={16} weight="bold" />
                  {t('positionDetail.bulkDelete', language)}
                </Button>
              </>
            )}
            {filteredCandidates.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={allFilteredSelected ? deselectAllCandidates : selectAllCandidates}
                className="gap-2"
              >
                {allFilteredSelected ? (
                  <>
                    <Square size={16} weight="bold" />
                    {t('positionDetail.deselectAll', language)}
                  </>
                ) : (
                  <>
                    <CheckSquare size={16} weight="bold" />
                    {t('positionDetail.selectAll', language)}
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
              className="flex items-start gap-3"
            >
              <div className="pt-6">
                <Checkbox
                  checked={selectedCandidateIds.has(candidate.id)}
                  onCheckedChange={() => toggleCandidateSelection(candidate.id)}
                  className="h-5 w-5"
                />
              </div>
              <div className="flex-1">
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
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('positionDetail.bulkDeleteConfirmTitle', language)}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('positionDetail.bulkDeleteConfirmDescription', language, { count: selectedCandidateIds.size })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('positions.cancel', language)}</AlertDialogCancel>
            <AlertDialogAction onClick={bulkDeleteCandidates} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('positions.confirmDelete', language)}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
