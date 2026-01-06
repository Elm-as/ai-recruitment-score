import { useState, useMemo } from 'react'
import { Position, Candidate, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TrendUp, Users, Target, CheckCircle, XCircle, ChartBar, ChartLineUp } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { AdvancedAnalyticsDashboard } from './AdvancedAnalyticsDashboard'

interface DashboardViewProps {
  positions: Position[]
  candidates: Candidate[]
  language: Language
}

export function DashboardView({ positions, candidates, language }: DashboardViewProps) {
  const [period, setPeriod] = useState<'7' | '30' | '90' | 'all'>('all')

  const now = Date.now()
  const periodMs = {
    '7': 7 * 24 * 60 * 60 * 1000,
    '30': 30 * 24 * 60 * 60 * 1000,
    '90': 90 * 24 * 60 * 60 * 1000,
    'all': Infinity,
  }

  const filteredCandidates = useMemo(() => {
    const cutoff = now - periodMs[period]
    return candidates.filter(c => c.createdAt >= cutoff)
  }, [candidates, period, now, periodMs])

  const filteredPositions = useMemo(() => {
    const cutoff = now - periodMs[period]
    return positions.filter(p => p.createdAt >= cutoff)
  }, [positions, period, now, periodMs])

  const metrics = useMemo(() => {
    const activePositions = filteredPositions.filter(p => p.status === 'active' || !p.status).length
    const totalCandidates = filteredCandidates.length
    const scoredCandidates = filteredCandidates.filter(c => c.status === 'scored' || c.status === 'selected')
    const averageScore = scoredCandidates.length > 0
      ? Math.round(scoredCandidates.reduce((sum, c) => sum + c.score, 0) / scoredCandidates.length)
      : 0
    const candidatesSelected = filteredCandidates.filter(c => c.status === 'selected').length
    const candidatesRejected = filteredCandidates.filter(c => c.status === 'rejected').length
    const positionsFilled = filteredPositions.filter(p => p.status === 'closed' || p.status === 'archived').length

    return {
      activePositions,
      totalCandidates,
      averageScore,
      candidatesSelected,
      candidatesRejected,
      positionsFilled,
    }
  }, [filteredCandidates, filteredPositions])

  const topPerformers = useMemo(() => {
    return [...filteredCandidates]
      .filter(c => c.status === 'scored' || c.status === 'selected')
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
  }, [filteredCandidates])

  const scoreDistribution = useMemo(() => {
    const ranges = [
      { label: '0-20', min: 0, max: 20, count: 0 },
      { label: '21-40', min: 21, max: 40, count: 0 },
      { label: '41-60', min: 41, max: 60, count: 0 },
      { label: '61-80', min: 61, max: 80, count: 0 },
      { label: '81-100', min: 81, max: 100, count: 0 },
    ]

    filteredCandidates
      .filter(c => c.status === 'scored' || c.status === 'selected')
      .forEach(c => {
        const range = ranges.find(r => c.score >= r.min && c.score <= r.max)
        if (range) range.count++
      })

    return ranges
  }, [filteredCandidates])

  const candidatesPerPosition = useMemo(() => {
    const positionMap = new Map<string, { title: string; count: number }>()
    
    filteredCandidates.forEach(c => {
      const position = positions.find(p => p.id === c.positionId)
      if (position) {
        const existing = positionMap.get(position.id)
        if (existing) {
          existing.count++
        } else {
          positionMap.set(position.id, { title: position.title, count: 1 })
        }
      }
    })

    return Array.from(positionMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [filteredCandidates, positions])

  const recentActivity = useMemo(() => {
    const activities = filteredCandidates
      .filter(c => c.analyzedAt)
      .map(c => {
        const position = positions.find(p => p.id === c.positionId)
        return {
          id: c.id,
          candidateName: c.name,
          positionTitle: position?.title || '',
          score: c.score,
          date: c.analyzedAt!,
          status: c.status,
        }
      })
      .sort((a, b) => b.date - a.date)
      .slice(0, 10)

    return activities
  }, [filteredCandidates, positions])

  const MetricCard = ({ 
    title, 
    value, 
    icon, 
    trend, 
    color = 'primary' 
  }: { 
    title: string
    value: number | string
    icon: React.ReactNode
    trend?: string
    color?: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs xs:text-sm font-medium leading-tight">{title}</CardTitle>
          <div className={`text-${color}`}>{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="text-xl xs:text-2xl md:text-3xl lg:text-4xl font-bold">{value}</div>
          {trend && (
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              {trend}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl xs:text-2xl md:text-3xl font-bold tracking-tight">{t('dashboard.title', language)}</h2>
          <p className="text-xs xs:text-sm md:text-base text-muted-foreground leading-snug">{t('dashboard.metrics', language)}</p>
        </div>
        
        <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">{t('dashboard.last7Days', language)}</SelectItem>
            <SelectItem value="30">{t('dashboard.last30Days', language)}</SelectItem>
            <SelectItem value="90">{t('dashboard.last90Days', language)}</SelectItem>
            <SelectItem value="all">{t('dashboard.allTime', language)}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full max-w-full xs:max-w-md grid-cols-2 mb-3 sm:mb-4">
          <TabsTrigger value="overview" className="gap-1.5 xs:gap-2 text-xs xs:text-sm">
            <ChartBar size={14} className="xs:hidden" weight="duotone" />
            <ChartBar size={16} className="hidden xs:block" weight="duotone" />
            <span className="hidden xs:inline">{language === 'fr' ? 'Vue d\'ensemble' : 'Overview'}</span>
            <span className="xs:hidden">{language === 'fr' ? 'Vue' : 'View'}</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="gap-1.5 xs:gap-2 text-xs xs:text-sm">
            <ChartLineUp size={14} className="xs:hidden" weight="duotone" />
            <ChartLineUp size={16} className="hidden xs:block" weight="duotone" />
            <span className="hidden xs:inline">{language === 'fr' ? 'Analyses Avancées' : 'Advanced Analytics'}</span>
            <span className="xs:hidden">{language === 'fr' ? 'Avancé' : 'Advanced'}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 md:space-y-6">

      <div className="grid gap-3 md:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <MetricCard
          title={t('dashboard.activePositions', language)}
          value={metrics.activePositions}
          icon={<Target size={16} className="xs:hidden" weight="duotone" />}
          color="primary"
        />
        <MetricCard
          title={t('dashboard.totalCandidates', language)}
          value={metrics.totalCandidates}
          icon={<Users size={16} className="xs:hidden" weight="duotone" />}
          color="accent"
        />
        <MetricCard
          title={t('dashboard.averageScore', language)}
          value={`${metrics.averageScore}%`}
          icon={<TrendUp size={16} className="xs:hidden" weight="duotone" />}
          color="accent"
        />
        <MetricCard
          title={t('dashboard.candidatesSelected', language)}
          value={metrics.candidatesSelected}
          icon={<CheckCircle size={16} className="xs:hidden" weight="duotone" />}
          color="accent"
        />
        <MetricCard
          title={t('dashboard.candidatesRejected', language)}
          value={metrics.candidatesRejected}
          icon={<XCircle size={16} className="xs:hidden" weight="duotone" />}
          color="muted"
        />
        <MetricCard
          title={t('dashboard.positionsFilled', language)}
          value={metrics.positionsFilled}
          icon={<CheckCircle size={16} className="xs:hidden" weight="duotone" />}
          color="accent"
        />
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm xs:text-base sm:text-lg">{t('dashboard.topPerformers', language)}</CardTitle>
            <CardDescription className="text-xs xs:text-sm">{t('dashboard.recentActivity', language)}</CardDescription>
          </CardHeader>
          <CardContent>
            {topPerformers.length === 0 ? (
              <p className="text-xs xs:text-sm text-muted-foreground text-center py-8">
                {t('dashboard.noData', language)}
              </p>
            ) : (
              <div className="space-y-2 xs:space-y-3">
                {topPerformers.map((candidate, index) => {
                  const position = positions.find(p => p.id === candidate.positionId)
                  return (
                    <div
                      key={candidate.id}
                      className="flex items-center justify-between p-2 xs:p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 xs:gap-3 min-w-0 flex-1">
                        <div className="flex h-7 w-7 xs:h-8 xs:w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs xs:text-sm sm:text-base font-bold shrink-0">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs xs:text-sm sm:text-base truncate">{candidate.name}</p>
                          <p className="text-[10px] xs:text-xs sm:text-sm text-muted-foreground truncate">
                            {position?.title}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="font-bold text-sm xs:text-base sm:text-lg">{candidate.score}</p>
                        <p className="text-[10px] xs:text-xs text-muted-foreground">/ 100</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm xs:text-base sm:text-lg">{t('dashboard.scoreDistribution', language)}</CardTitle>
            <CardDescription className="text-xs xs:text-sm">{t('dashboard.overview', language)}</CardDescription>
          </CardHeader>
          <CardContent>
            {scoreDistribution.every(r => r.count === 0) ? (
              <p className="text-xs xs:text-sm text-muted-foreground text-center py-8">
                {t('dashboard.noData', language)}
              </p>
            ) : (
              <div className="space-y-2 xs:space-y-3">
                {scoreDistribution.map((range) => {
                  const maxCount = Math.max(...scoreDistribution.map(r => r.count))
                  const percentage = maxCount > 0 ? (range.count / maxCount) * 100 : 0
                  
                  return (
                    <div key={range.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs xs:text-sm">
                        <span className="font-medium">{range.label}</span>
                        <span className="text-muted-foreground">{range.count}</span>
                      </div>
                      <div className="h-1.5 xs:h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="h-full bg-accent rounded-full"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm xs:text-base sm:text-lg">{t('dashboard.candidatesPerPosition', language)}</CardTitle>
            <CardDescription className="text-xs xs:text-sm">{t('dashboard.positionsOverview', language)}</CardDescription>
          </CardHeader>
          <CardContent>
            {candidatesPerPosition.length === 0 ? (
              <p className="text-xs xs:text-sm text-muted-foreground text-center py-8">
                {t('dashboard.noData', language)}
              </p>
            ) : (
              <div className="space-y-2 xs:space-y-3">
                {candidatesPerPosition.map((item) => {
                  const maxCount = Math.max(...candidatesPerPosition.map(i => i.count))
                  const percentage = (item.count / maxCount) * 100
                  
                  return (
                    <div key={item.title} className="space-y-1">
                      <div className="flex items-center justify-between text-xs xs:text-sm">
                        <span className="font-medium truncate flex-1 mr-2">{item.title}</span>
                        <span className="text-muted-foreground shrink-0">{item.count}</span>
                      </div>
                      <div className="h-1.5 xs:h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm xs:text-base sm:text-lg">{t('dashboard.recentActivity', language)}</CardTitle>
            <CardDescription className="text-xs xs:text-sm">{t('dashboard.evaluationTimeline', language)}</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-xs xs:text-sm text-muted-foreground text-center py-8">
                {t('dashboard.noData', language)}
              </p>
            ) : (
              <div className="space-y-1.5 xs:space-y-2 max-h-[320px] overflow-y-auto">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start justify-between p-1.5 xs:p-2 rounded-lg hover:bg-secondary/30 transition-colors text-xs xs:text-sm"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-xs xs:text-sm">{activity.candidateName}</p>
                      <p className="text-[10px] xs:text-xs text-muted-foreground truncate">
                        {activity.positionTitle}
                      </p>
                      <p className="text-[10px] xs:text-xs text-muted-foreground">
                        {new Date(activity.date).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="font-bold text-sm xs:text-base">{activity.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedAnalyticsDashboard
            positions={positions}
            candidates={candidates}
            language={language}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
