import { useState, useEffect } from 'react'
import { Position, Language } from '@/lib/types'
import { t } from '@/lib/translations'
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
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

interface EditPositionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  position: Position
  language: Language
  onSave: (position: Position) => void
}

export default function EditPositionDialog({
  open,
  onOpenChange,
  position,
  language,
  onSave,
}: EditPositionDialogProps) {
  const [title, setTitle] = useState(position.title)
  const [description, setDescription] = useState(position.description)
  const [requirements, setRequirements] = useState(position.requirements)
  const [openings, setOpenings] = useState(position.openings.toString())
  const [isInternship, setIsInternship] = useState(position.isInternship || false)

  useEffect(() => {
    setTitle(position.title)
    setDescription(position.description)
    setRequirements(position.requirements)
    setOpenings(position.openings.toString())
    setIsInternship(position.isInternship || false)
  }, [position])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim() || !requirements.trim()) {
      toast.error(t('createPosition.errorFields', language))
      return
    }

    const openingsNum = parseInt(openings)
    if (isNaN(openingsNum) || openingsNum < 1) {
      toast.error(t('createPosition.errorOpenings', language))
      return
    }

    const updatedPosition: Position = {
      ...position,
      title: title.trim(),
      description: description.trim(),
      requirements: requirements.trim(),
      openings: openingsNum,
      isInternship,
    }

    onSave(updatedPosition)
    toast.success(language === 'fr' ? 'Poste mis à jour avec succès' : 'Position updated successfully')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">
            {language === 'fr' ? 'Modifier le poste' : 'Edit Position'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {language === 'fr' 
              ? 'Modifiez les informations du poste. Les candidats déjà évalués pourront être réévalués.' 
              : 'Edit the position information. Already evaluated candidates can be re-evaluated.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-sm font-medium">
              {t('createPosition.title', language)}
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('createPosition.titlePlaceholder', language)}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-sm font-medium">
              {t('createPosition.description', language)}
            </Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('createPosition.descriptionPlaceholder', language)}
              rows={4}
              className="text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-requirements" className="text-sm font-medium">
              {t('createPosition.requirements', language)}
            </Label>
            <Textarea
              id="edit-requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder={t('createPosition.requirementsPlaceholder', language)}
              rows={4}
              className="text-sm resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-openings" className="text-sm font-medium">
              {t('createPosition.openings', language)}
            </Label>
            <Input
              id="edit-openings"
              type="number"
              min="1"
              value={openings}
              onChange={(e) => setOpenings(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="edit-internship" className="text-sm font-medium cursor-pointer">
                {language === 'fr' ? 'Il s\'agit d\'un stage' : 'This is an internship'}
              </Label>
              <p className="text-xs text-muted-foreground">
                {language === 'fr' 
                  ? 'Les faiblesses seront moins pénalisantes dans l\'évaluation' 
                  : 'Weaknesses will be less penalizing in the evaluation'}
              </p>
            </div>
            <Switch
              id="edit-internship"
              checked={isInternship}
              onCheckedChange={setIsInternship}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel', language)}
            </Button>
            <Button type="submit">
              {language === 'fr' ? 'Enregistrer' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
