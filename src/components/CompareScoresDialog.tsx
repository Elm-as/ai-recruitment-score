import { Candidate, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendUp, TrendDown, CheckCircle, XCircle, Sparkle } from '@phosphor-icons/react'

interface CompareScoresDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidates: Candidate[]
  language: Language
}

export default function CompareScoresDialog({
  open,
  onOpenChange,
  candidates,
  language,
}: CompareScoresDialogProps) {
  const candidatesWithAnswers = candidates.filter(
    (c) => c.questionAnswers && c.questionAnswers.length > 0
  )

  const getAverageScore = (candidate: Candidate) => {
    if (!candidate.questionAnswers || candidate.questionAnswers.length === 0) {
      return 0
    }
    const scoredAnswers = candidate.questionAnswers.filter((qa) => qa.aiScore)
    if (scoredAnswers.length === 0) return 0

    const sum = scoredAnswers.reduce(
      (acc, qa) => acc + (qa.aiScore?.overallScore || 0),
      0
    )
    return Math.round(sum / scoredAnswers.length)
  }

  const sortedCandidates = [...candidatesWithAnswers].sort(
    (a, b) => getAverageScore(b) - getAverageScore(a)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] md:max-w-3xl lg:max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl font-bold break-words">
            {t('compare.title', language)}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {t('compare.description', language)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-140px)] sm:h-[calc(90vh-160px)] md:h-[calc(90vh-180px)] pr-2 sm:pr-4">
          {sortedCandidates.length === 0 ? (
            <div className="text-center py-8 sm:py-12 space-y-3 sm:space-y-4 px-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted flex items-center justify-center">
                  <Sparkle size={24} className="sm:hidden text-muted-foreground" weight="duotone" />
                  <Sparkle size={32} className="hidden sm:block text-muted-foreground" weight="duotone" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-base sm:text-lg font-semibold text-foreground">
                  {language === 'fr' ? 'Aucune évaluation disponible' : 'No Evaluations Available'}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                  {language === 'fr' 
                    ? 'Pour comparer les scores, vous devez d\'abord : 1) Générer des questions d\'entretien, 2) Enregistrer les réponses des candidats, 3) Évaluer ces réponses avec l\'IA.' 
                    : 'To compare scores, you need to: 1) Generate interview questions, 2) Record candidate answers, 3) Evaluate those answers with AI.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {sortedCandidates.map((candidate, index) => {
                const avgScore = getAverageScore(candidate)
                const scoredAnswers = candidate.questionAnswers?.filter(
                  (qa) => qa.aiScore
                )

                return (
                  <Card key={candidate.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-3 p-3 sm:p-6">
                      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <Badge
                            variant={index === 0 ? 'default' : 'secondary'}
                            className="text-sm sm:text-lg px-2 py-0.5 sm:px-3 sm:py-1 shrink-0"
                          >
                            #{index + 1}
                          </Badge>
                          <CardTitle className="text-base sm:text-xl break-words">
                            {candidate.name}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                            {t('compare.averageScore', language)}:
                          </span>
                          <Badge
                            variant={avgScore >= 80 ? 'default' : avgScore >= 60 ? 'secondary' : 'outline'}
                            className="text-sm sm:text-lg px-2 py-0.5 sm:px-3 sm:py-1"
                          >
                            {avgScore}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={avgScore} className="mt-2 sm:mt-3 h-1.5 sm:h-2" />
                    </CardHeader>

                    <CardContent className="pt-4 sm:pt-6 space-y-3 sm:space-y-4 p-3 sm:p-6">
                      {scoredAnswers && scoredAnswers.length > 0 ? (
                        scoredAnswers.map((qa, qaIndex) => (
                          <div key={qaIndex}>
                            <div className="space-y-2 sm:space-y-3">
                              <div>
                                <p className="font-semibold text-xs sm:text-sm text-muted-foreground">
                                  {t('compare.question', language)} {qa.questionIndex + 1}
                                </p>
                                <p className="text-xs sm:text-sm mt-1 break-words leading-relaxed">{qa.question}</p>
                              </div>

                              {qa.aiScore && (
                                <div className="space-y-2 sm:space-y-3 bg-muted/30 p-3 sm:p-4 rounded-lg">
                                  <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">
                                        {t('compare.technicalDepth', language)}
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <Progress
                                          value={qa.aiScore.technicalDepth}
                                          className="h-1.5 sm:h-2 flex-1"
                                        />
                                        <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                                          {qa.aiScore.technicalDepth}%
                                        </span>
                                      </div>
                                    </div>

                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">
                                        {t('compare.accuracy', language)}
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <Progress
                                          value={qa.aiScore.accuracy}
                                          className="h-1.5 sm:h-2 flex-1"
                                        />
                                        <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                                          {qa.aiScore.accuracy}%
                                        </span>
                                      </div>
                                    </div>

                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">
                                        {t('compare.completeness', language)}
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <Progress
                                          value={qa.aiScore.completeness}
                                          className="h-1.5 sm:h-2 flex-1"
                                        />
                                        <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                                          {qa.aiScore.completeness}%
                                        </span>
                                      </div>
                                    </div>

                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">
                                        {t('compare.overall', language)}
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <Progress
                                          value={qa.aiScore.overallScore}
                                          className="h-1.5 sm:h-2 flex-1"
                                        />
                                        <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                                          {qa.aiScore.overallScore}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {qa.aiScore.strengths.length > 0 && (
                                    <div>
                                      <p className="text-xs font-semibold text-foreground mb-1.5 sm:mb-2 flex items-center gap-1">
                                        <CheckCircle
                                          size={12}
                                          weight="fill"
                                          className="sm:hidden text-green-600"
                                        />
                                        <CheckCircle
                                          size={14}
                                          weight="fill"
                                          className="hidden sm:block text-green-600"
                                        />
                                        {t('compare.strengths', language)}
                                      </p>
                                      <ul className="space-y-1">
                                        {qa.aiScore.strengths.map((strength, i) => (
                                          <li
                                            key={i}
                                            className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed"
                                          >
                                            <TrendUp
                                              size={12}
                                              className="text-green-600 mt-0.5 shrink-0"
                                            />
                                            <span className="break-words">{strength}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {qa.aiScore.improvements.length > 0 && (
                                    <div>
                                      <p className="text-xs font-semibold text-foreground mb-1.5 sm:mb-2 flex items-center gap-1">
                                        <XCircle
                                          size={12}
                                          weight="fill"
                                          className="sm:hidden text-amber-600"
                                        />
                                        <XCircle
                                          size={14}
                                          weight="fill"
                                          className="hidden sm:block text-amber-600"
                                        />
                                        {t('compare.improvements', language)}
                                      </p>
                                      <ul className="space-y-1">
                                        {qa.aiScore.improvements.map((improvement, i) => (
                                          <li
                                            key={i}
                                            className="text-xs text-muted-foreground flex items-start gap-2 leading-relaxed"
                                          >
                                            <TrendDown
                                              size={12}
                                              className="text-amber-600 mt-0.5 shrink-0"
                                            />
                                            <span className="break-words">{improvement}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            {qaIndex < scoredAnswers.length - 1 && (
                              <Separator className="mt-3 sm:mt-4" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 sm:py-6 space-y-2">
                          <p className="text-sm font-semibold text-foreground">
                            {language === 'fr' ? 'Aucune réponse évaluée' : 'No Scored Answers'}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {language === 'fr' 
                              ? 'Ce candidat a des réponses qui n\'ont pas encore été évaluées par l\'IA.' 
                              : 'This candidate has answers that haven\'t been scored by AI yet.'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
