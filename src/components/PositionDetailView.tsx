import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Position, Candidate, Language, OrderingPreset } from '@/lib/types'
import { t } from '@/lib/translations'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Funnel, Trash, Archive, CheckSquare, Square, ArrowsLeftRight, Sparkle, Info, EnvelopeSimple, ArrowsDownUp, FloppyDisk, CheckCircle, FilePdf, ChartBar, PencilSimple } from '@phosphor-icons/react'
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
import CompareScoresDialog from './CompareScoresDialog'
import EmailTemplateDialog from './EmailTemplateDialog'
import OrderingPresetsDialog from './OrderingPresetsDialog'
import EditPositionDialog from './EditPositionDialog'
import { ComparisonMatrixDialog } from './ComparisonMatrixDialog'
import { generatePositionReportPDF } from '@/lib/pdfExport'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'
import type { DragEndEvent } from '@dnd-kit/core'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableCandidateItemProps {
  candidate: Candidate
  index: number
  topPicksCount: number
  selectedCandidateIds: Set<string>
  toggleCandidateSelection: (id: string) => void
  setCandidates: (updater: (prev: Candidate[]) => Candidate[]) => void
  position: Position
  positions: Position[]
  language: Language
}

function SortableCandidateItem({
  candidate,
  index,
  topPicksCount,
  selectedCandidateIds,
  toggleCandidateSelection,
  setCandidates,
  position,
  positions,
  language,
}: SortableCandidateItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: candidate.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-2 sm:gap-3"
    >
      <div className="pt-4 sm:pt-5 flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded transition-colors touch-none"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-muted-foreground"
          >
            <circle cx="5" cy="4" r="1" fill="currentColor" />
            <circle cx="5" cy="8" r="1" fill="currentColor" />
            <circle cx="5" cy="12" r="1" fill="currentColor" />
            <circle cx="11" cy="4" r="1" fill="currentColor" />
            <circle cx="11" cy="8" r="1" fill="currentColor" />
            <circle cx="11" cy="12" r="1" fill="currentColor" />
          </svg>
        </div>
        <Checkbox
          checked={selectedCandidateIds.has(candidate.id)}
          onCheckedChange={() => toggleCandidateSelection(candidate.id)}
          className="h-5 w-5"
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
  )
}

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
  const [editPositionOpen, setEditPositionOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(new Set())
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
  const [compareScoresOpen, setCompareScoresOpen] = useState(false)
  const [emailTemplateOpen, setEmailTemplateOpen] = useState(false)
  const [presetsDialogOpen, setPresetsDialogOpen] = useState(false)
  const [comparisonMatrixOpen, setComparisonMatrixOpen] = useState(false)
  const [useCustomOrder, setUseCustomOrder] = useState(false)
  const [activePresetId, setActivePresetId] = useState<string | null>(null)
  const [presets, setPresets] = useKV<OrderingPreset[]>('ordering-presets', [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const sortedCandidates = [...candidates].sort((a, b) => {
    if (useCustomOrder && a.customOrder !== undefined && b.customOrder !== undefined) {
      return a.customOrder - b.customOrder
    }
    return b.score - a.score
  })
  
  const filteredCandidates = sortedCandidates.filter((c) => {
    if (filterStatus === 'all') return true
    return c.status === filterStatus
  })

  const topPicksCount = Math.min(position.openings, candidates.length)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = filteredCandidates.findIndex((c) => c.id === active.id)
      const newIndex = filteredCandidates.findIndex((c) => c.id === over.id)

      const reorderedFiltered = arrayMove(filteredCandidates, oldIndex, newIndex)

      setCandidates((prev) => {
        const updated = prev.map((c) => {
          const newPosition = reorderedFiltered.findIndex((fc) => fc.id === c.id)
          if (newPosition !== -1) {
            return { ...c, customOrder: newPosition }
          }
          return c
        })
        return updated
      })

      if (!useCustomOrder) {
        setUseCustomOrder(true)
      }

      setActivePresetId(null)

      toast.success(language === 'fr' ? 'Ordre des candidats mis à jour' : 'Candidate order updated')
    }
  }

  const resetToScoreOrder = () => {
    setCandidates((prev) =>
      prev.map((c) => {
        const { customOrder, ...rest } = c
        return rest
      })
    )
    setUseCustomOrder(false)
    setActivePresetId(null)
    toast.success(language === 'fr' ? 'Ordre réinitialisé par score' : 'Order reset to score-based')
  }

  const applyPreset = (preset: OrderingPreset) => {
    setCandidates((prev) => {
      return prev.map((c) => {
        const orderIndex = preset.candidateOrder.indexOf(c.id)
        if (orderIndex !== -1) {
          return { ...c, customOrder: orderIndex }
        }
        return c
      })
    })
    setUseCustomOrder(true)
    setActivePresetId(preset.id)
  }

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
    const hiredCount = candidates.filter(c => c.status === 'hired').length
    if (hiredCount > 0) {
      toast.error(t('positions.cannotDeleteLocked', language))
      return
    }

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
    const hiredCount = candidates.filter(c => c.status === 'hired').length
    if (hiredCount > 0) {
      toast.error(t('positions.cannotArchiveLocked', language))
      return
    }

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

  const handleUpdatePosition = (updatedPosition: Position) => {
    setPositions((prev) => prev.map((p) => (p.id === position.id ? updatedPosition : p)))
  }

  const allFilteredSelected = filteredCandidates.length > 0 && filteredCandidates.every((c) => selectedCandidateIds.has(c.id))

  const answeredButNotScoredCount = candidates.reduce((count, candidate) => {
    const answered = candidate.questionAnswers?.length || 0
    const scored = candidate.questionAnswers?.filter(qa => qa.aiScore).length || 0
    return count + (answered - scored)
  }, 0)

  const hiredCandidatesCount = candidates.filter(c => c.status === 'hired').length
  const isPositionLocked = hiredCandidatesCount > 0

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="w-full">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2 mb-3 sm:mb-4 -ml-2 hover:scale-105 transition-transform h-10"
          >
            <ArrowLeft size={20} weight="bold" />
            <span className="text-sm sm:text-base">{t('positionDetail.back', language)}</span>
          </Button>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground break-words leading-tight">{position.title}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-1.5 break-words leading-relaxed">{position.description}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-3">
              <Badge variant="outline" className="gap-1.5 text-xs h-7">
                {position.openings} {position.openings === 1 ? t('positions.openings', language) : t('positions.openings_plural', language)}
              </Badge>
              <Badge variant="secondary" className="gap-1.5 text-xs h-7">
                {candidates.length} {candidates.length === 1 ? t('positions.candidates', language) : t('positions.candidates_plural', language)}
              </Badge>
              {hiredCandidatesCount > 0 && (
                <Badge className="gap-1.5 text-xs bg-blue-500 hover:bg-blue-600 h-7">
                  {hiredCandidatesCount === 1 ? t('positions.hiredCandidates', language, { count: hiredCandidatesCount }) : t('positions.hiredCandidates_plural', language, { count: hiredCandidatesCount })}
                </Badge>
              )}
              {answeredButNotScoredCount > 0 && (
                <Badge className="gap-1.5 text-xs bg-orange-500 hover:bg-orange-600 animate-pulse h-7">
                  {answeredButNotScoredCount} {language === 'fr' ? 'réponse(s) à évaluer' : 'answer(s) to score'}
                </Badge>
              )}
              {isPositionLocked && (
                <Badge variant="outline" className="gap-1.5 text-xs border-blue-500 text-blue-600 h-7">
                  🔒 {t('positions.locked', language)}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 w-full">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setEditPositionOpen(true)}
            className="gap-2 flex-1 xs:flex-initial h-10 hover:bg-primary/10 hover:border-primary"
          >
            <PencilSimple size={18} weight="bold" />
            <span className="hidden xs:inline">{language === 'fr' ? 'Modifier' : 'Edit'}</span>
            <span className="xs:hidden">Éditer</span>
          </Button>
          <AlertDialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={isPositionLocked}
                className="border-muted-foreground text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed gap-2 flex-1 xs:flex-initial h-10"
              >
                <Archive size={18} weight="bold" />
                <span className="hidden xs:inline">{t('positions.archive', language)}</span>
                <span className="xs:hidden">Archiver</span>
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
              <Button 
                variant="outline" 
                size="sm" 
                disabled={isPositionLocked}
                className="border-destructive text-destructive hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed gap-2 flex-1 xs:flex-initial h-10"
              >
                <Trash size={18} weight="bold" />
                <span className="hidden xs:inline">{t('positions.delete', language)}</span>
                <span className="xs:hidden">Supprimer</span>
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
          
          <Button onClick={() => setAddCandidateOpen(true)} size="sm" className="gap-2 hover:scale-105 transition-transform flex-1 xs:flex-initial h-10">
            <Plus size={18} weight="bold" />
            <span className="hidden xs:inline">{t('positionDetail.addCandidate', language)}</span>
            <span className="xs:hidden">Ajouter</span>
          </Button>
        </div>
      </div>

      {candidates.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-3 sm:gap-3"
        >
          {answeredButNotScoredCount > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 rounded-lg"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <Sparkle size={18} className="sm:hidden text-orange-600 shrink-0 mt-0.5" weight="fill" />
                <Sparkle size={20} className="hidden sm:block text-orange-600 shrink-0 mt-0.5" weight="fill" />
                <div className="flex-1 space-y-1">
                  <h4 className="font-semibold text-xs sm:text-sm text-orange-900">
                    {language === 'fr' 
                      ? `${answeredButNotScoredCount} réponse${answeredButNotScoredCount > 1 ? 's' : ''} en attente d'évaluation` 
                      : `${answeredButNotScoredCount} answer${answeredButNotScoredCount > 1 ? 's' : ''} awaiting evaluation`}
                  </h4>
                  <p className="text-xs text-orange-800 leading-relaxed">
                    {language === 'fr' 
                      ? 'Ouvrez les cartes des candidats ci-dessous, développez la section "Questions d\'Entretien" et cliquez sur "Évaluer la Réponse" pour obtenir une analyse IA détaillée.' 
                      : 'Open candidate cards below, expand the "Interview Questions" section and click "Score Answer" to get detailed AI analysis.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {candidates.length > 1 && filteredCandidates.length > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-lg"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <ArrowsDownUp size={18} className="sm:hidden text-blue-600 shrink-0 mt-0.5" weight="duotone" />
                <ArrowsDownUp size={20} className="hidden sm:block text-blue-600 shrink-0 mt-0.5" weight="duotone" />
                <div className="flex-1">
                  <p className="text-xs text-blue-800 leading-relaxed">
                    {language === 'fr' 
                      ? 'Glissez-déposez les candidats pour les réorganiser manuellement. Utilisez la poignée ⋮⋮ à gauche de chaque carte.' 
                      : 'Drag and drop candidates to reorder them manually. Use the ⋮⋮ handle on the left of each card.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 w-full xs:w-auto">
              <Funnel size={18} className="text-muted-foreground shrink-0" weight="duotone" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full xs:w-[180px] sm:w-[200px] h-10">
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

            <div className="flex items-center gap-2 w-full xs:w-auto flex-wrap">
              {useCustomOrder && (
                <Button 
                  onClick={resetToScoreOrder}
                  size="sm"
                  variant="outline"
                  className="gap-2 hover:scale-105 transition-transform flex-1 xs:flex-initial h-10"
                >
                  <ArrowsDownUp size={18} weight="duotone" />
                  <span className="hidden sm:inline">{language === 'fr' ? 'Réinitialiser ordre' : 'Reset order'}</span>
                  <span className="sm:hidden">{language === 'fr' ? 'Réinit.' : 'Reset'}</span>
                </Button>
              )}

              <Button 
                onClick={() => setPresetsDialogOpen(true)}
                size="sm"
                variant={activePresetId ? 'default' : 'outline'}
                className={`gap-2 hover:scale-105 transition-transform flex-1 xs:flex-initial h-10 ${
                  activePresetId ? 'shadow-md ring-2 ring-primary/20' : ''
                }`}
              >
                {activePresetId ? (
                  <CheckCircle size={18} weight="fill" />
                ) : (
                  <FloppyDisk size={18} weight="duotone" />
                )}
                <span className="hidden sm:inline">
                  {activePresetId
                    ? (presets || []).find((p) => p.id === activePresetId)?.name || (language === 'fr' ? 'Presets' : 'Presets')
                    : (language === 'fr' ? 'Presets d\'ordre' : 'Order presets')}
                </span>
                <span className="sm:hidden">{language === 'fr' ? 'Presets' : 'Presets'}</span>
              </Button>

              <Button 
                onClick={() => setEmailTemplateOpen(true)}
                size="sm"
                variant="outline"
                className="gap-2 hover:scale-105 transition-transform flex-1 xs:flex-initial h-10"
              >
                <EnvelopeSimple size={18} weight="duotone" />
                <span className="hidden sm:inline">{t('email.button', language)}</span>
                <span className="sm:hidden">Email</span>
              </Button>

              <Button 
                onClick={() => setCompareScoresOpen(true)}
                size="sm"
                variant="outline"
                className="gap-2 hover:scale-105 transition-transform flex-1 xs:flex-initial h-10"
              >
                <ArrowsLeftRight size={18} weight="bold" />
                <span className="hidden sm:inline">{t('compare.buttonText', language)}</span>
                <span className="sm:hidden">Comparer</span>
              </Button>

              <Button 
                onClick={() => setComparisonMatrixOpen(true)}
                size="sm"
                variant="outline"
                className="gap-2 hover:scale-105 transition-transform flex-1 xs:flex-initial h-10"
              >
                <ChartBar size={18} weight="duotone" />
                <span className="hidden sm:inline">{language === 'fr' ? 'Matrice' : 'Matrix'}</span>
                <span className="sm:hidden">{language === 'fr' ? 'Matrice' : 'Matrix'}</span>
              </Button>

              <Button 
                onClick={() => generatePositionReportPDF(position, candidates, language)}
                size="sm"
                variant="outline"
                className="gap-2 hover:scale-105 transition-transform flex-1 xs:flex-initial h-10"
              >
                <FilePdf size={18} weight="duotone" />
                <span className="hidden sm:inline">{language === 'fr' ? 'Exporter PDF' : 'Export PDF'}</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            </div>

            <CompareScoresDialog 
              open={compareScoresOpen}
              onOpenChange={setCompareScoresOpen}
              candidates={candidates} 
              language={language} 
            />

            <ComparisonMatrixDialog
              open={comparisonMatrixOpen}
              onOpenChange={setComparisonMatrixOpen}
              candidates={candidates}
              position={position}
              language={language}
            />

            <EmailTemplateDialog
              open={emailTemplateOpen}
              onOpenChange={setEmailTemplateOpen}
              candidates={candidates}
              position={position}
              language={language}
            />

            <OrderingPresetsDialog
              open={presetsDialogOpen}
              onOpenChange={setPresetsDialogOpen}
              positionId={position.id}
              candidates={candidates}
              onApplyPreset={applyPreset}
              language={language}
              activePresetId={activePresetId}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedCandidateIds.size > 0 && (
              <>
                <Badge variant="secondary" className="gap-1.5 text-xs h-7">
                  {selectedCandidateIds.size === 1 
                    ? t('positionDetail.selectedCount', language, { count: selectedCandidateIds.size })
                    : t('positionDetail.selectedCount_plural', language, { count: selectedCandidateIds.size })
                  }
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setBulkDeleteDialogOpen(true)}
                  className="gap-1.5 border-destructive text-destructive hover:bg-destructive/10 text-xs sm:text-sm h-8"
                >
                  <Trash size={16} weight="bold" />
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
                className="gap-1.5 text-xs sm:text-sm h-8"
              >
                {allFilteredSelected ? (
                  <>
                    <Square size={16} weight="bold" />
                    <span className="hidden xs:inline">{t('positionDetail.deselectAll', language)}</span>
                    <span className="xs:hidden">Désélect.</span>
                  </>
                ) : (
                  <>
                    <CheckSquare size={16} weight="bold" />
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
          className="border-2 border-dashed rounded-lg p-6 sm:p-8 md:p-12 text-center bg-muted/20"
        >
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filteredCandidates.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3 sm:space-y-4">
              {filteredCandidates.map((candidate, index) => (
                <SortableCandidateItem
                  key={candidate.id}
                  candidate={candidate}
                  index={index}
                  topPicksCount={topPicksCount}
                  selectedCandidateIds={selectedCandidateIds}
                  toggleCandidateSelection={toggleCandidateSelection}
                  setCandidates={setCandidates}
                  position={position}
                  positions={positions}
                  language={language}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <AddCandidateDialog
        open={addCandidateOpen}
        onOpenChange={setAddCandidateOpen}
        position={position}
        setCandidates={setCandidates}
        positions={positions}
        language={language}
      />

      <EditPositionDialog
        open={editPositionOpen}
        onOpenChange={setEditPositionOpen}
        position={position}
        onSave={handleUpdatePosition}
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
