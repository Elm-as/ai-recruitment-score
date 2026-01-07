import { useState, useEffect } from 'react'
import { t } from '@/lib/translations'
import { t } from '@/lib/translations'
import {
  DialogD
  DialogHeader,
} from '@/components
import { Input 
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'


  open,
  position,
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

      toast.error(t('createPosition.errorFields', language))

    const openingsN
      toast.err
    }
    const updatedPosition: Position = {
      title: title.trim(),
      requirements: requirements.trim(),
    }
    onSave(updatedPosi


    <Dialog open={open

            {language === 'fr' ? 'Modifier le poste' : 'Edit Position'}
          <DialogDescription className="text-sm">
            
     

          <div className="space-y-2">
              {t('createPosition.title', languag
            <Input
            
     


            <Label
            </Label>
              id="edit-description"
              onChange={(e) => setDescri
              rows={4}
     

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
            <B
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




















