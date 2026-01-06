import { Company, User, LicenseType } from './types'

export async function initializeDemoAccount() {
  const now = Date.now()
  const trialExpiry = now + (14 * 24 * 60 * 60 * 1000)

  const demoCompany: Company = {
    id: 'demo-company-1',
    name: 'Demo Company',
    email: 'contact@demo-company.com',
    createdAt: now,
    license: {
      type: 'professional',
      maxUsers: 15,
      maxPositions: 100,
      maxCandidatesPerPosition: 1000,
      features: {
        bulkOperations: true,
        advancedAnalytics: true,
        emailTemplates: true,
        apiAccess: false,
        customBranding: false
      },
      startDate: now,
      expiryDate: now + (365 * 24 * 60 * 60 * 1000),
      isActive: true
    }
  }

  const demoUser: User = {
    id: 'demo-user-1',
    companyId: demoCompany.id,
    name: 'Demo Admin',
    email: 'admin@demo-company.com',
    role: 'owner',
    createdAt: now,
    lastLoginAt: now
  }

  return { demoCompany, demoUser }
}

export function getLicenseLimits(licenseType: LicenseType) {
  const limits = {
    trial: {
      maxUsers: 3,
      maxPositions: 5,
      maxCandidatesPerPosition: 50,
      durationDays: 14,
      features: {
        bulkOperations: false,
        advancedAnalytics: false,
        emailTemplates: false,
        apiAccess: false,
        customBranding: false
      }
    },
    starter: {
      maxUsers: 5,
      maxPositions: 20,
      maxCandidatesPerPosition: 200,
      durationDays: 365,
      features: {
        bulkOperations: true,
        advancedAnalytics: false,
        emailTemplates: true,
        apiAccess: false,
        customBranding: false
      }
    },
    professional: {
      maxUsers: 15,
      maxPositions: 100,
      maxCandidatesPerPosition: 1000,
      durationDays: 365,
      features: {
        bulkOperations: true,
        advancedAnalytics: true,
        emailTemplates: true,
        apiAccess: false,
        customBranding: false
      }
    },
    enterprise: {
      maxUsers: -1,
      maxPositions: -1,
      maxCandidatesPerPosition: -1,
      durationDays: 365,
      features: {
        bulkOperations: true,
        advancedAnalytics: true,
        emailTemplates: true,
        apiAccess: true,
        customBranding: true
      }
    }
  }

  return limits[licenseType]
}

export function canPerformAction(
  company: Company,
  action: 'addUser' | 'addPosition' | 'addCandidate' | 'bulkOperations' | 'advancedAnalytics' | 'emailTemplates' | 'apiAccess',
  currentCounts?: { users?: number; positions?: number; candidates?: number }
): { allowed: boolean; reason?: string } {
  if (!company.license.isActive) {
    return { allowed: false, reason: 'License expired' }
  }

  const now = Date.now()
  if (now > company.license.expiryDate) {
    return { allowed: false, reason: 'License expired' }
  }

  switch (action) {
    case 'addUser':
      if (company.license.maxUsers === -1) return { allowed: true }
      if ((currentCounts?.users || 0) >= company.license.maxUsers) {
        return { allowed: false, reason: 'User limit reached' }
      }
      return { allowed: true }

    case 'addPosition':
      if (company.license.maxPositions === -1) return { allowed: true }
      if ((currentCounts?.positions || 0) >= company.license.maxPositions) {
        return { allowed: false, reason: 'Position limit reached' }
      }
      return { allowed: true }

    case 'addCandidate':
      if (company.license.maxCandidatesPerPosition === -1) return { allowed: true }
      if ((currentCounts?.candidates || 0) >= company.license.maxCandidatesPerPosition) {
        return { allowed: false, reason: 'Candidate limit reached for this position' }
      }
      return { allowed: true }

    case 'bulkOperations':
      if (!company.license.features.bulkOperations) {
        return { allowed: false, reason: 'Bulk operations not available in your plan' }
      }
      return { allowed: true }

    case 'advancedAnalytics':
      if (!company.license.features.advancedAnalytics) {
        return { allowed: false, reason: 'Advanced analytics not available in your plan' }
      }
      return { allowed: true }

    case 'emailTemplates':
      if (!company.license.features.emailTemplates) {
        return { allowed: false, reason: 'Email templates not available in your plan' }
      }
      return { allowed: true }

    case 'apiAccess':
      if (!company.license.features.apiAccess) {
        return { allowed: false, reason: 'API access not available in your plan' }
      }
      return { allowed: true }

    default:
      return { allowed: true }
  }
}

export function hasPermission(
  userRole: User['role'],
  action: 'createPosition' | 'deletePosition' | 'addCandidate' | 'deleteCandidate' | 'addUser' | 'deleteUser' | 'viewOnly'
): boolean {
  const permissions = {
    owner: ['createPosition', 'deletePosition', 'addCandidate', 'deleteCandidate', 'addUser', 'deleteUser'],
    admin: ['createPosition', 'deletePosition', 'addCandidate', 'deleteCandidate', 'addUser', 'deleteUser'],
    recruiter: ['createPosition', 'deletePosition', 'addCandidate', 'deleteCandidate'],
    viewer: ['viewOnly']
  }

  return permissions[userRole].includes(action)
}
