import { useState, useMemo } from 'react'
import { t } from '@/lib/translations'
import {
  Dialog,
  DialogDescript
  DialogTitle,
} from '@/compo
import { Scrol
import { Checkbo
import { Separator } from '@/co
import { motion } from 'framer-motion'
  ChartBar,
  Sparkle,
  TrendDown,
} from '@phosphor-icons/react'

  candidates: Candidate[]
}
export d
  ChartBar,
  const
  Sparkle,
  }, [cand
  TrendDown,
      const 
} from '@phosphor-icons/react'
import { Candidate, Language } from '@/lib/types'

interface CompareScoresDialogProps {

  language: Language


    const allQuestions = new Map<
  const [open, setOpen] = useState(false)
        candidateAnswers: Map<

            score: {
              accuracy: numbe
              overallScore: number
    )
        >

  const toggleCandidate = (candidateId: string) => {
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

  const selectedCandidates = useMemo(() => {
    return candidatesWithAnswers.filter((c) => selectedCandidateIds.has(c.id))
  }, [candidatesWithAnswers, selectedCandidateIds])

  const comparisonData = useMemo(() => {
    if (selectedCandidates.length < 2) return []

    const allQuestions = new Map<
      string,
      {
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

    return selectedCandidates
          allQuestions.set(questionKey, {
          candidate.questionAnswer
            candidateAnswers: new Map(),
          })
        }

        const questionData = allQuestions.get(questionKey)!
        questionData.candidateAnswers.set(candidate.id, {
            ? Math.round(
          score: {
            technicalDepth: qa.aiScore.technicalDepth,
            accuracy: qa.aiScore.accuracy,
            completeness: qa.aiScore.completeness,
            overallScore: qa.aiScore.overallScore,
            feedback: qa.aiScore.feedback,
          },
          
  return
      

                  return (
                      key={candidate.id}
                      className="flex items-cen
                    >
        answers: Array.from(data.candidateAnswers.entries()).map(([candidateId, answerData]) => {
          const candidate = selectedCandidates.find((c) => c.id === candidateId)
          return {
            candidateId,
            candidateName: candidate?.name || 'Unknown',
            ...answerData,
          }
        }),
         
                  )
              </div>

              <div className="text-center p
              </div>

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

                
                                <Pro
                              <span clas
                              </span>
          averageAnswerScore,
          answeredCount: scoredAnswers.length,
                                </p>
          avgTechnicalDepth,
          avgAccuracy,
          avgCompleteness,
         
      })
      .sort((a, b) => b.averageAnswerScore - a.averageAnswerScore)
                          

                          </div>
                      </motion.div>
                  </div>

   

                      <h3 className="text-lg font-semibold mb-4 flex items-center gap
                        {t('compareScores.questionByQuestion', l
   

          
                              <CollapsibleTrigg
                             
                                      Question {item.questionIndex + 1}
                                    <p className=
                                    </p>
                 
                      
                                <div className="border-t
                      
                                      <Collapsible
                                        className="
                                        <div cla
                        
                             
                                            <Badge var
                              
                       

                                              {t('compareS
                                     

                                          {answer.score.o

                   
                                          
                                            <div className=
                                     
                                              </span>
                          
                               
                                        
                                              <Pro
                                                {answer.score.accuracy}
                                            </div>
                     
                               
                                            <div className="flex items-c
                                              <span className={`text-xs font-
                        
                                          </div>

                                          <CollapsibleTrigger className="text-xs
                                          </CollapsibleTrigger>
                                            <div className="text-sm bg-muted/50 p-2 roun
                            
                            
                                            {answer.score.feedback && 
                                             
                              
                                 
                   
                   
                    
                  

                    </div>
                )}
            )}
        </ScrollArea
    </Dialog>





































































































                  </div>



                  <>


                    <div>






                          const bestScore = getBestScoreForQuestion(item.answers)














                                </div>



                                  {item.answers


                                      <Collapsible


                                      >



                                            {answer.candidateName}













                                        </div>









                                            </p>







                                          <div>


                                            </p>


















                                        </div>

                                        <Collapsible>







                                              </p>

                                            </div>

                                              <div className="text-sm bg-muted/50 p-2 rounded">





                                            )}


                                      </Collapsible>







                    </div>



            )}



    </Dialog>

}
