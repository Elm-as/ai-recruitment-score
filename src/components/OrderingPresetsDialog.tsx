import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { OrderingPreset, Candidate, Language } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { FloppyDisk, ArrowClockwise, Trash, ClockCounterClockwise, CheckCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

interface OrderingPresetsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  positionId: string
  candidates: Candidate[]
  onApplyPreset: (preset: OrderingPreset) => void
  language: Language
  activePresetId: string | null
}

export default function OrderingPresetsDialog({
  open,
  onOpenChange,
  positionId,
  candidates,
  onApplyPreset,
  language,
  activePresetId,
}: OrderingPresetsDialogProps) {
  const [presets, setPresets] = useKV<OrderingPreset[]>('ordering-presets', [])
  const [presetName, setPresetName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [presetToDelete, setPresetToDelete] = useState<OrderingPreset | null>(null)

  const positionPresets = (presets || []).filter((p) => p.positionId === positionId)

  const saveCurrentOrder = async () => {
    if (!presetName.trim()) {
      toast.error(language === 'fr' ? 'Veuillez entrer un nom pour le preset' : 'Please enter a preset name')
      return
    }

    setIsSaving(true)

    try {
      const candidateOrder = [...candidates]
        .sort((a, b) => {
          if (a.customOrder !== undefined && b.customOrder !== undefined) {
            return a.customOrder - b.customOrder
          }
          return b.score - a.score
        })
        .map((c) => c.id)

      const newPreset: OrderingPreset = {
        id: `preset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        positionId,
        name: presetName.trim(),
        candidateOrder,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      setPresets((prev) => [...(prev || []), newPreset])

      toast.success(
        language === 'fr'
          ? `Preset "${presetName}" enregistré avec succès`
          : `Preset "${presetName}" saved successfully`
      )

      setPresetName('')
    } catch (error) {
      toast.error(language === 'fr' ? 'Erreur lors de l\'enregistrement' : 'Error saving preset')
    } finally {
      setIsSaving(false)
    }
  }

  const updatePreset = async (preset: OrderingPreset) => {
    const candidateOrder = [...candidates]
      .sort((a, b) => {
        if (a.customOrder !== undefined && b.customOrder !== undefined) {
          return a.customOrder - b.customOrder
        }
        return b.score - a.score
      })
      .map((c) => c.id)

    const updatedPreset: OrderingPreset = {
      ...preset,
      candidateOrder,
      updatedAt: Date.now(),
    }

    setPresets((prev) =>
      (prev || []).map((p) => (p.id === preset.id ? updatedPreset : p))
    )

    toast.success(
      language === 'fr'
        ? `Preset "${preset.name}" mis à jour`
        : `Preset "${preset.name}" updated`
    )
  }

  const deletePreset = () => {
    if (!presetToDelete) return

    setPresets((prev) => (prev || []).filter((p) => p.id !== presetToDelete.id))

    toast.success(
      language === 'fr'
        ? `Preset "${presetToDelete.name}" supprimé`
        : `Preset "${presetToDelete.name}" deleted`
    )

    setDeleteDialogOpen(false)
    setPresetToDelete(null)
  }

  const loadPreset = (preset: OrderingPreset) => {
    onApplyPreset(preset)
    toast.success(
      language === 'fr'
        ? `Preset "${preset.name}" appliqué`
        : `Preset "${preset.name}" applied`
    )
    onOpenChange(false)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg flex items-center gap-2">
              <FloppyDisk size={20} weight="duotone" />
              {language === 'fr' ? 'Presets d\'Ordre' : 'Order Presets'}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {language === 'fr'
                ? 'Enregistrez et gérez plusieurs ordres personnalisés de candidats'
                : 'Save and manage multiple custom candidate orderings'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="preset-name" className="text-sm">
                {language === 'fr' ? 'Enregistrer l\'ordre actuel' : 'Save current order'}
              </Label>
              <div className="flex gap-2">
                <Input
                  id="preset-name"
                  placeholder={language === 'fr' ? 'Nom du preset...' : 'Preset name...'}
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveCurrentOrder()
                    }
                  }}
                  className="flex-1"
                />
                <Button
                  onClick={saveCurrentOrder}
                  disabled={isSaving || !presetName.trim()}
                  className="gap-2 shrink-0"
                >
                  <FloppyDisk size={18} weight="bold" />
                  <span className="hidden xs:inline">
                    {language === 'fr' ? 'Enregistrer' : 'Save'}
                  </span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm">
                {language === 'fr' ? 'Presets enregistrés' : 'Saved presets'}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {positionPresets.length}
                </Badge>
              </Label>

              {positionPresets.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-6 sm:p-8 text-center bg-muted/20">
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {language === 'fr'
                      ? 'Aucun preset enregistré pour cette position'
                      : 'No presets saved for this position'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {language === 'fr'
                      ? 'Organisez vos candidats et enregistrez l\'ordre ci-dessus'
                      : 'Arrange your candidates and save the order above'}
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[300px] rounded-lg border">
                  <div className="p-2 space-y-2">
                    {positionPresets.map((preset, index) => {
                      const isActive = preset.id === activePresetId
                      
                      return (
                        <motion.div
                          key={preset.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-start gap-2 p-3 rounded-lg border transition-all ${
                            isActive
                              ? 'bg-accent border-primary shadow-md ring-2 ring-primary/20'
                              : 'bg-card hover:bg-accent/50'
                          }`}
                        >
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              {isActive && (
                                <CheckCircle
                                  size={18}
                                  weight="fill"
                                  className="text-primary shrink-0 animate-in fade-in zoom-in duration-300"
                                />
                              )}
                              <h4 className={`font-semibold text-sm truncate ${
                                isActive ? 'text-primary' : ''
                              }`}>
                                {preset.name}
                              </h4>
                              {isActive && (
                                <Badge className="bg-primary text-primary-foreground text-xs shrink-0 animate-in fade-in slide-in-from-left-2 duration-300">
                                  {language === 'fr' ? 'Actif' : 'Active'}
                                </Badge>
                              )}
                              {preset.updatedAt !== preset.createdAt && !isActive && (
                                <Badge variant="outline" className="text-xs shrink-0">
                                  {language === 'fr' ? 'Modifié' : 'Updated'}
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ClockCounterClockwise size={12} />
                                {formatDate(preset.createdAt)}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {preset.candidateOrder.length}{' '}
                                {language === 'fr' ? 'candidats' : 'candidates'}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              size="sm"
                              variant={isActive ? 'default' : 'ghost'}
                              onClick={() => loadPreset(preset)}
                              disabled={isActive}
                              className="h-8 gap-1.5"
                            >
                              <ArrowClockwise size={16} weight="bold" />
                              <span className="hidden sm:inline text-xs">
                                {language === 'fr' ? 'Charger' : 'Load'}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updatePreset(preset)}
                              className="h-8 gap-1.5"
                            >
                              <FloppyDisk size={16} weight="bold" />
                              <span className="hidden sm:inline text-xs">
                                {language === 'fr' ? 'Mettre à jour' : 'Update'}
                              </span>
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setPresetToDelete(preset)
                                setDeleteDialogOpen(true)
                              }}
                              className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash size={16} weight="bold" />
                            </Button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {language === 'fr' ? 'Fermer' : 'Close'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[95vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">
              {language === 'fr' ? 'Supprimer le preset' : 'Delete preset'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              {language === 'fr'
                ? `Êtes-vous sûr de vouloir supprimer le preset "${presetToDelete?.name}" ? Cette action est irréversible.`
                : `Are you sure you want to delete the preset "${presetToDelete?.name}"? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">
              {language === 'fr' ? 'Annuler' : 'Cancel'}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deletePreset}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
            >
              {language === 'fr' ? 'Supprimer' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
