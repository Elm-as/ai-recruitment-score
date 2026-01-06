export interface Position {
  id: string
  title: string
  description: string
  requirements: string
  openings: number
  createdAt: number
  status: 'active' | 'closed' | 'archived'
  archivedAt?: number
}

export interface Candidate {
  id: string
  positionId: string
  name: string
  email: string
  profileText: string
  fileName?: string
  fileType?: 'pdf' | 'html'
  score: number
  scoreBreakdown: {
    category: string
    score: number
    reasoning: string
  }[]
  strengths: string[]
  weaknesses: string[]
  overallAssessment: string
  interviewQuestions?: string[]
  questionAnswers?: {
    questionIndex: number
    question: string
    answer: string
    answeredAt: number
    aiScore?: {
      technicalDepth: number
      accuracy: number
      completeness: number
      overallScore: number
      feedback: string
      strengths: string[]
      improvements: string[]
      scoredAt: number
    }
  }[]
  followUpQuestions?: {
    originalQuestionIndex: number
    originalQuestion: string
    originalAnswer: string
    followUpQuestions: string[]
    generatedAt: number
  }[]
  alternativePositions?: {
    positionId: string
    positionTitle: string
    reasoning: string
  }[]
  status: 'pending' | 'analyzing' | 'scored' | 'selected' | 'rejected'
  createdAt: number
  analyzedAt?: number
  customOrder?: number
}

export interface PositionWithCandidates extends Position {
  candidates: Candidate[]
}

export interface OrderingPreset {
  id: string
  positionId: string
  name: string
  candidateOrder: string[]
  createdAt: number
  updatedAt: number
}

export type Language = 'fr' | 'en'

export type LicenseType = 'trial' | 'starter' | 'professional' | 'enterprise'
export type UserRole = 'owner' | 'admin' | 'recruiter' | 'viewer'

export interface Company {
  id: string
  name: string
  email: string
  createdAt: number
  license: {
    type: LicenseType
    maxUsers: number
    maxPositions: number
    maxCandidatesPerPosition: number
    features: {
      bulkOperations: boolean
      advancedAnalytics: boolean
      emailTemplates: boolean
      apiAccess: boolean
      customBranding: boolean
    }
    startDate: number
    expiryDate: number
    isActive: boolean
  }
  subscription: {
    stripeCustomerId?: string
    stripeSubscriptionId?: string
    status: 'active' | 'past_due' | 'canceled' | 'expired' | 'trialing'
    currentPeriodEnd: number
    cancelAtPeriodEnd: boolean
    lastPaymentDate?: number
    nextPaymentDate?: number
    paymentMethod?: {
      type: 'card' | 'sepa' | 'paypal'
      last4?: string
      brand?: string
    }
  }
  paymentReminders?: PaymentReminder[]
}

export interface PaymentReminder {
  id: string
  companyId: string
  type: 'upcoming' | 'overdue' | 'expiring_soon'
  sentAt: number
  daysBeforeExpiry: number
  acknowledged: boolean
}

export interface PaymentHistory {
  id: string
  companyId: string
  amount: number
  currency: string
  status: 'succeeded' | 'failed' | 'pending' | 'refunded'
  stripePaymentId?: string
  createdAt: number
  description: string
}

export interface User {
  id: string
  companyId: string
  name: string
  email: string
  passwordHash: string
  role: UserRole
  createdAt: number
  lastLoginAt?: number
}

export interface AuthSession {
  companyId: string
  userId: string
  isAuthenticated: boolean
}
