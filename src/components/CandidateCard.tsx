import { useState } from 'react'
import { Candidate, Position, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import {
  CheckCircle,
  XCircle,
  Sparkle,
  TrendUp,
  TrendDown,
  ArrowsLeftRight,
  User,
  Envelope,
  Trash,
  ChatCircleDots,
  PencilSimple,
  FloppyDisk,
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
  const [answeringQuestion, setAnsweringQuestion] = useState<number | null>(null)
  const [answerText, setAnswerText] = useState('')
  const [scoringAnswer, setScoringAnswer] = useState<number | null>(null)

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

  const getRankBadgeVariant = (rank: number) => {
    if (rank === 1) return 'default'
    if (rank === 2) return 'secondary'
    if (rank === 3) return 'outline'
    return 'outline'
  }

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

Return a JSON object with a single property "questions" containing an array of question strings in ${isEnglish ? 'ENGLISH' : 'FRENCH'}:
{
  "questions": ["question 1", "question 2", ...]
}`

      const result = await (window as any).spark.llm(questionsPrompt, 'gpt-4o', true)
      const data = JSON.parse(result)

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

  const saveAnswer = (questionIndex: number) => {
    if (!answerText.trim()) return

    const question = candidate.interviewQuestions?.[questionIndex] || ''
    
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidate.id) {
          const existingAnswers = c.questionAnswers || []
          const existingAnswerIndex = existingAnswers.findIndex(
            (a) => a.questionIndex === questionIndex
          )

          let updatedAnswers
          if (existingAnswerIndex >= 0) {
            updatedAnswers = [...existingAnswers]
            updatedAnswers[existingAnswerIndex] = {
              questionIndex,
              question,
              answer: answerText,
              answeredAt: Date.now(),
            }
          } else {
            updatedAnswers = [
              ...existingAnswers,
              {
                questionIndex,
                question,
                answer: answerText,
                answeredAt: Date.now(),
              },
            ]
          }

          return { ...c, questionAnswers: updatedAnswers }
        }
        return c
      })
    )

    setAnsweringQuestion(null)
    setAnswerText('')
    
    toast.success(t('common.save', language), {
      description: language === 'fr' 
        ? 'Cliquez sur "Évaluer la Réponse" pour obtenir une analyse IA détaillée' 
        : 'Click "Score Answer" to get detailed AI analysis',
      duration: 4000,
    })
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

Return a JSON object with a single property "questions" containing an array of follow-up question strings in ${isEnglish ? 'ENGLISH' : 'FRENCH'}:
{
  "questions": ["follow-up question 1", "follow-up question 2", ...]
}`

      const result = await (window as any).spark.llm(followUpPrompt, 'gpt-4o', true)
      const data = JSON.parse(result)

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

Return a JSON object:
{
  "technicalDepth": 85,
  "accuracy": 90,
  "completeness": 80,
  "overallScore": 85,
  "feedback": "detailed feedback about the answer...",
  "strengths": ["strength 1", "strength 2", ...],
  "improvements": ["improvement 1", "improvement 2", ...]
}`

      const result = await (window as any).spark.llm(scoringPrompt, 'gpt-4o', true)
      const scoreData = JSON.parse(result)

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

  const startAnswering = (questionIndex: number) => {
    const existingAnswer = candidate.questionAnswers?.find(
      (a) => a.questionIndex === questionIndex
    )
    setAnsweringQuestion(questionIndex)
    setAnswerText(existingAnswer?.answer || '')
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

  const deleteCandidate = () => {
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
        <CardContent className="py-8">
          <div className="flex items-center justify-center gap-3">
            <Sparkle size={24} className="text-accent animate-pulse" weight="fill" />
            <span className="text-sm text-muted-foreground">
              {t('candidate.analyzing', language, { name: candidate.name })}
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.2 }}>
      <Card
        className={`${
          candidate.status === 'selected'
            ? 'border-green-500 bg-green-50/50'
            : candidate.status === 'rejected'
            ? 'border-red-300 bg-red-50/50'
            : isTopPick
            ? 'border-accent bg-accent/5'
            : ''
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0 w-full sm:w-auto">
              <div className="flex flex-row sm:flex-col gap-1">
                <Badge variant={getRankBadgeVariant(rank)} className="w-fit text-xs">
                  #{rank}
                </Badge>
                {isTopPick && (
                  <Badge className="bg-accent text-accent-foreground w-fit text-xs">
                    {t('candidate.topPick', language)}
                  </Badge>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <User size={14} className="text-muted-foreground shrink-0" />
                  <h3 className="font-semibold text-base sm:text-lg break-words">{candidate.name}</h3>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                  <Envelope size={12} className="shrink-0" />
                  <span className="truncate">{candidate.email}</span>
                </div>
              </div>
            </div>
            <div
              className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 ${getScoreBgColor(
                candidate.score
              )} shrink-0`}
            >
              <div className="text-center">
                <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(candidate.score)}`}>
                  {candidate.score}
                </div>
                <div className="text-xs text-muted-foreground">/ 100</div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-foreground">{candidate.overallAssessment}</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="breakdown">
              <AccordionTrigger className="text-sm font-medium">
                {t('candidate.scoreBreakdown', language)}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {candidate.scoreBreakdown.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.category}</span>
                        <span className={getScoreColor(item.score)}>{item.score}/100</span>
                      </div>
                      <Progress value={item.score} className="h-2" />
                      <p className="text-xs text-muted-foreground">{item.reasoning}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="strengths-weaknesses">
              <AccordionTrigger className="text-sm font-medium">
                {t('candidate.strengthsWeaknesses', language)}
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendUp size={16} className="text-green-600" weight="bold" />
                      <h4 className="text-sm font-semibold text-green-600">{t('candidate.strengths', language)}</h4>
                    </div>
                    <ul className="space-y-1">
                      {candidate.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendDown size={16} className="text-red-600" weight="bold" />
                      <h4 className="text-sm font-semibold text-red-600">{t('candidate.weaknesses', language)}</h4>
                    </div>
                    <ul className="space-y-1">
                      {candidate.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-red-600 mt-0.5">•</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {candidate.interviewQuestions && candidate.interviewQuestions.length > 0 && (
              <AccordionItem value="questions">
                <AccordionTrigger className="text-sm font-medium">
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
                    {candidate.interviewQuestions.map((question, index) => {
                      const answer = candidate.questionAnswers?.find((a) => a.questionIndex === index)
                      const followUp = candidate.followUpQuestions?.find((f) => f.originalQuestionIndex === index)
                      const isAnswering = answeringQuestion === index

                      return (
                        <div key={index} className="border rounded-lg p-3 space-y-3 bg-card">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <p className="text-sm text-foreground flex-1">
                                <span className="font-semibold text-accent mr-2">{index + 1}.</span>
                                {question}
                              </p>
                              {answer && (
                                <Badge 
                                  variant={answer.aiScore ? "default" : "secondary"} 
                                  className="shrink-0 gap-1 text-xs"
                                >
                                  {answer.aiScore ? (
                                    <>
                                      <CheckCircle size={12} weight="fill" />
                                      {language === 'fr' ? 'Évaluée' : 'Scored'}
                                    </>
                                  ) : (
                                    <>
                                      <ChatCircleDots size={12} weight="fill" />
                                      {language === 'fr' ? 'Répondue' : 'Answered'}
                                    </>
                                  )}
                                </Badge>
                              )}
                            </div>

                            {!isAnswering && answer && (
                              <div className="mt-2 space-y-3">
                                <div className="p-3 bg-muted/50 rounded-md space-y-2">
                                  <div className="flex items-center justify-between flex-wrap gap-2">
                                    <p className="text-xs text-muted-foreground">
                                      {t('candidate.answeredOn', language)} {new Date(answer.answeredAt).toLocaleDateString()}
                                    </p>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => startAnswering(index)}
                                      className="h-7 gap-1 text-xs"
                                    >
                                      <PencilSimple size={12} />
                                      {t('candidate.editAnswer', language)}
                                    </Button>
                                  </div>
                                  <p className="text-sm text-foreground whitespace-pre-wrap">{answer.answer}</p>
                                </div>

                                {answer.aiScore && (
                                  <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/30 rounded-lg space-y-3">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                      <div className="flex items-center gap-2">
                                        <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 ${
                                          answer.aiScore.overallScore >= 80 
                                            ? 'bg-green-100 border-green-300' 
                                            : answer.aiScore.overallScore >= 60 
                                            ? 'bg-yellow-100 border-yellow-300' 
                                            : 'bg-red-100 border-red-300'
                                        }`}>
                                          <span className={`text-lg font-bold ${
                                            answer.aiScore.overallScore >= 80 
                                              ? 'text-green-600' 
                                              : answer.aiScore.overallScore >= 60 
                                              ? 'text-yellow-600' 
                                              : 'text-red-600'
                                          }`}>
                                            {answer.aiScore.overallScore}
                                          </span>
                                        </div>
                                        <div>
                                          <h5 className="text-sm font-semibold text-accent flex items-center gap-1.5">
                                            <Sparkle size={16} weight="fill" />
                                            {t('candidate.aiFeedback', language)}
                                          </h5>
                                          <p className="text-xs text-muted-foreground">
                                            {language === 'fr' ? 'Évaluation technique' : 'Technical evaluation'}
                                          </p>
                                        </div>
                                      </div>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => scoreAnswer(index)}
                                        disabled={scoringAnswer === index}
                                        className="h-8 gap-1 text-xs border-accent/30 hover:bg-accent/10"
                                      >
                                        <Sparkle size={12} weight="fill" />
                                        {scoringAnswer === index ? t('candidate.scoringAnswer', language) : t('candidate.rescore', language)}
                                      </Button>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                      <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">{t('candidate.technicalDepth', language)}</div>
                                        <div className="flex items-center gap-2">
                                          <Progress value={answer.aiScore.technicalDepth} className="h-1.5 flex-1" />
                                          <span className={`text-xs font-semibold ${getScoreColor(answer.aiScore.technicalDepth)}`}>
                                            {answer.aiScore.technicalDepth}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">{t('candidate.accuracy', language)}</div>
                                        <div className="flex items-center gap-2">
                                          <Progress value={answer.aiScore.accuracy} className="h-1.5 flex-1" />
                                          <span className={`text-xs font-semibold ${getScoreColor(answer.aiScore.accuracy)}`}>
                                            {answer.aiScore.accuracy}
                                          </span>
                                        </div>
                                      </div>
                                      <div className="space-y-1">
                                        <div className="text-xs text-muted-foreground">{t('candidate.completeness', language)}</div>
                                        <div className="flex items-center gap-2">
                                          <Progress value={answer.aiScore.completeness} className="h-1.5 flex-1" />
                                          <span className={`text-xs font-semibold ${getScoreColor(answer.aiScore.completeness)}`}>
                                            {answer.aiScore.completeness}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <p className="text-xs text-foreground leading-relaxed">{answer.aiScore.feedback}</p>

                                    {answer.aiScore.strengths && answer.aiScore.strengths.length > 0 && (
                                      <div>
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                          <TrendUp size={14} className="text-green-600" weight="bold" />
                                          <h6 className="text-xs font-semibold text-green-600">{t('candidate.answerStrengths', language)}</h6>
                                        </div>
                                        <ul className="space-y-0.5 ml-4">
                                          {answer.aiScore.strengths.map((strength, sIdx) => (
                                            <li key={sIdx} className="text-xs text-foreground flex items-start gap-1.5">
                                              <span className="text-green-600 mt-0.5">•</span>
                                              <span>{strength}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {answer.aiScore.improvements && answer.aiScore.improvements.length > 0 && (
                                      <div>
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                          <TrendDown size={14} className="text-orange-600" weight="bold" />
                                          <h6 className="text-xs font-semibold text-orange-600">{t('candidate.answerImprovements', language)}</h6>
                                        </div>
                                        <ul className="space-y-0.5 ml-4">
                                          {answer.aiScore.improvements.map((improvement, iIdx) => (
                                            <li key={iIdx} className="text-xs text-foreground flex items-start gap-1.5">
                                              <span className="text-orange-600 mt-0.5">•</span>
                                              <span>{improvement}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {!answer.aiScore && (
                                  <div className="p-3 bg-accent/5 border-2 border-dashed border-accent/30 rounded-lg">
                                    <div className="flex items-center justify-between gap-3 flex-wrap">
                                      <div className="flex items-center gap-2">
                                        <Sparkle size={18} weight="fill" className="text-accent shrink-0" />
                                        <div>
                                          <p className="text-sm font-semibold text-foreground">
                                            {language === 'fr' ? 'Évaluation IA disponible' : 'AI Evaluation Available'}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            {language === 'fr' 
                                              ? 'Obtenez une analyse détaillée de cette réponse' 
                                              : 'Get detailed analysis of this answer'}
                                          </p>
                                        </div>
                                      </div>
                                      <Button
                                        size="sm"
                                        onClick={() => scoreAnswer(index)}
                                        disabled={scoringAnswer === index}
                                        className="gap-1.5 text-xs bg-accent hover:bg-accent/90 shrink-0"
                                      >
                                        <Sparkle size={14} weight="fill" />
                                        {scoringAnswer === index
                                          ? t('candidate.scoringAnswer', language)
                                          : t('candidate.scoreAnswer', language)}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {!isAnswering && !answer && (
                              <div className="mt-2 p-3 bg-muted/30 border border-dashed rounded-md">
                                <div className="flex items-center justify-between gap-3 flex-wrap">
                                  <p className="text-xs text-muted-foreground">
                                    {language === 'fr' 
                                      ? 'Aucune réponse enregistrée pour cette question' 
                                      : 'No answer recorded for this question'}
                                  </p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startAnswering(index)}
                                    className="gap-1.5 text-xs"
                                  >
                                    <ChatCircleDots size={14} />
                                    {t('candidate.answerQuestion', language)}
                                  </Button>
                                </div>
                              </div>
                            )}

                            {isAnswering && (
                              <div className="mt-2 space-y-2">
                                <div className="flex items-start gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                                  <Sparkle size={14} className="text-blue-600 shrink-0 mt-0.5" weight="fill" />
                                  <p className="text-xs text-blue-800">
                                    {language === 'fr'
                                      ? 'Après avoir enregistré la réponse, vous pourrez la faire évaluer par l\'IA pour obtenir des scores détaillés et des recommandations.'
                                      : 'After saving the answer, you can have it evaluated by AI to get detailed scores and recommendations.'}
                                  </p>
                                </div>
                                <Textarea
                                  value={answerText}
                                  onChange={(e) => setAnswerText(e.target.value)}
                                  placeholder={t('candidate.answerPlaceholder', language)}
                                  className="min-h-24 text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={() => saveAnswer(index)}
                                    disabled={!answerText.trim()}
                                    className="gap-1.5 text-xs"
                                  >
                                    <FloppyDisk size={14} />
                                    {t('candidate.saveAnswer', language)}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setAnsweringQuestion(null)
                                      setAnswerText('')
                                    }}
                                    className="text-xs"
                                  >
                                    {t('candidate.cancel', language)}
                                  </Button>
                                </div>
                              </div>
                            )}

                            {answer && !isAnswering && (
                              <div className="mt-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => generateFollowUpQuestions(index)}
                                  disabled={generatingFollowUp === index}
                                  className="gap-1.5 text-xs"
                                >
                                  <Sparkle size={14} weight="fill" />
                                  {generatingFollowUp === index
                                    ? t('candidate.generating', language)
                                    : t('candidate.generateFollowUp', language)}
                                </Button>
                              </div>
                            )}

                            {followUp && followUp.followUpQuestions.length > 0 && (
                              <div className="mt-3 pl-4 border-l-2 border-accent space-y-2">
                                <p className="text-xs font-semibold text-accent">
                                  {t('candidate.followUpQuestions', language)}
                                </p>
                                <ul className="space-y-2">
                                  {followUp.followUpQuestions.map((fq, fqIndex) => (
                                    <li key={fqIndex} className="text-sm text-foreground">
                                      <span className="font-semibold text-accent mr-2">
                                        {index + 1}.{fqIndex + 1}
                                      </span>
                                      {fq}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {candidate.alternativePositions && candidate.alternativePositions.length > 0 && (
              <AccordionItem value="alternatives">
                <AccordionTrigger className="text-sm font-medium">
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
                className="gap-1.5 text-xs sm:text-sm"
              >
                <Sparkle size={14} weight="fill" />
                <span className="hidden xs:inline">{generatingQuestions ? t('candidate.generating', language) : t('candidate.generateQuestions', language)}</span>
                <span className="xs:hidden">{generatingQuestions ? 'En cours...' : 'Questions'}</span>
              </Button>
            )}

            {candidate.status !== 'selected' && (
              <Button
                size="sm"
                variant="outline"
                onClick={markAsSelected}
                className="gap-1.5 border-green-500 text-green-600 hover:bg-green-50 text-xs sm:text-sm"
              >
                <CheckCircle size={14} weight="bold" />
                <span className="hidden xs:inline">{t('candidate.select', language)}</span>
                <span className="xs:hidden">Sélect.</span>
              </Button>
            )}

            {candidate.status !== 'rejected' && (
              <Button
                size="sm"
                variant="outline"
                onClick={markAsRejected}
                className="gap-1.5 border-red-500 text-red-600 hover:bg-red-50 text-xs sm:text-sm"
              >
                <XCircle size={14} weight="bold" />
                <span className="hidden xs:inline">{t('candidate.reject', language)}</span>
                <span className="xs:hidden">Rejeter</span>
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 border-destructive text-destructive hover:bg-destructive/10 text-xs sm:text-sm"
                >
                  <Trash size={14} weight="bold" />
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
