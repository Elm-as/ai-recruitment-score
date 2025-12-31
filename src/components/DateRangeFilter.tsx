import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarBlank, X } from '@phosphor-icons/react'
import { Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { motion, AnimatePresence } from 'framer-motion'

interface DateRange {
  from: Date | undefined
  to: Date | undefined
}

interface DateRangeFilterProps {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  language: Language
}

export default function DateRangeFilter({
  dateRange,
  onDateRangeChange,
  language,
}: DateRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formatDateRange = () => {
    if (!dateRange.from) {
      return t('dateFilter.selectDates', language)
    }
    
    const formatDate = (date: Date) => {
      return date.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    }

    if (dateRange.to) {
      return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`
    }
    
    return formatDate(dateRange.from)
  }

  const clearDateRange = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDateRangeChange({ from: undefined, to: undefined })
  }

  const hasDateRange = dateRange.from || dateRange.to

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={hasDateRange ? 'default' : 'outline'}
          size="sm"
          className="gap-2 min-w-[160px] sm:min-w-[200px] justify-start relative"
        >
          <CalendarBlank size={16} weight={hasDateRange ? 'fill' : 'duotone'} />
          <span className="flex-1 text-left truncate text-xs sm:text-sm">{formatDateRange()}</span>
          <AnimatePresence>
            {hasDateRange && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <X
                  size={14}
                  weight="bold"
                  className="hover:text-destructive transition-colors"
                  onClick={clearDateRange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 max-w-[95vw]" align="start">
        <div className="p-3 border-b">
          <h4 className="font-semibold text-sm mb-1">{t('dateFilter.title', language)}</h4>
          <p className="text-xs text-muted-foreground">{t('dateFilter.description', language)}</p>
        </div>
        <Calendar
          mode="range"
          selected={{
            from: dateRange.from,
            to: dateRange.to,
          }}
          onSelect={(range) => {
            if (range) {
              onDateRangeChange({
                from: range.from,
                to: range.to,
              })
            }
          }}
          numberOfMonths={1}
          disabled={(date) => date > new Date()}
        />
        {hasDateRange && (
          <div className="p-3 border-t flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onDateRangeChange({ from: undefined, to: undefined })
                setIsOpen(false)
              }}
              className="flex-1 gap-1.5"
            >
              <X size={14} weight="bold" />
              {t('dateFilter.clear', language)}
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              {t('dateFilter.apply', language)}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
