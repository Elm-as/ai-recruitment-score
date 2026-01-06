import { Company, User, LicenseType } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Building, 
  Users, 
  Briefcase, 
  UserPlus,
  Calendar,
  CheckCircle,
  WarningCircle,
  Crown
} from '@phosphor-icons/react'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { toast } from 'sonner'

interface CompanyManagementProps {
  company: Company
  currentUser: User
  allUsers: User[]
  positionsCount: number
  candidatesCount: number
  language: 'fr' | 'en'
  onUpdateCompany: (company: Company) => void
  onAddUser: (user: User) => void
}

export function CompanyManagement({
  company,
  currentUser,
  allUsers,
  positionsCount,
  candidatesCount,
  language,
  onUpdateCompany,
  onAddUser
}: CompanyManagementProps) {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState<'admin' | 'recruiter' | 'viewer'>('recruiter')
  const [isLoading, setIsLoading] = useState(false)

  const t = {
    fr: {
      title: 'Gestion de l\'entreprise',
      licenseInfo: 'Informations de licence',
      usageStats: 'Statistiques d\'utilisation',
      teamMembers: 'Membres de l\'équipe',
      licenseType: 'Type de licence',
      status: 'Statut',
      active: 'Active',
      expired: 'Expirée',
      expiresOn: 'Expire le',
      users: 'Utilisateurs',
      positions: 'Postes',
      candidates: 'Candidats',
      unlimited: 'Illimité',
      features: 'Fonctionnalités',
      bulkOps: 'Opérations groupées',
      analytics: 'Analyses avancées',
      emails: 'Modèles d\'emails',
      api: 'Accès API',
      branding: 'Personnalisation',
      enabled: 'Activé',
      disabled: 'Désactivé',
      addUser: 'Ajouter un utilisateur',
      userName: 'Nom complet',
      userEmail: 'Email',
      role: 'Rôle',
      owner: 'Propriétaire',
      admin: 'Administrateur',
      recruiter: 'Recruteur',
      viewer: 'Observateur',
      cancel: 'Annuler',
      add: 'Ajouter',
      userAdded: 'Utilisateur ajouté avec succès',
      limitReached: 'Limite d\'utilisateurs atteinte',
      emailExists: 'Cet email est déjà utilisé',
      allFieldsRequired: 'Tous les champs sont requis',
      invalidEmail: 'Email invalide'
    },
    en: {
      title: 'Company Management',
      licenseInfo: 'License Information',
      usageStats: 'Usage Statistics',
      teamMembers: 'Team Members',
      licenseType: 'License Type',
      status: 'Status',
      active: 'Active',
      expired: 'Expired',
      expiresOn: 'Expires on',
      users: 'Users',
      positions: 'Positions',
      candidates: 'Candidates',
      unlimited: 'Unlimited',
      features: 'Features',
      bulkOps: 'Bulk Operations',
      analytics: 'Advanced Analytics',
      emails: 'Email Templates',
      api: 'API Access',
      branding: 'Custom Branding',
      enabled: 'Enabled',
      disabled: 'Disabled',
      addUser: 'Add User',
      userName: 'Full Name',
      userEmail: 'Email',
      role: 'Role',
      owner: 'Owner',
      admin: 'Administrator',
      recruiter: 'Recruiter',
      viewer: 'Viewer',
      cancel: 'Cancel',
      add: 'Add',
      userAdded: 'User added successfully',
      limitReached: 'User limit reached',
      emailExists: 'This email is already in use',
      allFieldsRequired: 'All fields are required',
      invalidEmail: 'Invalid email'
    }
  }

  const texts = t[language]

  const companyUsers = allUsers.filter(u => u.companyId === company.id)
  const daysUntilExpiry = Math.ceil((company.license.expiryDate - Date.now()) / (1000 * 60 * 60 * 24))
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0

  const usersPercentage = company.license.maxUsers === -1 
    ? 0 
    : (companyUsers.length / company.license.maxUsers) * 100

  const positionsPercentage = company.license.maxPositions === -1 
    ? 0 
    : (positionsCount / company.license.maxPositions) * 100

  const handleAddUser = async () => {
    if (!newUserName || !newUserEmail) {
      toast.error(texts.allFieldsRequired)
      return
    }

    if (!newUserEmail.includes('@')) {
      toast.error(texts.invalidEmail)
      return
    }

    if (company.license.maxUsers !== -1 && companyUsers.length >= company.license.maxUsers) {
      toast.error(texts.limitReached)
      return
    }

    if (allUsers.some(u => u.email.toLowerCase() === newUserEmail.toLowerCase())) {
      toast.error(texts.emailExists)
      return
    }

    setIsLoading(true)

    const temporaryPassword = await window.spark.kv.get<string>('temp-password') || 'ChangeMe123!'
    const { hashPassword } = await import('@/lib/password')
    const passwordHash = await hashPassword(temporaryPassword)

    const newUser: User = {
      id: `user-${Date.now()}`,
      companyId: company.id,
      name: newUserName,
      email: newUserEmail,
      passwordHash,
      role: newUserRole,
      createdAt: Date.now()
    }

    await onAddUser(newUser)
    
    setNewUserName('')
    setNewUserEmail('')
    setNewUserRole('recruiter')
    setIsAddUserOpen(false)
    setIsLoading(false)
    toast.success(texts.userAdded)
  }

  const getRoleIcon = (role: string) => {
    if (role === 'owner') return <Crown size={16} weight="fill" className="text-yellow-500" />
    return null
  }

  const getLicenseTypeBadge = (type: LicenseType) => {
    const variants: Record<LicenseType, 'default' | 'secondary' | 'outline'> = {
      trial: 'outline',
      starter: 'secondary',
      professional: 'default',
      enterprise: 'default'
    }
    return variants[type]
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold">{texts.title}</h2>
        {(currentUser.role === 'owner' || currentUser.role === 'admin') && (
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <UserPlus size={16} weight="bold" />
                <span className="hidden sm:inline">{texts.addUser}</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{texts.addUser}</DialogTitle>
                <DialogDescription>
                  {language === 'fr' 
                    ? 'Ajoutez un nouveau membre à votre équipe'
                    : 'Add a new member to your team'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="new-user-name">{texts.userName}</Label>
                  <Input
                    id="new-user-name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-user-email">{texts.userEmail}</Label>
                  <Input
                    id="new-user-email"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-user-role">{texts.role}</Label>
                  <Select value={newUserRole} onValueChange={(v: any) => setNewUserRole(v)}>
                    <SelectTrigger id="new-user-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">{texts.admin}</SelectItem>
                      <SelectItem value="recruiter">{texts.recruiter}</SelectItem>
                      <SelectItem value="viewer">{texts.viewer}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddUserOpen(false)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {texts.cancel}
                  </Button>
                  <Button 
                    onClick={handleAddUser} 
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {texts.add}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Building size={20} weight="duotone" />
              {company.name}
            </CardTitle>
            <CardDescription className="break-all">{company.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{texts.licenseType}</span>
                <Badge variant={getLicenseTypeBadge(company.license.type)}>
                  {company.license.type.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{texts.status}</span>
                <div className="flex items-center gap-1">
                  {company.license.isActive ? (
                    <>
                      <CheckCircle size={16} weight="fill" className="text-green-500" />
                      <span className="text-sm text-green-600">{texts.active}</span>
                    </>
                  ) : (
                    <>
                      <WarningCircle size={16} weight="fill" className="text-red-500" />
                      <span className="text-sm text-red-600">{texts.expired}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {company.license.isActive && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">{texts.expiresOn}</span>
                  <span className={isExpiringSoon ? 'text-orange-600 font-medium' : ''}>
                    {new Date(company.license.expiryDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                  </span>
                </div>
                {isExpiringSoon && (
                  <p className="text-xs text-orange-600">
                    {language === 'fr' 
                      ? `⚠️ Expire dans ${daysUntilExpiry} jours`
                      : `⚠️ Expires in ${daysUntilExpiry} days`}
                  </p>
                )}
              </div>
            )}

            <div className="pt-2 border-t space-y-2">
              <p className="text-sm font-semibold">{texts.features}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className={company.license.features.bulkOperations ? 'text-green-600' : 'text-muted-foreground'}>
                    {company.license.features.bulkOperations ? '✓' : '✗'}
                  </span>
                  <span>{texts.bulkOps}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={company.license.features.advancedAnalytics ? 'text-green-600' : 'text-muted-foreground'}>
                    {company.license.features.advancedAnalytics ? '✓' : '✗'}
                  </span>
                  <span>{texts.analytics}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={company.license.features.emailTemplates ? 'text-green-600' : 'text-muted-foreground'}>
                    {company.license.features.emailTemplates ? '✓' : '✗'}
                  </span>
                  <span>{texts.emails}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={company.license.features.apiAccess ? 'text-green-600' : 'text-muted-foreground'}>
                    {company.license.features.apiAccess ? '✓' : '✗'}
                  </span>
                  <span>{texts.api}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">{texts.usageStats}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Users size={16} weight="duotone" />
                  {texts.users}
                </span>
                <span className="font-medium">
                  {companyUsers.length}
                  {company.license.maxUsers !== -1 && ` / ${company.license.maxUsers}`}
                  {company.license.maxUsers === -1 && ` (${texts.unlimited})`}
                </span>
              </div>
              {company.license.maxUsers !== -1 && (
                <Progress value={usersPercentage} className="h-2" />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Briefcase size={16} weight="duotone" />
                  {texts.positions}
                </span>
                <span className="font-medium">
                  {positionsCount}
                  {company.license.maxPositions !== -1 && ` / ${company.license.maxPositions}`}
                  {company.license.maxPositions === -1 && ` (${texts.unlimited})`}
                </span>
              </div>
              {company.license.maxPositions !== -1 && (
                <Progress value={positionsPercentage} className="h-2" />
              )}
            </div>

            <div className="pt-2 border-t">
              <p className="text-sm font-semibold mb-3">{texts.teamMembers}</p>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {companyUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between text-xs sm:text-sm p-2 rounded bg-muted/50">
                    <div className="flex items-center gap-2 min-w-0">
                      {getRoleIcon(user.role)}
                      <div className="min-w-0">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0 ml-2">
                      {texts[user.role as keyof typeof texts] || user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
