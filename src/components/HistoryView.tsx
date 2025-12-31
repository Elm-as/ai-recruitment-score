import { useState } from 'react'
import { Position, Candidate } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MagnifyingGlass, CalendarBlank, Users, User } from '@phosphor-icons/react'

interface HistoryViewProps {
  positions: Position[]
  candidates: Candidate[]
}

export default function HistoryView({ positions, candidates }: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPositions = positions.filter((position) => {
    const query = searchQuery.toLowerCase()
    return (
      position.title.toLowerCase().includes(query) ||
      position.description.toLowerCase().includes(query)
    )
  })

  const getCandidatesForPosition = (positionId: string) => {
    return candidates.filter((c) => c.positionId === positionId)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">History</h2>
        <p className="text-sm text-muted-foreground">
          View all past evaluations and recruitment activities
        </p>
      </div>

      <div className="relative">
        <MagnifyingGlass
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search positions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredPositions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">
              {positions.length === 0
                ? 'No positions in history yet'
                : 'No positions match your search'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-300px)]">
          <div className="space-y-4 pr-4">
            {filteredPositions.map((position) => {
              const positionCandidates = getCandidatesForPosition(position.id)
              const scoredCandidates = positionCandidates.filter((c) => c.status === 'scored' || c.status === 'selected' || c.status === 'rejected')
              const selectedCandidates = positionCandidates.filter((c) => c.status === 'selected')

              return (
                <Card key={position.id} className="hover:border-accent/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{position.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {position.description}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={position.status === 'active' ? 'default' : 'secondary'}
                        className="shrink-0"
                      >
                        {position.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <CalendarBlank size={14} />
                      <span>Created {formatDate(position.createdAt)}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-muted-foreground" />
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-semibold">{positionCandidates.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-muted-foreground" />
                          <span className="text-muted-foreground">Evaluated:</span>
                          <span className="font-semibold">{scoredCandidates.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-green-600 text-white gap-1.5 text-xs">
                            Selected: {selectedCandidates.length}
                          </Badge>
                        </div>
                      </div>

                      {scoredCandidates.length > 0 && (
                        <>
                          <Separator />
                          <div>
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                              Top Candidates
                            </h4>
                            <div className="space-y-2">
                              {scoredCandidates
                                .sort((a, b) => b.score - a.score)
                                .slice(0, 3)
                                .map((candidate, index) => (
                                  <div
                                    key={candidate.id}
                                    className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        #{index + 1}
                                      </Badge>
                                      <span className="font-medium">{candidate.name}</span>
                                      {candidate.status === 'selected' && (
                                        <Badge className="bg-green-600 text-white text-xs">
                                          Selected
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
              )
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
