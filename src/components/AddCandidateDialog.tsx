import { useState } from 'react'
import { Position, Candidate } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { Sparkle } from '@phosphor-icons/react'

interface AddCandidateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  position: Position
  setCandidates: (updater: (prev: Candidate[]) => Candidate[]) => void
  positions: Position[]
}

export default function AddCandidateDialog({
  open,
  onOpenChange,
  position,
  setCandidates,
  positions,
}: AddCandidateDialogProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profileText, setProfileText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)

  const analyzeCandidate = async (candidate: Candidate) => {
    setIsAnalyzing(true)
    setProgress(10)

    try {
      const otherPositions = positions.filter((p) => p.id !== position.id && p.status === 'active')

      const analysisPrompt = spark.llmPrompt`You are an expert HR professional and recruitment specialist. Analyze this candidate profile against the job requirements.

JOB POSITION:
Title: ${position.title}
Description: ${position.description}
Requirements: ${position.requirements}

CANDIDATE PROFILE:
Name: ${candidate.name}
Email: ${candidate.email}
Profile Information:
${candidate.profileText}

Provide a comprehensive evaluation in JSON format with this exact structure:
{
  "score": <number 0-100>,
  "scoreBreakdown": [
    {
      "category": "<category name>",
      "score": <number 0-100>,
      "reasoning": "<brief explanation>"
    }
  ],
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "overallAssessment": "<2-3 sentence summary of candidate fit>"
}

Evaluate at least 4-5 categories such as: Technical Skills, Experience Level, Education Background, Cultural Fit, Communication Skills, etc.
Be specific and reference actual details from the candidate's profile.`

      setProgress(40)

      const analysisResult = await spark.llm(analysisPrompt, 'gpt-4o', true)
      const analysis = JSON.parse(analysisResult)

      setProgress(70)

      let alternativePositions = undefined
      if (otherPositions.length > 0 && analysis.score >= 50 && analysis.score < 80) {
        const alternativesPrompt = spark.llmPrompt`Based on this candidate's profile and their score of ${analysis.score}/100 for the ${position.title} position, evaluate if they might be a better fit for any of these other open positions:

CANDIDATE PROFILE:
${candidate.profileText}

OTHER OPEN POSITIONS:
${otherPositions.map((p) => `- ${p.title}: ${p.description}\n  Requirements: ${p.requirements}`).join('\n\n')}

Return a JSON object with a single property "alternatives" containing an array of suitable alternative positions (empty array if none):
{
  "alternatives": [
    {
      "positionId": "<position id>",
      "positionTitle": "<position title>",
      "reasoning": "<why this position is a better fit>"
    }
  ]
}

Only suggest alternatives if the candidate would score significantly higher (10+ points) for that position.`

        const alternativesResult = await spark.llm(alternativesPrompt, 'gpt-4o', true)
        const alternativesData = JSON.parse(alternativesResult)
        
        if (alternativesData.alternatives && alternativesData.alternatives.length > 0) {
          alternativePositions = alternativesData.alternatives.map((alt: any) => {
            const pos = otherPositions.find((p) => p.title === alt.positionTitle)
            return {
              positionId: pos?.id || alt.positionId,
              positionTitle: alt.positionTitle,
              reasoning: alt.reasoning,
            }
          })
        }
      }

      setProgress(100)

      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidate.id
            ? {
                ...c,
                score: analysis.score,
                scoreBreakdown: analysis.scoreBreakdown,
                strengths: analysis.strengths,
                weaknesses: analysis.weaknesses,
                overallAssessment: analysis.overallAssessment,
                alternativePositions,
                status: 'scored' as const,
                analyzedAt: Date.now(),
              }
            : c
        )
      )

      toast.success('Candidate analyzed successfully', {
        description: `Score: ${analysis.score}/100`,
      })
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Failed to analyze candidate', {
        description: 'Please try again',
      })
      setCandidates((prev) => prev.filter((c) => c.id !== candidate.id))
    } finally {
      setIsAnalyzing(false)
      setProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !profileText.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    const newCandidate: Candidate = {
      id: `cand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      positionId: position.id,
      name: name.trim(),
      email: email.trim(),
      profileText: profileText.trim(),
      score: 0,
      scoreBreakdown: [],
      strengths: [],
      weaknesses: [],
      overallAssessment: '',
      status: 'analyzing',
      createdAt: Date.now(),
    }

    setCandidates((prev) => [...prev, newCandidate])

    setName('')
    setEmail('')
    setProfileText('')
    onOpenChange(false)

    await analyzeCandidate(newCandidate)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkle size={24} className="text-accent" weight="fill" />
            Add Candidate
          </DialogTitle>
          <DialogDescription>
            Enter the candidate's information. AI will analyze and score them automatically.
          </DialogDescription>
        </DialogHeader>

        {isAnalyzing ? (
          <div className="py-8 space-y-4">
            <div className="text-center">
              <Sparkle size={48} className="text-accent mx-auto mb-4 animate-pulse" weight="fill" />
              <h3 className="text-lg font-semibold mb-2">Analyzing Candidate...</h3>
              <p className="text-sm text-muted-foreground">
                AI is evaluating the candidate against job requirements
              </p>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="candidate-name">Full Name *</Label>
                <Input
                  id="candidate-name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="candidate-email">Email *</Label>
                <Input
                  id="candidate-email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="candidate-profile">Candidate Profile / CV Content *</Label>
              <Textarea
                id="candidate-profile"
                placeholder="Paste the candidate's resume/CV content here. Include their experience, education, skills, achievements, and any other relevant information..."
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Tip: Include as much detail as possible for more accurate AI analysis
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                <Sparkle size={18} weight="fill" />
                Analyze Candidate
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
