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

  useEffect(() => {
    if (open) {
      setTitle(position.title)
      setDescription(position.description)
      setRequirements(position.requirements)
      setOpenings(position.openings.toString())
    }
  }, [open, position])

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
              ? 'Modifiez les informations du poste.' 
              : 'Edit the position information.'}
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
              placeholder="1"
              value={openings}
              onChange={(e) => setOpenings(e.target.value)}
              className="text-sm"
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              {t('createPosition.cancel', language)}
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {language === 'fr' ? 'Enregistrer' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
