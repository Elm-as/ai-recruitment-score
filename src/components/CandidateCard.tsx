import { useState } from 'react'
import { Candidate, Position, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  XCircle,
  Sparkle,
  ArrowsLeftRight,
  Trash,
  Briefcase,
  FilePdf,
} from '@phosphor-icons/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import CandidateHeader from './candidate-details/CandidateHeader'
import ScoreBreakdownSection from './candidate-details/ScoreBreakdownSection'
import StrengthsWeaknessesSection from './candidate-details/StrengthsWeaknessesSection'
import QuestionItem from './candidate-details/QuestionItem'
import { generateCandidatePDF } from '@/lib/pdfExport'

interface CandidateCardProps {
  candidate: Candidate
  rank: number
  isTopPick: boolean
  setCandidates: (updater: (prev: Candidate[]) => Candidate[]) => void
  position: Position
  positions: Position[]
  language: Language
}

export default function CandidateCard({
  candidate,
  rank,
  isTopPick,
  setCandidates,
  position,
  positions,
  language,
}: CandidateCardProps) {
  const [generatingQuestions, setGeneratingQuestions] = useState(false)
  const [generatingFollowUp, setGeneratingFollowUp] = useState<number | null>(null)
  const [scoringAnswer, setScoringAnswer] = useState<number | null>(null)

  const generateInterviewQuestions = async () => {
    setGeneratingQuestions(true)
    try {
      const isEnglish = language === 'en'
      const questionsPrompt = (window as any).spark.llmPrompt`Expert technical interviewer: Generate 6-8 TECHNICAL questions only. No behavioral/social/soft skills. Respond in ${isEnglish ? 'ENGLISH' : 'FRENCH'}.

JOB: ${position.title}
REQ: ${position.requirements}

CANDIDATE: ${candidate.name} (${candidate.score}/100)
Strengths: ${candidate.strengths.slice(0, 3).join(', ')}
Weaknesses: ${candidate.weaknesses.slice(0, 3).join(', ')}

Focus: Technical skills, knowledge, problem-solving, experience verification, tools/tech mastery.

Return JSON in ${isEnglish ? 'ENGLISH' : 'FRENCH'}:
{"questions":["q1","q2",...]}`

      console.log('Generating interview questions...')
      const result = await (window as any).spark.llm(questionsPrompt, 'gpt-4o-mini', true)
      console.log('Questions result:', result)
      const data = JSON.parse(result)

      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid response format: missing questions array')
      }

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidate.id
            ? { ...c, interviewQuestions: data.questions }
            : c
        )
      )

      toast.success(t('candidate.questionsGenerated', language))
    } catch (error) {
      console.error('Error generating questions:', error)
      toast.error(t('candidate.questionsError', language))
    } finally {
      setGeneratingQuestions(false)
    }
  }

  const generateFollowUpQuestions = async (questionIndex: number) => {
    const answer = candidate.questionAnswers?.find(
      (a) => a.questionIndex === questionIndex
    )
    if (!answer) return

    setGeneratingFollowUp(questionIndex)
    try {
      const isEnglish = language === 'en'
      const followUpPrompt = (window as any).spark.llmPrompt`Technical interviewer: Generate 3-5 TECHNICAL follow-up questions. No behavioral/social/soft skills. Respond in ${isEnglish ? 'ENGLISH' : 'FRENCH'}.

QUESTION: ${answer.question}
ANSWER: ${answer.answer}

JOB: ${position.title}
CANDIDATE: ${candidate.name}

Focus: Technical depth, understanding, edge cases, implementation details.

Return JSON in ${isEnglish ? 'ENGLISH' : 'FRENCH'}:
{"questions":["q1","q2",...]}`

      console.log('Generating follow-up questions...')
      const result = await (window as any).spark.llm(followUpPrompt, 'gpt-4o-mini', true)
      console.log('Follow-up result:', result)
      const data = JSON.parse(result)

      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Invalid response format: missing questions array')
      }

      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id === candidate.id) {
            const existingFollowUps = c.followUpQuestions || []
            const existingFollowUpIndex = existingFollowUps.findIndex(
              (f) => f.originalQuestionIndex === questionIndex
            )

            let updatedFollowUps
            if (existingFollowUpIndex >= 0) {
              updatedFollowUps = [...existingFollowUps]
              updatedFollowUps[existingFollowUpIndex] = {
                originalQuestionIndex: questionIndex,
                originalQuestion: answer.question,
                originalAnswer: answer.answer,
                followUpQuestions: data.questions,
                generatedAt: Date.now(),
              }
            } else {
              updatedFollowUps = [
                ...existingFollowUps,
                {
                  originalQuestionIndex: questionIndex,
                  originalQuestion: answer.question,
                  originalAnswer: answer.answer,
                  followUpQuestions: data.questions,
                  generatedAt: Date.now(),
                },
              ]
            }

            return { ...c, followUpQuestions: updatedFollowUps }
          }
          return c
        })
      )

      toast.success(t('candidate.followUpGenerated', language))
    } catch (error) {
      console.error('Error generating follow-up questions:', error)
      toast.error(t('candidate.followUpError', language))
    } finally {
      setGeneratingFollowUp(null)
    }
  }

  const scoreAnswer = async (questionIndex: number) => {
    const answer = candidate.questionAnswers?.find(
      (a) => a.questionIndex === questionIndex
    )
    if (!answer) return

    setScoringAnswer(questionIndex)
    try {
      const isEnglish = language === 'en'
      const scoringPrompt = (window as any).spark.llmPrompt`Technical interviewer: Evaluate answer for technical depth, accuracy, completeness. Respond in ${isEnglish ? 'ENGLISH' : 'FRENCH'}.

JOB: ${position.title}
CANDIDATE: ${candidate.name} (${candidate.score}/100)

QUESTION: ${answer.question}
ANSWER: ${answer.answer}

Score 0-100 each:
1. Technical Depth
2. Accuracy
3. Completeness

Return JSON in ${isEnglish ? 'ENGLISH' : 'FRENCH'}:
{
  "technicalDepth":85,
  "accuracy":90,
  "completeness":80,
  "overallScore":85,
  "feedback":"",
  "strengths":[""],
  "improvements":[""]
}`

      console.log('Scoring answer...')
      const result = await (window as any).spark.llm(scoringPrompt, 'gpt-4o-mini', true)
      console.log('Scoring result:', result)
      const scoreData = JSON.parse(result)

      if (typeof scoreData.technicalDepth !== 'number' || typeof scoreData.accuracy !== 'number' || 
          typeof scoreData.completeness !== 'number' || typeof scoreData.overallScore !== 'number') {
        throw new Error('Invalid response format: missing numeric scores')
      }

      setCandidates((prev) =>
        prev.map((c) => {
          if (c.id === candidate.id) {
            const updatedAnswers = (c.questionAnswers || []).map((ans) => {
              if (ans.questionIndex === questionIndex) {
                return {
                  ...ans,
                  aiScore: {
                    technicalDepth: scoreData.technicalDepth,
                    accuracy: scoreData.accuracy,
                    completeness: scoreData.completeness,
                    overallScore: scoreData.overallScore,
                    feedback: scoreData.feedback,
                    strengths: scoreData.strengths,
                    improvements: scoreData.improvements,
                    scoredAt: Date.now(),
                  },
                }
              }
              return ans
            })

            return { ...c, questionAnswers: updatedAnswers }
          }
          return c
        })
      )

      toast.success(t('candidate.answerScored', language))
    } catch (error) {
      console.error('Error scoring answer:', error)
      toast.error(t('candidate.scoringError', language))
    } finally {
      setScoringAnswer(null)
    }
  }

  const markAsSelected = () => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidate.id ? { ...c, status: 'selected' as const } : c))
    )
    toast.success(t('candidate.markedSelected', language))
  }

  const markAsRejected = () => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidate.id ? { ...c, status: 'rejected' as const } : c))
    )
    toast.success(t('candidate.markedRejected', language))
  }

  const markAsHired = () => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidate.id ? { ...c, status: 'hired' as const, hiredAt: Date.now() } : c))
    )
    toast.success(t('candidate.hiredSuccess', language))
  }

  const deleteCandidate = () => {
    if (candidate.status === 'hired') {
      toast.error(t('candidate.cannotDeleteHired', language))
      return
    }

    const deletedCandidate = candidate

    setCandidates((prev) => prev.filter((c) => c.id !== candidate.id))

    toast.success(t('candidate.deleteSuccess', language), {
      action: {
        label: t('common.undo', language),
        onClick: () => {
          setCandidates((prev) => [...prev, deletedCandidate].sort((a, b) => b.createdAt - a.createdAt))
          toast.success(t('common.undoAction', language))
        },
      },
      duration: 5000,
    })
  }

  if (candidate.status === 'analyzing') {
    return (
      <Card className="border-accent/50 bg-accent/5">
        <CardContent className="py-6 sm:py-8">
          <div className="flex items-center justify-center gap-3">
            <Sparkle size={20} className="sm:hidden text-accent animate-pulse" weight="fill" />
            <Sparkle size={24} className="hidden sm:block text-accent animate-pulse" weight="fill" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              {t('candidate.analyzing', language, { name: candidate.name })}
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  const answeredButNotScoredCount = (() => {
    const answered = candidate.questionAnswers?.length || 0
    const scored = candidate.questionAnswers?.filter(qa => qa.aiScore).length || 0
    return answered - scored
  })()

  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.2 }}>
      <Card
        className={`${
          candidate.status === 'hired'
            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
            : candidate.status === 'selected'
            ? 'border-green-500 bg-green-50/50 dark:bg-green-950/20'
            : candidate.status === 'rejected'
            ? 'border-red-300 bg-red-50/50 dark:bg-red-950/20'
            : isTopPick
            ? 'border-accent bg-accent/5'
            : ''
        }`}
      >
        <CardHeader className="pb-2 sm:pb-3">
          <CandidateHeader
            candidate={candidate}
            rank={rank}
            isTopPick={isTopPick}
            language={language}
          />
        </CardHeader>

        <CardContent className="space-y-3 sm:space-y-4">
          <div>
            <p className="text-xs sm:text-sm text-foreground leading-relaxed">{candidate.overallAssessment}</p>
          </div>

          <Accordion type="multiple" className="w-full">
            <ScoreBreakdownSection candidate={candidate} language={language} />
            
            <StrengthsWeaknessesSection candidate={candidate} language={language} />

            {candidate.interviewQuestions && candidate.interviewQuestions.length > 0 && (
              <AccordionItem value="questions">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span>{t('candidate.interviewQuestions', language, { count: candidate.interviewQuestions.length })}</span>
                    {(() => {
                      const answeredCount = candidate.questionAnswers?.length || 0
                      const scoredCount = candidate.questionAnswers?.filter(qa => qa.aiScore).length || 0
                      const pendingScores = answeredCount - scoredCount

                      return (
                        <div className="flex items-center gap-1.5">
                          {answeredCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {answeredCount} {language === 'fr' ? 'réponse(s)' : 'answer(s)'}
                            </Badge>
                          )}
                          {scoredCount > 0 && (
                            <Badge variant="default" className="text-xs bg-accent">
                              {scoredCount} {language === 'fr' ? 'évaluée(s)' : 'scored'}
                            </Badge>
                          )}
                          {pendingScores > 0 && (
                            <Badge variant="outline" className="text-xs border-orange-500 text-orange-600 animate-pulse">
                              {pendingScores} {language === 'fr' ? 'à évaluer' : 'to score'}
                            </Badge>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    {candidate.interviewQuestions.map((question, index) => (
                      <QuestionItem
                        key={index}
                        candidate={candidate}
                        questionIndex={index}
                        question={question}
                        setCandidates={setCandidates}
                        onGenerateFollowUp={generateFollowUpQuestions}
                        onScoreAnswer={scoreAnswer}
                        generatingFollowUp={generatingFollowUp}
                        scoringAnswer={scoringAnswer}
                        language={language}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {candidate.alternativePositions && candidate.alternativePositions.length > 0 && (
              <AccordionItem value="alternatives">
                <AccordionTrigger className="text-sm font-medium hover:no-underline">
                  <div className="flex items-center gap-2">
                    <ArrowsLeftRight size={16} />
                    {t('candidate.alternativePositions', language)}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {candidate.alternativePositions.map((alt, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-muted/30">
                        <h5 className="font-semibold text-sm mb-1">{alt.positionTitle}</h5>
                        <p className="text-xs text-muted-foreground">{alt.reasoning}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          <Separator />

          <div className="flex flex-wrap gap-2">
            {!candidate.interviewQuestions && (
              <Button
                size="sm"
                variant="outline"
                onClick={generateInterviewQuestions}
                disabled={generatingQuestions}
                className="gap-1.5 text-xs sm:text-sm flex-1 xs:flex-initial h-9"
              >
                <Sparkle size={16} weight="fill" />
                <span className="hidden xs:inline">{generatingQuestions ? t('candidate.generating', language) : t('candidate.generateQuestions', language)}</span>
                <span className="xs:hidden">{generatingQuestions ? 'En cours...' : 'Questions'}</span>
              </Button>
            )}

            {candidate.status !== 'selected' && candidate.status !== 'hired' && (
              <Button
                size="sm"
                variant="outline"
                onClick={markAsSelected}
                className="gap-1.5 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 text-xs sm:text-sm flex-1 xs:flex-initial h-9"
              >
                <CheckCircle size={16} weight="bold" />
                <span className="hidden xs:inline">{t('candidate.select', language)}</span>
                <span className="xs:hidden">Sélect.</span>
              </Button>
            )}

            {candidate.status === 'selected' && (
              <Button
                size="sm"
                variant="outline"
                onClick={markAsHired}
                className="gap-1.5 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs sm:text-sm flex-1 xs:flex-initial h-9"
              >
                <Briefcase size={16} weight="bold" />
                <span className="hidden xs:inline">{t('candidate.markAsHired', language)}</span>
                <span className="xs:hidden">Recruté</span>
              </Button>
            )}

            {candidate.status !== 'rejected' && candidate.status !== 'hired' && (
              <Button
                size="sm"
                variant="outline"
                onClick={markAsRejected}
                className="gap-1.5 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs sm:text-sm flex-1 xs:flex-initial h-9"
              >
                <XCircle size={16} weight="bold" />
                <span className="hidden xs:inline">{t('candidate.reject', language)}</span>
                <span className="xs:hidden">Rejeter</span>
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                generateCandidatePDF(candidate, position, language)
                toast.success(language === 'fr' ? 'Export PDF en cours...' : 'Exporting PDF...')
              }}
              className="gap-1.5 text-xs sm:text-sm flex-1 xs:flex-initial h-9"
            >
              <FilePdf size={16} weight="duotone" />
              <span className="hidden xs:inline">{language === 'fr' ? 'Export PDF' : 'Export PDF'}</span>
              <span className="xs:hidden">PDF</span>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={candidate.status === 'hired'}
                  className="gap-1.5 border-destructive text-destructive hover:bg-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm flex-1 xs:flex-initial h-9"
                >
                  <Trash size={16} weight="bold" />
                  <span className="hidden xs:inline">{t('candidate.delete', language)}</span>
                  <span className="xs:hidden">Suppr.</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-base sm:text-lg">{t('candidate.deleteConfirmTitle', language)}</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm">
                    {t('candidate.deleteConfirmDescription', language, { name: candidate.name })}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel className="w-full sm:w-auto">{t('candidate.cancel', language)}</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteCandidate} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto">
                    {t('candidate.confirmDelete', language)}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
