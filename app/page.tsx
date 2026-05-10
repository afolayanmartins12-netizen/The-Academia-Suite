'use client'

import { useState } from 'react'
import { BottomNav, TabType } from '@/components/academia/bottom-nav'
import { HomeTab } from '@/components/academia/tabs/home-tab'
import { AttendanceTab } from '@/components/academia/tabs/attendance-tab'
import { GradesTab } from '@/components/academia/tabs/grades-tab'
import { UtilitiesTab } from '@/components/academia/tabs/utilities-tab'

export default function AcademiaSuite() {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [utilityTarget, setUtilityTarget] = useState<string | undefined>()

  const handleNavigate = (tab: TabType, utility?: string) => {
    setActiveTab(tab)
    if (utility) {
      setUtilityTarget(utility)
    } else {
      setUtilityTarget(undefined)
    }
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab onNavigate={handleNavigate} />
      case 'attendance':
        return <AttendanceTab />
      case 'grades':
        return <GradesTab />
      case 'utilities':
        return <UtilitiesTab initialUtility={utilityTarget} />
      default:
        return <HomeTab onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen mesh-bg">
      <div className="max-w-md mx-auto h-screen flex flex-col">
        {/* Main Content */}
        <main className="flex-1 overflow-auto pb-24">
          {renderTab()}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={(tab) => handleNavigate(tab)} />
      </div>
    </div>
  )
}
