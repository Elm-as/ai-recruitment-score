import { useState } from 'react'
import { Position, Candidate, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { MagnifyingGlass, CalendarBlank, Users, User, Archive } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface HistoryViewProps {
  positions: Position[]
  candidates: Candidate[]
  language: Language
}

export default function HistoryView({ positions, candidates, language }: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showArchivedOnly, setShowArchivedOnly] = useState(false)

  const filteredPositions = positions.filter((position) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch = (
      position.title.toLowerCase().includes(query) ||
      position.description.toLowerCase().includes(query)
    )
    
    if (showArchivedOnly) {
      return matchesSearch && position.status === 'archived'
    }
    
    return matchesSearch
  })

  const getCandidatesForPosition = (positionId: string) => {
    return candidates.filter((c) => c.positionId === positionId)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-semibold text-foreground mb-2">{t('history.title', language)}</h2>
        <p className="text-sm text-muted-foreground">
          {t('history.description', language)}
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlass
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            weight="duotone"
          />
          <Input
            placeholder={t('history.search', language)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showArchivedOnly ? 'default' : 'outline'}
          onClick={() => setShowArchivedOnly(!showArchivedOnly)}
          className="gap-2 whitespace-nowrap"
        >
          <Archive size={18} weight={showArchivedOnly ? 'fill' : 'duotone'} />
          {showArchivedOnly ? t('history.hideArchived', language) : t('history.showArchived', language)}
        </Button>
      </div>

      {filteredPositions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-dashed border-2">
            <CardContent className="py-16 text-center">
              <Users size={48} className="text-muted-foreground mx-auto mb-4" weight="duotone" />
              <p className="text-muted-foreground text-lg font-medium mb-2">
                {positions.length === 0 ? t('history.noHistory', language) : t('history.noResults', language)}
              </p>
              {positions.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  {t('history.noHistoryDesc', language)}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4 pr-4">
            {filteredPositions.map((position, index) => {
              const positionCandidates = getCandidatesForPosition(position.id)
              const scoredCandidates = positionCandidates.filter((c) => c.status === 'scored' || c.status === 'selected' || c.status === 'rejected')
              const selectedCandidates = positionCandidates.filter((c) => c.status === 'selected')

              return (
                <motion.div
                  key={position.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:border-accent/50 transition-all hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{position.title}</CardTitle>
                          <CardDescription className="line-clamp-2 mt-1">
                            {position.description}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={position.status === 'active' ? 'default' : position.status === 'archived' ? 'outline' : 'secondary'}
                          className="shrink-0"
                        >
                          {position.status === 'active' 
                            ? t('history.active', language) 
                            : position.status === 'archived'
                            ? t('positions.archived', language)
                            : t('history.closed', language)
                          }
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        <CalendarBlank size={14} weight="duotone" />
                        <span>{t('history.created', language)} {formatDate(position.createdAt)}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-muted-foreground" weight="duotone" />
                            <span className="text-muted-foreground">{t('history.total', language)}:</span>
                            <span className="font-semibold">{positionCandidates.length}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-muted-foreground" weight="duotone" />
                            <span className="text-muted-foreground">{t('history.evaluated', language)}:</span>
                            <span className="font-semibold">{scoredCandidates.length}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600 text-white gap-1.5 text-xs">
                              {t('history.selected', language)}: {selectedCandidates.length}
                            </Badge>
                          </div>
                        </div>

                        {scoredCandidates.length > 0 && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                                {t('history.topCandidates', language)}
                              </h4>
                              <div className="space-y-2">
                                {scoredCandidates
                                  .sort((a, b) => b.score - a.score)
                                  .slice(0, 3)
                                  .map((candidate, cidx) => (
                                    <div
                                      key={candidate.id}
                                      className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                                    >
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="text-xs">
                                          #{cidx + 1}
                                        </Badge>
                                        <span className="font-medium">{candidate.name}</span>
                                        {candidate.status === 'selected' && (
                                          <Badge className="bg-green-600 text-white text-xs">
                                            {t('positionDetail.selected', language)}
                                          </Badge>
                                        )}
                                      </div>
                                      <span className="font-semibold text-accent">
                                        {candidate.score}/100
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
