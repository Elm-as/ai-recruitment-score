import { Language } from '@/lib/types'
import { t } from '@/lib/translations'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Question, Lightbulb, FileText, ChartBar, Users, Archive, Trash, ArrowsClockwise, ArrowRight } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface FAQViewProps {
  language: Language
  onNavigate?: (tab: string) => void
}

export default function FAQView({ language, onNavigate }: FAQViewProps) {
  const faqCategories = [
    {
      title: t('faq.category.general', language),
      icon: Question,
      color: 'text-accent',
      questions: [
        { q: 'whatIsThis', a: 'whatIsThisAnswer', link: null },
        { q: 'howItWorks', a: 'howItWorksAnswer', link: 'positions' },
        { q: 'needAccount', a: 'needAccountAnswer', link: null },
        { q: 'dataStorage', a: 'dataStorageAnswer', link: null },
      ]
    },
    {
      title: t('faq.category.positions', language),
      icon: FileText,
      color: 'text-blue-500',
      questions: [
        { q: 'createPosition', a: 'createPositionAnswer', link: 'positions' },
        { q: 'archivePosition', a: 'archivePositionAnswer', link: 'positions' },
        { q: 'deletePosition', a: 'deletePositionAnswer', link: 'positions' },
        { q: 'restoreArchived', a: 'restoreArchivedAnswer', link: 'history' },
      ]
    },
    {
      title: t('faq.category.candidates', language),
      icon: Users,
      color: 'text-purple-500',
      questions: [
        { q: 'addCandidate', a: 'addCandidateAnswer', link: 'positions' },
        { q: 'fileFormats', a: 'fileFormatsAnswer', link: null },
        { q: 'howScoring', a: 'howScoringAnswer', link: 'positions' },
        { q: 'scoreBreakdown', a: 'scoreBreakdownAnswer', link: 'positions' },
        { q: 'deleteCandidate', a: 'deleteCandidateAnswer', link: 'positions' },
        { q: 'bulkDelete', a: 'bulkDeleteAnswer', link: 'positions' },
      ]
    },
    {
      title: t('faq.category.questions', language),
      icon: Lightbulb,
      color: 'text-yellow-600',
      questions: [
        { q: 'interviewQuestions', a: 'interviewQuestionsAnswer', link: 'positions' },
        { q: 'questionTypes', a: 'questionTypesAnswer', link: null },
        { q: 'answerQuestions', a: 'answerQuestionsAnswer', link: 'positions' },
        { q: 'scoreAnswers', a: 'scoreAnswersAnswer', link: 'positions' },
        { q: 'followUpQuestions', a: 'followUpQuestionsAnswer', link: 'positions' },
      ]
    },
    {
      title: t('faq.category.analysis', language),
      icon: ChartBar,
      color: 'text-green-500',
      questions: [
        { q: 'compareScores', a: 'compareScoresAnswer', link: 'positions' },
        { q: 'alternativePositions', a: 'alternativePositionsAnswer', link: 'positions' },
        { q: 'orderingPresets', a: 'orderingPresetsAnswer', link: 'positions' },
        { q: 'emailTemplates', a: 'emailTemplatesAnswer', link: 'positions' },
      ]
    },
    {
      title: t('faq.category.history', language),
      icon: Archive,
      color: 'text-orange-500',
      questions: [
        { q: 'viewHistory', a: 'viewHistoryAnswer', link: 'history' },
        { q: 'filterHistory', a: 'filterHistoryAnswer', link: 'history' },
        { q: 'dateRange', a: 'dateRangeAnswer', link: 'history' },
      ]
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="border-accent/20 shadow-lg">
        <CardHeader>
          <div className="flex items-start gap-3">
            <Question size={32} weight="duotone" className="text-accent shrink-0 mt-1" />
            <div>
              <CardTitle className="text-2xl">{t('faq.title', language)}</CardTitle>
              <CardDescription className="mt-2">{t('faq.subtitle', language)}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        {faqCategories.map((category, categoryIndex) => {
          const Icon = category.icon
          return (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon size={24} weight="duotone" className={category.color} />
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`item-${categoryIndex}-${itemIndex}`}>
                        <AccordionTrigger className="text-left hover:no-underline hover:text-accent transition-colors">
                          {t(`faq.questions.${item.q}`, language)}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed space-y-3">
                          <p>{t(`faq.answers.${item.a}`, language)}</p>
                          {item.link && onNavigate && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onNavigate(item.link)}
                              className="gap-2 hover:bg-accent/10 hover:text-accent hover:border-accent transition-all"
                            >
                              {t(`faq.goTo.${item.link}`, language)}
                              <ArrowRight size={16} weight="bold" />
                            </Button>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
        <CardHeader>
          <div className="flex items-start gap-3">
            <Lightbulb size={24} weight="duotone" className="text-accent shrink-0 mt-1" />
            <div>
              <CardTitle className="text-lg">{t('faq.tips.title', language)}</CardTitle>
              <CardDescription className="mt-2">{t('faq.tips.subtitle', language)}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <ArrowsClockwise size={20} weight="duotone" className="text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">{t('faq.tips.tip1', language)}</p>
          </div>
          <div className="flex gap-3">
            <ChartBar size={20} weight="duotone" className="text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">{t('faq.tips.tip2', language)}</p>
          </div>
          <div className="flex gap-3">
            <Trash size={20} weight="duotone" className="text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">{t('faq.tips.tip3', language)}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
