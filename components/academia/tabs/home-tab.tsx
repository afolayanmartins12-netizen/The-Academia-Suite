'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  FileText, 
  Brain, 
  Wallet, 
  Calendar, 
  ChevronRight, 
  LayoutGrid,
  BellRing,
  CheckCircle2,
  Flame
} from 'lucide-react'
import { GlassCard } from '../glass-card'
import { ThemeToggle } from '../theme-toggle'
import { SideDrawer } from '../side-drawer'
import { TabType } from '../bottom-nav'
import { cn } from '@/lib/utils'

interface HomeTabProps {
  onNavigate: (tab: TabType, utility?: string) => void
}

const quickAccess = [
  { id: 'pdf', label: 'PDF Share', icon: FileText, color: 'text-primary', tab: 'utilities' as const, utility: 'pdf' },
  { id: 'ai', label: 'Study AI', icon: Brain, color: 'text-primary', tab: 'utilities' as const, utility: 'ai' },
  { id: 'budget', label: 'Budget', icon: Wallet, color: 'text-primary', tab: 'utilities' as const, utility: 'budget' },
  { id: 'timetable', label: 'Timetable', icon: Calendar, color: 'text-primary', tab: 'utilities' as const, utility: 'timetable' },
]

export function HomeTab({ onNavigate }: HomeTabProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <div className="flex-1 flex flex-col p-5 gap-6 overflow-y-auto no-scrollbar pb-40 bg-transparent transition-colors duration-500">
        
        {/* --- HEADER: REDESIGNED FOR BEST ALIGNMENT --- */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDrawerOpen(true)}
              className="w-12 h-12 rounded-2xl bg-muted/50 border border-border flex items-center justify-center hover:border-primary/50 transition-all shadow-sm active:scale-95"
            >
              <User className="w-6 h-6 text-foreground/80" />
            </button>
            <div className="flex flex-col justify-center">
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1.5">Welcome back,</p>
              <h1 className="text-xl font-black text-foreground italic uppercase tracking-tighter leading-none">
                Hello, Martins Afolayan
              </h1>
            </div>
          </div>
          
          {/* Action Group: Using bg-muted/30 to "group" the toggle and bell visually */}
          <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl border border-border/50">
            <ThemeToggle />
            <div className="w-[1px] h-4 bg-border/50 mx-0.5" /> {/* Divider */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl text-primary hover:bg-primary/10 transition-all">
              <BellRing className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
            </button>
          </div>
        </div>

        {/* --- LIVE STATUS PANEL --- */}
        <GlassCard 
          className="bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border-primary/30 py-6 px-6 relative overflow-hidden group cursor-pointer"
          onClick={() => onNavigate('attendance')}
        >
          <div className="absolute -right-2 -top-2 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700">
            <LayoutGrid className="w-24 h-24 text-primary" />
          </div>
          
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] text-primary font-black uppercase tracking-widest">Ongoing Lecture</span>
          </div>
          
          <h3 className="text-2xl font-black text-foreground italic uppercase tracking-tighter leading-none">CSC301: Data Structures</h3>
          <p className="text-muted-foreground text-[10px] font-bold uppercase mt-2 tracking-wider">Hall 4 • Ends 2:45 PM</p>
        </GlassCard>

        {/* --- QUICK ACCESS --- */}
        <div>
          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-4 ml-1">Academic Utilities</p>
          <div className="grid grid-cols-2 gap-3">
            {quickAccess.map((item) => {
              const Icon = item.icon
              return (
                <GlassCard
                  key={item.id}
                  onClick={() => onNavigate(item.tab, item.utility)}
                  className="flex flex-col items-start gap-4 p-5 hover:border-primary/40 bg-muted/20 group transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center shrink-0 group-hover:text-primary transition-colors shadow-sm">
                    <Icon className={cn("w-5 h-5", item.color)} />
                  </div>
                  <span className="text-xs font-black text-foreground uppercase tracking-widest leading-none">{item.label}</span>
                </GlassCard>
              )
            })}
          </div>
        </div>

        {/* --- ATTENDANCE FOOTER --- */}
        <GlassCard 
          className="p-5 border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer group shadow-none mb-2"
          onClick={() => onNavigate('attendance', 'history')}
        >
          <div className="flex items-start justify-between">
            <div className="flex gap-5">
              <div className="relative w-14 h-14 shrink-0">
                <svg className="w-14 h-14 -rotate-90">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="5" className="text-primary/10" />
                  <circle
                    cx="28" cy="28" r="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeDasharray={`${92 * 1.5} 150`}
                    strokeLinecap="round"
                    className="text-primary transition-all duration-1000"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-foreground italic">92%</span>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Presence History</p>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                    <span className="text-sm font-bold text-foreground italic tracking-tight uppercase">View Full Logs</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-primary/10">
                   <div className="flex flex-col">
                      <span className="text-[8px] text-muted-foreground font-black uppercase tracking-tighter">Attended</span>
                      <span className="text-[10px] font-bold text-foreground tracking-widest">32 Sessions</span>
                   </div>
                   <div className="flex flex-col border-l border-primary/10 pl-4">
                      <span className="text-[8px] text-destructive/70 font-black uppercase tracking-tighter">Missed</span>
                      <span className="text-[10px] font-bold text-foreground tracking-widest">3 Classes</span>
                   </div>
                   <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded-md">
                      <Flame className="w-3 h-3 text-primary fill-primary/20" />
                      <span className="text-[10px] font-black text-primary">8 Day Streak</span>
                   </div>
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-1" />
          </div>
        </GlassCard>

      </div>

      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}