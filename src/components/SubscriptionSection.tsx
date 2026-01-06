import { Company, Language, PaymentHistory } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Calendar, CheckCircle, WarningCircle, Clock } from '@phosphor-icons/react'
import { getDaysUntilExpiry, formatCurrency, SUBSCRIPTION_PRICES } from '@/lib/payment'
import { useKV } from '@github/spark/hooks'
import { Separator } from '@/components/ui/separator'

interface SubscriptionSectionProps {
  company: Company
  language: Language
  onManageSubscription: () => void
}

export function SubscriptionSection({ company, language, onManageSubscription }: SubscriptionSectionProps) {
  const [paymentHistory] = useKV<PaymentHistory[]>('payment-history', [])
  const daysRemaining = getDaysUntilExpiry(company)
  const companyPayments = paymentHistory?.filter(p => p.companyId === company.id) || []
  const recentPayments = companyPayments.slice(-3).reverse()

  const texts = {
    fr: {
      title: 'Abonnement et facturation',
      currentPlan: 'Plan actuel',
      status: 'Statut',
      expiresIn: 'Expire dans',
      days: 'jours',
      nextPayment: 'Prochain paiement',
      paymentMethod: 'Méthode de paiement',
      recentPayments: 'Paiements récents',
      manageSubscription: 'Gérer l\'abonnement',
      noPaymentMethod: 'Aucune méthode configurée',
      noPayments: 'Aucun paiement enregistré',
      amount: 'Montant',
      date: 'Date',
      statusLabel: 'Statut',
      succeeded: 'Réussi',
      failed: 'Échoué',
      pending: 'En attente',
      refunded: 'Remboursé',
      active: 'Actif',
      past_due: 'En retard',
      canceled: 'Annulé',
      expired: 'Expiré',
      trialing: 'Essai',
    },
    en: {
      title: 'Subscription & Billing',
      currentPlan: 'Current Plan',
      status: 'Status',
      expiresIn: 'Expires in',
      days: 'days',
      nextPayment: 'Next Payment',
      paymentMethod: 'Payment Method',
      recentPayments: 'Recent Payments',
      manageSubscription: 'Manage Subscription',
      noPaymentMethod: 'No payment method',
      noPayments: 'No payments recorded',
      amount: 'Amount',
      date: 'Date',
      statusLabel: 'Status',
      succeeded: 'Succeeded',
      failed: 'Failed',
      pending: 'Pending',
      refunded: 'Refunded',
      active: 'Active',
      past_due: 'Past Due',
      canceled: 'Canceled',
      expired: 'Expired',
      trialing: 'Trial',
    },
  }

  const t = texts[language]

  const getStatusBadge = (status: typeof company.subscription.status) => {
    const variants: Record<typeof status, 'default' | 'destructive' | 'secondary'> = {
      active: 'default',
      trialing: 'secondary',
      past_due: 'destructive',
      canceled: 'destructive',
      expired: 'destructive',
    }

    return (
      <Badge variant={variants[status]}>
        {t[status] || status}
      </Badge>
    )
  }

  const getPaymentStatusIcon = (status: PaymentHistory['status']) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle size={16} weight="duotone" className="text-green-500" />
      case 'failed':
        return <WarningCircle size={16} weight="duotone" className="text-destructive" />
      case 'pending':
        return <Clock size={16} weight="duotone" className="text-yellow-500" />
      default:
        return <CheckCircle size={16} weight="duotone" className="text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={24} weight="duotone" />
                {t.title}
              </CardTitle>
              <CardDescription className="mt-2">
                {company.name}
              </CardDescription>
            </div>
            <Button onClick={onManageSubscription} className="gap-2">
              <CreditCard size={16} weight="duotone" />
              {t.manageSubscription}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">{t.currentPlan}</div>
              <div className="text-2xl font-bold capitalize">{company.license.type}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">{t.status}</div>
              <div>{getStatusBadge(company.subscription.status)}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">{t.expiresIn}</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                {daysRemaining <= 7 && (
                  <WarningCircle size={20} weight="duotone" className="text-destructive" />
                )}
                {daysRemaining} {t.days}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">{t.paymentMethod}</div>
              <div className="text-sm font-medium">
                {company.subscription.paymentMethod 
                  ? `${company.subscription.paymentMethod.brand || company.subscription.paymentMethod.type} •••• ${company.subscription.paymentMethod.last4}`
                  : t.noPaymentMethod
                }
              </div>
            </div>
          </div>

          {company.subscription.nextPaymentDate && (
            <>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar size={16} weight="duotone" />
                  {t.nextPayment}
                </span>
                <span className="font-semibold">
                  {new Date(company.subscription.nextPaymentDate).toLocaleDateString(
                    language === 'fr' ? 'fr-FR' : 'en-US',
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </span>
              </div>
            </>
          )}

          {recentPayments.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">{t.recentPayments}</h4>
                <div className="space-y-2">
                  {recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getPaymentStatusIcon(payment.status)}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{payment.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(payment.createdAt).toLocaleDateString(
                              language === 'fr' ? 'fr-FR' : 'en-US'
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        {formatCurrency(payment.amount, payment.currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
