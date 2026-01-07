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
  onSave: (position: Position) => void
  language: Language
}

export default function EditPositionDialog({
  open,
  onOpenChange,
  position,
  onSave,
  language,
}: EditPositionDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [openings, setOpenings] = useState('1')
  const [isInternship, setIsInternship] = useState(false)

  useEffect(() => {
    if (open && position) {
      setTitle(position.title)
      setDescription(position.description)
      setRequirements(position.requirements)
      setOpenings(position.openings.toString())
      setIsInternship(position.isInternship || false)
    }
  }, [open, position])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim() || !requirements.trim()) {
      toast.error(language === 'fr' ? 'Tous les champs sont requis' : 'All fields are required')
      return
    }

    const openingsNum = parseInt(openings)
    if (isNaN(openingsNum) || openingsNum < 1) {
      toast.error(language === 'fr' ? 'Le nombre de postes doit être au moins 1' : 'Number of openings must be at least 1')
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
    toast.success(language === 'fr' ? 'Poste modifié avec succès' : 'Position updated successfully')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {language === 'fr' ? 'Modifier le poste' : 'Edit Position'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            {language === 'fr' 
              ? 'Modifiez les informations du poste' 
              : 'Update the position information'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-sm">
              {language === 'fr' ? 'Titre du poste' : 'Job Title'} *
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-sm">
              {language === 'fr' ? 'Description' : 'Description'} *
            </Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-requirements" className="text-sm">
              {language === 'fr' ? 'Exigences' : 'Requirements'} *
            </Label>
            <Textarea
              id="edit-requirements"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
              className="text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-openings" className="text-sm">
              {language === 'fr' ? 'Nombre de postes' : 'Number of Openings'} *
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

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
              {language === 'fr' ? 'Annuler' : 'Cancel'}
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
