import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignIn, Building, Eye, EyeSlash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Company, User } from '@/lib/types'
import { verifyPassword } from '@/lib/password'

interface LoginFormProps {
  onLogin: (company: Company, user: User) => void
  onCreateAccount: () => void
  language: 'fr' | 'en'
}

export function LoginForm({ onLogin, onCreateAccount, language }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const t = {
    fr: {
      title: 'Connexion',
      subtitle: 'Accédez à votre compte entreprise',
      emailLabel: 'Email professionnel',
      emailPlaceholder: 'votre.email@entreprise.com',
      passwordLabel: 'Mot de passe',
      passwordPlaceholder: 'Entrez votre mot de passe',
      showPassword: 'Afficher le mot de passe',
      hidePassword: 'Masquer le mot de passe',
      loginButton: 'Se connecter',
      noAccount: "Pas encore de compte ?",
      createAccount: 'Créer un compte entreprise',
      emailRequired: 'Email requis',
      passwordRequired: 'Mot de passe requis',
      invalidEmail: 'Email invalide',
      loginError: 'Email ou mot de passe incorrect',
      loginSuccess: 'Connexion réussie',
      licenseExpired: 'Licence expirée'
    },
    en: {
      title: 'Login',
      subtitle: 'Access your company account',
      emailLabel: 'Professional Email',
      emailPlaceholder: 'your.email@company.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      loginButton: 'Sign In',
      noAccount: "Don't have an account?",
      createAccount: 'Create company account',
      emailRequired: 'Email required',
      passwordRequired: 'Password required',
      invalidEmail: 'Invalid email',
      loginError: 'Incorrect email or password',
      loginSuccess: 'Login successful',
      licenseExpired: 'License expired'
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

    if (!password) {
      toast.error(texts.passwordRequired)
      return
    }

    setIsLoading(true)

    try {
      const existingCompanies = await window.spark.kv.get<Company[]>('companies') || []
      const existingUsers = await window.spark.kv.get<User[]>('users') || []

      const user = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
      
      if (!user) {
        toast.error(texts.loginError)
        setIsLoading(false)
        return
      }

      const isPasswordValid = await verifyPassword(password, user.passwordHash)
      
      if (!isPasswordValid) {
        toast.error(texts.loginError)
        setIsLoading(false)
        return
      }

      const company = existingCompanies.find(c => c.id === user.companyId)
      
      if (!company) {
        toast.error(texts.loginError)
        setIsLoading(false)
        return
      }

      if (!company.license.isActive) {
        toast.error(texts.licenseExpired)
        setIsLoading(false)
        return
      }

      await window.spark.kv.set('users', existingUsers.map(u => 
        u.id === user.id ? { ...u, lastLoginAt: Date.now() } : u
      ))

      toast.success(texts.loginSuccess)
      onLogin(company, user)
    } catch (error) {
      toast.error(texts.loginError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 mb-2">
          <Building size={32} weight="duotone" className="text-primary" />
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
          
          <div className="space-y-2">
            <Label htmlFor="password">{texts.passwordLabel}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder={texts.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
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
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                {texts.loginButton}...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <SignIn size={18} weight="bold" />
                {texts.loginButton}
              </span>
            )}
          </Button>

          <div className="text-center space-y-2 pt-4 border-t">
            <p className="text-sm text-muted-foreground">{texts.noAccount}</p>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={onCreateAccount}
            >
              {texts.createAccount}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
