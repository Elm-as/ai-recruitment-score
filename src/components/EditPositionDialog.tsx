import { useState, useEffect } from 'react'
import { t } from '@/lib/translations'
import { t } from '@/lib/translations'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
} from '@/compo
import { Input
import { Textarea } from '@/com
import { toast } from 'sonner'
interface EditPositionDialogProps {
  onOpenChange: (open: boolean) => void
  onSave: (position: Position) => void
}
export default function EditPo

  onSave,
}: EditPosition
  const [description, setDescription] =
  const [openings, s

  language: Language
 

export default function EditPositionDialog({

  onOpenChange,
    if (!ti
      ret
  language,
}: EditPositionDialogProps) {
      return

      ...position,
      description: description.trim(),
      openings: openingsNum,

    onSave(updatedP
    onOpenChange(false)

    <Dialog open={open} onOpenChange={onOp
        <DialogHeader>
            {language === 'fr' ? 'Modifier le p
          <DialogDescription className="text-xs sm:te
    }
          </DialogDesc

            <Label htmlFor="edit-title" classNam
            </Label>

              onChange={(e) => setTitle(e.target.value)}
            />
      return
     

              id="edit-description"
              onChange={(e) => setDescription(e.
              className="text-sm"
          </
     

            <Textarea
              valu
              rows={4}
            />

      openings: openingsNum,
            </Label
    }

    onSave(updatedPosition)
            />
    onOpenChange(false)
   

          
                  ? 'Les faiblesses seront moins pén
              </p>
            <Switch
              checked={isInternship}
            />

            <Button type="button" variant="outline" onClick=
            </Button>
              {language === 'fr' ? 'Enregistrer' : 'S
          </DialogFooter>
          </DialogDescription>
  )





            <Input




            />










              rows={4}

            />







              id="edit-requirements"


              rows={4}

            />













            />











              </p>

            <Switch

              checked={isInternship}

            />





            </Button>

              {language === 'fr' ? 'Enregistrer' : 'Save'}

          </DialogFooter>

      </DialogContent>

  )

