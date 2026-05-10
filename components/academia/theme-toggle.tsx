'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-14 h-7 rounded-full bg-muted/20" />

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        // Forced 'rounded-full' for the track
        "relative w-14 h-7 rounded-full transition-all duration-500 border",
        // Light Mode: Subtle border
        "bg-white/10 border-black/5 shadow-inner",
        // Dark Mode: Ensure border is visible so you can see the curves
        "dark:bg-white/5 dark:border-white/10 backdrop-blur-md"
      )}
      aria-label="Toggle theme"
    >
      <div
        className={cn(
          // Forced 'rounded-full' for the sliding pill
          "absolute w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out shadow-md",
          // Dark Mode: Left position
          isDark 
            ? "translate-x-1 bg-slate-800 border border-white/20" 
            : "translate-x-8 bg-white border border-black/5"
        )}
      >
        {isDark ? (
          <Moon className="w-3 h-3 text-primary fill-primary" />
        ) : (
          <Sun className="w-3 h-3 text-amber-500 fill-amber-500" />
        )}
      </div>
    </button>
  )
}