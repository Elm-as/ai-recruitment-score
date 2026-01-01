import { useState } from 'react'
import { Candidate, Position, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
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
                  {t('candidate.interviewQuestions', language, { count: candidate.interviewQuestions.length })}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-3 pt-2">
                    {candidate.interviewQuestions.map((question, index) => (
                      <li key={index} className="text-sm text-foreground">
                        <span className="font-semibold text-accent mr-2">{index + 1}.</span>
                        {question}
                      </li>
                    ))}
                  </ul>
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
