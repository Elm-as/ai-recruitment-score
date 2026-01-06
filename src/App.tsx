import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Position, Candidate, Language, Company, User, AuthSession } from '@/lib/types'
import { t } from '@/lib/translations'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Briefcase, Clock, Moon, Sun, Globe, Monitor, Question, SignOut, Buildings, ChartBar, UserCircle, Key } from '@phosphor-icons/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import PositionsView from '@/components/PositionsView'
import HistoryView from '@/components/HistoryView'
import FAQView from '@/components/FAQView'
import { DashboardView } from '@/components/DashboardView'
import { CompanyManagement } from '@/components/CompanyManagement'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegistrationForm } from '@/components/auth/RegistrationForm'
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm'
import { ChangePasswordDialog } from '@/components/auth/ChangePasswordDialog'
import { SubscriptionBlockPage } from '@/components/SubscriptionBlockPage'
import { PaymentReminderBanner } from '@/components/PaymentReminderBanner'
import { PaymentPage } from '@/components/PaymentPage'
import { Toaster } from '@/components/ui/sonner'
import { useTheme } from '@/hooks/use-theme'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { isSubscriptionExpired, shouldShowPaymentReminder, getDaysUntilExpiry } from '@/lib/payment'

function App() {
  const [positions, setPositions] = useKV<Position[]>('positions', [])
  const [candidates, setCandidates] = useKV<Candidate[]>('candidates', [])
  const [companies, setCompanies] = useKV<Company[]>('companies', [])
  const [users, setUsers] = useKV<User[]>('users', [])
  const [authSession, setAuthSession] = useKV<AuthSession | null>('auth-session', null)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [language, setLanguage] = useKV<Language>('app-language', 'fr')
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login')
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showPaymentReminder, setShowPaymentReminder] = useState(false)
  const [showPaymentPage, setShowPaymentPage] = useState(false)
  const { theme, setTheme } = useTheme()

  const lang = language || 'fr'
  const isAuthenticated = authSession?.isAuthenticated || false
  
  const currentCompany = companies?.find(c => c.id === authSession?.companyId)
  const currentUser = users?.find(u => u.id === authSession?.userId)
  const companyUsers = users?.filter(u => u.companyId === currentCompany?.id) || []

  const companyPositions = positions?.filter(p => 
    candidates?.some(c => c.positionId === p.id && users?.find(u => u.id === authSession?.userId)?.companyId === currentCompany?.id)
  ) || positions || []

  const handleLogin = (company: Company, user: User) => {
    setAuthSession({
      companyId: company.id,
      userId: user.id,
      isAuthenticated: true
    })
  }

  const handleRegister = (company: Company, user: User) => {
    setAuthSession({
      companyId: company.id,
      userId: user.id,
      isAuthenticated: true
    })
  }

  const handleLogout = () => {
    setAuthSession(null)
    setActiveTab('dashboard')
    toast.success(lang === 'fr' ? 'Déconnexion réussie' : 'Logged out successfully')
  }

  const handleAddUser = async (newUser: User) => {
    setUsers((current) => [...(current || []), newUser])
  }

  const handlePasswordChanged = (updatedUser: User) => {
    setUsers((current) => 
      (current || []).map(u => u.id === updatedUser.id ? updatedUser : u)
    )
  }

  const handleUpdateCompany = (updated: Company) => {
    setCompanies((current) => 
      (current || []).map(c => c.id === updated.id ? updated : c)
    )
  }

  useEffect(() => {
    if (positions && positions.length > 0) {
      let needsUpdate = false
      const updatedPositions: Position[] = positions.map(p => {
        if (!(p as any).status) {
          needsUpdate = true
          return { ...p, status: 'active' as const }
        }
        return p
      })
      
      if (needsUpdate) {
        setPositions(() => updatedPositions)
      }
    }
  }, [])

  useEffect(() => {
    if (candidates && candidates.length > 0) {
      let needsUpdate = false
      const updatedCandidates: Candidate[] = candidates.map(c => {
        if (!(c as any).status) {
          needsUpdate = true
          const status = (c as any).score > 0 ? 'scored' as const : 'pending' as const
          return { ...c, status }
        }
        return c
      })
      
      if (needsUpdate) {
        setCandidates(() => updatedCandidates)
      }
    }
  }, [])

  useEffect(() => {
    if (companies && companies.length > 0) {
      let needsUpdate = false
      const updatedCompanies: Company[] = companies.map(c => {
        if (!(c as any).subscription) {
          needsUpdate = true
          const now = Date.now()
          const expiryDate = (c as any).license?.expiryDate || (now + (365 * 24 * 60 * 60 * 1000))
          return {
            ...c,
            subscription: {
              status: 'active' as const,
              currentPeriodEnd: expiryDate,
              cancelAtPeriodEnd: false,
              nextPaymentDate: expiryDate,
            }
          }
        }
        return c
      })
      
      if (needsUpdate) {
        setCompanies(() => updatedCompanies)
      }
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated && currentCompany) {
      const shouldShow = shouldShowPaymentReminder(currentCompany)
      setShowPaymentReminder(shouldShow)
    }
  }, [isAuthenticated, currentCompany])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Globe size={16} weight="duotone" />
                <span className="hidden sm:inline">{lang === 'fr' ? 'Français' : 'English'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('fr')} className="cursor-pointer">
                🇫🇷 Français
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')} className="cursor-pointer">
                🇬🇧 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex justify-center"
        >
          {authView === 'login' ? (
            <LoginForm
              onLogin={handleLogin}
              onCreateAccount={() => setAuthView('register')}
              onForgotPassword={() => setAuthView('forgot')}
              language={lang}
            />
          ) : authView === 'register' ? (
            <RegistrationForm
              onRegister={handleRegister}
              onBack={() => setAuthView('login')}
              language={lang}
            />
          ) : (
            <ForgotPasswordForm
              onBack={() => setAuthView('login')}
              language={lang}
            />
          )}
        </motion.div>
        <Toaster />
      </div>
    )
  }

  if (!currentCompany || !currentUser) {
    return <div>Loading...</div>
  }

  const canAccessFeature = (feature: keyof Company['license']['features']) => {
    return currentCompany.license.features[feature]
  }

  if (showPaymentPage) {
    return (
      <div className="min-h-screen bg-background">
        <PaymentPage
          company={currentCompany}
          language={lang}
          onUpdateCompany={handleUpdateCompany}
          onCancel={() => setShowPaymentPage(false)}
        />
        <Toaster />
      </div>
    )
  }

  if (isSubscriptionExpired(currentCompany)) {
    return (
      <>
        <SubscriptionBlockPage
          company={currentCompany}
          language={lang}
          onUpgrade={() => setShowPaymentPage(true)}
        />
        <Toaster />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-foreground tracking-tight break-words leading-tight">
                {t('app.title', lang)}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 hidden xs:block leading-snug truncate">
                {currentCompany.name}
              </p>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="hover:scale-105 transition-transform h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
                    <Globe size={16} weight="duotone" className="md:hidden" />
                    <Globe size={18} weight="duotone" className="hidden md:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[140px]">
                  <DropdownMenuItem onClick={() => setLanguage('fr')} className="cursor-pointer text-xs sm:text-sm">
                    🇫🇷 Français
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('en')} className="cursor-pointer text-xs sm:text-sm">
                    🇬🇧 English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="hover:scale-105 transition-transform h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
                    {theme === 'dark' ? (
                      <Moon size={16} weight="duotone" className="md:hidden" />
                    ) : theme === 'light' ? (
                      <Sun size={16} weight="duotone" className="md:hidden" />
                    ) : (
                      <Monitor size={16} weight="duotone" className="md:hidden" />
                    )}
                    {theme === 'dark' ? (
                      <Moon size={18} weight="duotone" className="hidden md:block" />
                    ) : theme === 'light' ? (
                      <Sun size={18} weight="duotone" className="hidden md:block" />
                    ) : (
                      <Monitor size={18} weight="duotone" className="hidden md:block" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[140px]">
                  <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer text-xs sm:text-sm">
                    <Sun size={14} className="mr-2" />
                    {t('theme.light', lang)}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer text-xs sm:text-sm">
                    <Moon size={14} className="mr-2" />
                    {t('theme.dark', lang)}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer text-xs sm:text-sm">
                    <Monitor size={14} className="mr-2" />
                    {t('theme.system', lang)}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 sm:h-9 md:h-10 px-2 sm:px-3">
                    <UserCircle size={16} className="sm:hidden" weight="duotone" />
                    <span className="hidden sm:inline text-xs sm:text-sm font-medium truncate max-w-[80px] sm:max-w-[100px] md:max-w-[150px]">
                      {currentUser.name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[180px]">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    <p className="font-medium text-foreground truncate">{currentUser.email}</p>
                    <p className="capitalize">{currentUser.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setShowChangePassword(true)}
                    className="cursor-pointer text-xs sm:text-sm"
                  >
                    <Key size={14} className="mr-2" />
                    {lang === 'fr' ? 'Changer le mot de passe' : 'Change password'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="cursor-pointer text-xs sm:text-sm text-destructive focus:text-destructive"
                  >
                    <SignOut size={14} className="mr-2" />
                    {lang === 'fr' ? 'Déconnexion' : 'Logout'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        {showPaymentReminder && (
          <PaymentReminderBanner
            company={currentCompany}
            language={lang}
            onDismiss={() => setShowPaymentReminder(false)}
            onUpgrade={() => setShowPaymentPage(true)}
          />
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-full sm:max-w-lg md:max-w-3xl grid-cols-5 mb-3 sm:mb-4 md:mb-6 h-10 sm:h-11">
            <TabsTrigger value="dashboard" className="gap-1 sm:gap-1.5 md:gap-2 text-xs sm:text-sm px-1 sm:px-2">
              <ChartBar size={14} className="sm:hidden" weight="duotone" />
              <ChartBar size={16} className="hidden sm:block md:hidden" weight="duotone" />
              <ChartBar size={18} className="hidden md:block" weight="duotone" />
              <span className="hidden xs:inline">{lang === 'fr' ? 'Tableau de bord' : 'Dashboard'}</span>
              <span className="xs:hidden">{lang === 'fr' ? 'TDB' : 'Dash'}</span>
            </TabsTrigger>
            <TabsTrigger value="positions" className="gap-1 sm:gap-1.5 md:gap-2 text-xs sm:text-sm px-1 sm:px-2">
              <Briefcase size={14} className="sm:hidden" weight="duotone" />
              <Briefcase size={16} className="hidden sm:block md:hidden" weight="duotone" />
              <Briefcase size={18} className="hidden md:block" weight="duotone" />
              <span className="hidden xs:inline">{t('nav.positions', lang)}</span>
              <span className="xs:hidden">Postes</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1 sm:gap-1.5 md:gap-2 text-xs sm:text-sm px-1 sm:px-2">
              <Clock size={14} className="sm:hidden" weight="duotone" />
              <Clock size={16} className="hidden sm:block md:hidden" weight="duotone" />
              <Clock size={18} className="hidden md:block" weight="duotone" />
              <span className="hidden xs:inline">{t('nav.history', lang)}</span>
              <span className="xs:hidden">Hist.</span>
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-1 sm:gap-1.5 md:gap-2 text-xs sm:text-sm px-1 sm:px-2">
              <Buildings size={14} className="sm:hidden" weight="duotone" />
              <Buildings size={16} className="hidden sm:block md:hidden" weight="duotone" />
              <Buildings size={18} className="hidden md:block" weight="duotone" />
              <span className="hidden xs:inline">{lang === 'fr' ? 'Entreprise' : 'Company'}</span>
              <span className="xs:hidden">{lang === 'fr' ? 'Ent.' : 'Co.'}</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="gap-1 sm:gap-1.5 md:gap-2 text-xs sm:text-sm px-1 sm:px-2">
              <Question size={14} className="sm:hidden" weight="duotone" />
              <Question size={16} className="hidden sm:block md:hidden" weight="duotone" />
              <Question size={18} className="hidden md:block" weight="duotone" />
              <span>FAQ</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0">
            <DashboardView
              positions={companyPositions}
              candidates={candidates || []}
              language={lang}
            />
          </TabsContent>

          <TabsContent value="positions" className="mt-0">
            <PositionsView
              positions={companyPositions}
              setPositions={setPositions}
              candidates={candidates || []}
              setCandidates={setCandidates}
              language={lang}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <HistoryView
              positions={companyPositions}
              candidates={candidates || []}
              language={lang}
            />
          </TabsContent>

          <TabsContent value="company" className="mt-0">
            <CompanyManagement
              company={currentCompany}
              currentUser={currentUser}
              allUsers={companyUsers}
              positionsCount={companyPositions.length}
              candidatesCount={candidates?.length || 0}
              language={lang}
              onUpdateCompany={handleUpdateCompany}
              onAddUser={handleAddUser}
            />
          </TabsContent>

          <TabsContent value="faq" className="mt-0">
            <FAQView language={lang} onNavigate={setActiveTab} />
          </TabsContent>
        </Tabs>
      </main>

      <ChangePasswordDialog
        open={showChangePassword}
        onOpenChange={setShowChangePassword}
        currentUser={currentUser}
        onPasswordChanged={handlePasswordChanged}
        language={lang}
      />

      <Toaster />
    </div>
  )
}

export default App
