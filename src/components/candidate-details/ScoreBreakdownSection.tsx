import { Candidate, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Progress } from '@/components/ui/progress'

interface ScoreBreakdownSectionProps {
  candidate: Candidate
  language: Language
}

export default function ScoreBreakdownSection({ candidate, language }: ScoreBreakdownSectionProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <AccordionItem value="breakdown">
      <AccordionTrigger className="text-sm font-medium hover:no-underline">
        {t('candidate.scoreBreakdown', language)}
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3 pt-2">
          {candidate.scoreBreakdown.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{item.category}</span>
                <span className={getScoreColor(item.score)}>{item.score}/100</span>
              </div>
              <Progress value={item.score} className="h-2" />
              <p className="text-xs text-muted-foreground">{item.reasoning}</p>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
