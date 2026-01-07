import { useState, useEffect } from 'react'
import { t } from '@/lib/translations'
  Dialog,
  Dialog
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,

  open: boolea
  position: Position
  language: Language

  open,
  position,
  language,

  const [requirements, setRequireme

    if (open) {
      setDescription
      setOpenings(position.openings.toString())
  }, [open, position
 

      toast.error(t('createPosition.errorFie
    }
    const openi
      toast
    }
    const u
      title: title.trim(),
      requirements: requirements.trim(),
    }
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

              placeholder="1"
              onChange={(e) => setOpenings(e.target.value)}
            />


          
              {language === 'fr' ? 'Enregistrer' : '
          </DialogFooter>
      </DialogContent>
  )


























































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
