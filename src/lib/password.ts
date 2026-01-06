export interface PasswordValidation {
  isValid: boolean
  errors: string[]
}

export function validatePassword(password: string, language: 'fr' | 'en' = 'fr'): PasswordValidation {
  const errors: string[] = []
  
  const messages = {
    fr: {
      minLength: 'Le mot de passe doit contenir au moins 8 caractères',
      uppercase: 'Le mot de passe doit contenir au moins une majuscule',
      lowercase: 'Le mot de passe doit contenir au moins une minuscule',
      number: 'Le mot de passe doit contenir au moins un chiffre',
      special: 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*)',
    },
    en: {
      minLength: 'Password must be at least 8 characters long',
      uppercase: 'Password must contain at least one uppercase letter',
      lowercase: 'Password must contain at least one lowercase letter',
      number: 'Password must contain at least one number',
      special: 'Password must contain at least one special character (!@#$%^&*)',
    }
  }
  
  const msg = messages[language]
  
  if (password.length < 8) {
    errors.push(msg.minLength)
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push(msg.uppercase)
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push(msg.lowercase)
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push(msg.number)
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push(msg.special)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hash))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  const hashedInput = await hashPassword(password)
  return hashedInput === hashedPassword
}

export function getPasswordStrength(password: string): {
  strength: 'weak' | 'medium' | 'strong' | 'very-strong'
  score: number
} {
  let score = 0
  
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1
  
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1
  
  if (/[a-z].*[a-z].*[a-z]/.test(password)) score += 0.5
  if (/[A-Z].*[A-Z]/.test(password)) score += 0.5
  if (/[0-9].*[0-9]/.test(password)) score += 0.5
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 0.5
  
  let strength: 'weak' | 'medium' | 'strong' | 'very-strong'
  if (score < 4) {
    strength = 'weak'
  } else if (score < 6) {
    strength = 'medium'
  } else if (score < 8) {
    strength = 'strong'
  } else {
    strength = 'very-strong'
  }
  
  return { strength, score: Math.min(score / 10 * 100, 100) }
}
