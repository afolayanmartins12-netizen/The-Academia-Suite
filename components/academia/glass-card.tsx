'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function GlassCard({ children, className, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass-card rounded-2xl p-4 transition-all duration-200 overflow-hidden relative',
        onClick && 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
        className
      )}
    >
      {children}
    </div>
  )
}
