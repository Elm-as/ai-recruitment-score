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
      className="space-y-4 sm:space-y-6"
    >
      <Card className="border-accent/20 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <Question size={24} className="sm:hidden text-accent shrink-0 mt-1" weight="duotone" />
            <Question size={32} className="hidden sm:block text-accent shrink-0 mt-1" weight="duotone" />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg sm:text-xl md:text-2xl break-words">{t('faq.title', language)}</CardTitle>
              <CardDescription className="mt-1 sm:mt-2 text-xs sm:text-sm">{t('faq.subtitle', language)}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-3 sm:gap-4 md:gap-6">
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
                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Icon size={20} weight="duotone" className={`sm:hidden ${category.color}`} />
                    <Icon size={24} weight="duotone" className={`hidden sm:block ${category.color}`} />
                    <CardTitle className="text-base sm:text-lg break-words">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`item-${categoryIndex}-${itemIndex}`}>
                        <AccordionTrigger className="text-left hover:no-underline hover:text-accent transition-colors text-sm sm:text-base py-3 sm:py-4">
                          {t(`faq.questions.${item.q}`, language)}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground leading-relaxed space-y-3 text-xs sm:text-sm pb-4">
                          <p className="break-words">{t(`faq.answers.${item.a}`, language)}</p>
                          {item.link && onNavigate && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onNavigate(item.link)}
                              className="gap-2 hover:bg-accent/10 hover:text-accent hover:border-accent transition-all w-full xs:w-auto h-9"
                            >
                              {t(`faq.goTo.${item.link}`, language)}
                              <ArrowRight size={14} className="sm:hidden" weight="bold" />
                              <ArrowRight size={16} className="hidden sm:block" weight="bold" />
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
        <CardHeader className="p-4 sm:p-6">
          <div className="flex items-start gap-2 sm:gap-3">
            <Lightbulb size={20} className="sm:hidden text-accent shrink-0 mt-1" weight="duotone" />
            <Lightbulb size={24} className="hidden sm:block text-accent shrink-0 mt-1" weight="duotone" />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg break-words">{t('faq.tips.title', language)}</CardTitle>
              <CardDescription className="mt-1 sm:mt-2 text-xs sm:text-sm">{t('faq.tips.subtitle', language)}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
          <div className="flex gap-2 sm:gap-3">
            <ArrowsClockwise size={18} className="sm:hidden text-accent shrink-0 mt-0.5" weight="duotone" />
            <ArrowsClockwise size={20} className="hidden sm:block text-accent shrink-0 mt-0.5" weight="duotone" />
            <p className="text-xs sm:text-sm text-foreground break-words leading-relaxed">{t('faq.tips.tip1', language)}</p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <ChartBar size={18} className="sm:hidden text-accent shrink-0 mt-0.5" weight="duotone" />
            <ChartBar size={20} className="hidden sm:block text-accent shrink-0 mt-0.5" weight="duotone" />
            <p className="text-xs sm:text-sm text-foreground break-words leading-relaxed">{t('faq.tips.tip2', language)}</p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Trash size={18} className="sm:hidden text-accent shrink-0 mt-0.5" weight="duotone" />
            <Trash size={20} className="hidden sm:block text-accent shrink-0 mt-0.5" weight="duotone" />
            <p className="text-xs sm:text-sm text-foreground break-words leading-relaxed">{t('faq.tips.tip3', language)}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
