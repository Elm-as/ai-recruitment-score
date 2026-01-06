import { useState } from 'react'
import { Company, Language, LicenseType, PaymentHistory } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { CreditCard, Check, Clock, Warning, Sparkle, Buildings, Rocket, Crown } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { formatCurrency, SUBSCRIPTION_PRICES, simulateStripePayment, getDaysUntilExpiry } from '@/lib/payment'
import { getLicenseLimits } from '@/lib/license'
import { useKV } from '@github/spark/hooks'

interface PaymentPageProps {
  company: Company
  language: Language
  onUpdateCompany: (company: Company) => void
  onCancel?: () => void
}

export function PaymentPage({ company, language, onUpdateCompany, onCancel }: PaymentPageProps) {
  const [paymentHistory, setPaymentHistory] = useKV<PaymentHistory[]>('payment-history', [])
  const [selectedPlan, setSelectedPlan] = useState<LicenseType>(company.license.type)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvc, setCardCvc] = useState('')
  const [cardName, setCardName] = useState('')

  const texts = {
    fr: {
      title: 'Gestion de l\'abonnement',
      subtitle: 'Gérez votre abonnement et votre méthode de paiement',
      currentPlan: 'Plan actuel',
      selectPlan: 'Choisir un plan',
      billingCycle: 'Cycle de facturation',
      monthly: 'Mensuel',
      yearly: 'Annuel (2 mois gratuits)',
      paymentMethod: 'Méthode de paiement',
      cardNumber: 'Numéro de carte',
      cardExpiry: 'Expiration (MM/AA)',
      cardCvc: 'CVC',
      cardName: 'Nom sur la carte',
      processPayment: 'Traiter le paiement',
      processing: 'Traitement en cours...',
      cancel: 'Annuler',
      features: 'Fonctionnalités incluses',
      maxUsers: 'utilisateurs maximum',
      maxPositions: 'postes maximum',
      maxCandidates: 'candidats par poste',
      unlimited: 'Illimité',
      currentStatus: 'Statut actuel',
      expiresIn: 'Expire dans',
      days: 'jours',
      paymentSuccess: 'Paiement réussi ! Votre abonnement a été renouvelé.',
      paymentError: 'Erreur lors du paiement. Veuillez réessayer.',
      validationError: 'Veuillez remplir tous les champs de paiement.',
      subscriptionUpdated: 'Abonnement mis à jour avec succès !',
      perMonth: '/ mois',
      perYear: '/ an',
      savePercent: 'Économisez 17%',
      trial: 'Essai',
      starter: 'Démarrage',
      professional: 'Professionnel',
      enterprise: 'Enterprise',
      popularBadge: 'Populaire',
      currentBadge: 'Actuel',
    },
    en: {
      title: 'Subscription Management',
      subtitle: 'Manage your subscription and payment method',
      currentPlan: 'Current Plan',
      selectPlan: 'Select a Plan',
      billingCycle: 'Billing Cycle',
      monthly: 'Monthly',
      yearly: 'Yearly (2 months free)',
      paymentMethod: 'Payment Method',
      cardNumber: 'Card Number',
      cardExpiry: 'Expiration (MM/YY)',
      cardCvc: 'CVC',
      cardName: 'Name on Card',
      processPayment: 'Process Payment',
      processing: 'Processing...',
      cancel: 'Cancel',
      features: 'Included Features',
      maxUsers: 'users maximum',
      maxPositions: 'positions maximum',
      maxCandidates: 'candidates per position',
      unlimited: 'Unlimited',
      currentStatus: 'Current Status',
      expiresIn: 'Expires in',
      days: 'days',
      paymentSuccess: 'Payment successful! Your subscription has been renewed.',
      paymentError: 'Payment error. Please try again.',
      validationError: 'Please fill in all payment fields.',
      subscriptionUpdated: 'Subscription updated successfully!',
      perMonth: '/ month',
      perYear: '/ year',
      savePercent: 'Save 17%',
      trial: 'Trial',
      starter: 'Starter',
      professional: 'Professional',
      enterprise: 'Enterprise',
      popularBadge: 'Popular',
      currentBadge: 'Current',
    },
  }

  const t = texts[language]

  const planIcons = {
    trial: Sparkle,
    starter: Buildings,
    professional: Rocket,
    enterprise: Crown,
  }

  const plans: Array<{ type: LicenseType; name: string; popular?: boolean }> = [
    { type: 'trial', name: t.trial },
    { type: 'starter', name: t.starter },
    { type: 'professional', name: t.professional, popular: true },
    { type: 'enterprise', name: t.enterprise },
  ]

  const handlePayment = async () => {
    if (!cardNumber || !cardExpiry || !cardCvc || !cardName) {
      toast.error(t.validationError)
      return
    }

    setIsProcessing(true)

    try {
      const price = SUBSCRIPTION_PRICES[selectedPlan]
      const amount = billingCycle === 'monthly' ? price.monthly : price.yearly

      const result = await simulateStripePayment(amount, price.currency)

      if (result.success) {
        const now = Date.now()
        const durationMs = billingCycle === 'monthly' 
          ? 30 * 24 * 60 * 60 * 1000 
          : 365 * 24 * 60 * 60 * 1000

        const limits = getLicenseLimits(selectedPlan)
        
        const updatedCompany: Company = {
          ...company,
          license: {
            ...company.license,
            type: selectedPlan,
            maxUsers: limits.maxUsers,
            maxPositions: limits.maxPositions,
            maxCandidatesPerPosition: limits.maxCandidatesPerPosition,
            features: limits.features,
            expiryDate: now + durationMs,
            isActive: true,
          },
          subscription: {
            ...company.subscription,
            status: 'active',
            currentPeriodEnd: now + durationMs,
            nextPaymentDate: now + durationMs,
            lastPaymentDate: now,
            cancelAtPeriodEnd: false,
            stripeSubscriptionId: result.paymentId,
            paymentMethod: {
              type: 'card',
              last4: cardNumber.slice(-4),
              brand: 'Visa',
            },
          },
        }

        const newPayment: PaymentHistory = {
          id: `payment-${now}`,
          companyId: company.id,
          amount,
          currency: price.currency,
          status: 'succeeded',
          stripePaymentId: result.paymentId,
          createdAt: now,
          description: `${t[selectedPlan]} - ${billingCycle === 'monthly' ? t.monthly : t.yearly}`,
        }

        setPaymentHistory((current) => [...(current || []), newPayment])
        onUpdateCompany(updatedCompany)
        toast.success(t.paymentSuccess)
        
        if (onCancel) {
          setTimeout(() => onCancel(), 1500)
        }
      } else {
        toast.error(result.error || t.paymentError)
      }
    } catch (error) {
      toast.error(t.paymentError)
    } finally {
      setIsProcessing(false)
    }
  }

  const daysRemaining = getDaysUntilExpiry(company)
  const selectedPrice = SUBSCRIPTION_PRICES[selectedPlan]
  const amount = billingCycle === 'monthly' ? selectedPrice.monthly : selectedPrice.yearly

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t.currentStatus}</CardTitle>
              <CardDescription>
                {company.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{t.currentPlan}</div>
                  <div className="text-2xl font-bold capitalize">{company.license.type}</div>
                </div>
                <Badge variant={company.subscription.status === 'active' ? 'default' : 'destructive'}>
                  {company.subscription.status}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.expiresIn}</span>
                <span className="font-semibold flex items-center gap-2">
                  {daysRemaining <= 7 && <Warning size={16} weight="duotone" className="text-destructive" />}
                  {daysRemaining} {t.days}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t.selectPlan}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>{t.billingCycle}</Label>
                <RadioGroup
                  value={billingCycle}
                  onValueChange={(value) => setBillingCycle(value as 'monthly' | 'yearly')}
                  className="grid grid-cols-2 gap-4"
                >
                  <Label
                    htmlFor="monthly"
                    className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all ${
                      billingCycle === 'monthly' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <RadioGroupItem value="monthly" id="monthly" className="sr-only" />
                    <span className="font-semibold">{t.monthly}</span>
                  </Label>
                  <Label
                    htmlFor="yearly"
                    className={`flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all relative ${
                      billingCycle === 'yearly' ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <RadioGroupItem value="yearly" id="yearly" className="sr-only" />
                    <span className="font-semibold">{t.yearly}</span>
                    <Badge variant="secondary" className="absolute -top-2 text-xs">
                      {t.savePercent}
                    </Badge>
                  </Label>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plans.map((plan) => {
                  const Icon = planIcons[plan.type]
                  const price = SUBSCRIPTION_PRICES[plan.type]
                  const limits = getLicenseLimits(plan.type)
                  const planAmount = billingCycle === 'monthly' ? price.monthly : price.yearly
                  const isCurrent = company.license.type === plan.type

                  return (
                    <motion.div
                      key={plan.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all relative ${
                          selectedPlan === plan.type
                            ? 'border-primary border-2 shadow-lg'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPlan(plan.type)}
                      >
                        {plan.popular && (
                          <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                            {t.popularBadge}
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge variant="outline" className="absolute -top-2 right-4 z-10">
                            {t.currentBadge}
                          </Badge>
                        )}
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <Icon size={24} weight="duotone" className="text-primary" />
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <div className="text-3xl font-bold">
                                {formatCurrency(planAmount)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {billingCycle === 'monthly' ? t.perMonth : t.perYear}
                              </div>
                            </div>
                            <div className="space-y-1.5 text-xs">
                              <div className="flex items-center gap-2">
                                <Check size={14} className="text-primary shrink-0" />
                                <span>
                                  {limits.maxUsers === -1 ? t.unlimited : limits.maxUsers} {t.maxUsers}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Check size={14} className="text-primary shrink-0" />
                                <span>
                                  {limits.maxPositions === -1 ? t.unlimited : limits.maxPositions} {t.maxPositions}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Check size={14} className="text-primary shrink-0" />
                                <span>
                                  {limits.maxCandidatesPerPosition === -1 ? t.unlimited : limits.maxCandidatesPerPosition} {t.maxCandidates}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard size={24} weight="duotone" />
                {t.paymentMethod}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">{t.cardNumber}</Label>
                <Input
                  id="cardNumber"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                  maxLength={19}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">{t.cardExpiry}</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => {
                      let val = e.target.value.replace(/\D/g, '')
                      if (val.length >= 2) {
                        val = val.slice(0, 2) + '/' + val.slice(2, 4)
                      }
                      setCardExpiry(val)
                    }}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardCvc">{t.cardCvc}</Label>
                  <Input
                    id="cardCvc"
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardName">{t.cardName}</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <span className="font-medium capitalize">{selectedPlan}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t.billingCycle}</span>
                  <span className="font-medium">{billingCycle === 'monthly' ? t.monthly : t.yearly}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(amount)}</span>
              </div>
              <Button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full h-12 gap-2"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Clock size={20} weight="duotone" className="animate-spin" />
                    {t.processing}
                  </>
                ) : (
                  <>
                    <CreditCard size={20} weight="duotone" />
                    {t.processPayment}
                  </>
                )}
              </Button>
              {onCancel && (
                <Button
                  onClick={onCancel}
                  variant="outline"
                  className="w-full"
                  disabled={isProcessing}
                >
                  {t.cancel}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
