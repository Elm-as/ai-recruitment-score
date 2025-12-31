import { useState, useRef } from 'react'
import { Position, Candidate, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { extractTextFromFile, validateFileSize } from '@/lib/fileUtils'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Sparkle, UploadSimple, FileText, FilePdf, FileHtml } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface AddCandidateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  position: Position
  setCandidates: (updater: (prev: Candidate[]) => Candidate[]) => void
  positions: Position[]
  language: Language
}

export default function AddCandidateDialog({
  open,
  onOpenChange,
  position,
  setCandidates,
  positions,
  language,
}: AddCandidateDialogProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profileText, setProfileText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadMethod, setUploadMethod] = useState<'file' | 'paste'>('file')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!validateFileSize(file, 5)) {
      toast.error(t('addCandidate.errorFileSize', language))
      return
    }

    setIsExtracting(true)
    toast.info(t('addCandidate.extracting', language))

    try {
      const { text, fileType } = await extractTextFromFile(file)
      setProfileText(text)
      setUploadedFile(file)
      toast.success(t('addCandidate.fileUploaded', language, { name: file.name }))
    } catch (error) {
      toast.error(t('addCandidate.errorFileRead', language))
      console.error(error)
    } finally {
      setIsExtracting(false)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const analyzeCandidate = async (candidate: Candidate) => {
    setIsAnalyzing(true)
    setProgress(10)

    try {
      const otherPositions = positions.filter((p) => p.id !== position.id && p.status === 'active')
      const isEnglish = language === 'en'

      const analysisPromptText = `You are an expert HR professional and recruitment specialist. Analyze this candidate profile against the job requirements.

IMPORTANT: All output text (assessments, reasoning, strengths, weaknesses) must be written in ${isEnglish ? 'ENGLISH' : 'FRENCH'} language.

JOB POSITION:
Title: ${position.title}
Description: ${position.description}
Requirements: ${position.requirements}

CANDIDATE PROFILE:
Name: ${candidate.name}
Email: ${candidate.email}
Profile Information:
${candidate.profileText}

Provide a comprehensive evaluation in JSON format with this exact structure (all text in ${isEnglish ? 'ENGLISH' : 'FRENCH'}):
{
  "score": <number 0-100>,
  "scoreBreakdown": [
    {
      "category": "<category name in ${isEnglish ? 'English' : 'French'}>",
      "score": <number 0-100>,
      "reasoning": "<brief explanation in ${isEnglish ? 'English' : 'French'}>"
    }
  ],
  "strengths": ["<strength 1 in ${isEnglish ? 'English' : 'French'}>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1 in ${isEnglish ? 'English' : 'French'}>", "<weakness 2>", ...],
  "overallAssessment": "<2-3 sentence summary of candidate fit in ${isEnglish ? 'English' : 'French'}>"
}

Evaluate at least 4-5 categories such as: Technical Skills, Experience Level, Education Background, Cultural Fit, Communication Skills, etc.
Be specific and reference actual details from the candidate's profile.`

      setProgress(40)

      const analysisResult = await window.spark.llm(analysisPromptText, 'gpt-4o', true)
      const analysis = JSON.parse(analysisResult)

      setProgress(70)

      let alternativePositions = undefined
      if (otherPositions.length > 0 && analysis.score >= 50 && analysis.score < 80) {
        const alternativesPromptText = `Based on this candidate's profile and their score of ${analysis.score}/100 for the ${position.title} position, evaluate if they might be a better fit for any of these other open positions:

IMPORTANT: All reasoning text must be in ${isEnglish ? 'ENGLISH' : 'FRENCH'} language.

CANDIDATE PROFILE:
${candidate.profileText}

OTHER OPEN POSITIONS:
${otherPositions.map((p) => `- ${p.title}: ${p.description}\n  Requirements: ${p.requirements}`).join('\n\n')}

Return a JSON object with a single property "alternatives" containing an array of suitable alternative positions (empty array if none). All reasoning must be in ${isEnglish ? 'ENGLISH' : 'FRENCH'}:
{
  "alternatives": [
    {
      "positionId": "<position id>",
      "positionTitle": "<position title>",
      "reasoning": "<why this position is a better fit, in ${isEnglish ? 'English' : 'French'}>"
    }
  ]
}

Only suggest alternatives if the candidate would score significantly higher (10+ points) for that position.`

        const alternativesResult = await window.spark.llm(alternativesPromptText, 'gpt-4o', true)
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

      toast.success(t('addCandidate.success', language), {
        description: `Score: ${analysis.score}/100`,
      })
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error(t('addCandidate.errorAnalysis', language))
      setCandidates((prev) => prev.filter((c) => c.id !== candidate.id))
    } finally {
      setIsAnalyzing(false)
      setProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !profileText.trim()) {
      toast.error(t('addCandidate.errorFields', language))
      return
    }

    const newCandidate: Candidate = {
      id: `cand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      positionId: position.id,
      name: name.trim(),
      email: email.trim(),
      profileText: profileText.trim(),
      fileName: uploadedFile?.name,
      fileType: uploadedFile?.name.endsWith('.pdf') ? 'pdf' : uploadedFile?.name.endsWith('.html') || uploadedFile?.name.endsWith('.htm') ? 'html' : undefined,
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
    setUploadedFile(null)
    onOpenChange(false)

    await analyzeCandidate(newCandidate)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkle size={28} className="text-accent" weight="duotone" />
            {t('addCandidate.title', language)}
          </DialogTitle>
          <DialogDescription>
            {t('addCandidate.description', language)}
          </DialogDescription>
        </DialogHeader>

        {isAnalyzing ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 space-y-6"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkle size={64} className="text-accent mx-auto mb-4" weight="duotone" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{t('addCandidate.analyzing', language)}</h3>
              <p className="text-sm text-muted-foreground">
                {t('candidate.aiEvaluating', language)}
              </p>
            </div>
            <Progress value={progress} className="w-full h-3" />
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as 'file' | 'paste')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file" className="gap-2">
                  <UploadSimple size={18} weight="duotone" />
                  {t('addCandidate.file', language)}
                </TabsTrigger>
                <TabsTrigger value="paste" className="gap-2">
                  <FileText size={18} weight="duotone" />
                  {t('addCandidate.paste', language)}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="space-y-4 mt-6">
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-all cursor-pointer bg-muted/20"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadedFile ? (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="space-y-3">
                      {uploadedFile.name.endsWith('.pdf') ? (
                        <FilePdf size={48} className="text-destructive mx-auto" weight="duotone" />
                      ) : (
                        <FileHtml size={48} className="text-accent mx-auto" weight="duotone" />
                      )}
                      <p className="font-medium">{uploadedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setUploadedFile(null)
                          setProfileText('')
                        }}
                      >
                        {t('candidate.changeFile', language)}
                      </Button>
                    </motion.div>
                  ) : (
                    <>
                      <UploadSimple size={48} className="text-muted-foreground mx-auto mb-4" weight="duotone" />
                      <p className="text-base font-medium mb-2">
                        {t('addCandidate.dragDrop', language)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t('addCandidate.uploadDesc', language)}
                      </p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.html,.htm"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleFileUpload(file)
                    }}
                  />
                </div>
              </TabsContent>

              <TabsContent value="paste" className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="profile-text-paste">
                    {t('addCandidate.profileText', language)} *
                  </Label>
                  <Textarea
                    id="profile-text-paste"
                    placeholder={t('addCandidate.profileTextPlaceholder', language)}
                    value={profileText}
                    onChange={(e) => setProfileText(e.target.value)}
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="candidate-name">
                  {t('addCandidate.candidateName', language)} *
                </Label>
                <Input
                  id="candidate-name"
                  placeholder={t('addCandidate.candidateNamePlaceholder', language)}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="candidate-email">
                  {t('addCandidate.candidateEmail', language)} *
                </Label>
                <Input
                  id="candidate-email"
                  type="email"
                  placeholder={t('addCandidate.candidateEmailPlaceholder', language)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('addCandidate.cancel', language)}
              </Button>
              <Button type="submit" className="gap-2" disabled={isExtracting}>
                <Sparkle size={18} weight="duotone" />
                {t('addCandidate.analyze', language)}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
