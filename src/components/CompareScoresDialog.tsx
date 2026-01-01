import { useState, useMemo } from 'react'
import { Candidate, Language } from '@/lib/types'
import {
  Dialog
  DialogH
  DialogTrigger,
import { Button } fr
import { Progre
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
}
export default function CompareScoresDialog({ candi
  const [selectedCandidateIds, setSele

      (c) => c.questionAnswers && c.
  }, [candidates])
  const selectedCand
 

      const newSet = new Set(prev)
        newSet.delete(candidateId)
        newSet.add(candidateId)

  }
  const comparisonData = useM


      candidate.qu

          if (!allQuestions.has(questionKey)
              question: answer.question,
            })

            candidateName: candidate.name,
            score: answer.aiScore,
        }
    })
    return Array.from(allQuestions
      answers:
  }, [selectedCandidates])
  const

      
   

          overallScore: candidate.score,
          answeredCount: 0,

          avgCompleteness: 0,

      const avgAnswerScore = scoredAnswers.redu
      const avgAccuracy = scoredAnswers.reduce((sum, a

        candidateId: candidate.id,
        ov
        answeredCount: scoredAnswers.length,
        avgTechnicalDepth: Math.round(avgTe
        avgCompleteness: Math.round(avgC
              candidateAnswers: new Map(),
            })
          }

          allQuestions.get(questionKey)!.candidateAnswers.set(candidate.id, {
            candidateName: candidate.name,
            answer: answer.answer,
            score: answer.aiScore,
          })
        }
      })
    })

    return Array.from(allQuestions.values()).map((item) => ({
      question: item.question,
      answers: Array.from(item.candidateAnswers.values()),
    }))
  }, [selectedCandidates])

  const overallComparison = useMemo(() => {
    if (selectedCandidates.length === 0) return []

    return selectedCandidates.map((candidate) => {
      const scoredAnswers = candidate.questionAnswers?.filter((a) => a.aiScore) || []
      
      if (scoredAnswers.length === 0) {
        return {
          candidateId: candidate.id,
          candidateName: candidate.name,
          overallScore: candidate.score,
          averageAnswerScore: 0,
          answeredCount: 0,
          totalQuestions: candidate.interviewQuestions?.length || 0,
          avgTechnicalDepth: 0,
          avgAccuracy: 0,
          avgCompleteness: 0,
        }
      }

      const avgAnswerScore = scoredAnswers.reduce((sum, a) => sum + a.aiScore!.overallScore, 0) / scoredAnswers.length
      const avgTechnicalDepth = scoredAnswers.reduce((sum, a) => sum + a.aiScore!.technicalDepth, 0) / scoredAnswers.length
      const avgAccuracy = scoredAnswers.reduce((sum, a) => sum + a.aiScore!.accuracy, 0) / scoredAnswers.length
      const avgCompleteness = scoredAnswers.reduce((sum, a) => sum + a.aiScore!.completeness, 0) / scoredAnswers.length

      return {
        candidateId: candidate.id,
        candidateName: candidate.name,
        overallScore: candidate.score,
        averageAnswerScore: Math.round(avgAnswerScore),
        answeredCount: scoredAnswers.length,
        totalQuestions: candidate.interviewQuestions?.length || 0,
        avgTechnicalDepth: Math.round(avgTechnicalDepth),
        avgAccuracy: Math.round(avgAccuracy),
        avgCompleteness: Math.round(avgCompleteness),
      }
    }).sort((a, b) => b.averageAnswerScore - a.averageAnswerScore)
  }, [selectedCandidates])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-300'
    if (score >= 60) return 'bg-yellow-100 border-yellow-300'
    return 'bg-red-100 border-red-300'
  }

  if (candidatesWithAnswers.length === 0) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 hover:scale-105 transition-transform">
          <ChartBar size={16} weight="duotone" />
          <span className="hidden sm:inline">{t('compareScores.title', language)}</span>
          <span className="sm:hidden">{t('compareScores.titleShort', language)}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{t('compareScores.title', language)}</DialogTitle>
          <DialogDescription className="text-sm">
            {t('compareScores.description', language)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[70vh] pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">{t('compareScores.selectCandidates', language)}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {candidatesWithAnswers.map((candidate) => {
                  const answeredCount = candidate.questionAnswers?.filter((a) => a.aiScore).length || 0
                  const totalQuestions = candidate.interviewQuestions?.length || 0

                  return (
                    <div
                      key={candidate.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCandidateIds.has(candidate.id)
                          ? 'bg-accent/10 border-accent'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => toggleCandidate(candidate.id)}
                    >
                      <Checkbox
                        checked={selectedCandidateIds.has(candidate.id)}
                        onCheckedChange={() => toggleCandidate(candidate.id)}
                        className="h-5 w-5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-muted-foreground shrink-0" />
                          <p className="text-sm font-medium truncate">{candidate.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {answeredCount}/{totalQuestions} {t('compareScores.questionsAnswered', language)}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-bold ${getScoreBgColor(candidate.score)}`}>
                        {candidate.score}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {selectedCandidates.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <ChartBar size={48} className="mx-auto mb-3 opacity-30" weight="duotone" />
                <p className="text-sm">{t('compareScores.selectAtLeastTwo', language)}</p>
              </div>
            )}

            {selectedCandidates.length === 1 && (
              <div className="text-center py-12 text-muted-foreground">
                <ChartBar size={48} className="mx-auto mb-3 opacity-30" weight="duotone" />
                <p className="text-sm">{t('compareScores.selectOneMore', language)}</p>
              </div>
            )}

            {selectedCandidates.length >= 2 && (
              <>
                <Separator />

                <div>
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Sparkle size={16} weight="fill" className="text-accent" />
                    {t('compareScores.overallComparison', language)}
                  </h3>
                  <div className="space-y-3">
                    {overallComparison.map((comp, index) => (
                      <motion.div
                        key={comp.candidateId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {index === 0 && (
                              <Badge className="bg-accent text-accent-foreground text-xs">
                                {t('compareScores.topPerformer', language)}
                              </Badge>
                            )}
                            <h4 className="font-semibold text-sm">{comp.candidateName}</h4>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">{t('compareScores.profileScore', language)}</p>
                              <p className={`text-lg font-bold ${getScoreColor(comp.overallScore)}`}>
                                {comp.overallScore}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">{t('compareScores.avgAnswerScore', language)}</p>
                              <p className={`text-lg font-bold ${getScoreColor(comp.averageAnswerScore)}`}>
                                {comp.averageAnswerScore}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">{t('candidate.technicalDepth', language)}</div>
                            <div className="flex items-center gap-2">
                              <Progress value={comp.avgTechnicalDepth} className="h-1.5 flex-1" />
                              <span className={`text-xs font-semibold ${getScoreColor(comp.avgTechnicalDepth)}`}>
                                {comp.avgTechnicalDepth}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">{t('candidate.accuracy', language)}</div>
                            <div className="flex items-center gap-2">
                              <Progress value={comp.avgAccuracy} className="h-1.5 flex-1" />
                              <span className={`text-xs font-semibold ${getScoreColor(comp.avgAccuracy)}`}>
                                {comp.avgAccuracy}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">{t('candidate.completeness', language)}</div>
                            <div className="flex items-center gap-2">
                              <Progress value={comp.avgCompleteness} className="h-1.5 flex-1" />
                              <span className={`text-xs font-semibold ${getScoreColor(comp.avgCompleteness)}`}>
                                {comp.avgCompleteness}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {comp.answeredCount} {t('compareScores.of', language)} {comp.totalQuestions} {t('compareScores.questionsScored', language)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {comparisonData.length > 0 && (
                  <>
                    <Separator />

                    <div>
                      <h3 className="text-sm font-semibold mb-4">{t('compareScores.questionByQuestion', language)}</h3>
                      <div className="space-y-6">
                        {comparisonData.map((item, qIndex) => (
                          <div key={qIndex} className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-start gap-2">
                              <span className="text-sm font-semibold text-accent shrink-0">Q{qIndex + 1}:</span>
                              <p className="text-sm font-medium">{item.question}</p>
                            </div>

                            <div className="space-y-3">
                              {item.answers
                                .sort((a, b) => b.score.overallScore - a.score.overallScore)
                                .map((answer, aIndex) => (
                                  <div
                                    key={aIndex}
                                    className={`p-3 rounded-lg ${
                                      aIndex === 0 ? 'bg-green-50 border border-green-200' : 'bg-muted/30'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                      <div className="flex items-center gap-2">
                                        <User size={14} className="text-muted-foreground" />
                                        <p className="text-sm font-medium">{answer.candidateName}</p>
                                        {aIndex === 0 && (
                                          <Badge variant="outline" className="text-xs gap-1 border-green-500 text-green-600">
                                            <TrendUp size={12} weight="bold" />
                                            {t('compareScores.best', language)}
                                          </Badge>
                                        )}
                                        {aIndex === item.answers.length - 1 && item.answers.length > 1 && (
                                          <Badge variant="outline" className="text-xs gap-1 border-red-500 text-red-600">
                                            <TrendDown size={12} weight="bold" />
                                            {t('compareScores.needsWork', language)}
                                          </Badge>
                                        )}
                                      </div>
                                      <div className={`text-lg font-bold ${getScoreColor(answer.score.overallScore)}`}>
                                        {answer.score.overallScore}
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mb-2">
                                      <div className="space-y-0.5">
                                        <p className="text-xs text-muted-foreground">{t('candidate.technicalDepth', language)}</p>
                                        <div className="flex items-center gap-1.5">
                                          <Progress value={answer.score.technicalDepth} className="h-1 flex-1" />
                                          <span className={`text-xs font-semibold ${getScoreColor(answer.score.technicalDepth)}`}>
                                            {answer.score.technicalDepth}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-0.5">
                                        <p className="text-xs text-muted-foreground">{t('candidate.accuracy', language)}</p>
                                        <div className="flex items-center gap-1.5">
                                          <Progress value={answer.score.accuracy} className="h-1 flex-1" />
                                          <span className={`text-xs font-semibold ${getScoreColor(answer.score.accuracy)}`}>
                                            {answer.score.accuracy}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-0.5">
                                        <p className="text-xs text-muted-foreground">{t('candidate.completeness', language)}</p>
                                        <div className="flex items-center gap-1.5">
                                          <Progress value={answer.score.completeness} className="h-1 flex-1" />
                                          <span className={`text-xs font-semibold ${getScoreColor(answer.score.completeness)}`}>
                                            {answer.score.completeness}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <details className="text-xs">
                                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground mb-1">
                                        {t('compareScores.viewAnswer', language)}
                                      </summary>
                                      <p className="text-foreground mt-2 pl-2 border-l-2 border-accent whitespace-pre-wrap">
                                        {answer.answer}
                                      </p>
                                      {answer.score.feedback && (
                                        <div className="mt-2 p-2 bg-accent/10 rounded">
                                          <p className="text-foreground">{answer.score.feedback}</p>
                                        </div>
                                      )}
                                    </details>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
      }
    }).sort((a, b) => b.averageAnswerScore - a.averageAnswerScore)
  }, [selectedCandidates])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-300'
    if (score >= 60) return 'bg-yellow-100 border-yellow-300'
    return 'bg-red-100 border-red-300'
  }

  if (candidatesWithAnswers.length === 0) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 hover:scale-105 transition-transform">
          <ChartBar size={16} weight="duotone" />
          <span className="hidden sm:inline">{t('compareScores.title', language)}</span>
          <span className="sm:hidden">{t('compareScores.titleShort', language)}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{t('compareScores.title', language)}</DialogTitle>
          <DialogDescription className="text-sm">
            {t('compareScores.description', language)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-full max-h-[70vh] pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">{t('compareScores.selectCandidates', language)}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {candidatesWithAnswers.map((candidate) => {
                  const answeredCount = candidate.questionAnswers?.filter((a) => a.aiScore).length || 0
                  const totalQuestions = candidate.interviewQuestions?.length || 0

                  return (
                    <div
                      key={candidate.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCandidateIds.has(candidate.id)
                          ? 'bg-accent/10 border-accent'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => toggleCandidate(candidate.id)}
                    >
                      <Checkbox
                        checked={selectedCandidateIds.has(candidate.id)}
                        onCheckedChange={() => toggleCandidate(candidate.id)}
                        className="h-5 w-5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-muted-foreground shrink-0" />
                          <p className="text-sm font-medium truncate">{candidate.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {answeredCount}/{totalQuestions} {t('compareScores.questionsAnswered', language)}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-bold ${getScoreBgColor(candidate.score)}`}>
                        {candidate.score}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {selectedCandidates.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <ChartBar size={48} className="mx-auto mb-3 opacity-30" weight="duotone" />
                <p className="text-sm">{t('compareScores.selectAtLeastTwo', language)}</p>
              </div>
            )}

            {selectedCandidates.length === 1 && (
              <div className="text-center py-12 text-muted-foreground">
                <ChartBar size={48} className="mx-auto mb-3 opacity-30" weight="duotone" />
                <p className="text-sm">{t('compareScores.selectOneMore', language)}</p>
              </div>
            )}

            {selectedCandidates.length >= 2 && (
              <>
                <Separator />

                <div>
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                    <Sparkle size={16} weight="fill" className="text-accent" />
                    {t('compareScores.overallComparison', language)}
                  </h3>
                  <div className="space-y-3">
                    {overallComparison.map((comp, index) => (
                      <motion.div
                        key={comp.candidateId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {index === 0 && (
                              <Badge className="bg-accent text-accent-foreground text-xs">
                                {t('compareScores.topPerformer', language)}
                              </Badge>
                            )}
                            <h4 className="font-semibold text-sm">{comp.candidateName}</h4>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">{t('compareScores.profileScore', language)}</p>
                              <p className={`text-lg font-bold ${getScoreColor(comp.overallScore)}`}>
                                {comp.overallScore}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">{t('compareScores.avgAnswerScore', language)}</p>
                              <p className={`text-lg font-bold ${getScoreColor(comp.averageAnswerScore)}`}>
                                {comp.averageAnswerScore}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">{t('candidate.technicalDepth', language)}</div>
                            <div className="flex items-center gap-2">
                              <Progress value={comp.avgTechnicalDepth} className="h-1.5 flex-1" />
                              <span className={`text-xs font-semibold ${getScoreColor(comp.avgTechnicalDepth)}`}>
                                {comp.avgTechnicalDepth}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">{t('candidate.accuracy', language)}</div>
                            <div className="flex items-center gap-2">
                              <Progress value={comp.avgAccuracy} className="h-1.5 flex-1" />
                              <span className={`text-xs font-semibold ${getScoreColor(comp.avgAccuracy)}`}>
                                {comp.avgAccuracy}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">{t('candidate.completeness', language)}</div>
                            <div className="flex items-center gap-2">
                              <Progress value={comp.avgCompleteness} className="h-1.5 flex-1" />
                              <span className={`text-xs font-semibold ${getScoreColor(comp.avgCompleteness)}`}>
                                {comp.avgCompleteness}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          {comp.answeredCount} {t('compareScores.of', language)} {comp.totalQuestions} {t('compareScores.questionsScored', language)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {comparisonData.length > 0 && (
                  <>
                    <Separator />

                    <div>
                      <h3 className="text-sm font-semibold mb-4">{t('compareScores.questionByQuestion', language)}</h3>
                      <div className="space-y-6">
                        {comparisonData.map((item, qIndex) => (
                          <div key={qIndex} className="border rounded-lg p-4 space-y-4">
                            <div className="flex items-start gap-2">
                              <span className="text-sm font-semibold text-accent shrink-0">Q{qIndex + 1}:</span>
                              <p className="text-sm font-medium">{item.question}</p>
                            </div>

                            <div className="space-y-3">
                              {item.answers
                                .sort((a, b) => b.score.overallScore - a.score.overallScore)
                                .map((answer, aIndex) => (
                                  <div
                                    key={aIndex}
                                    className={`p-3 rounded-lg ${
                                      aIndex === 0 ? 'bg-green-50 border border-green-200' : 'bg-muted/30'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                      <div className="flex items-center gap-2">
                                        <User size={14} className="text-muted-foreground" />
                                        <p className="text-sm font-medium">{answer.candidateName}</p>
                                        {aIndex === 0 && (
                                          <Badge variant="outline" className="text-xs gap-1 border-green-500 text-green-600">
                                            <TrendUp size={12} weight="bold" />
                                            {t('compareScores.best', language)}
                                          </Badge>
                                        )}
                                        {aIndex === item.answers.length - 1 && item.answers.length > 1 && (
                                          <Badge variant="outline" className="text-xs gap-1 border-red-500 text-red-600">
                                            <TrendDown size={12} weight="bold" />
                                            {t('compareScores.needsWork', language)}
                                          </Badge>
                                        )}
                                      </div>
                                      <div className={`text-lg font-bold ${getScoreColor(answer.score.overallScore)}`}>
                                        {answer.score.overallScore}
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mb-2">
                                      <div className="space-y-0.5">
                                        <p className="text-xs text-muted-foreground">{t('candidate.technicalDepth', language)}</p>
                                        <div className="flex items-center gap-1.5">
                                          <Progress value={answer.score.technicalDepth} className="h-1 flex-1" />
                                          <span className={`text-xs font-semibold ${getScoreColor(answer.score.technicalDepth)}`}>
                                            {answer.score.technicalDepth}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-0.5">
                                        <p className="text-xs text-muted-foreground">{t('candidate.accuracy', language)}</p>
                                        <div className="flex items-center gap-1.5">
                                          <Progress value={answer.score.accuracy} className="h-1 flex-1" />
                                          <span className={`text-xs font-semibold ${getScoreColor(answer.score.accuracy)}`}>
                                            {answer.score.accuracy}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-0.5">
                                        <p className="text-xs text-muted-foreground">{t('candidate.completeness', language)}</p>
                                        <div className="flex items-center gap-1.5">
                                          <Progress value={answer.score.completeness} className="h-1 flex-1" />
                                          <span className={`text-xs font-semibold ${getScoreColor(answer.score.completeness)}`}>
                                            {answer.score.completeness}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <details className="text-xs">
                                      <summary className="cursor-pointer text-muted-foreground hover:text-foreground mb-1">
                                        {t('compareScores.viewAnswer', language)}
                                      </summary>
                                      <p className="text-foreground mt-2 pl-2 border-l-2 border-accent whitespace-pre-wrap">
                                        {answer.answer}
                                      </p>
                                      {answer.score.feedback && (
                                        <div className="mt-2 p-2 bg-accent/10 rounded">
                                          <p className="text-foreground">{answer.score.feedback}</p>
                                        </div>
                                      )}
                                    </details>
                                  </div>
                                ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
