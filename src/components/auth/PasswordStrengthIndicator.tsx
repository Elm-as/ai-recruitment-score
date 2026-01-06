import { motion } from 'framer-motion'
import { getPasswordStrength } from '@/lib/password'
import { ShieldCheck, ShieldWarning, ShieldSlash } from '@phosphor-icons/react'

interface PasswordStrengthIndicatorProps {
  password: string
  language: 'fr' | 'en'
}

export function PasswordStrengthIndicator({ password, language }: PasswordStrengthIndicatorProps) {
  if (!password) return null
  
  const { strength, score } = getPasswordStrength(password)
  
  const colors = {
    weak: { bg: 'bg-destructive/20', bar: 'bg-destructive', text: 'text-destructive' },
    medium: { bg: 'bg-yellow-500/20', bar: 'bg-yellow-500', text: 'text-yellow-600' },
    strong: { bg: 'bg-blue-500/20', bar: 'bg-blue-500', text: 'text-blue-600' },
    'very-strong': { bg: 'bg-green-500/20', bar: 'bg-green-500', text: 'text-green-600' }
  }
  
  const labels = {
    fr: {
      weak: 'Faible',
      medium: 'Moyen',
      strong: 'Fort',
      'very-strong': 'Très fort'
    },
    en: {
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong',
      'very-strong': 'Very Strong'
    }
  }
  
  const icons = {
    weak: ShieldSlash,
    medium: ShieldWarning,
    strong: ShieldCheck,
    'very-strong': ShieldCheck
  }
  
  const color = colors[strength]
  const Icon = icons[strength]
  
  return (
    <div className="space-y-2">
      <div className={`h-2 w-full rounded-full overflow-hidden ${color.bg}`}>
        <motion.div
          className={`h-full ${color.bar}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className={`flex items-center gap-1.5 text-xs font-medium ${color.text}`}>
        <Icon size={14} weight="fill" />
        {labels[language][strength]}
      </div>
    </div>
  )
}
