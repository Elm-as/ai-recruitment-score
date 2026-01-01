import { useState } from 'react'
import { Candidate, Position, Language } from '@/lib/types'
import {
import {
  DialogD
  DialogContent,
  DialogDescription,
  DialogHeader,
import { Badge
import { Copy, Sparkle, Envelop
import { motion, AnimatePresence } from 'framer
interface EmailTemplateDialogProps {
  onOpenChange: (open: boolean) => void
  position: Position
}
export default function EmailTemplateDialog({
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Copy, Sparkle, EnvelopeSimple, Check, Clipboard } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface EmailTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidates: Candidate[]
  position: Position
  language: Language
}

export default function EmailTemplateDialog({
  open,
        const i
Question: ${q
Feedback: $
          :
        const strengthsSection
          : ''
        const emailPurpose = emailType === 'shortlist' 
          : emailType === 'rejection' 
          : 'interview invitation email to the candidate. Include 
        const formatInstructions = emailType === 'shortlist' 
          : 'Format: Start with "Subject: " line, then the emai
        const prompt = `You are an HR professional creatin

Email: ${candidate.email}
Overall Assessment: ${candidate.overallAssessment}${strengthsSecti
Email Type: ${emailType === 'shortlist
${customInstructions ? `Addition

Create a professional ${emailPurpose} 
${formatInstructions}
Write the complete email ready to send.`
        cons
     

    } catch (error) {
      console.error('Email generation error:', e

  }
  const copyToClipboard = async (text: string, candid
      await navigator.clipboard.writeText(text)
      toast.success(t('email.cop

        const prompt = spark.llmPrompt`You are an HR professional creating email templates for recruitment.

Position: ${position.title}
Candidate: ${candidate.name}
Email: ${candidate.email}
Score: ${candidate.score}/100
Overall Assessment: ${candidate.overallAssessment}

${candidate.strengths.length > 0 ? `Strengths:\n${candidate.strengths.map(s => `- ${s}`).join('\n')}` : ''}

${candidate.questionAnswers && candidate.questionAnswers.length > 0 ? `
Interview Performance:
${candidate.questionAnswers.filter(qa => qa.aiScore).map(qa => `
Question: ${qa.question}
Answer Score: ${qa.aiScore?.overallScore}/100
Feedback: ${qa.aiScore?.feedback}
`).join('\n')}
` : ''}

Email Type: ${emailType === 'shortlist' ? 'Shortlist notification for hiring manager' : emailType === 'rejection' ? 'Professional rejection' : 'Interview invitation'}

${customInstructions ? `Additional instructions: ${customInstructions}` : ''}

Language: ${language === 'fr' ? 'French' : 'English'}

Create a professional ${emailType === 'shortlist' ? 'email to the hiring manager summarizing this candidate\'s qualifications, scores, and why they should be considered. Include specific data points and assessment results.' : emailType === 'rejection' ? 'rejection email to the candidate. Be respectful and encouraging.' : 'interview invitation email to the candidate. Include next steps.'} 

${emailType === 'shortlist' ? 'Format: Start with "Subject: " line, then the email body. Include bullet points with their scores and key strengths. Be data-driven and professional.' : 'Format: Start with "Subject: " line, then the email body.'}

Write the complete email ready to send.`

        const result = await spark.llm(prompt, 'gpt-4o')
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

                        key={candidat
    setSelectedCandidates(topCandidates.map(c => c.id))
  }

          
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <EnvelopeSimple size={24} weight="duotone" className="text-accent" />
            {t('email.title', language)}
          </DialogTitle>
                          </div>
            {t('email.description', language)}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="select" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="select" className="text-xs sm:text-sm">
                    ))
              </ScrollArea
            <TabsTrigger value="customize" className="text-xs sm:text-sm">
              {t('email.customizeTab', language)}
            </TabsTrigger>
            <TabsTrigger value="preview" className="text-xs sm:text-sm" disabled={Object.keys(generatedEmails).length === 0}>
              {t('email.previewTab', language)}
            </TabsTrigger>
                </Lab

          <TabsContent value="select" className="flex-1 overflow-auto space-y-4 mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">{t('email.selectCandidates', language)}</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectTopCandidates}
                    <EnvelopeSimple s
                >
                  {t('email.selectTop', language, { count: topCandidates.length })}
                </Button>
                    

              <ScrollArea className="h-[300px] rounded-md border p-4">
                <div className="space-y-2">
              </div>
                    <p className="text-sm text-muted-foreground text-center py-8">
                      {t('email.noCandidates', language)}
                    </p>
                  </Lab
                    candidates.map((candidate) => (
                      <motion.div
                        key={candidate.id}
                    onChange={(e) => setRecipientEma
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedCandidates.includes(candidate.id)
                            ? 'bg-accent/10 border-accent'
                            : 'bg-card hover:bg-muted/50'
                        }`}
                        onClick={() => toggleCandidate(candidate.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-sm">{candidate.name}</h4>
                              <Badge variant={candidate.score >= 80 ? 'default' : 'secondary'} className="text-xs">
                                {candidate.score}/100
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{candidate.email}</p>
                          </div>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                            selectedCandidates.includes(candidate.id)
                              ? 'bg-accent border-accent'
                              : 'border-muted-foreground'
                    {t('email.
                            {selectedCandidates.includes(candidate.id) && (
                              <Check size={14} weight="bold" className="text-accent-foreground" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="customize" className="flex-1 overflow-auto space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-type" className="text-sm font-semibold">
                  {t('email.emailType', language)}
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Button
                    variant={emailType === 'shortlist' ? 'default' : 'outline'}
                    className="justify-start text-xs sm:text-sm"
                    onClick={() => setEmailType('shortlist')}
                  >
                    <Sparkle size={16} weight="duotone" className="mr-2" />
                    {t('email.typeShortlist', language)}
                           
                  <Button
                    variant={emailType === 'interview' ? 'default' : 'outline'}
                    className="justify-start text-xs sm:text-sm"
                    onClick={() => setEmailType('interview')}
                  >
                    <EnvelopeSimple size={16} weight="duotone" className="mr-2" />
                    {t('email.typeInterview', language)}
                           
                  <Button
                    variant={emailType === 'rejection' ? 'default' : 'outline'}
                    className="justify-start text-xs sm:text-sm"
                    onClick={() => setEmailType('rejection')}
                  >
                    <EnvelopeSimple size={16} weight="duotone" className="mr-2" />
                    {t('email.typeRejection', language)}
                      <div 
                </div>
              </div>

              {emailType === 'shortlist' && (
                <div className="space-y-2">
                  <Label htmlFor="recipient-email" className="text-sm">
                    {t('email.recipientEmail', language)}
          </TabsContent>
                  <Input
    </Dialog>
                    type="email"
                    placeholder={language === 'fr' ? 'manager@entreprise.com' : 'manager@company.com'}
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="text-sm"
                  />
                </div>



                <Label htmlFor="custom-instructions" className="text-sm">
                  {t('email.customInstructions', language)}
                </Label>

                  id="custom-instructions"
                  placeholder={t('email.customInstructionsPlaceholder', language)}
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={4}
                  className="text-sm resize-none"
                />



                onClick={handleGenerateEmail}
                disabled={generating || selectedCandidates.length === 0}
                className="w-full gap-2"

                {generating ? (
                  <>
                    <motion.div

                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}

                      <Sparkle size={18} weight="duotone" />

                    {t('email.generating', language)}

                ) : (

                    <Sparkle size={18} weight="duotone" />

                  </>

              </Button>

          </TabsContent>

          <TabsContent value="preview" className="flex-1 overflow-auto space-y-4 mt-4">

              <div className="space-y-6 pr-4">
                {selectedCandidates.map((candidateId) => {
                  const candidate = candidates.find(c => c.id === candidateId)
                  const email = generatedEmails[candidateId]
                  
                  if (!candidate || !email) return null


                    <motion.div

                      initial={{ opacity: 0, y: 20 }}

                      className="space-y-3"

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">{candidate.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {candidate.email}
                          </Badge>
                        </div>

                          variant="outline"

                          onClick={() => copyToClipboard(email, candidateId)}
                          className="gap-2"
                        >

                            {copiedId === candidateId ? (
                              <motion.div
                                key="check"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                              >
                                <Check size={16} weight="bold" className="text-green-600" />
                              </motion.div>

                              <motion.div

                                initial={{ scale: 0 }}

                                exit={{ scale: 0 }}

                                <Copy size={16} weight="bold" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <span className="text-xs">{t('email.copy', language)}</span>

                      </div>

                      <div className="bg-muted/50 rounded-lg p-4 border">
                        <pre className="whitespace-pre-wrap text-xs sm:text-sm font-mono leading-relaxed">
                          {email}

                      </div>

                      <Separator />

                  )

              </div>

          </TabsContent>

      </DialogContent>

  )

