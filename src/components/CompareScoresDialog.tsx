import { useState, useMemo } from 'react'
import { Candidate, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import {
  DialogC
  DialogHeader,
  DialogTrigger,
import { Button
import { Progr
import { ScrollA
import { ChartBar, User, Sparkl

  candidates: Candidate[]
}
export default function CompareScoresDialog({ candida
  const [selectedCandidateIds, setSelectedCandidateIds] 
import { Checkbox } from '@/components/ui/checkbox'
import { ChartBar, User, Sparkle, TrendUp, TrendDown } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface CompareScoresDialogProps {
  candidates: Candidate[]
  language: Language
}

export default function CompareScoresDialog({ candidates, language }: CompareScoresDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<Set<string>>(new Set())

  const candidatesWithAnswers = useMemo(() => {
    return candidates.filter(
      (c) => c.questionAnswers && c.questionAnswers.some((a) => a.aiScore)
    )
  }, [candidates])

  const selectedCandidates = useMemo(() => {
    return candidatesWithAnswers.filter((c) => selectedCandidateIds.has(c.id))
  }, [candidatesWithAnswers, selectedCandidateIds])

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

  const comparisonData = useMemo(() => {
    if (selectedCandidates.length < 2) return []

    const allQuestions = new Map<
      string,
      {
        question: string
        candidateAnswers: Map<
          string,
          {
            candidateName: string
            answer: string
            score: {
              technicalDepth: number
              accuracy: number
              completeness: number
              overallScore: number
              feedback: string
            }
  const ove
        >
      }
    >()

    selectedCandidates.forEach((candidate) => {
      candidate.questionAnswers?.forEach((answer) => {
        if (!answer.aiScore) return

        const questionKey = `${answer.questionIndex}`
        if (!allQuestions.has(questionKey)) {
          allQuestions.set(questionKey, {
            question: answer.question,
            candidateAnswers: new Map(),

         

        allQuestions.get(questionKey)!.candidateAnswers.set(candidate.id, {
          candidateName: candidate.name,
          answer: answer.answer,
          score: answer.aiScore,
        })
        
      

          totalQuestions: candidate.interviewQuestions?.lengt
          avgAccuracy: Math.ro
        }
      .


    return 'text-red-600'


    return selectedCandidates
      .map((candidate) => {
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

        const avgAnswerScore =
          scoredAnswers.reduce((sum, a) => sum + a.aiScore!.overallScore, 0) / scoredAnswers.length
        const avgTechnicalDepth =
          scoredAnswers.reduce((sum, a) => sum + a.aiScore!.technicalDepth, 0) / scoredAnswers.length
        const avgAccuracy =
          scoredAnswers.reduce((sum, a) => sum + a.aiScore!.accuracy, 0) / scoredAnswers.length
        const avgCompleteness =
          scoredAnswers.reduce((sum, a) => sum + a.aiScore!.completeness, 0) / scoredAnswers.length

                
                  return (
                      key={candidate.id}
                        selectedCandidat
          averageAnswerScore: Math.round(avgAnswerScore),
          answeredCount: scoredAnswers.length,
                      <Checkbox
          avgTechnicalDepth: Math.round(avgTechnicalDepth),
          avgAccuracy: Math.round(avgAccuracy),
          avgCompleteness: Math.round(avgCompleteness),
         
      })
      .sort((a, b) => b.averageAnswerScore - a.averageAnswerScore)
              <div classNa

            )}
            {selectedCandidates.length >= 2 
                <Separator />
                <div>
   

                    {overallComparison.map((co
                        key={comp.candidateId}
                        animate={{ opacity: 1, x: 0 }}
                        className="bor
   

                                {t('compare
               
   

          
                              </p>
                            <
                              <p className={`text-lg font-bold ${getScoreColor(comp.averageAnswerSc
                              </p>
                          </div>

                 
                      
                              <span className={`text-xs font-semibold ${
                      
                          </div>
                            <div className="text-
                              <Progress value={comp.av
                              
                       

                            <div className="flex items-ce
                              <span c
                 
                          </div>

                          {comp.answeredCount} {t('compareS
                      </motion.div>
                  </div>

                  <>

                      <h3 className="tex
                        {comparisonData.map((item, qIndex) => (
                            <div className="flex items-start g
                              <p className="text-sm font

                         
                                .map((answer, aIndex) => (
                     
                               
                                  >
                                      <div className="flex items-center gap-2
                                        <p 
                        
                                            {t('compar
                                        )}
                                          <Badge variant="outline" className="text-xs g
                                            {t('compareScores.needsWork', language)}
                              
                                      <div className={`text-lg font-b
                                      </div>

                            
                                        <div className="flex items-center gap-1.5">
                                         
                            
                          
                   
                   
                    
                  

                                        <div clas
                                          <span className={`text-xs fon
                                          </span>
                                      </div>

              

                                        {answer.a
                                      {answer.score.feedback && (
                                          <p className="text-foreground">{answer.score.feed
                                      )}
                    
              

                    </div>
                
            )}

    </Dialog>
}





















































































































































































