import { useState, useMemo } from 'react'
import { t } from '@/lib/translations'
import { t } from '@/lib/translations'
import {
  DialogD
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { motion } from 'framer-motion'
import {
  language:
  User,
export def
  TrendUp,

  CaretDown,
      (c) => c.questionAnswers


  candidates: Candidate[]
  }, [candidatesWith
}

export default function CompareScoresDialog({ candidates, language }: CompareScoresDialogProps) {
        newSet.delete(candidateId)
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(new Set())

  const candidatesWithAnswers = useMemo(() => {
    return candidates.filter(
      (c) => c.questionAnswers && c.questionAnswers.length > 0 && c.questionAnswers.some((a) => a.aiScore)
    i
  }, [candidates])


        if (!allQuestions.has(questionKey)) {
            question: qa.question,


        questionData.candidateAnswers.s
          answer: qa.answer,
            technicalDepth: qa.aiSco
            completeness: qa.aiSco
            fe
        })
    })
    return Array.fr
      
  }

      }))
  }, [selectedCandidates])


      .map((c
       
            ? Math.round
                  scoredAnswer
            : 0
          s
                scoredAnswers.red
              )
        const avgCom
            ? Math.round(
                  scoredAnswer
            : 0
          scoredAnswers.length > 0
                scoredAnswers.r
             

         
       
       

          avgCompleteness,
      })
  }, [selectedCandidates])

    if (score >= 60) return 'text-yellow-600'
  }
  const getBestScoreForQuestion = (answer
  }
  return (
          })
        }

      <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogTitle className="text-2xl font-bold flex
            {t('compareScores.title', la
          <DialogDescription
          </Dialog

          <div className="space-y-6">
              <h3 className="text-lg font-semibold
              </h3>
                {candidatesWithAnswers.map
            
          
      })
    })

    return Array.from(allQuestions.entries())
      .map(([questionIndex, data]) => ({
        questionIndex: parseInt(questionIndex),
        question: data.question,
        answers: Array.from(data.candidateAnswers.entries()).map(([candidateId, answerData]) => ({
          candidateId,
          ...answerData,
        })),
      }))
      .sort((a, b) => a.questionIndex - b.questionIndex)
  }, [selectedCandidates])

  const overallComparison = useMemo(() => {
    if (selectedCandidates.length === 0) return []

            {selectedCandidat
                <div>
                    <Sparkle size={20} weight="duotone" />
                  </h3>
                    {overallCompar
                        k
                        animate={{ opacity: 1, x: 0 }}
                        className="bor
               
               
                           
                                <B
                         
                              )}
                          </div>
               
               
                              {
                          </div>

                          <div>
                              <span cl
               
               
                            </div>
                            <p cla
                         
                          </div>
                          <div classNa
               
               

        return {
          candidateId: candidate.id,
          candidateName: candidate.name,
          overallScore: candidate.score,
                             
                              </div>
          totalQuestions: candidate.interviewQuestions?.length || 0,
                            
                      
                          
        }
        
                              </span>
  }, [selectedCandidates])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBestScoreForQuestion = (answers: typeof comparisonData[0]['answers']) => {
    return Math.max(...answers.map((a) => a.score.overallScore))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={candidatesWithAnswers.length < 2}>
          <ChartBar size={18} weight="duotone" />
          {t('compareScores.titleShort', language)}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ChartBar size={24} weight="duotone" />
            {t('compareScores.title', language)}
          </DialogTitle>
          <DialogDescription>
            {t('compareScores.description', language)}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {t('compareScores.selectCandidates', language)}
              </h3>
              <div className="grid gap-2">
                {candidatesWithAnswers.map((candidate) => {
                  const scoredCount =
                    candidate.questionAnswers?.filter((a) => a.aiScore).length || 0
                  return (
                    <motion.div
                      key={candidate.id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => toggleCandidate(candidate.id)}
                    >
                      <Checkbox
                        checked={selectedCandidateIds.has(candidate.id)}
                        onCheckedChange={() => toggleCandidate(candidate.id)}
                      />
                      <User size={18} weight="duotone" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{candidate.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {scoredCount} {t('compareScores.questionsAnswered', language)}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {candidate.score}/100
                      </Badge>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {selectedCandidates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {t('compareScores.selectAtLeastTwo', language)}
              </div>
            )}

            {selectedCandidates.length === 1 && (
              <div className="text-center py-8 text-muted-foreground">
                {t('compareScores.selectOneMore', language)}
              </div>
            )}

            {selectedCandidates.length >= 2 && (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkle size={20} weight="duotone" />
                    {t('compareScores.overallComparison', language)}
                  </h3>
                  <div className="grid gap-4">
                    {overallComparison.map((comp, index) => (
                      <motion.div
                        key={comp.candidateId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-4 bg-card"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <User size={18} weight="duotone" />
                            <div className="min-w-0">
                              <p className="font-semibold truncate">{comp.candidateName}</p>
                              {index === 0 && (
                                <Badge variant="default" className="text-xs gap-1 mt-1">
                                  <TrendUp size={12} />
                                  {t('compareScores.topPerformer', language)}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs text-muted-foreground">
                              {t('compareScores.profileScore', language)}
                            </p>
                            <p className={`text-lg font-bold ${getScoreColor(comp.overallScore)}`}>
                              {comp.overallScore}/100
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-sm font-medium">
                                {t('compareScores.avgAnswerScore', language)}
                              </span>
                              <span className={`text-sm font-semibold ${getScoreColor(comp.averageAnswerScore)}`}>
                                {comp.averageAnswerScore}/100
                              </span>
                            </div>
                            <Progress value={comp.averageAnswerScore} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-1">
                              {comp.answeredCount} {t('compareScores.of', language)} {comp.totalQuestions}{' '}
                              {t('compareScores.questionsScored', language)}
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1 text-left">
                                <p className="text-xs text-muted-foreground">
                                  {t('candidate.technicalDepth', language)}
                                </p>
                                <Progress value={comp.avgTechnicalDepth} className="h-1.5 mt-1" />
                              </div>
                              <span className="text-sm font-semibold shrink-0">
                                {comp.avgTechnicalDepth}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1 text-left">
                                <p className="text-xs text-muted-foreground">
                                  {t('candidate.accuracy', language)}
                                </p>
                                <Progress value={comp.avgAccuracy} className="h-1.5 mt-1" />
                              </div>
                              <span className="text-sm font-semibold shrink-0">
                                {comp.avgAccuracy}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="flex-1 text-left">
                                <p className="text-xs text-muted-foreground">
                                  {t('candidate.completeness', language)}
                                </p>
                                <Progress value={comp.avgCompleteness} className="h-1.5 mt-1" />
                              </div>
                              <span className="text-sm font-semibold shrink-0">
                                {comp.avgCompleteness}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                </div>

                {comparisonData.length > 0 && (

                    <Separator />

                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <ChartBar size={20} weight="duotone" />
                        {t('compareScores.questionByQuestion', language)}
                      </h3>
                      <div className="space-y-4">
                        {comparisonData.map((item, qIndex) => {

                          return (
                            <Collapsible key={qIndex} className="border rounded-lg">
                              <CollapsibleTrigger className="w-full p-4 hover:bg-accent/50 transition-colors">
                                <div className="flex items-start gap-3 text-left">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium mb-1">
                                      Question {item.questionIndex + 1}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {item.question}
                                    </p>
                                  </div>
                                  <CaretDown size={20} className="shrink-0 text-muted-foreground" />

                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="border-t p-4 space-y-3">

                                    .sort((a, b) => b.score.overallScore - a.score.overallScore)
                                    .map((answer) => (
                                      <div
                                        key={answer.candidateId}
                                        className="border rounded-lg p-3 bg-card/50"

                                        <div className="flex items-center gap-2 mb-2">
                                          <User size={16} weight="duotone" />
                                          <p className="font-medium text-sm flex-1">

                                          </p>
                                          {answer.score.overallScore === bestScore && (
                                            <Badge variant="default" className="text-xs gap-1">
                                              <TrendUp size={12} />
                                              {t('compareScores.best', language)}
                                            </Badge>
                                          )}
                                          {answer.score.overallScore < 50 && (
                                            <Badge variant="outline" className="text-xs gap-1">
                                              <TrendDown size={12} />
                                              {t('compareScores.needsWork', language)}
                                            </Badge>
                                          )}


                                        <div className={`text-lg font-bold mb-2 ${getScoreColor(answer.score.overallScore)}`}>
                                          {answer.score.overallScore}/100
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 mb-3">
                                          <div>
                                            <p className="text-xs text-muted-foreground">
                                              {t('candidate.technicalDepth', language)}

                                            <div className="flex items-center gap-1.5">
                                              <Progress value={answer.score.technicalDepth} className="h-1.5" />
                                              <span className={`text-xs font-semibold ${getScoreColor(answer.score.technicalDepth)}`}>
                                                {answer.score.technicalDepth}
                                              </span>
                                            </div>
                                          </div>

                                            <p className="text-xs text-muted-foreground">
                                              {t('candidate.accuracy', language)}

                                            <div className="flex items-center gap-1.5">
                                              <Progress value={answer.score.accuracy} className="h-1.5" />
                                              <span className={`text-xs font-semibold ${getScoreColor(answer.score.accuracy)}`}>
                                                {answer.score.accuracy}
                                              </span>
                                            </div>
                                          </div>
                                          <div>
                                            <p className="text-xs text-muted-foreground">
                                              {t('candidate.completeness', language)}
                                            </p>
                                            <div className="flex items-center gap-1.5">
                                              <Progress value={answer.score.completeness} className="h-1.5" />
                                              <span className={`text-xs font-semibold ${getScoreColor(answer.score.completeness)}`}>
                                                {answer.score.completeness}
                                              </span>
                                            </div>
                                          </div>



                                          <CollapsibleTrigger className="text-xs text-primary hover:underline">
                                            {t('compareScores.viewAnswer', language)}
                                          </CollapsibleTrigger>
                                          <CollapsibleContent className="mt-2 space-y-2">
                                            <div className="text-sm bg-muted/50 p-2 rounded">
                                              <p className="text-xs text-muted-foreground mb-1">
                                                {t('candidate.answerPlaceholder', language).replace('...', '')}:

                                              <p className="text-foreground">{answer.answer}</p>

                                            {answer.score.feedback && (

                                                <p className="text-xs text-muted-foreground mb-1">
                                                  {t('candidate.aiFeedback', language)}:
                                                </p>
                                                <p className="text-foreground">{answer.score.feedback}</p>
                                              </div>

                                          </CollapsibleContent>
                                        </Collapsible>

                                    ))}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          )
                        })}
                      </div>

                  </>
                )}
              </>

          </div>
        </ScrollArea>
      </DialogContent>

  )

