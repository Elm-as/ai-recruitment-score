import { useState, useMemo } from 'react'
import {
  Dialog
  DialogH
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { motion } from 'framer-motion'
import {
  ChartBar,
  Sparkle,
  TrendUp,
  TrendDown,
  CaretDown,
} from '@phosphor-icons/react'
import { Candidate, Language } from '@/lib/types'

interface CompareScoresDialogProps {
  candidates: Candidate[]
  language: Language
}

  const candidatesWithAnswers = useMemo(() => {
      (c) => c.questionAnswers && c.quest
  }, [candidates])

      const newSet = new Set(prev)
        newSet.delete(candida
        newSet.add(candidateId)
     
  }

  }, [candidatesWithAnswers, selectedCandidateIds])
  const comparisonData = useMemo(() => 

      string,
        question: string
          stri
            answer: string
       
              compl
      
   


      candidate.questionAnswers?.forEach((qa) => {


          allQuestions.set(questionKey, 
            candidateAnswers: new Map(),

        const questionData = allQ
          ans
       
        question: string
        candidateAnswers: Map<
          string,
          {
            answer: string
            score: {
              technicalDepth: number
              accuracy: number
              completeness: number
              overallScore: number
              feedback?: string
            }
          }
        >
      }
    >()

    selectedCandidates.forEach((candidate) => {
      candidate.questionAnswers?.forEach((qa) => {
        if (!qa.aiScore) return

        const questionKey = `${qa.questionIndex}`

        if (!allQuestions.has(questionKey)) {
          allQuestions.set(questionKey, {
            question: qa.question,
            candidateAnswers: new Map(),
          })
        }

        const questionData = allQuestions.get(questionKey)!
        questionData.candidateAnswers.set(candidate.id, {
          answer: qa.answer,
          score: {
            technicalDepth: qa.aiScore.technicalDepth,
            accuracy: qa.aiScore.accuracy,
            completeness: qa.aiScore.completeness,
            overallScore: qa.aiScore.overallScore,
            feedback: qa.aiScore.feedback,
          },
        })
      })
    })

    return Array.from(allQuestions.entries()).map(([key, data]) => ({
      questionIndex: parseInt(key),
      question: data.question,
      answers: Array.from(data.candidateAnswers.entries()).map(([candidateId, answerData]) => {
        const candidate = selectedCandidates.find((c) => c.id === candidateId)
        return {
          candidateId,
          candidateName: candidate?.name || 'Unknown',
          ...answerData,
        }
      }),
    }))
  }, [selectedCandidates])

  const candidateOverallStats = useMemo(() => {
    return selectedCandidates
      .map((candidate) => {
        const scoredAnswers =
          candidate.questionAnswers?.filter((qa) => qa.aiScore).map((qa) => qa.aiScore!) || []

        const avgTechnicalDepth =
          scoredAnswers.length > 0
            ? Math.round(
                scoredAnswers.reduce((sum, score) => sum + score.technicalDepth, 0) /
                  scoredAnswers.length
              )
            : 0
        const avgAccuracy =
          scoredAnswers.length > 0
            ? Math.round(
                scoredAnswers.reduce((sum, score) => sum + score.accuracy, 0) / scoredAnswers.length
              )
            : 0
        const avgCompleteness =
          scoredAnswers.length > 0
            ? Math.round(
                scoredAnswers.reduce((sum, score) => sum + score.completeness, 0) /
                  scoredAnswers.length
              )
            : 0
        const averageAnswerScore =
          scoredAnswers.length > 0
            ? Math.round(
                scoredAnswers.reduce((sum, score) => sum + score.overallScore, 0) /
                  scoredAnswers.length
              )
            : 0

        return {
          id: candidate.id,
          name: candidate.name,
          averageAnswerScore,
          answeredCount: scoredAnswers.length,
          avgTechnicalDepth,
          avgAccuracy,
          avgCompleteness,
        }
      })
      .sort((a, b) => b.averageAnswerScore - a.averageAnswerScore)
  }, [selectedCandidates])

  const getBestScoreForQuestion = (
    answers: Array<{ candidateId: string; score: { overallScore: number } }>
  ) => {
    return Math.max(...answers.map((a) => a.score.overallScore))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={candidatesWithAnswers.length < 2}
          className="gap-2"
        >
          <ChartBar size={16} weight="duotone" />
          {t('compareScores.compare', language)}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkle size={24} weight="duotone" className="text-accent" />
            {t('compareScores.title', language)}
          </DialogTitle>
          <DialogDescription>{t('compareScores.description', language)}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] px-6">
          <div className="space-y-6 pb-6">
            <div>
              <h3 className="text-sm font-semibold mb-3">
                {t('compareScores.selectCandidates', language)}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {candidatesWithAnswers.map((candidate) => {
                  const answeredCount =
                    candidate.questionAnswers?.filter((qa) => qa.aiScore).length || 0
                  return (
                    <motion.div
                      key={candidate.id}
                      className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => toggleCandidate(candidate.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Checkbox
                        checked={selectedCandidateIds.has(candidate.id)}
                        onCheckedChange={() => toggleCandidate(candidate.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {answeredCount} {t('compareScores.answersScored', language)}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {selectedCandidates.length < 2 && (
              <div className="text-center py-8 text-muted-foreground">
                <ChartBar size={48} className="mx-auto mb-3 opacity-50" />
                <p>{t('compareScores.selectAtLeastTwo', language)}</p>
              </div>
            )}

            {selectedCandidates.length >= 2 && (
              <>
                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendUp size={20} weight="duotone" />
                    {t('compareScores.overallPerformance', language)}
                  </h3>

                  <div className="grid grid-cols-1 gap-4">
                    {candidateOverallStats.map((stat, index) => (
                      <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-border rounded-lg p-4 bg-card"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge variant={index === 0 ? 'default' : 'secondary'}>
                              #{index + 1}
                            </Badge>
                            <span className="font-semibold">{stat.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-accent">
                              {stat.averageAnswerScore}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t('compareScores.avgScore', language)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {t('compareScores.technicalDepth', language)}
                            </p>
                            <Progress value={stat.avgTechnicalDepth} className="h-2" />
                            <p className="text-xs font-medium mt-1">{stat.avgTechnicalDepth}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {t('compareScores.accuracy', language)}
                            </p>
                            <Progress value={stat.avgAccuracy} className="h-2" />
                            <p className="text-xs font-medium mt-1">{stat.avgAccuracy}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {t('compareScores.completeness', language)}
                            </p>
                            <Progress value={stat.avgCompleteness} className="h-2" />
                            <p className="text-xs font-medium mt-1">{stat.avgCompleteness}%</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
            )}
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ChartBar size={20} weight="duotone" />
                    {t('compareScores.questionByQuestion', language)}
                  </h3>

                  <div className="space-y-4">
                    {comparisonData.map((item) => {
                      const bestScore = getBestScoreForQuestion(item.answers)

                      return (
                        <Collapsible key={item.questionIndex} className="border rounded-lg">
                          <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-3 text-left flex-1">
                              <Badge variant="outline">
                                Question {item.questionIndex + 1}
                              </Badge>
                              <p className="font-medium flex-1">{item.question}</p>
                            </div>
                            <CaretDown size={16} className="shrink-0" />
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="border-t">
                              {item.answers
                                .sort((a, b) => b.score.overallScore - a.score.overallScore)
                                .map((answer, answerIndex) => (
                                  <Collapsible
                                    key={answer.candidateId}
                                    className="border-b last:border-b-0"
                                  >
                                    <div className="p-4 bg-muted/30">
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                          <Badge
                                            variant={
                                              answer.score.overallScore === bestScore
                                                ? 'default'
                                                : 'secondary'
                                            }
                                          >

                                          </Badge>
                                          {answer.score.overallScore === bestScore && (
                                            <TrendUp size={16} className="text-green-500" />
                                          )}
                                          {answer.score.overallScore <
                                            bestScore * 0.7 && (
                                            <TrendDown size={16} className="text-orange-500" />
                                          )}

                                        <div className="text-right">
                                          <p className="text-xl font-bold text-accent">
                                            {answer.score.overallScore}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {t('compareScores.score', language)}
                                          </p>

                                      </div>

                                      <div className="grid grid-cols-3 gap-2 mb-3">
                                        <div>
                                          <p className="text-xs text-muted-foreground mb-1">
                                            {t('compareScores.technicalDepth', language)}
                                          </p>
                                          <Progress
                                            value={answer.score.technicalDepth}
                                            className="h-1.5"
                                          />
                                          <p className="text-xs font-medium mt-0.5">
                                            {answer.score.technicalDepth}%
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-muted-foreground mb-1">
                                            {t('compareScores.accuracy', language)}
                                          </p>
                                          <Progress
                                            value={answer.score.accuracy}
                                            className="h-1.5"
                                          />
                                          <p className="text-xs font-medium mt-0.5">
                                            {answer.score.accuracy}%
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-muted-foreground mb-1">
                                            {t('compareScores.completeness', language)}
                                          </p>
                                          <Progress
                                            value={answer.score.completeness}
                                            className="h-1.5"
                                          />
                                          <p className="text-xs font-medium mt-0.5">
                                            {answer.score.completeness}%
                                          </p>
                                        </div>
                                      </div>

                                      <CollapsibleTrigger className="text-xs text-accent hover:underline">
                                        {t('compareScores.viewDetails', language)}
                                      </CollapsibleTrigger>

                                      <CollapsibleContent className="mt-3 space-y-2">
                                        <div className="text-sm bg-muted/50 p-3 rounded">
                                          <p className="font-medium text-xs text-muted-foreground mb-1">
                                            {t('compareScores.answer', language)}
                                          </p>
                                          <p>{answer.answer}</p>
                                        </div>

                                        {answer.score.feedback && (
                                          <div className="text-sm bg-accent/10 p-3 rounded border border-accent/20">
                                            <p className="font-medium text-xs text-accent mb-1">
                                              {t('compareScores.feedback', language)}
                                            </p>
                                            <p>{answer.score.feedback}</p>
                                          </div>
                                        )}
                                      </CollapsibleContent>
                                    </div>
                                  </Collapsible>
                                ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      )
                    })}
                  </div>
                </div>
              </>

          </div>
        </ScrollArea>
      </DialogContent>

  )

