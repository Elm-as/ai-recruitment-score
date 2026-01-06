import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Building, UserPlus, ArrowLeft, Eye, EyeSlash, Warning } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Company, User, LicenseType } from '@/lib/types'
import { validatePassword, hashPassword } from '@/lib/password'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'

interface RegistrationFormProps {
  onRegister: (company: Company, user: User) => void
  onBack: () => void
  language: 'fr' | 'en'
}

const LICENSE_PLANS = {
  trial: {
    fr: { name: 'Essai Gratuit (14 jours)', maxUsers: 3, maxPositions: 5, maxCandidates: 50 },
    en: { name: 'Free Trial (14 days)', maxUsers: 3, maxPositions: 5, maxCandidates: 50 }
  },
  starter: {
    fr: { name: 'Starter - 49€/mois', maxUsers: 5, maxPositions: 20, maxCandidates: 200 },
    en: { name: 'Starter - €49/month', maxUsers: 5, maxPositions: 20, maxCandidates: 200 }
  },
  professional: {
    fr: { name: 'Professional - 149€/mois', maxUsers: 15, maxPositions: 100, maxCandidates: 1000 },
    en: { name: 'Professional - €149/month', maxUsers: 15, maxPositions: 100, maxCandidates: 1000 }
  },
  enterprise: {
    fr: { name: 'Enterprise - Sur mesure', maxUsers: -1, maxPositions: -1, maxCandidates: -1 },
    en: { name: 'Enterprise - Custom', maxUsers: -1, maxPositions: -1, maxCandidates: -1 }
  }
}

export function RegistrationForm({ onRegister, onBack, language }: RegistrationFormProps) {
  const [companyName, setCompanyName] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [licenseType, setLicenseType] = useState<LicenseType>('trial')
  const [isLoading, setIsLoading] = useState(false)

  const t = {
    fr: {
      title: 'Créer un compte entreprise',
      subtitle: 'Commencez à utiliser notre plateforme de recrutement',
      companySection: 'Informations de l\'entreprise',
      companyName: 'Nom de l\'entreprise',
      companyNamePlaceholder: 'Acme Corp',
      companyEmail: 'Email de l\'entreprise',
      companyEmailPlaceholder: 'contact@entreprise.com',
      userSection: 'Votre compte administrateur',
      userName: 'Votre nom complet',
      userNamePlaceholder: 'Jean Dupont',
      userEmail: 'Votre email professionnel',
      userEmailPlaceholder: 'jean.dupont@entreprise.com',
      password: 'Mot de passe',
      passwordPlaceholder: 'Créez un mot de passe sécurisé',
      confirmPassword: 'Confirmer le mot de passe',
      confirmPasswordPlaceholder: 'Ressaisissez votre mot de passe',
      showPassword: 'Afficher le mot de passe',
      hidePassword: 'Masquer le mot de passe',
      passwordRequirements: 'Exigences du mot de passe :',
      licenseSection: 'Choisissez votre forfait',
      registerButton: 'Créer le compte',
      backButton: 'Retour à la connexion',
      allFieldsRequired: 'Tous les champs sont requis',
      invalidEmail: 'Email invalide',
      emailMismatch: 'Les emails doivent appartenir au même domaine',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      accountExists: 'Un compte existe déjà avec cet email',
      registrationSuccess: 'Compte créé avec succès !',
      registrationError: 'Erreur lors de la création du compte'
    },
    en: {
      title: 'Create Company Account',
      subtitle: 'Start using our recruitment platform',
      companySection: 'Company Information',
      companyName: 'Company Name',
      companyNamePlaceholder: 'Acme Corp',
      companyEmail: 'Company Email',
      companyEmailPlaceholder: 'contact@company.com',
      userSection: 'Your Admin Account',
      userName: 'Your Full Name',
      userNamePlaceholder: 'John Doe',
      userEmail: 'Your Professional Email',
      userEmailPlaceholder: 'john.doe@company.com',
      password: 'Password',
      passwordPlaceholder: 'Create a secure password',
      confirmPassword: 'Confirm Password',
      confirmPasswordPlaceholder: 'Re-enter your password',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      passwordRequirements: 'Password requirements:',
      licenseSection: 'Choose Your Plan',
      registerButton: 'Create Account',
      backButton: 'Back to Login',
      allFieldsRequired: 'All fields are required',
      invalidEmail: 'Invalid email',
      emailMismatch: 'Emails must belong to the same domain',
      passwordMismatch: 'Passwords do not match',
      accountExists: 'An account already exists with this email',
      registrationSuccess: 'Account created successfully!',
      registrationError: 'Error creating account'
    }
  }

  const texts = t[language]

  const validateEmails = () => {
    const companyDomain = companyEmail.split('@')[1]
    const userDomain = userEmail.split('@')[1]
    return companyDomain === userDomain
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!companyName || !companyEmail || !userName || !userEmail || !password || !confirmPassword) {
      toast.error(texts.allFieldsRequired)
      return
    }

    if (!companyEmail.includes('@') || !userEmail.includes('@')) {
      toast.error(texts.invalidEmail)
      return
    }

    if (!validateEmails()) {
      toast.error(texts.emailMismatch)
      return
    }

    const passwordValidation = validatePassword(password, language)
    if (!passwordValidation.isValid) {
      passwordValidation.errors.forEach(error => toast.error(error))
      return
    }

    if (password !== confirmPassword) {
      toast.error(texts.passwordMismatch)
      return
    }

    setIsLoading(true)

    try {
      const existingCompanies = await window.spark.kv.get<Company[]>('companies') || []
      const existingUsers = await window.spark.kv.get<User[]>('users') || []

      if (existingUsers.some(u => u.email.toLowerCase() === userEmail.toLowerCase())) {
        toast.error(texts.accountExists)
        setIsLoading(false)
        return
      }

      const now = Date.now()
      const expiryDate = licenseType === 'trial' 
        ? now + (14 * 24 * 60 * 60 * 1000)
        : now + (365 * 24 * 60 * 60 * 1000)

      const planDetails = LICENSE_PLANS[licenseType][language]

      const newCompany: Company = {
        id: `company-${now}`,
        name: companyName,
        email: companyEmail,
        createdAt: now,
        license: {
          type: licenseType,
          maxUsers: planDetails.maxUsers,
          maxPositions: planDetails.maxPositions,
          maxCandidatesPerPosition: planDetails.maxCandidates,
          features: {
            bulkOperations: licenseType !== 'trial',
            advancedAnalytics: licenseType === 'professional' || licenseType === 'enterprise',
            emailTemplates: licenseType !== 'trial',
            apiAccess: licenseType === 'enterprise',
            customBranding: licenseType === 'enterprise'
          },
          startDate: now,
          expiryDate,
          isActive: true
        },
        subscription: {
          status: licenseType === 'trial' ? 'trialing' : 'active',
          currentPeriodEnd: expiryDate,
          cancelAtPeriodEnd: false,
          nextPaymentDate: expiryDate,
        }
      }

      const passwordHash = await hashPassword(password)

      const newUser: User = {
        id: `user-${now}`,
        companyId: newCompany.id,
        name: userName,
        email: userEmail,
        passwordHash,
        role: 'owner',
        createdAt: now,
        lastLoginAt: now
      }

      await window.spark.kv.set('companies', [...existingCompanies, newCompany])
      await window.spark.kv.set('users', [...existingUsers, newUser])

      toast.success(texts.registrationSuccess)
      onRegister(newCompany, newUser)
    } catch (error) {
      toast.error(texts.registrationError)
    } finally {
      setIsLoading(false)
    }
  }

  const passwordValidation = validatePassword(password, language)

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <Building size={32} weight="duotone" className="text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">{texts.title}</CardTitle>
        <CardDescription>{texts.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{texts.companySection}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company-name">{texts.companyName}</Label>
                <Input
                  id="company-name"
                  type="text"
                  placeholder={texts.companyNamePlaceholder}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-email">{texts.companyEmail}</Label>
                <Input
                  id="company-email"
                  type="email"
                  placeholder={texts.companyEmailPlaceholder}
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{texts.userSection}</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="user-name">{texts.userName}</Label>
                <Input
                  id="user-name"
                  type="text"
                  placeholder={texts.userNamePlaceholder}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">{texts.userEmail}</Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder={texts.userEmailPlaceholder}
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">{texts.password}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={texts.passwordPlaceholder}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={showPassword ? texts.hidePassword : texts.showPassword}
                  >
                    {showPassword ? (
                      <EyeSlash size={18} className="text-muted-foreground" />
                    ) : (
                      <Eye size={18} className="text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {password && (
                  <PasswordStrengthIndicator password={password} language={language} />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">{texts.confirmPassword}</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={texts.confirmPasswordPlaceholder}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="new-password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    aria-label={showConfirmPassword ? texts.hidePassword : texts.showPassword}
                  >
                    {showConfirmPassword ? (
                      <EyeSlash size={18} className="text-muted-foreground" />
                    ) : (
                      <Eye size={18} className="text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {password && !passwordValidation.isValid && (
              <Alert variant="destructive">
                <Warning size={16} className="mt-0.5" />
                <AlertDescription>
                  <div className="font-medium mb-1">{texts.passwordRequirements}</div>
                  <ul className="list-disc list-inside space-y-0.5 text-xs">
                    {passwordValidation.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{texts.licenseSection}</h3>
            <Select value={licenseType} onValueChange={(value: LicenseType) => setLicenseType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(LICENSE_PLANS) as LicenseType[]).map((plan) => (
                  <SelectItem key={plan} value={plan}>
                    {LICENSE_PLANS[plan][language].name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onBack}
              disabled={isLoading}
            >
              <ArrowLeft size={18} weight="bold" className="mr-2" />
              {texts.backButton}
            </Button>
            <Button 
              type="submit" 
              className="w-full sm:flex-1" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  {texts.registerButton}...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserPlus size={18} weight="bold" />
                  {texts.registerButton}
                </span>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
