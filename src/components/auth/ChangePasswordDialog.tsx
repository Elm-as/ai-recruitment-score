import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Eye, EyeSlash, Lock } from '@phosphor-icons/react'
import { User } from '@/lib/types'
import { verifyPassword, hashPassword, validatePassword } from '@/lib/password'
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator'

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUser: User
  onPasswordChanged: (updatedUser: User) => void
  language: 'fr' | 'en'
}

export function ChangePasswordDialog({ 
  open, 
  onOpenChange, 
  currentUser, 
  onPasswordChanged,
  language 
}: ChangePasswordDialogProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const t = {
    fr: {
      title: 'Changer le Mot de Passe',
      description: 'Mettez à jour votre mot de passe pour sécuriser votre compte',
      currentPassword: 'Mot de passe actuel',
      newPassword: 'Nouveau mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      updatePassword: 'Mettre à jour',
      cancel: 'Annuler',
      passwordUpdated: 'Mot de passe mis à jour avec succès',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      incorrectPassword: 'Mot de passe actuel incorrect',
      allFieldsRequired: 'Tous les champs sont requis',
      showPassword: 'Afficher',
      hidePassword: 'Masquer',
    },
    en: {
      title: 'Change Password',
      description: 'Update your password to secure your account',
      currentPassword: 'Current password',
      newPassword: 'New password',
      confirmPassword: 'Confirm password',
      updatePassword: 'Update Password',
      cancel: 'Cancel',
      passwordUpdated: 'Password updated successfully',
      passwordMismatch: 'Passwords do not match',
      incorrectPassword: 'Current password incorrect',
      allFieldsRequired: 'All fields are required',
      showPassword: 'Show',
      hidePassword: 'Hide',
    }
  }

  const texts = t[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(texts.allFieldsRequired)
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error(texts.passwordMismatch)
      return
    }

    const validation = validatePassword(newPassword, language)
    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error))
      return
    }

    setIsLoading(true)

    try {
      const isCurrentPasswordValid = await verifyPassword(currentPassword, currentUser.passwordHash)
      
      if (!isCurrentPasswordValid) {
        toast.error(texts.incorrectPassword)
        setIsLoading(false)
        return
      }

      const newPasswordHash = await hashPassword(newPassword)
      
      const updatedUser: User = {
        ...currentUser,
        passwordHash: newPasswordHash,
      }

      const existingUsers = await window.spark.kv.get<User[]>('users') || []
      const updatedUsers = existingUsers.map(u => 
        u.id === currentUser.id ? updatedUser : u
      )
      
      await window.spark.kv.set('users', updatedUsers)

      onPasswordChanged(updatedUser)
      toast.success(texts.passwordUpdated)
      
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      onOpenChange(false)
    } catch (error) {
      toast.error('Error updating password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Lock size={24} weight="duotone" className="text-primary" />
          </div>
          <DialogTitle>{texts.title}</DialogTitle>
          <DialogDescription>{texts.description}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">{texts.currentPassword}</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                tabIndex={-1}
              >
                {showCurrentPassword ? (
                  <EyeSlash size={18} className="text-muted-foreground" />
                ) : (
                  <Eye size={18} className="text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">{texts.newPassword}</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="new-password"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowNewPassword(!showNewPassword)}
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <EyeSlash size={18} className="text-muted-foreground" />
                ) : (
                  <Eye size={18} className="text-muted-foreground" />
                )}
              </Button>
            </div>
            {newPassword && <PasswordStrengthIndicator password={newPassword} language={language} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">{texts.confirmPassword}</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
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
              >
                {showConfirmPassword ? (
                  <EyeSlash size={18} className="text-muted-foreground" />
                ) : (
                  <Eye size={18} className="text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              {texts.cancel}
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
                  {texts.updatePassword}...
                </span>
              ) : (
                texts.updatePassword
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
