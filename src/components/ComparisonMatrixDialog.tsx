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
      <DialogContent className="max-w-[95vw] max-h-[90vh] w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-8">
            <span className="text-lg sm:text-xl md:text-2xl">
              {language === 'fr' ? 'Matrice de Comparaison' : 'Comparison Matrix'}
            </span>
            <Button
              onClick={handleExportComparison}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <FilePdf size={16} weight="duotone" />
              <span className="hidden sm:inline">
                {language === 'fr' ? 'Exporter PDF' : 'Export PDF'}
              </span>
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4">
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

        <ScrollArea className="h-[calc(90vh-16rem)]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead className="sticky top-0 bg-muted z-10">
                <tr>
                  <th className="border border-border p-3 text-left font-semibold min-w-[120px]">
                    {language === 'fr' ? 'Critère' : 'Criteria'}
                  </th>
                  {displayCandidates.map((candidate, index) => (
                    <th key={candidate.id} className="border border-border p-3 text-left min-w-[200px]">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm truncate">
                            #{index + 1} {candidate.name}
                          </span>
                        </div>
                        <Badge className={getScoreBadgeColor(candidate.score)}>
                          {candidate.score}/100
                        </Badge>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="border border-border p-3 font-medium bg-muted/50">
                    {language === 'fr' ? 'Statut' : 'Status'}
                  </td>
                  {displayCandidates.map((candidate) => (
                    <td key={candidate.id} className="border border-border p-3">
                      <Badge variant={getStatusBadgeVariant(candidate.status)} className="capitalize">
                        {candidate.status}
                      </Badge>
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="border border-border p-3 font-medium bg-muted/50">
                    Email
                  </td>
                  {displayCandidates.map((candidate) => (
                    <td key={candidate.id} className="border border-border p-3 text-sm">
                      {candidate.email}
                    </td>
                  ))}
                </tr>

                {displayCandidates[0]?.scoreBreakdown.map((_, categoryIndex) => (
                  <tr key={categoryIndex} className="hover:bg-muted/50 transition-colors">
                    <td className="border border-border p-3 font-medium bg-muted/50">
                      {displayCandidates[0].scoreBreakdown[categoryIndex].category}
                    </td>
                    {displayCandidates.map((candidate) => {
                      const breakdown = candidate.scoreBreakdown[categoryIndex]
                      return (
                        <td key={candidate.id} className="border border-border p-3">
                          <div className="flex flex-col gap-1">
                            <Badge variant="outline" className="w-fit">
                              {breakdown?.score || 0}/100
                            </Badge>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {breakdown?.reasoning || '-'}
                            </p>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}

                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="border border-border p-3 font-medium bg-muted/50 align-top">
                    <div className="flex items-center gap-2">
                      <TrendUp size={16} weight="duotone" className="text-emerald-600" />
                      {language === 'fr' ? 'Forces' : 'Strengths'}
                    </div>
                  </td>
                  {displayCandidates.map((candidate) => (
                    <td key={candidate.id} className="border border-border p-3">
                      <ul className="space-y-1">
                        {candidate.strengths.slice(0, 3).map((strength, idx) => (
                          <li key={idx} className="text-xs text-foreground flex items-start gap-1">
                            <span className="text-emerald-600 mt-0.5">•</span>
                            <span className="line-clamp-2">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="border border-border p-3 font-medium bg-muted/50 align-top">
                    <div className="flex items-center gap-2">
                      <TrendDown size={16} weight="duotone" className="text-amber-600" />
                      {language === 'fr' ? 'Faiblesses' : 'Weaknesses'}
                    </div>
                  </td>
                  {displayCandidates.map((candidate) => (
                    <td key={candidate.id} className="border border-border p-3">
                      <ul className="space-y-1">
                        {candidate.weaknesses.slice(0, 3).map((weakness, idx) => (
                          <li key={idx} className="text-xs text-foreground flex items-start gap-1">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span className="line-clamp-2">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="border border-border p-3 font-medium bg-muted/50 align-top">
                    {language === 'fr' ? 'Évaluation Globale' : 'Overall Assessment'}
                  </td>
                  {displayCandidates.map((candidate) => (
                    <td key={candidate.id} className="border border-border p-3">
                      <p className="text-xs text-muted-foreground line-clamp-4">
                        {candidate.overallAssessment}
                      </p>
                    </td>
                  ))}
                </tr>

                {displayCandidates.some(c => c.questionAnswers && c.questionAnswers.length > 0) && (
                  <tr className="hover:bg-muted/50 transition-colors">
                    <td className="border border-border p-3 font-medium bg-muted/50 align-top">
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
                        <td key={candidate.id} className="border border-border p-3">
                          <Badge variant="outline" className="w-fit">
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
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {language === 'fr' ? 'Fermer' : 'Close'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
