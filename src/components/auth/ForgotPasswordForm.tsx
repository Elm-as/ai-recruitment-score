import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, EnvelopeSimple, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { User } from '@/lib/types'

interface ForgotPasswordFormProps {
  onBack: () => void
  language: 'fr' | 'en'
}

export function ForgotPasswordForm({ onBack, language }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const t = {
    fr: {
      title: 'Mot de passe oublié',
      subtitle: 'Entrez votre email pour recevoir les instructions',
      emailLabel: 'Email professionnel',
      emailPlaceholder: 'votre.email@entreprise.com',
      sendLink: 'Envoyer le Lien',
      backToLogin: 'Retour à la connexion',
      emailRequired: 'Email requis',
      invalidEmail: 'Email invalide',
      emailNotFound: 'Aucun compte trouvé avec cet email',
      emailSentTitle: 'Email envoyé !',
      emailSentMessage: 'Un email a été envoyé à',
      checkInbox: 'Vérifiez votre boîte de réception pour les instructions de réinitialisation.',
      contactAdmin: 'Si vous ne recevez pas d\'email, contactez l\'administrateur de votre entreprise.',
      sendAnother: 'Renvoyer l\'email',
    },
    en: {
      title: 'Forgot Password',
      subtitle: 'Enter your email to receive instructions',
      emailLabel: 'Professional Email',
      emailPlaceholder: 'your.email@company.com',
      sendLink: 'Send Reset Link',
      backToLogin: 'Back to login',
      emailRequired: 'Email required',
      invalidEmail: 'Invalid email',
      emailNotFound: 'No account found with this email',
      emailSentTitle: 'Email Sent!',
      emailSentMessage: 'An email has been sent to',
      checkInbox: 'Check your inbox for reset instructions.',
      contactAdmin: 'If you don\'t receive an email, contact your company administrator.',
      sendAnother: 'Send another email',
    }
  }

  const texts = t[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error(texts.emailRequired)
      return
    }

    if (!email.includes('@')) {
      toast.error(texts.invalidEmail)
      return
    }

    setIsLoading(true)

    try {
      const existingUsers = await window.spark.kv.get<User[]>('users') || []
      const user = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
      
      if (!user) {
        toast.error(texts.emailNotFound)
        setIsLoading(false)
        return
      }

      const resetToken = crypto.randomUUID()
      const resetExpiry = Date.now() + (60 * 60 * 1000)
      
      await window.spark.kv.set(`password-reset:${resetToken}`, {
        userId: user.id,
        email: user.email,
        expiry: resetExpiry,
      })

      const resetLink = `${window.location.origin}?reset=${resetToken}`
      const emailSubject = language === 'fr' 
        ? 'Réinitialisation de mot de passe - Assistant IA de Recrutement'
        : 'Password Reset - AI Recruitment Assistant'
      
      const emailBody = language === 'fr'
        ? `Bonjour ${user.name},\n\nVous avez demandé la réinitialisation de votre mot de passe.\n\nCliquez sur le lien suivant pour réinitialiser votre mot de passe:\n${resetLink}\n\nCe lien expire dans 1 heure.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.\n\nCordialement,\nL'équipe Assistant IA de Recrutement`
        : `Hello ${user.name},\n\nYou requested a password reset.\n\nClick the following link to reset your password:\n${resetLink}\n\nThis link expires in 1 hour.\n\nIf you didn't request this reset, please ignore this email.\n\nBest regards,\nAI Recruitment Assistant Team`

      console.log('Password Reset Email:')
      console.log('To:', user.email)
      console.log('Subject:', emailSubject)
      console.log('Body:', emailBody)
      console.log('Reset Link:', resetLink)

      setEmailSent(true)
      toast.success(texts.emailSentMessage + ' ' + email)
    } catch (error) {
      toast.error('Error sending reset email')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center">
              <CheckCircle size={32} weight="duotone" className="text-accent" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{texts.emailSentTitle}</CardTitle>
          <CardDescription className="text-left space-y-2 pt-2">
            <p>{texts.emailSentMessage} <strong>{email}</strong></p>
            <p>{texts.checkInbox}</p>
            <p className="text-xs">{texts.contactAdmin}</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setEmailSent(false)}
          >
            {texts.sendAnother}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onBack}
          >
            <ArrowLeft size={18} className="mr-2" />
            {texts.backToLogin}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <EnvelopeSimple size={32} weight="duotone" className="text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">{texts.title}</CardTitle>
        <CardDescription>{texts.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{texts.emailLabel}</Label>
            <Input
              id="email"
              type="email"
              placeholder={texts.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                {texts.sendLink}...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <EnvelopeSimple size={18} weight="bold" />
                {texts.sendLink}
              </span>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onBack}
          >
            <ArrowLeft size={18} className="mr-2" />
            {texts.backToLogin}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
