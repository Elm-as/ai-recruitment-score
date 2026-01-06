import { Language } from '@/lib/types'
import { t } from '@/lib/translations'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Question, Lightbulb, FileText, ChartBar, Users, Archive, Trash, ArrowsClockwise } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface FAQViewProps {
  language: Language
}

export default function FAQView({ language }: FAQViewProps) {
  const faqCategories = [
    {
      title: t('faq.category.general', language),
      icon: Question,
      color: 'text-accent',
      questions: [
        { q: 'whatIsThis', a: 'whatIsThisAnswer' },
        { q: 'howItWorks', a: 'howItWorksAnswer' },
        { q: 'needAccount', a: 'needAccountAnswer' },
        { q: 'dataStorage', a: 'dataStorageAnswer' },
      ]
    },
    {
      title: t('faq.category.positions', language),
      icon: FileText,
      color: 'text-blue-500',
      questions: [
        { q: 'createPosition', a: 'createPositionAnswer' },
        { q: 'archivePosition', a: 'archivePositionAnswer' },
        { q: 'deletePosition', a: 'deletePositionAnswer' },
        { q: 'restoreArchived', a: 'restoreArchivedAnswer' },
      ]
    },
    {
      title: t('faq.category.candidates', language),
      icon: Users,
      color: 'text-purple-500',
      questions: [
        { q: 'addCandidate', a: 'addCandidateAnswer' },
        { q: 'fileFormats', a: 'fileFormatsAnswer' },
        { q: 'howScoring', a: 'howScoringAnswer' },
        { q: 'scoreBreakdown', a: 'scoreBreakdownAnswer' },
        { q: 'deleteCandidate', a: 'deleteCandidateAnswer' },
        { q: 'bulkDelete', a: 'bulkDeleteAnswer' },
      ]
    },
    {
      title: t('faq.category.questions', language),
      icon: Lightbulb,
      color: 'text-yellow-600',
      questions: [
        { q: 'interviewQuestions', a: 'interviewQuestionsAnswer' },
        { q: 'questionTypes', a: 'questionTypesAnswer' },
        { q: 'answerQuestions', a: 'answerQuestionsAnswer' },
        { q: 'scoreAnswers', a: 'scoreAnswersAnswer' },
        { q: 'followUpQuestions', a: 'followUpQuestionsAnswer' },
      ]
    },
    {
      title: t('faq.category.analysis', language),
      icon: ChartBar,
      color: 'text-green-500',
      questions: [
        { q: 'compareScores', a: 'compareScoresAnswer' },
        { q: 'alternativePositions', a: 'alternativePositionsAnswer' },
        { q: 'orderingPresets', a: 'orderingPresetsAnswer' },
        { q: 'emailTemplates', a: 'emailTemplatesAnswer' },
      ]
    },
    {
      title: t('faq.category.history', language),
      icon: Archive,
      color: 'text-orange-500',
      questions: [
        { q: 'viewHistory', a: 'viewHistoryAnswer' },
        { q: 'filterHistory', a: 'filterHistoryAnswer' },
        { q: 'dateRange', a: 'dateRangeAnswer' },
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
                        <AccordionContent className="text-muted-foreground leading-relaxed">
                          {t(`faq.answers.${item.a}`, language)}
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
