import { Company, Language } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LockKey, Warning, CreditCard, Clock } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { getDaysUntilExpiry, formatCurrency, SUBSCRIPTION_PRICES } from '@/lib/payment'

interface SubscriptionBlockPageProps {
  company: Company
  language: Language
  onUpgrade: () => void
}

export function SubscriptionBlockPage({ company, language, onUpgrade }: SubscriptionBlockPageProps) {
  const isExpired = company.subscription.status === 'expired' || company.subscription.status === 'canceled'
  const isPastDue = company.subscription.status === 'past_due'
  const daysRemaining = getDaysUntilExpiry(company)

  const texts = {
    fr: {
      title: isExpired ? 'Abonnement expiré' : 'Paiement en retard',
      subtitle: isExpired 
        ? 'Votre abonnement a expiré. Renouvelez votre abonnement pour continuer à utiliser la plateforme.'
        : 'Votre paiement est en retard. Veuillez mettre à jour vos informations de paiement.',
      accessBlocked: 'Accès bloqué',
      features: 'Fonctionnalités bloquées',
      featureList: [
        'Création de nouveaux postes',
        'Ajout de candidats',
        'Analyse par IA',
        'Génération de questions',
        'Modèles d\'email',
        'Tableaux de bord analytiques',
      ],
      renewNow: 'Renouveler maintenant',
      updatePayment: 'Mettre à jour le paiement',
      contactSupport: 'Contacter le support',
      expiredDate: 'Expiré le',
      currentPlan: 'Plan actuel',
      monthlyPrice: 'Prix mensuel',
      supportEmail: 'support@recrutement-ia.com',
    },
    en: {
      title: isExpired ? 'Subscription Expired' : 'Payment Overdue',
      subtitle: isExpired 
        ? 'Your subscription has expired. Renew your subscription to continue using the platform.'
        : 'Your payment is overdue. Please update your payment information.',
      accessBlocked: 'Access Blocked',
      features: 'Blocked Features',
      featureList: [
        'Creating new positions',
        'Adding candidates',
        'AI analysis',
        'Question generation',
        'Email templates',
        'Analytics dashboards',
      ],
      renewNow: 'Renew Now',
      updatePayment: 'Update Payment',
      contactSupport: 'Contact Support',
      expiredDate: 'Expired on',
      currentPlan: 'Current Plan',
      monthlyPrice: 'Monthly Price',
      supportEmail: 'support@recruitment-ai.com',
    },
  }

  const t = texts[language]
  const price = SUBSCRIPTION_PRICES[company.license.type]

  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/5 via-background to-destructive/10 flex items-center justify-center p-3 xs:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-destructive/20 shadow-2xl">
          <CardHeader className="text-center space-y-3 xs:space-y-4 pb-6 xs:pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto"
            >
              <div className="w-16 h-16 xs:w-20 xs:h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <LockKey size={32} weight="duotone" className="xs:hidden text-destructive" />
                <LockKey size={40} weight="duotone" className="hidden xs:block text-destructive" />
              </div>
            </motion.div>
            <div>
              <CardTitle className="text-xl xs:text-2xl sm:text-3xl font-bold text-destructive">
                {t.title}
              </CardTitle>
              <CardDescription className="text-sm xs:text-base mt-2 xs:mt-3 leading-snug px-2 xs:px-0">
                {t.subtitle}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 xs:space-y-6">
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-3 xs:p-4">
              <div className="flex items-start gap-2 xs:gap-3">
                <Warning size={20} weight="duotone" className="xs:hidden mt-0.5 shrink-0 text-destructive" />
                <Warning size={24} weight="duotone" className="hidden xs:block mt-0.5 shrink-0 text-destructive" />
                <div className="space-y-1.5 xs:space-y-2 flex-1 min-w-0">
                  <h3 className="font-semibold text-sm xs:text-base text-foreground">{t.accessBlocked}</h3>
                  <p className="text-xs xs:text-sm text-muted-foreground truncate">
                    {company.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
              <div className="bg-muted/50 rounded-lg p-3 xs:p-4">
                <div className="text-[10px] xs:text-xs text-muted-foreground mb-1">{t.currentPlan}</div>
                <div className="text-base xs:text-lg font-semibold capitalize">{company.license.type}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 xs:p-4">
                <div className="text-[10px] xs:text-xs text-muted-foreground mb-1">{t.expiredDate}</div>
                <div className="text-base xs:text-lg font-semibold">
                  {new Date(company.license.expiryDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                </div>
              </div>
            </div>

            <div className="space-y-2 xs:space-y-3">
              <h4 className="font-semibold text-xs xs:text-sm text-muted-foreground flex items-center gap-1.5 xs:gap-2">
                <Clock size={14} className="xs:hidden" weight="duotone" />
                <Clock size={16} className="hidden xs:block" weight="duotone" />
                {t.features}
              </h4>
              <ul className="space-y-1.5 xs:space-y-2">
                {t.featureList.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-1.5 xs:gap-2 text-xs xs:text-sm text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive/50 shrink-0" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-4 xs:pt-6 space-y-2 xs:space-y-3">
              <Button
                onClick={onUpgrade}
                className="w-full h-10 xs:h-12 text-sm xs:text-base gap-1.5 xs:gap-2 shadow-lg"
                size="lg"
              >
                <CreditCard size={18} className="xs:hidden" weight="duotone" />
                <CreditCard size={20} className="hidden xs:block" weight="duotone" />
                {isPastDue ? t.updatePayment : t.renewNow}
              </Button>
              
              <Button
                variant="outline"
                className="w-full h-9 xs:h-10 text-xs xs:text-sm"
                onClick={() => window.location.href = `mailto:${t.supportEmail}`}
              >
                {t.contactSupport}
              </Button>
            </div>

            {!isExpired && price && (
              <div className="text-center pt-3 xs:pt-4 border-t">
                <p className="text-xs xs:text-sm text-muted-foreground">
                  {t.monthlyPrice}: <span className="font-semibold text-foreground">{formatCurrency(price.monthly)}</span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
