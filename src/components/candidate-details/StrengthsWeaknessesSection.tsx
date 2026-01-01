import { Candidate, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { TrendUp, TrendDown } from '@phosphor-icons/react'

interface StrengthsWeaknessesSectionProps {
  candidate: Candidate
  language: Language
}

export default function StrengthsWeaknessesSection({ candidate, language }: StrengthsWeaknessesSectionProps) {
  return (
    <AccordionItem value="strengths-weaknesses">
      <AccordionTrigger className="text-sm font-medium hover:no-underline">
        {t('candidate.strengthsWeaknesses', language)}
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendUp size={16} className="text-green-600" weight="bold" />
              <h4 className="text-sm font-semibold text-green-600">{t('candidate.strengths', language)}</h4>
            </div>
            <ul className="space-y-1">
              {candidate.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendDown size={16} className="text-red-600" weight="bold" />
              <h4 className="text-sm font-semibold text-red-600">{t('candidate.weaknesses', language)}</h4>
            </div>
            <ul className="space-y-1">
              {candidate.weaknesses.map((weakness, index) => (
                <li key={index} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
