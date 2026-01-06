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
      const questionsPrompt = (window as any).spark.llmPrompt`You are an expert technical interviewer. Generate 6-8 targeted TECHNICAL interview questions for this candidate based on their profile and the job requirements.

CRITICAL: Generate ONLY technical questions. Do NOT include:
- Behavioral questions (e.g., "Tell me about a time when...")
- Social questions (e.g., "How do you work in a team?")
- Soft skills questions (e.g., "How do you handle conflict?")
- Cultural fit questions
- Motivation questions

ONLY INCLUDE: Technical skills, technical knowledge, technical problem-solving, technical experience verification, technical capabilities, tools/technologies mastery, and technical challenges.

IMPORTANT: Generate all questions in ${isEnglish ? 'ENGLISH' : 'FRENCH'} language.

JOB POSITION:
${position.title}
${position.description}
Requirements: ${position.requirements}

CANDIDATE:
Name: ${candidate.name}
Score: ${candidate.score}/100
Strengths: ${candidate.strengths.join(', ')}
Weaknesses: ${candidate.weaknesses.join(', ')}
Overall Assessment: ${candidate.overallAssessment}

Profile:
${candidate.profileText}

Generate TECHNICAL questions that:
1. Probe their claimed technical experience and technical skills
2. Address any technical gaps or technical weaknesses identified
3. Verify their technical capabilities with specific tools, languages, frameworks, or technologies
4. Explore their technical achievements and technical problem-solving
5. Test their understanding of technical concepts relevant to the role

Return ONLY valid JSON with a single property "questions" containing an array of question strings in ${isEnglish ? 'ENGLISH' : 'FRENCH'}:
{
  "questions": ["question 1", "question 2", ...]
}`

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
      const followUpPrompt = (window as any).spark.llmPrompt`You are an expert technical interviewer conducting a deep-dive technical interview. Based on the candidate's answer to a technical question, generate 3-5 targeted TECHNICAL follow-up questions.

CRITICAL: Generate ONLY technical follow-up questions. Do NOT include:
- Behavioral questions
- Social questions
- Soft skills questions
- Cultural fit questions

ONLY INCLUDE: Technical depth questions, technical clarification questions, technical problem-solving questions, technical edge-case questions, and technical implementation questions.

IMPORTANT: Generate all questions in ${isEnglish ? 'ENGLISH' : 'FRENCH'} language.

ORIGINAL TECHNICAL QUESTION:
${answer.question}

CANDIDATE'S ANSWER:
${answer.answer}

JOB CONTEXT:
Position: ${position.title}
Key Requirements: ${position.requirements}

CANDIDATE PROFILE:
Strengths: ${candidate.strengths.join(', ')}
Weaknesses: ${candidate.weaknesses.join(', ')}

Generate follow-up TECHNICAL questions that:
1. Probe deeper into the technical details of their answer
2. Test their technical understanding beyond surface-level knowledge
3. Challenge any technical assumptions or technical gaps in their response
4. Explore technical edge cases or technical scenarios related to their answer
5. Verify technical expertise with specific implementation details

Return ONLY valid JSON with a single property "questions" containing an array of follow-up question strings in ${isEnglish ? 'ENGLISH' : 'FRENCH'}:
{
  "questions": ["follow-up question 1", "follow-up question 2", ...]
}`

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
      const scoringPrompt = (window as any).spark.llmPrompt`You are an expert technical interviewer evaluating a candidate's answer to a technical interview question. Assess the answer for technical depth, accuracy, and completeness.

IMPORTANT: Provide all feedback in ${isEnglish ? 'ENGLISH' : 'FRENCH'} language.

JOB POSITION:
${position.title}
${position.description}
Requirements: ${position.requirements}

CANDIDATE PROFILE:
Name: ${candidate.name}
Overall Score: ${candidate.score}/100
Strengths: ${candidate.strengths.join(', ')}
Weaknesses: ${candidate.weaknesses.join(', ')}

TECHNICAL QUESTION:
${answer.question}

CANDIDATE'S ANSWER:
${answer.answer}

Evaluate this answer on the following criteria (each scored 0-100):

1. **Technical Depth**: Does the answer demonstrate deep technical understanding? Does it go beyond surface-level knowledge? Does it show practical experience?

2. **Accuracy**: Is the information provided technically correct? Are there any factual errors or misconceptions?

3. **Completeness**: Does the answer fully address the question? Are important aspects or considerations covered?

Provide:
- Scores for each criterion (0-100)
- An overall score (weighted average)
- Detailed feedback explaining the scores in ${isEnglish ? 'ENGLISH' : 'FRENCH'}
- 2-4 specific strengths of the answer in ${isEnglish ? 'ENGLISH' : 'FRENCH'}
- 2-4 specific areas for improvement in ${isEnglish ? 'ENGLISH' : 'FRENCH'}

Return ONLY valid JSON:
{
  "technicalDepth": 85,
  "accuracy": 90,
  "completeness": 80,
  "overallScore": 85,
  "feedback": "detailed feedback about the answer...",
  "strengths": ["strength 1", "strength 2", ...],
  "improvements": ["improvement 1", "improvement 2", ...]
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
