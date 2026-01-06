import { Company, PaymentReminder, LicenseType } from './types'

export const SUBSCRIPTION_PRICES: Record<LicenseType, { monthly: number; yearly: number; currency: string }> = {
  trial: { monthly: 0, yearly: 0, currency: 'EUR' },
  starter: { monthly: 29, yearly: 290, currency: 'EUR' },
  professional: { monthly: 79, yearly: 790, currency: 'EUR' },
  enterprise: { monthly: 199, yearly: 1990, currency: 'EUR' },
}

export function isSubscriptionExpired(company: Company): boolean {
  if (!company.subscription) {
    return company.license?.expiryDate ? company.license.expiryDate < Date.now() : false
  }
  return company.subscription.status === 'expired' || 
         company.subscription.status === 'canceled' ||
         company.license.expiryDate < Date.now()
}

export function isSubscriptionPastDue(company: Company): boolean {
  if (!company.subscription) return false
  return company.subscription.status === 'past_due'
}

export function getDaysUntilExpiry(company: Company): number {
  const daysRemaining = Math.ceil((company.license.expiryDate - Date.now()) / (1000 * 60 * 60 * 24))
  return Math.max(0, daysRemaining)
}

export function shouldShowPaymentReminder(company: Company): boolean {
  const daysRemaining = getDaysUntilExpiry(company)
  
  if (isSubscriptionExpired(company)) return true
  if (isSubscriptionPastDue(company)) return true
  
  if (daysRemaining <= 7 && daysRemaining > 0) {
    const lastReminder = company.paymentReminders?.[company.paymentReminders.length - 1]
    if (!lastReminder) return true
    if (!lastReminder.acknowledged) return true
    
    const daysSinceLastReminder = Math.floor((Date.now() - lastReminder.sentAt) / (1000 * 60 * 60 * 24))
    return daysSinceLastReminder >= 2
  }
  
  return false
}

export function getPaymentReminderType(company: Company): 'upcoming' | 'overdue' | 'expiring_soon' {
  if (isSubscriptionExpired(company)) return 'overdue'
  if (isSubscriptionPastDue(company)) return 'overdue'
  
  const daysRemaining = getDaysUntilExpiry(company)
  if (daysRemaining <= 3) return 'expiring_soon'
  
  return 'upcoming'
}

export function createDefaultSubscription(licenseType: LicenseType = 'trial') {
  const now = Date.now()
  const trialPeriod = 14 * 24 * 60 * 60 * 1000
  
  return {
    status: 'trialing' as const,
    currentPeriodEnd: now + trialPeriod,
    cancelAtPeriodEnd: false,
    nextPaymentDate: now + trialPeriod,
  }
}

export function simulateStripePayment(amount: number, currency: string = 'EUR'): Promise<{ success: boolean; paymentId?: string; error?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.1
      
      if (success) {
        resolve({
          success: true,
          paymentId: `pi_${Math.random().toString(36).substring(2, 15)}`,
        })
      } else {
        resolve({
          success: false,
          error: 'Payment failed. Please check your payment details.',
        })
      }
    }, 1500)
  })
}

export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount)
}
