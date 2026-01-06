import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Position, Candidate, Language } from '@/lib/types'
import { t } from '@/lib/translations'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Briefcase, Clock, Moon, Sun, Globe, Monitor, Question } from '@phosphor-icons/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import PositionsView from '@/components/PositionsView'
import HistoryView from '@/components/HistoryView'
import FAQView from '@/components/FAQView'
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight break-words">
                {t('app.title', lang)}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 hidden xs:block">
                {t('app.subtitle', lang)}
              </p>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="hover:scale-105 transition-transform h-9 w-9 sm:h-10 sm:w-10">
                    <Globe size={18} className="sm:hidden" weight="duotone" />
                    <Globe size={18} className="hidden sm:block" weight="duotone" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setLanguage('fr')} className="cursor-pointer text-sm">
                    🇫🇷 Français
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage('en')} className="cursor-pointer text-sm">
                    🇬🇧 English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="hover:scale-105 transition-transform h-9 w-9 sm:h-10 sm:w-10">
                    {theme === 'dark' ? (
                      <Moon size={18} className="sm:hidden" weight="duotone" />
                    ) : theme === 'light' ? (
                      <Sun size={18} className="sm:hidden" weight="duotone" />
                    ) : (
                      <Monitor size={18} className="sm:hidden" weight="duotone" />
                    )}
                    {theme === 'dark' ? (
                      <Moon size={18} className="hidden sm:block" weight="duotone" />
                    ) : theme === 'light' ? (
                      <Sun size={18} className="hidden sm:block" weight="duotone" />
                    ) : (
                      <Monitor size={18} className="hidden sm:block" weight="duotone" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme('light')} className="cursor-pointer text-sm">
                    <Sun size={14} className="mr-2" />
                    {t('theme.light', lang)}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')} className="cursor-pointer text-sm">
                    <Moon size={14} className="mr-2" />
                    {t('theme.dark', lang)}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')} className="cursor-pointer text-sm">
                    <Monitor size={14} className="mr-2" />
                    {t('theme.system', lang)}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-full sm:max-w-lg grid-cols-3 mb-4 sm:mb-6 h-11">
            <TabsTrigger value="positions" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Briefcase size={16} className="sm:hidden" weight="duotone" />
              <Briefcase size={18} className="hidden sm:block" weight="duotone" />
              <span className="hidden xs:inline">{t('nav.positions', lang)}</span>
              <span className="xs:hidden">Postes</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Clock size={16} className="sm:hidden" weight="duotone" />
              <Clock size={18} className="hidden sm:block" weight="duotone" />
              <span className="hidden xs:inline">{t('nav.history', lang)}</span>
              <span className="xs:hidden">Historique</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="gap-1.5 sm:gap-2 text-xs sm:text-sm">
              <Question size={16} className="sm:hidden" weight="duotone" />
              <Question size={18} className="hidden sm:block" weight="duotone" />
              <span className="hidden xs:inline">FAQ</span>
              <span className="xs:hidden">FAQ</span>
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

          <TabsContent value="faq" className="mt-0">
            <FAQView language={lang} />
          </TabsContent>
        </Tabs>
      </main>

      <Toaster />
    </div>
  )
}

export default App
