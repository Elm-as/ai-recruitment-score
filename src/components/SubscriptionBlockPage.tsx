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
    <div className="min-h-screen bg-gradient-to-br from-destructive/5 via-background to-destructive/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="border-destructive/20 shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mx-auto"
            >
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
                <LockKey size={40} weight="duotone" className="text-destructive" />
              </div>
            </motion.div>
            <div>
              <CardTitle className="text-3xl font-bold text-destructive">
                {t.title}
              </CardTitle>
              <CardDescription className="text-base mt-3">
                {t.subtitle}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Warning size={24} weight="duotone" className="text-destructive mt-0.5 shrink-0" />
                <div className="space-y-2 flex-1">
                  <h3 className="font-semibold text-foreground">{t.accessBlocked}</h3>
                  <p className="text-sm text-muted-foreground">
                    {company.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">{t.currentPlan}</div>
                <div className="text-lg font-semibold capitalize">{company.license.type}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">{t.expiredDate}</div>
                <div className="text-lg font-semibold">
                  {new Date(company.license.expiryDate).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                <Clock size={16} weight="duotone" />
                {t.features}
              </h4>
              <ul className="space-y-2">
                {t.featureList.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive/50" />
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-6 space-y-3">
              <Button
                onClick={onUpgrade}
                className="w-full h-12 text-base gap-2 shadow-lg"
                size="lg"
              >
                <CreditCard size={20} weight="duotone" />
                {isPastDue ? t.updatePayment : t.renewNow}
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = `mailto:${t.supportEmail}`}
              >
                {t.contactSupport}
              </Button>
            </div>

            {!isExpired && price && (
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
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
