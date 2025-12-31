import { useState } from 'react'
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

interface CreatePositionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreatePosition: (position: Position) => void
  language: Language
}

export default function CreatePositionDialog({
  open,
  onOpenChange,
  onCreatePosition,
  language,
}: CreatePositionDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [openings, setOpenings] = useState('1')

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

    const newPosition: Position = {
      id: `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: title.trim(),
      description: description.trim(),
      requirements: requirements.trim(),
      openings: openingsNum,
      createdAt: Date.now(),
      status: 'active',
    }

    onCreatePosition(newPosition)
    toast.success(t('createPosition.success', language))

    setTitle('')
    setDescription('')
    setRequirements('')
    setOpenings('1')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('createPosition.title', language)}</DialogTitle>
          <DialogDescription>
            {t('createPosition.description', language)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('createPosition.jobTitle', language)} {t('createPosition.required', language)}</Label>
            <Input
              id="title"
              placeholder={t('createPosition.jobTitlePlaceholder', language)}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('createPosition.jobDescription', language)} {t('createPosition.required', language)}</Label>
            <Textarea
              id="description"
              placeholder={t('createPosition.jobDescriptionPlaceholder', language)}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">{t('createPosition.requirements', language)} {t('createPosition.required', language)}</Label>
            <Textarea
              id="requirements"
              placeholder={t('createPosition.requirementsPlaceholder', language)}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="openings">{t('createPosition.numberOfOpenings', language)} {t('createPosition.required', language)}</Label>
            <Input
              id="openings"
              type="number"
              min="1"
              placeholder="1"
              value={openings}
              onChange={(e) => setOpenings(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('createPosition.cancel', language)}
            </Button>
            <Button type="submit">{t('createPosition.create', language)}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
