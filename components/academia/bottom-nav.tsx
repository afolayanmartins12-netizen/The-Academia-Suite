'use client'

import { Home, Radio, Calculator, Library } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TabType = 'home' | 'attendance' | 'grades' | 'utilities'

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs = [
  { id: 'home' as const, label: 'Home', icon: Home },
  { id: 'attendance' as const, label: 'Attendance', icon: Radio },
  { id: 'grades' as const, label: 'Grades', icon: Calculator },
  { id: 'utilities' as const, label: 'Utilities', icon: Library },
]

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card rounded-t-3xl border-t-0 border-x-0 px-2 pb-6 pt-2">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className={cn(
                'p-2 rounded-xl transition-all duration-200',
                isActive && 'bg-primary/10'
              )}>
                <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
