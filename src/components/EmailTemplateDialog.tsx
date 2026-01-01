import { useState } from 'react'
import { Candidate, Position, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Checkbox } from '@/components/ui/checkbox'
import { Copy, Sparkle, EnvelopeSimple, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface EmailTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidates: Candidate[]
  position: Position
  language: Language
}

export default function EmailTemplateDialog({
  open,
  onOpenChange,
  candidates,
  position,
  language,
}: EmailTemplateDialogProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([])
  const [emailType, setEmailType] = useState<'shortlist' | 'invitation' | 'rejection'>('shortlist')
  const [customInstructions, setCustomInstructions] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedEmails, setGeneratedEmails] = useState<Record<string, string>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const sortedCandidates = [...candidates].sort((a, b) => b.score - a.score)

  const generateEmails = async () => {
    if (selectedCandidates.length === 0) {
      toast.error(language === 'fr' ? 'Sélectionnez au moins un candidat' : 'Select at least one candidate')
      return
    }

    setGenerating(true)
    try {
      const newEmails: Record<string, string> = {}

      for (const candidateId of selectedCandidates) {
        const candidate = candidates.find(c => c.id === candidateId)
        if (!candidate) continue

        const strengthsSection = candidate.strengths.length > 0
          ? `Strengths:\n${candidate.strengths.map(s => `- ${s}`).join('\n')}`
          : ''

        const questionsSection = candidate.questionAnswers && candidate.questionAnswers.length > 0
          ? `\nInterview Performance:\n${candidate.questionAnswers.filter(qa => qa.aiScore).map(qa => `
Question: ${qa.question}
Answer Score: ${qa.aiScore?.overallScore}/100
Feedback: ${qa.aiScore?.feedback}
`).join('\n')}`
          : ''

        const emailPurpose = emailType === 'shortlist'
          ? 'email to the hiring manager summarizing this candidate\'s qualifications, scores, and why they should be considered. Include specific data points and assessment results.'
          : emailType === 'rejection'
          ? 'rejection email to the candidate. Be respectful and encouraging.'
          : 'interview invitation email to the candidate. Include next steps.'

        const formatInstructions = emailType === 'shortlist'
          ? 'Format: Start with "Subject: " line, then the email body. Include bullet points with their scores and key strengths. Be data-driven and professional.'
          : 'Format: Start with "Subject: " line, then the email body.'

        const prompt = (window as any).spark.llmPrompt`You are an HR professional creating email templates for recruitment.

Position: ${position.title}
Candidate: ${candidate.name}
Email: ${candidate.email}
Score: ${candidate.score}/100
Overall Assessment: ${candidate.overallAssessment}
${strengthsSection}
${questionsSection}

Email Type: ${emailType === 'shortlist' ? 'Shortlist notification for hiring manager' : emailType === 'rejection' ? 'Professional rejection' : 'Interview invitation'}

${customInstructions ? `Additional instructions: ${customInstructions}` : ''}

Language: ${language === 'fr' ? 'French' : 'English'}

Create a professional ${emailPurpose} 
${formatInstructions}
Write the complete email ready to send.`

        const result = await (window as any).spark.llm(prompt, 'gpt-4o')
        newEmails[candidateId] = result
      }

      setGeneratedEmails(newEmails)
      toast.success(t('email.generated', language))
    } catch (error) {
      toast.error(t('email.error', language))
      console.error('Email generation error:', error)
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = async (text: string, candidateId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(candidateId)
      toast.success(t('email.copied', language))
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      toast.error(t('email.copyError', language))
    }
  }

  const toggleCandidate = (candidateId: string) => {
    setSelectedCandidates(prev =>
      prev.includes(candidateId)
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    )
  }

  const selectTopCandidates = () => {
    const topCandidates = sortedCandidates.slice(0, Math.min(5, sortedCandidates.length))
    setSelectedCandidates(topCandidates.map(c => c.id))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <EnvelopeSimple size={24} weight="duotone" className="text-accent" />
            {t('email.title', language)}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {t('email.description', language)}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="select" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select" className="text-xs sm:text-sm">
              {language === 'fr' ? 'Sélectionner' : 'Select'}
            </TabsTrigger>
            <TabsTrigger value="configure" className="text-xs sm:text-sm">
              {language === 'fr' ? 'Configurer' : 'Configure'}
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs sm:text-sm">
              {language === 'fr' ? 'Aperçu' : 'Preview'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="flex-1 overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {language === 'fr' 
                    ? `${selectedCandidates.length} candidat(s) sélectionné(s)` 
                    : `${selectedCandidates.length} candidate(s) selected`}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={selectTopCandidates}
                  className="text-xs"
                >
                  {language === 'fr' ? 'Top 5' : 'Select Top 5'}
                </Button>
              </div>

              <ScrollArea className="h-[300px] sm:h-[400px] pr-4">
                <div className="space-y-2">
                  {sortedCandidates.map((candidate, index) => (
                    <motion.div
                      key={candidate.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-start gap-3 p-3 rounded-lg border ${
                        selectedCandidates.includes(candidate.id)
                          ? 'bg-accent/10 border-accent'
                          : 'bg-card border-border'
                      }`}
                    >
                      <Checkbox
                        checked={selectedCandidates.includes(candidate.id)}
                        onCheckedChange={() => toggleCandidate(candidate.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={index < 3 ? 'default' : 'secondary'} className="text-xs">
                            #{index + 1}
                          </Badge>
                          <p className="font-semibold text-sm truncate">{candidate.name}</p>
                          <Badge
                            className={`text-xs ${
                              candidate.score >= 80
                                ? 'bg-green-100 text-green-700'
                                : candidate.score >= 60
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {candidate.score}/100
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{candidate.email}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="configure" className="flex-1 overflow-auto space-y-4">
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  {language === 'fr' ? 'Type d\'email' : 'Email Type'}
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button
                    variant={emailType === 'shortlist' ? 'default' : 'outline'}
                    onClick={() => setEmailType('shortlist')}
                    className="text-xs sm:text-sm"
                  >
                    {language === 'fr' ? 'Liste restreinte' : 'Shortlist'}
                  </Button>
                  <Button
                    variant={emailType === 'invitation' ? 'default' : 'outline'}
                    onClick={() => setEmailType('invitation')}
                    className="text-xs sm:text-sm"
                  >
                    {language === 'fr' ? 'Invitation' : 'Invitation'}
                  </Button>
                  <Button
                    variant={emailType === 'rejection' ? 'default' : 'outline'}
                    onClick={() => setEmailType('rejection')}
                    className="text-xs sm:text-sm"
                  >
                    {language === 'fr' ? 'Rejet' : 'Rejection'}
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="instructions" className="text-sm font-semibold mb-2 block">
                  {language === 'fr' ? 'Instructions personnalisées (optionnel)' : 'Custom Instructions (optional)'}
                </Label>
                <Textarea
                  id="instructions"
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder={
                    language === 'fr'
                      ? 'Ajoutez des instructions spécifiques pour la génération d\'email...'
                      : 'Add specific instructions for email generation...'
                  }
                  className="min-h-24 text-sm"
                />
              </div>

              <Button
                onClick={generateEmails}
                disabled={generating || selectedCandidates.length === 0}
                className="w-full gap-2"
              >
                <Sparkle size={16} weight="fill" />
                {generating
                  ? language === 'fr'
                    ? 'Génération en cours...'
                    : 'Generating...'
                  : language === 'fr'
                  ? 'Générer les emails'
                  : 'Generate Emails'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-hidden">
            <ScrollArea className="h-[300px] sm:h-[500px] pr-4">
              {Object.keys(generatedEmails).length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-muted-foreground">
                    <EnvelopeSimple size={48} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      {language === 'fr'
                        ? 'Aucun email généré. Configurez et générez d\'abord.'
                        : 'No emails generated. Configure and generate first.'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedCandidates.map((candidateId) => {
                    const candidate = candidates.find(c => c.id === candidateId)
                    const email = generatedEmails[candidateId]
                    if (!candidate || !email) return null

                    return (
                      <motion.div
                        key={candidateId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border rounded-lg p-4 space-y-3 bg-card"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm">{candidate.name}</p>
                            <p className="text-xs text-muted-foreground">{candidate.email}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(email, candidateId)}
                            className="gap-2"
                          >
                            {copiedId === candidateId ? (
                              <>
                                <Check size={14} weight="bold" />
                                <span className="text-xs">
                                  {language === 'fr' ? 'Copié' : 'Copied'}
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                <span className="text-xs">
                                  {language === 'fr' ? 'Copier' : 'Copy'}
                                </span>
                              </>
                            )}
                          </Button>
                        </div>
                        <Separator />
                        <pre className="text-xs whitespace-pre-wrap font-sans text-foreground bg-muted/30 p-3 rounded">
                          {email}
                        </pre>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
