import { useState, useRef } from 'react'
import { Position, Candidate, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { extractTextFromFile, validateFileSize, optimizeTextForAnalysis } from '@/lib/fileUtils'
import { analyzeCandidateWithAI, findAlternativePositions, validateAnalysisInput } from '@/lib/aiAnalysis'
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
      console.log('=== Starting Enhanced AI Analysis ===')
      console.log('Candidate:', candidate.name)
      console.log('Position:', position.title)
      console.log('Profile text length:', candidate.profileText.length)
      
      setProgress(20)
      
      const otherPositions = positions.filter((p) => p.id !== position.id && (p.status === 'active' || !p.status))
      console.log(`Found ${otherPositions.length} other active positions`)
      
      setProgress(30)
      console.log('Sending candidate data to AI for analysis...')
      
      const analysis = await analyzeCandidateWithAI(candidate, position, language)
      
      console.log('AI Analysis completed successfully')
      console.log('Final score:', analysis.score)
      console.log('Categories evaluated:', analysis.scoreBreakdown.length)

      setProgress(70)

      console.log('Checking for alternative position matches...')
      const alternativePositions = await findAlternativePositions(
        candidate,
        position,
        otherPositions,
        analysis.score,
        language
      )
      
      if (alternativePositions && alternativePositions.length > 0) {
        console.log(`Found ${alternativePositions.length} alternative position suggestions`)
      } else {
        console.log('No alternative positions recommended')
      }

      setProgress(95)

      console.log('Updating candidate record with analysis results...')
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

      setProgress(100)

      toast.success(t('addCandidate.success', language), {
        description: `${language === 'fr' ? 'Score' : 'Score'}: ${analysis.score}/100`,
        duration: 5000,
      })
      
      console.log('=== Analysis Complete ===')
    } catch (error) {
      console.error('=== Analysis Error ===')
      console.error('Error:', error)
      
      let errorMessage = t('addCandidate.errorAnalysis', language)
      
      if (error instanceof Error) {
        errorMessage += ': ' + error.message
        console.error('Error message:', error.message)
        console.error('Error stack:', error.stack)
      }
      
      toast.error(errorMessage, {
        duration: 8000,
      })
      
      setCandidates((prev) => prev.filter((c) => c.id !== candidate.id))
    } finally {
      setIsAnalyzing(false)
      setProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validation = validateAnalysisInput(name.trim(), email.trim(), profileText.trim())
    
    if (!validation.valid) {
      toast.error(validation.error || t('addCandidate.errorFields', language))
      return
    }

    const optimizedProfileText = optimizeTextForAnalysis(profileText.trim())
    
    console.log('Original profile length:', profileText.trim().length, 'characters')
    console.log('Optimized profile length:', optimizedProfileText.length, 'characters')

    const newCandidate: Candidate = {
      id: `cand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      positionId: position.id,
      name: name.trim(),
      email: email.trim(),
      profileText: optimizedProfileText,
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
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Sparkle size={24} className="text-accent" weight="duotone" />
            {t('addCandidate.title', language)}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {t('addCandidate.description', language)}
          </DialogDescription>
        </DialogHeader>

        {isAnalyzing ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 space-y-6"
          >
            <div className="text-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkle size={64} className="text-accent mx-auto mb-4" weight="duotone" />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{t('addCandidate.analyzing', language)}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {progress < 30 ? (language === 'fr' ? 'Préparation de l\'analyse...' : 'Preparing analysis...') :
                   progress < 70 ? (language === 'fr' ? 'Évaluation approfondie en cours...' : 'Deep evaluation in progress...') :
                   progress < 95 ? (language === 'fr' ? 'Recherche de correspondances alternatives...' : 'Finding alternative matches...') :
                   (language === 'fr' ? 'Finalisation...' : 'Finalizing...')}
                </p>
              </div>
              <div className="space-y-2">
                <Progress value={progress} className="w-full h-3" />
                <p className="text-xs text-muted-foreground">{progress}%</p>
              </div>
            </div>
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
                <div className="flex items-start gap-2 p-3 bg-accent/10 border border-accent/30 rounded-lg">
                  <Sparkle size={18} className="text-accent mt-0.5 shrink-0" weight="duotone" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {language === 'fr' 
                      ? "Les CV volumineux sont automatiquement optimisés pour une analyse IA efficace. Seules les sections les plus pertinentes (compétences, expérience, formation) sont conservées."
                      : "Large CVs are automatically optimized for efficient AI analysis. Only the most relevant sections (skills, experience, education) are retained."}
                  </p>
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
                <Label htmlFor="candidate-name" className="text-sm">
                  {t('addCandidate.candidateName', language)} *
                </Label>
                <Input
                  id="candidate-name"
                  placeholder={t('addCandidate.candidateNamePlaceholder', language)}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="candidate-email" className="text-sm">
                  {t('addCandidate.candidateEmail', language)} *
                </Label>
                <Input
                  id="candidate-email"
                  type="email"
                  placeholder={t('addCandidate.candidateEmailPlaceholder', language)}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm"
                />
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                {t('addCandidate.cancel', language)}
              </Button>
              <Button type="submit" className="gap-2 w-full sm:w-auto" disabled={isExtracting}>
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
