import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Position, Candidate, Language } from '@/lib/types'
import { TrendUp, TrendDown, Users, Briefcase, Target, Clock, ChartLine, CheckCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'

interface AdvancedAnalyticsDashboardProps {
  positions: Position[]
  candidates: Candidate[]
  language: Language
}

const COLORS = ['#4545ab', '#63b3ed', '#48bb78', '#ed8936', '#f56565', '#9f7aea']

export function AdvancedAnalyticsDashboard({
  positions,
  candidates,
  language
}: AdvancedAnalyticsDashboardProps) {
  const analytics = useMemo(() => {
    const activePositions = positions.filter(p => p.status === 'active')
    const closedPositions = positions.filter(p => p.status === 'closed')
    const archivedPositions = positions.filter(p => p.status === 'archived')
    
    const totalCandidates = candidates.length
    const scoredCandidates = candidates.filter(c => c.status !== 'pending' && c.status !== 'analyzing')
    const hiredCandidates = candidates.filter(c => c.status === 'hired')
    const selectedCandidates = candidates.filter(c => c.status === 'selected')
    const rejectedCandidates = candidates.filter(c => c.status === 'rejected')
    
    const averageScore = scoredCandidates.length > 0
      ? scoredCandidates.reduce((sum, c) => sum + c.score, 0) / scoredCandidates.length
      : 0
    
    const conversionRate = totalCandidates > 0
      ? ((hiredCandidates.length / totalCandidates) * 100)
      : 0
    
    const selectionRate = scoredCandidates.length > 0
      ? (((selectedCandidates.length + hiredCandidates.length) / scoredCandidates.length) * 100)
      : 0
    
    const averageTimeToScore = scoredCandidates.length > 0
      ? scoredCandidates
          .filter(c => c.analyzedAt && c.createdAt)
          .reduce((sum, c) => sum + (c.analyzedAt! - c.createdAt), 0) / 
        scoredCandidates.filter(c => c.analyzedAt && c.createdAt).length
      : 0
    
    const positionDistribution = positions.map(position => ({
      name: position.title,
      candidates: candidates.filter(c => c.positionId === position.id).length,
      hired: candidates.filter(c => c.positionId === position.id && c.status === 'hired').length
    }))
    
    const statusDistribution = [
      { name: language === 'fr' ? 'En attente' : 'Pending', value: candidates.filter(c => c.status === 'pending').length },
      { name: language === 'fr' ? 'Évalués' : 'Scored', value: candidates.filter(c => c.status === 'scored').length },
      { name: language === 'fr' ? 'Sélectionnés' : 'Selected', value: selectedCandidates.length },
      { name: language === 'fr' ? 'Recrutés' : 'Hired', value: hiredCandidates.length },
      { name: language === 'fr' ? 'Rejetés' : 'Rejected', value: rejectedCandidates.length }
    ].filter(item => item.value > 0)
    
    const scoreDistribution = [
      { range: '0-20', count: scoredCandidates.filter(c => c.score < 20).length },
      { range: '20-40', count: scoredCandidates.filter(c => c.score >= 20 && c.score < 40).length },
      { range: '40-60', count: scoredCandidates.filter(c => c.score >= 40 && c.score < 60).length },
      { range: '60-80', count: scoredCandidates.filter(c => c.score >= 60 && c.score < 80).length },
      { range: '80-100', count: scoredCandidates.filter(c => c.score >= 80).length }
    ]
    
    const last30Days = Date.now() - (30 * 24 * 60 * 60 * 1000)
    const last60Days = Date.now() - (60 * 24 * 60 * 60 * 1000)
    const last90Days = Date.now() - (90 * 24 * 60 * 60 * 1000)
    
    const trendsData: Array<{
      date: string
      candidates: number
      hired: number
      avgScore: number | null
    }> = []
    const daysRange = 30
    for (let i = daysRange - 1; i >= 0; i--) {
      const dayStart = Date.now() - (i * 24 * 60 * 60 * 1000)
      const dayEnd = dayStart + (24 * 60 * 60 * 1000)
      const date = new Date(dayStart)
      
      trendsData.push({
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        candidates: candidates.filter(c => c.createdAt >= dayStart && c.createdAt < dayEnd).length,
        hired: candidates.filter(c => c.hiredAt && c.hiredAt >= dayStart && c.hiredAt < dayEnd).length,
        avgScore: (() => {
          const dayCandidates = candidates.filter(c => c.analyzedAt && c.analyzedAt >= dayStart && c.analyzedAt < dayEnd && c.status !== 'pending')
          return dayCandidates.length > 0
            ? dayCandidates.reduce((sum, c) => sum + c.score, 0) / dayCandidates.length
            : null
        })()
      })
    }
    
    const categoryPerformance = scoredCandidates.length > 0 && scoredCandidates[0].scoreBreakdown
      ? scoredCandidates[0].scoreBreakdown.map(breakdown => {
          const categoryScores = scoredCandidates
            .map(c => c.scoreBreakdown.find(sb => sb.category === breakdown.category)?.score || 0)
          
          const avg = categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length
          const max = Math.max(...categoryScores)
          const min = Math.min(...categoryScores)
          
          return {
            category: breakdown.category,
            average: avg,
            highest: max,
            lowest: min
          }
        })
      : []
    
    return {
      totalPositions: positions.length,
      activePositions: activePositions.length,
      closedPositions: closedPositions.length,
      archivedPositions: archivedPositions.length,
      totalCandidates,
      scoredCandidates: scoredCandidates.length,
      hiredCandidates: hiredCandidates.length,
      selectedCandidates: selectedCandidates.length,
      rejectedCandidates: rejectedCandidates.length,
      averageScore,
      conversionRate,
      selectionRate,
      averageTimeToScore,
      positionDistribution,
      statusDistribution,
      scoreDistribution,
      trendsData,
      categoryPerformance
    }
  }, [positions, candidates, language])

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon size={20} weight="duotone" className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend === 'up' ? <TrendUp size={14} /> : <TrendDown size={14} />}
              <span>{trendValue}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            {language === 'fr' ? 'Analyses Avancées' : 'Advanced Analytics'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {language === 'fr' 
              ? 'Tendances, taux de conversion et insights du pipeline de recrutement' 
              : 'Trends, conversion rates, and hiring pipeline insights'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={language === 'fr' ? 'Total Postes' : 'Total Positions'}
          value={analytics.totalPositions}
          subtitle={`${analytics.activePositions} ${language === 'fr' ? 'actifs' : 'active'}`}
          icon={Briefcase}
        />
        
        <StatCard
          title={language === 'fr' ? 'Total Candidats' : 'Total Candidates'}
          value={analytics.totalCandidates}
          subtitle={`${analytics.scoredCandidates} ${language === 'fr' ? 'évalués' : 'scored'}`}
          icon={Users}
        />
        
        <StatCard
          title={language === 'fr' ? 'Taux de Conversion' : 'Conversion Rate'}
          value={`${analytics.conversionRate.toFixed(1)}%`}
          subtitle={`${analytics.hiredCandidates} ${language === 'fr' ? 'recrutés' : 'hired'}`}
          icon={Target}
        />
        
        <StatCard
          title={language === 'fr' ? 'Score Moyen' : 'Average Score'}
          value={`${analytics.averageScore.toFixed(1)}/100`}
          subtitle={language === 'fr' ? 'Tous candidats' : 'All candidates'}
          icon={ChartLine}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              {language === 'fr' ? 'Tendances sur 30 Jours' : '30-Day Trends'}
            </CardTitle>
            <CardDescription>
              {language === 'fr' 
                ? 'Candidats ajoutés et recrutés par jour' 
                : 'Candidates added and hired per day'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.trendsData}>
                <defs>
                  <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4545ab" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4545ab" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHired" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#48bb78" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#48bb78" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }} 
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="candidates" 
                  stroke="#4545ab" 
                  fillOpacity={1}
                  fill="url(#colorCandidates)"
                  name={language === 'fr' ? 'Candidats' : 'Candidates'}
                />
                <Area 
                  type="monotone" 
                  dataKey="hired" 
                  stroke="#48bb78" 
                  fillOpacity={1}
                  fill="url(#colorHired)"
                  name={language === 'fr' ? 'Recrutés' : 'Hired'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              {language === 'fr' ? 'Distribution des Scores' : 'Score Distribution'}
            </CardTitle>
            <CardDescription>
              {language === 'fr' 
                ? 'Répartition des candidats par plage de score' 
                : 'Candidates grouped by score range'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="range" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }} 
                />
                <Bar 
                  dataKey="count" 
                  fill="#4545ab" 
                  radius={[8, 8, 0, 0]}
                  name={language === 'fr' ? 'Candidats' : 'Candidates'}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              {language === 'fr' ? 'Statut des Candidats' : 'Candidate Status'}
            </CardTitle>
            <CardDescription>
              {language === 'fr' 
                ? 'Distribution par statut' 
                : 'Distribution by status'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              {language === 'fr' ? 'Performance par Catégorie' : 'Category Performance'}
            </CardTitle>
            <CardDescription>
              {language === 'fr' 
                ? 'Scores moyens par catégorie d\'évaluation' 
                : 'Average scores by evaluation category'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.categoryPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.categoryPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" domain={[0, 100]} className="text-xs" />
                  <YAxis dataKey="category" type="category" width={100} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }} 
                  />
                  <Bar 
                    dataKey="average" 
                    fill="#4545ab" 
                    radius={[0, 8, 8, 0]}
                    name={language === 'fr' ? 'Moyenne' : 'Average'}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                {language === 'fr' 
                  ? 'Aucune donnée de catégorie disponible' 
                  : 'No category data available'}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              {language === 'fr' ? 'Candidats par Poste' : 'Candidates per Position'}
            </CardTitle>
            <CardDescription>
              {language === 'fr' 
                ? 'Nombre de candidats et recrutements par poste' 
                : 'Number of candidates and hires per position'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.positionDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.positionDistribution}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" angle={-45} textAnchor="end" height={80} />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }} 
                  />
                  <Legend />
                  <Bar 
                    dataKey="candidates" 
                    fill="#4545ab" 
                    radius={[8, 8, 0, 0]}
                    name={language === 'fr' ? 'Candidats' : 'Candidates'}
                  />
                  <Bar 
                    dataKey="hired" 
                    fill="#48bb78" 
                    radius={[8, 8, 0, 0]}
                    name={language === 'fr' ? 'Recrutés' : 'Hired'}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                {language === 'fr' 
                  ? 'Aucun poste disponible' 
                  : 'No positions available'}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              {language === 'fr' ? 'Métriques Clés' : 'Key Metrics'}
            </CardTitle>
            <CardDescription>
              {language === 'fr' 
                ? 'Indicateurs de performance du recrutement' 
                : 'Recruitment performance indicators'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Target size={24} weight="duotone" className="text-primary" />
                  <div>
                    <p className="text-sm font-medium">
                      {language === 'fr' ? 'Taux de Sélection' : 'Selection Rate'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'fr' ? 'Candidats sélectionnés/évalués' : 'Selected/scored candidates'}
                    </p>
                  </div>
                </div>
                <Badge className="text-base px-3 py-1">
                  {analytics.selectionRate.toFixed(1)}%
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock size={24} weight="duotone" className="text-primary" />
                  <div>
                    <p className="text-sm font-medium">
                      {language === 'fr' ? 'Temps Moyen d\'Évaluation' : 'Avg. Evaluation Time'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'fr' ? 'De la soumission à l\'évaluation' : 'From submission to scoring'}
                    </p>
                  </div>
                </div>
                <Badge className="text-base px-3 py-1">
                  {analytics.averageTimeToScore > 0 
                    ? `${Math.round(analytics.averageTimeToScore / 1000 / 60)}m` 
                    : '-'}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle size={24} weight="duotone" className="text-emerald-600" />
                  <div>
                    <p className="text-sm font-medium">
                      {language === 'fr' ? 'Postes Fermés' : 'Closed Positions'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'fr' ? 'Recrutements complétés' : 'Completed recruitments'}
                    </p>
                  </div>
                </div>
                <Badge className="text-base px-3 py-1">
                  {analytics.closedPositions}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users size={24} weight="duotone" className="text-primary" />
                  <div>
                    <p className="text-sm font-medium">
                      {language === 'fr' ? 'Candidats par Poste' : 'Candidates per Position'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'fr' ? 'Moyenne' : 'Average'}
                    </p>
                  </div>
                </div>
                <Badge className="text-base px-3 py-1">
                  {analytics.totalPositions > 0 
                    ? (analytics.totalCandidates / analytics.totalPositions).toFixed(1) 
                    : '0'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
