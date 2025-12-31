import { useState } from 'react'
import { Position } from '@/lib/types'
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
}

export default function CreatePositionDialog({
  open,
  onOpenChange,
  onCreatePosition,
}: CreatePositionDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState('')
  const [openings, setOpenings] = useState('1')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !description.trim() || !requirements.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    const openingsNum = parseInt(openings)
    if (isNaN(openingsNum) || openingsNum < 1) {
      toast.error('Number of openings must be at least 1')
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
    toast.success('Position created successfully')

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
          <DialogTitle>Create New Position</DialogTitle>
          <DialogDescription>
            Define the job position details. This information will be used to evaluate candidates.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Senior React Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and what the ideal candidate will do..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements & Qualifications *</Label>
            <Textarea
              id="requirements"
              placeholder="List the required skills, experience, education, and qualifications..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="openings">Number of Openings *</Label>
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
              Cancel
            </Button>
            <Button type="submit">Create Position</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
