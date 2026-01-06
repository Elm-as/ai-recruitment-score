import { Company, Language } from '@/lib/types'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { X, Warning, Bell, CreditCard } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { getDaysUntilExpiry, formatCurrency, SUBSCRIPTION_PRICES } from '@/lib/payment'
import { useState } from 'react'

interface PaymentReminderBannerProps {
  company: Company
  language: Language
  onDismiss: () => void
  onUpgrade: () => void
}

export function PaymentReminderBanner({ company, language, onDismiss, onUpgrade }: PaymentReminderBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const daysRemaining = getDaysUntilExpiry(company)
  const isPastDue = company.subscription.status === 'past_due'
  const isExpiringSoon = daysRemaining <= 3 && daysRemaining > 0

  const texts = {
    fr: {
      expiringSoon: `Votre abonnement expire dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}.`,
      pastDue: 'Votre paiement est en retard. Mettez à jour vos informations de paiement.',
      upcoming: `Paiement à venir dans ${daysRemaining} jours.`,
      renewNow: 'Renouveler',
      updatePayment: 'Mettre à jour',
      dismiss: 'Ignorer',
    },
    en: {
      expiringSoon: `Your subscription expires in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}.`,
      pastDue: 'Your payment is overdue. Please update your payment information.',
      upcoming: `Payment due in ${daysRemaining} days.`,
      renewNow: 'Renew Now',
      updatePayment: 'Update Payment',
      dismiss: 'Dismiss',
    },
  }

  const t = texts[language]

  let message = t.upcoming
  let variant: 'default' | 'destructive' = 'default'
  let icon = <Bell size={20} weight="duotone" />

  if (isPastDue) {
    message = t.pastDue
    variant = 'destructive'
    icon = <Warning size={20} weight="duotone" />
  } else if (isExpiringSoon) {
    message = t.expiringSoon
    variant = 'destructive'
    icon = <Warning size={20} weight="duotone" />
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss()
    }, 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <Alert variant={variant} className="mb-3 sm:mb-4 border-2">
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-3 sm:gap-4">
              <div className="flex items-start xs:items-center gap-2 xs:gap-3 flex-1 min-w-0 w-full xs:w-auto">
                <div className="shrink-0 mt-0.5 xs:mt-0">
                  {icon}
                </div>
                <AlertDescription className="text-xs xs:text-sm font-medium flex-1 leading-snug">
                  {message}
                </AlertDescription>
              </div>
              <div className="flex items-center gap-1.5 xs:gap-2 shrink-0 w-full xs:w-auto justify-end">
                <Button
                  onClick={onUpgrade}
                  size="sm"
                  variant={variant === 'destructive' ? 'default' : 'default'}
                  className="gap-1.5 h-7 xs:h-8 text-xs xs:text-sm px-2.5 xs:px-3 flex-1 xs:flex-initial"
                >
                  <CreditCard size={14} className="xs:hidden" weight="duotone" />
                  <CreditCard size={16} className="hidden xs:block" weight="duotone" />
                  <span className="truncate">
                    {isPastDue ? t.updatePayment : t.renewNow}
                  </span>
                </Button>
                <Button
                  onClick={handleDismiss}
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 xs:h-8 xs:w-8 p-0 shrink-0"
                >
                  <X size={14} className="xs:hidden" />
                  <X size={16} className="hidden xs:block" />
                  <span className="sr-only">{t.dismiss}</span>
                </Button>
              </div>
            </div>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
