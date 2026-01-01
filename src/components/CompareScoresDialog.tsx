import { useState, useMemo } from 'react'
  Dialog
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/compo
import { Check
import { Button 
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
  CaretDown,
import {

  candidat
}
export defau
  const [sel
  const candidatesWithAnswers 
      (c) => c.questionAnswers && c.questionAnswe
  }, [candidates])

      const newSet = new Set(prev)
        newSet.delete(can
        newSet.add(c
 

  const selectedCandidates = useMemo(() => {
  }, [candidatesWithAnswers, selectedCand
  const comparisonData = useMemo(() => {

  const candidatesWithAnswers = useMemo(() => {
    return candidates.filter(
      (c) => c.questionAnswers && c.questionAnswers.some((qa) => qa.aiScore)
    )
  }, [candidates])

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
    const allQuestions = new Map<
      string,
      {
        question: string
        candidateAnswers: Map<
          string,
          {
        const questionData
          answer: qa
            technicalDepth: qa.aiSco
            completeness: qa.a
            feedback: qa.aiScore.f
        })
    })
    return Ar
      quest
        c
       
       

  }, [selectedCandidates])
  const candidateOverallStats = useMemo(() => {
      .map((candidate) => {

        const avgTechnicalDepth =

                  scoredAnswers.length
            : 0
          scoredAnswers.length > 0
                scoredAnswers.reduce((su
            
         

              )
        const averageAnswerScore =
            ? Math.round(
                  
            : 0
        return {
          name: candidate.name,
          answeredCount: scoredAnswers.length,
          avgAccuracy,
        }
      .sor

    an


    <Dialog open={open} onOpenChang
        <Button
          size="sm"
          className="gap-2"
          <Chart
        </Button>
      <DialogContent className="max-w-6xl max-h-[90vh]
          <DialogTitle c
         
         

          <div className="

              </h3>
                {candidatesWi
                    candida
                    <motion.d
                      className="flex items-center gap-3 p-3 border border-border rounded-lg h

                    >
                        checked={s
                      />
                        <p className="font-medium truncate">{candidate.name}</p>
                          {answeredCou
               
               
              </div>

              <div classN
                <p>{t('compareScores.selectAtLeastTwo', language)}</p>
            )}
            {se
                <Separator />
                <div>
                    <Tren
                  </h3>
                  <div className="grid
               
               
                        transition
                      >
                         
                              #{index + 1}
                            <span clas
               
               

                
                        </d
                        <div cl
                            <
                            </p>
                            
                      
                          
         
        
                            <p className="text-xs text-muted-foreg
                          

                        </div>
                    ))}
        
                <Separator />
   

          
                  <div className="space-y-4">
                      const b
               
                          <
                   
                              </Badge>
                           
         
                          <CollapsibleContent>
                              {item.answers
                 
                      
                                  >
                                      <div 
                                          <Badge
                                              answer.score.overallScore ==
                                                
                        
                                          </Badge>
                       

                                            <TrendDown size={1
                                        </
                 
                                            {answer.score
                                          <p className="text-xs
                   
                                      </div>
                                      <div className="grid 
                                       
                                          </p>
                          
                               
                                        
                                        </div>
                                          <p className="text-xs tex
                                          </p>
                                            valu
                     
                               
                                        </div>
                                          <p className="text-xs text-muted-fo
                        
                                            value={ans
                                          />
                                            {answer.score.completenes
                                        </div>

                            

                   
                   
                    


                                              {
                                            <p>{answer.score.feedback}
                                        )}
                                    </div>
                    
              

                  </div>
              </
          </div>

  )
























































                  </div>






























                                .map((answer) => (














                                            {answer.candidateName}








                                        </div>








                                        </div>









































































            )}



    </Dialog>

}
