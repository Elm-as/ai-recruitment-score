import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Position, Candidate, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Briefcase, Clock, Moon, Sun, Globe, Monitor } from '@phosphor-icons/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import PositionsView from '@/components/PositionsView'
import HistoryView from '@/components/HistoryView'
import { Toaster } from '@/components/ui/sonner'
import { useTheme } from '@/hooks/use-theme'
import { motion } from 'framer-motion'

function App() {
  const [positions, setPositions] = useKV<Position[]>('positions', [])
  const [candidates, setCandidates] = useKV<Candidate[]>('candidates', [])
  const [activeTab, setActiveTab] = useState('positions')
  const [language, setLanguage] = useKV<Language>('app-language', 'fr')
  const { theme, setTheme } = useTheme()

  const lang = language || 'fr'

  return (
    <div className="min-h-screen bg-background">
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                {t('app.title', lang)}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t('app.subtitle', lang)}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="hover:scale-105 transition-transform">
                    <Globe size={18} weight="duotone" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage('fr')} className="cursor-pointer">
                    🇫🇷 Français
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('en')} className="cursor-pointer">
                    🇬🇧 English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="hover:scale-105 transition-transform">
                    {theme === 'dark' ? (
                      <Moon size={18} weight="duotone" />
                    ) : theme === 'light' ? (
                      <Sun size={18} weight="duotone" />
                    ) : (
                      <Monitor size={18} weight="duotone" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer">
                    <Sun size={16} className="mr-2" />
                    {t('theme.light', lang)}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer">
                    <Moon size={16} className="mr-2" />
                    {t('theme.dark', lang)}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer">
                    <Monitor size={16} className="mr-2" />
                    {t('theme.system', lang)}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="positions" className="gap-2">
              <Briefcase size={18} weight="duotone" />
              <span className="hidden sm:inline">{t('nav.positions', lang)}</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Clock size={18} weight="duotone" />
              <span className="hidden sm:inline">{t('nav.history', lang)}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="positions" className="mt-0">
            <PositionsView
              positions={positions || []}
              setPositions={setPositions}
              candidates={candidates || []}
              setCandidates={setCandidates}
              language={lang}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <HistoryView
              positions={positions || []}
              candidates={candidates || []}
              language={lang}
            />
          </TabsContent>
        </Tabs>
      </main>

      <Toaster />
    </div>
  )
}

export default App
