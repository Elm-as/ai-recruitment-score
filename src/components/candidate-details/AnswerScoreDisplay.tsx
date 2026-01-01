import { Candidate, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Sparkle, TrendUp, TrendDown } from '@phosphor-icons/react'

interface AnswerScoreDisplayProps {
  answer: NonNullable<Candidate['questionAnswers']>[number]
  language: Language
  onRescore: () => void
  scoringAnswer: boolean
}

export default function AnswerScoreDisplay({
  answer,
  language,
  onRescore,
  scoringAnswer,
}: AnswerScoreDisplayProps) {
  if (!answer.aiScore) return null

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-2 border-accent/30 rounded-lg space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-full border-4 ${
              answer.aiScore.overallScore >= 80
                ? 'bg-green-100 border-green-300'
                : answer.aiScore.overallScore >= 60
                ? 'bg-yellow-100 border-yellow-300'
                : 'bg-red-100 border-red-300'
            }`}
          >
            <span
              className={`text-lg font-bold ${
                answer.aiScore.overallScore >= 80
                  ? 'text-green-600'
                  : answer.aiScore.overallScore >= 60
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              {answer.aiScore.overallScore}
            </span>
          </div>
          <div>
            <h5 className="text-sm font-semibold text-accent flex items-center gap-1.5">
              <Sparkle size={16} weight="fill" />
              {t('candidate.aiFeedback', language)}
            </h5>
            <p className="text-xs text-muted-foreground">
              {language === 'fr' ? 'Évaluation technique' : 'Technical evaluation'}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={onRescore}
          disabled={scoringAnswer}
          className="h-8 gap-1 text-xs border-accent/30 hover:bg-accent/10"
        >
          <Sparkle size={12} weight="fill" />
          {scoringAnswer ? t('candidate.scoringAnswer', language) : t('candidate.rescore', language)}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">{t('candidate.technicalDepth', language)}</div>
          <div className="flex items-center gap-2">
            <Progress value={answer.aiScore.technicalDepth} className="h-1.5 flex-1" />
            <span className={`text-xs font-semibold ${getScoreColor(answer.aiScore.technicalDepth)}`}>
              {answer.aiScore.technicalDepth}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">{t('candidate.accuracy', language)}</div>
          <div className="flex items-center gap-2">
            <Progress value={answer.aiScore.accuracy} className="h-1.5 flex-1" />
            <span className={`text-xs font-semibold ${getScoreColor(answer.aiScore.accuracy)}`}>
              {answer.aiScore.accuracy}
            </span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">{t('candidate.completeness', language)}</div>
          <div className="flex items-center gap-2">
            <Progress value={answer.aiScore.completeness} className="h-1.5 flex-1" />
            <span className={`text-xs font-semibold ${getScoreColor(answer.aiScore.completeness)}`}>
              {answer.aiScore.completeness}
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs text-foreground leading-relaxed">{answer.aiScore.feedback}</p>

      {answer.aiScore.strengths && answer.aiScore.strengths.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendUp size={14} className="text-green-600" weight="bold" />
            <h6 className="text-xs font-semibold text-green-600">
              {t('candidate.answerStrengths', language)}
            </h6>
          </div>
          <ul className="space-y-0.5 ml-4">
            {answer.aiScore.strengths.map((strength, sIdx) => (
              <li key={sIdx} className="text-xs text-foreground flex items-start gap-1.5">
                <span className="text-green-600 mt-0.5">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {answer.aiScore.improvements && answer.aiScore.improvements.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendDown size={14} className="text-orange-600" weight="bold" />
            <h6 className="text-xs font-semibold text-orange-600">
              {t('candidate.answerImprovements', language)}
            </h6>
          </div>
          <ul className="space-y-0.5 ml-4">
            {answer.aiScore.improvements.map((improvement, iIdx) => (
              <li key={iIdx} className="text-xs text-foreground flex items-start gap-1.5">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
