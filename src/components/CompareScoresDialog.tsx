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
import { TrendUp, TrendDown, CheckCircle, XCircle } from '@phosphor-icons/react'

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
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t('compare.title', language)}
          </DialogTitle>
          <DialogDescription>
            {t('compare.description', language)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-180px)] pr-4">
          {sortedCandidates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>{t('compare.noData', language)}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedCandidates.map((candidate, index) => {
                const avgScore = getAverageScore(candidate)
                const scoredAnswers = candidate.questionAnswers?.filter(
                  (qa) => qa.aiScore
                )

                return (
                  <Card key={candidate.id} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={index === 0 ? 'default' : 'secondary'}
                            className="text-lg px-3 py-1"
                          >
                            #{index + 1}
                          </Badge>
                          <CardTitle className="text-xl">
                            {candidate.name}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {t('compare.averageScore', language)}:
                          </span>
                          <Badge
                            variant={avgScore >= 80 ? 'default' : avgScore >= 60 ? 'secondary' : 'outline'}
                            className="text-lg px-3 py-1"
                          >
                            {avgScore}%
                          </Badge>
                        </div>
                      </div>
                      <Progress value={avgScore} className="mt-3 h-2" />
                    </CardHeader>

                    <CardContent className="pt-6 space-y-4">
                      {scoredAnswers && scoredAnswers.length > 0 ? (
                        scoredAnswers.map((qa, qaIndex) => (
                          <div key={qaIndex}>
                            <div className="space-y-3">
                              <div>
                                <p className="font-semibold text-sm text-muted-foreground">
                                  {t('compare.question', language)} {qa.questionIndex + 1}
                                </p>
                                <p className="text-sm mt-1">{qa.question}</p>
                              </div>

                              {qa.aiScore && (
                                <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">
                                        {t('compare.technicalDepth', language)}
                                      </p>
                                      <div className="flex items-center gap-2">
                                        <Progress
                                          value={qa.aiScore.technicalDepth}
                                          className="h-2 flex-1"
                                        />
                                        <span className="text-sm font-semibold">
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
                                          className="h-2 flex-1"
                                        />
                                        <span className="text-sm font-semibold">
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
                                          className="h-2 flex-1"
                                        />
                                        <span className="text-sm font-semibold">
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
                                          className="h-2 flex-1"
                                        />
                                        <span className="text-sm font-semibold">
                                          {qa.aiScore.overallScore}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {qa.aiScore.strengths.length > 0 && (
                                    <div>
                                      <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                                        <CheckCircle
                                          size={14}
                                          weight="fill"
                                          className="text-green-600"
                                        />
                                        {t('compare.strengths', language)}
                                      </p>
                                      <ul className="space-y-1">
                                        {qa.aiScore.strengths.map((strength, i) => (
                                          <li
                                            key={i}
                                            className="text-xs text-muted-foreground flex items-start gap-2"
                                          >
                                            <TrendUp
                                              size={12}
                                              className="text-green-600 mt-0.5 shrink-0"
                                            />
                                            <span>{strength}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {qa.aiScore.improvements.length > 0 && (
                                    <div>
                                      <p className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                                        <XCircle
                                          size={14}
                                          weight="fill"
                                          className="text-amber-600"
                                        />
                                        {t('compare.improvements', language)}
                                      </p>
                                      <ul className="space-y-1">
                                        {qa.aiScore.improvements.map((improvement, i) => (
                                          <li
                                            key={i}
                                            className="text-xs text-muted-foreground flex items-start gap-2"
                                          >
                                            <TrendDown
                                              size={12}
                                              className="text-amber-600 mt-0.5 shrink-0"
                                            />
                                            <span>{improvement}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            {qaIndex < scoredAnswers.length - 1 && (
                              <Separator className="mt-4" />
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          {t('compare.noScores', language)}
                        </p>
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
