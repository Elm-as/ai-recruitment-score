import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Candidate, Position, Language } from '@/lib/types'
import { X, FilePdf, TrendUp, TrendDown } from '@phosphor-icons/react'
import { generateComparisonPDF } from '@/lib/pdfExport'
import { motion } from 'framer-motion'

interface ComparisonMatrixDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidates: Candidate[]
  position: Position
  language: Language
}

export function ComparisonMatrixDialog({
  open,
  onOpenChange,
  candidates,
  position,
  language
}: ComparisonMatrixDialogProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  
  const sortedCandidates = [...candidates]
    .filter(c => c.status !== 'pending')
    .sort((a, b) => b.score - a.score)

  const toggleCandidate = (id: string) => {
    setSelectedCandidates(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    )
  }

  const handleExportComparison = () => {
    const candidatesToExport = selectedCandidates.length > 0
      ? sortedCandidates.filter(c => selectedCandidates.includes(c.id))
      : sortedCandidates.slice(0, 5)
    
    generateComparisonPDF(candidatesToExport, position, language)
  }

  const displayCandidates = selectedCandidates.length > 0
    ? sortedCandidates.filter(c => selectedCandidates.includes(c.id))
    : sortedCandidates.slice(0, 5)

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500 text-white'
    if (score >= 60) return 'bg-blue-500 text-white'
    if (score >= 40) return 'bg-amber-500 text-white'
    return 'bg-red-500 text-white'
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'hired': return 'default'
      case 'selected': return 'secondary'
      case 'rejected': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full p-0 flex flex-col max-h-[90vh] overflow-hidden">
        <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 border-b shrink-0">
          <DialogHeader>
            <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pr-8">
              <span className="text-lg sm:text-xl md:text-2xl">
                {language === 'fr' ? 'Matrice de Comparaison' : 'Comparison Matrix'}
              </span>
              <Button
                onClick={handleExportComparison}
                variant="outline"
                size="sm"
                className="gap-2 shrink-0"
              >
                <FilePdf size={16} weight="duotone" />
                <span className="hidden sm:inline">
                  {language === 'fr' ? 'Exporter PDF' : 'Export PDF'}
                </span>
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              {language === 'fr' 
                ? 'Sélectionnez les candidats à comparer (max 5 affichés par défaut)' 
                : 'Select candidates to compare (max 5 displayed by default)'}
            </p>
            <div className="flex flex-wrap gap-2">
              {sortedCandidates.map((candidate) => (
                <Button
                  key={candidate.id}
                  onClick={() => toggleCandidate(candidate.id)}
                  variant={selectedCandidates.includes(candidate.id) ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs"
                >
                  {candidate.name}
                </Button>
              ))}
              {selectedCandidates.length > 0 && (
                <Button
                  onClick={() => setSelectedCandidates([])}
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                >
                  {language === 'fr' ? 'Effacer' : 'Clear'}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-4 sm:px-6 py-4">
          <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
            <table className="w-full border-collapse table-fixed" style={{ minWidth: '600px' }}>
              <colgroup>
                <col style={{ width: '140px' }} />
                {displayCandidates.map((_, index) => (
                  <col key={index} style={{ width: `${Math.max(180, (95 * window.innerWidth / 100 - 140) / displayCandidates.length)}px` }} />
                ))}
              </colgroup>
              <thead className="sticky top-0 bg-background z-10 shadow-sm">
                <tr>
                  <th className="border border-border p-2 sm:p-3 text-left font-semibold text-xs sm:text-sm bg-muted/50">
                    {language === 'fr' ? 'Critère' : 'Criteria'}
                  </th>
                  {displayCandidates.map((candidate, index) => (
                    <th key={candidate.id} className="border border-border p-2 sm:p-3 text-left bg-muted/30">
                      <div className="flex flex-col gap-1.5 sm:gap-2">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-semibold text-xs sm:text-sm truncate" title={candidate.name}>
                            #{index + 1} {candidate.name}
                          </span>
                        </div>
                        <Badge className={`${getScoreBadgeColor(candidate.score)} text-xs`}>
                          {candidate.score}/100
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="border border-border p-2 sm:p-3 font-medium bg-muted/50 text-xs sm:text-sm">
                    {language === 'fr' ? 'Statut' : 'Status'}
                  </td>
                  {displayCandidates.map((candidate) => (
                    <td key={candidate.id} className="border border-border p-2 sm:p-3">
                      <Badge variant={getStatusBadgeVariant(candidate.status)} className="capitalize text-xs">
                        {candidate.status}
                      </Badge>
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="border border-border p-2 sm:p-3 font-medium bg-muted/50 text-xs sm:text-sm">
                    Email
                  </td>
                  {displayCandidates.map((candidate) => (
                    <td key={candidate.id} className="border border-border p-2 sm:p-3 text-xs">
                      <div className="break-words" title={candidate.email}>
                        {candidate.email}
                      </div>
                    </td>
                  ))}
                </tr>

                {displayCandidates[0]?.scoreBreakdown.map((_, categoryIndex) => (
                  <tr key={categoryIndex} className="hover:bg-muted/50 transition-colors">
                    <td className="border border-border p-2 sm:p-3 font-medium bg-muted/50 text-xs sm:text-sm align-top">
                      <div className="break-words">
                        {displayCandidates[0].scoreBreakdown[categoryIndex].category}
                      </div>
                    </td>
                    {displayCandidates.map((candidate) => {
                      const breakdown = candidate.scoreBreakdown[categoryIndex]
                      return (
                        <td key={candidate.id} className="border border-border p-2 sm:p-3 align-top">
                          <div className="flex flex-col gap-1">
                            <Badge variant="outline" className="w-fit text-xs">
                              {breakdown?.score || 0}/100
                            </Badge>
                            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight break-words">
                              {breakdown?.reasoning || '-'}
                            </p>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}

                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="border border-border p-2 sm:p-3 font-medium bg-muted/50 align-top text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <TrendUp size={14} weight="duotone" className="text-emerald-600 shrink-0" />
                      <span className="break-words">{language === 'fr' ? 'Forces' : 'Strengths'}</span>
                    </div>
                  </td>
                  {displayCandidates.map((candidate) => (
                    <td key={candidate.id} className="border border-border p-2 sm:p-3 align-top">
                      <ul className="space-y-1">
                        {candidate.strengths.slice(0, 3).map((strength, idx) => (
                          <li key={idx} className="text-[10px] sm:text-xs text-foreground flex items-start gap-1">
                            <span className="text-emerald-600 mt-0.5 shrink-0">•</span>
                            <span className="leading-tight break-words">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="border border-border p-2 sm:p-3 font-medium bg-muted/50 align-top text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <TrendDown size={14} weight="duotone" className="text-amber-600 shrink-0" />
                      <span className="break-words">{language === 'fr' ? 'Faiblesses' : 'Weaknesses'}</span>
                    </div>
                  </td>
                  {displayCandidates.map((candidate) => (
                    <td key={candidate.id} className="border border-border p-2 sm:p-3 align-top">
                      <ul className="space-y-1">
                        {candidate.weaknesses.slice(0, 3).map((weakness, idx) => (
                          <li key={idx} className="text-[10px] sm:text-xs text-foreground flex items-start gap-1">
                            <span className="text-amber-600 mt-0.5 shrink-0">•</span>
                            <span className="leading-tight break-words">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="border border-border p-2 sm:p-3 font-medium bg-muted/50 align-top text-xs sm:text-sm">
                    {language === 'fr' ? 'Évaluation Globale' : 'Overall Assessment'}
                  </td>
                  {displayCandidates.map((candidate) => (
                    <td key={candidate.id} className="border border-border p-2 sm:p-3 align-top">
                      <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight break-words">
                        {candidate.overallAssessment}
                      </p>
                    </td>
                  ))}
                </tr>

                {displayCandidates.some(c => c.questionAnswers && c.questionAnswers.length > 0) && (
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="border border-border p-2 sm:p-3 font-medium bg-muted/50 align-top text-xs sm:text-sm">
                      {language === 'fr' ? 'Score Moyen Q&R' : 'Avg Q&A Score'}
                    </td>
                    {displayCandidates.map((candidate) => {
                      const avgScore = candidate.questionAnswers?.length
                        ? candidate.questionAnswers
                            .filter(qa => qa.aiScore)
                            .reduce((sum, qa) => sum + (qa.aiScore?.overallScore || 0), 0) /
                          candidate.questionAnswers.filter(qa => qa.aiScore).length
                        : 0
                      return (
                        <td key={candidate.id} className="border border-border p-2 sm:p-3 align-top">
                          <Badge variant="outline" className="w-fit text-xs">
                            {avgScore.toFixed(1)}/100
                          </Badge>
                        </td>
                      )
                    })}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-4 sm:px-6 py-3 sm:py-4 border-t shrink-0 bg-background">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {language === 'fr' ? 'Fermer' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
