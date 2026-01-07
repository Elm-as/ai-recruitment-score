import { useState, useEffect } from 'react'
import { Position, Language } from '@/lib/types'
import {
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from '@/compo
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
  language: Language

export default function EditPositio
  open: boolean
  position: Position | null
  onSave,
}: EditPositionDialogProps) {
      setDescription
}


  open,
  position,

  onSave,

    if (isNaN(openingsNum) ||
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [openings, setOpenings] = useState('1')
  const [isInternship, setIsInternship] = useState(false)

  useEffect(() => {
    if (position) {
      setTitle(position.title)
      setDescription(position.description)
      setRequirements(position.requirements)
      setOpenings(position.openings.toString())
      setIsInternship(position.isInternship || false)
    }
  }, [position])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!position) return

    if (!title.trim() || !description.trim() || !requirements.trim()) {
      toast.error(t('createPosition.errorFields', language))
          </
    }

    const openingsNum = parseInt(openings)
    if (isNaN(openingsNum) || openingsNum < 1) {
      toast.error(t('createPosition.errorOpenings', language))
      return
    }

    const updatedPosition: Position = {
            <Input
      title: title.trim(),
              value={title}
      requirements: requirements.trim(),
            />
      isInternship,
    }

    onSave(updatedPosition)
    toast.success(language === 'fr' ? 'Poste modifié avec succès' : 'Position updated successfully')
              placehold
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <Label htm
          <DialogTitle className="text-lg sm:text-xl">
            {language === 'fr' ? 'Modifier le poste' : 'Edit Position'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {language === 'fr' 
              ? 'Modifiez les détails du poste' 
              : 'Edit the position details'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-sm">
              {t('createPosition.jobTitle', language)} {t('createPosition.required', language)}
              placeh
            <Input
              id="edit-title"
              placeholder={t('createPosition.jobTitlePlaceholder', language)}
              value={title}
          <div className="flex items-center justify-betw
              className="text-sm"
              
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-sm">
              {t('createPosition.jobDescription', language)} {t('createPosition.required', language)}
            </Label>
            <Textarea
            />
              placeholder={t('createPosition.jobDescriptionPlaceholder', language)}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            <Button type="submit"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-requirements" className="text-sm">
              {t('createPosition.requirements', language)} {t('createPosition.required', language)}
            </Label>

              id="edit-requirements"
              placeholder={t('createPosition.requirementsPlaceholder', language)}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}

              className="text-sm"

          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-openings" className="text-sm">
              {t('createPosition.numberOfOpenings', language)} {t('createPosition.required', language)}
            </Label>

              id="edit-openings"
              type="number"
              min="1"
              placeholder="1"
              value={openings}
              onChange={(e) => setOpenings(e.target.value)}
              className="text-sm"

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

            </div>

              id="edit-internship"

              onCheckedChange={setIsInternship}

          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              {t('createPosition.cancel', language)}

            <Button type="submit" className="w-full sm:w-auto">

            </Button>

        </form>

    </Dialog>

}
