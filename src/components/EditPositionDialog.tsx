import { useState, useEffect } from 'react'
import { t } from '@/lib/translations'
import { t } from '@/lib/translations'
  Dialog
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
import { toast 
interface Edit
  onOpenChange: (open: boolean)
  language: Language
}
export default function EditPositionDialog({
  onOpenChange,
  language,
}: EditPositionDialogProps) {

  const [openings, setOpenings] = u

    setTitle(position.title)
    setRequirements(
  language: Language

}

export default function EditPositionDialog({

  onOpenChange,
      retur
  language,
      ...
}: EditPositionDialogProps) {
      openings: openingsNum,
    }
    onSave(updatedPosition)
    onOpenChange(false)


        <DialogHead
    setTitle(position.title)
          <DialogDescription className="
              ? 'Modifiez les informations
          </DialogDescription>

          <div c

            <Input
              value={t

            />

      return
     

              onChange={(e) => setDescript
              rows={4}
            />

     

              id="edit-requirements"
              onCh
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

            <Button type="button" variant="outlin
            </Button>
              {language === 'fr' ? 'Enregistrer' : 'Save'}
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

