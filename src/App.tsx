import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Position, Candidate } from '@/lib/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Briefcase, Users, Clock } from '@phosphor-icons/react'
import PositionsView from '@/components/PositionsView'
import HistoryView from '@/components/HistoryView'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [positions, setPositions] = useKV<Position[]>('positions', [])
  const [candidates, setCandidates] = useKV<Candidate[]>('candidates', [])
  const [activeTab, setActiveTab] = useState('positions')

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            AI Recruitment Assistant
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Intelligent candidate evaluation and ranking system
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="positions" className="gap-2">
              <Briefcase size={18} />
              Positions
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock size={18} />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="mt-0">
            <PositionsView
              positions={positions || []}
              setPositions={setPositions}
              candidates={candidates || []}
              setCandidates={setCandidates}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <HistoryView
              positions={positions || []}
              candidates={candidates || []}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Toaster />
    </div>
  )
}

export default App
