'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  FileText, Brain, Wallet, Calendar, Camera,
  Send, Download, Sparkles, Plus, ChevronLeft, Trash2, ArrowUp
} from 'lucide-react'
import { GlassCard } from '../glass-card'
import { cn } from '@/lib/utils'

type UtilityType = 'menu' | 'pdf' | 'ai' | 'budget' | 'timetable' | 'scanner'

interface UtilitiesTabProps {
  initialUtility?: string
}

interface Expense {
  id: string
  name: string
  amount: number
  date: string
}

interface TimetableEntry {
  id: string
  subject: string
  time: string
  venue: string
}

const utilities = [
  { id: 'pdf' as const, label: 'PDF Share', icon: FileText, desc: 'Share files offline' },
  { id: 'ai' as const, label: 'Study AI', icon: Brain, desc: 'AI study assistant' },
  { id: 'budget' as const, label: 'Budget', icon: Wallet, desc: 'Track expenses' },
  { id: 'timetable' as const, label: 'Timetable', icon: Calendar, desc: 'Daily schedule' },
  { id: 'scanner' as const, label: 'Doc Scanner', icon: Camera, desc: 'Scan documents' },
]

// PDF Share Component
function PDFShare() {
  const [mode, setMode] = useState<'send' | 'receive'>('send')
  
  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-1 flex">
        <button
          onClick={() => setMode('send')}
          className={cn(
            'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2',
            mode === 'send' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          )}
        >
          <Send className="w-4 h-4" />
          Send
        </button>
        <button
          onClick={() => setMode('receive')}
          className={cn(
            'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2',
            mode === 'receive' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          )}
        >
          <Download className="w-4 h-4" />
          Receive
        </button>
      </div>
      
      <GlassCard className="h-48 flex flex-col items-center justify-center gap-3">
        {mode === 'send' ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Tap to select a file</p>
            <button className="max-w-[120px] bg-primary text-primary-foreground text-xs font-medium py-2 px-4 rounded-xl">
              Choose File
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center spark-animate">
              <Download className="w-8 h-8 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Searching for nearby devices...</p>
          </>
        )}
      </GlassCard>
    </div>
  )
}

// Study AI Component - Fixed height with pinned input
function StudyAI() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hello! How can I help you study today?' }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    
    setMessages([
      ...messages,
      { id: Date.now(), role: 'user', content: input },
      { id: Date.now() + 1, role: 'assistant', content: 'I understand you want to learn about that topic. Let me help you break it down...' }
    ])
    setInput('')
  }

  return (
    <div className="absolute inset-0 flex flex-col md:max-w-[70%] md:mx-auto md:inset-x-0">
      {/* Messages area - scrollable */}
      <div className="flex-1 overflow-auto px-1 pb-2 min-h-0">
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'max-w-[85%] p-3 rounded-2xl text-sm',
                msg.role === 'user' 
                  ? 'ml-auto bg-primary text-primary-foreground rounded-br-md'
                  : 'glass-card rounded-bl-md'
              )}
            >
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input bar - PINNED at bottom */}
      <div className="shrink-0 flex items-center gap-2 p-2 bg-background/80 backdrop-blur-sm border-t border-border/50">
        <div className="flex-1 glass-card rounded-xl px-3 py-2.5 flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-primary spark-animate shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
          />
        </div>
        <button
          onClick={sendMessage}
          className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0"
        >
          <ArrowUp className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>
    </div>
  )
}

// Budget Tracker Component
function BudgetTracker() {
  const [allowance] = useState(50000)
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', name: 'Textbooks', amount: 15000, date: 'May 5' },
    { id: '2', name: 'Lunch', amount: 8500, date: 'May 6' },
    { id: '3', name: 'Transport', amount: 9000, date: 'May 7' },
  ])
  const [newExpenseName, setNewExpenseName] = useState('')
  const [newExpenseAmount, setNewExpenseAmount] = useState('')
  const [showForm, setShowForm] = useState(false)

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const percentage = (totalSpent / allowance) * 100

  const createExpense = () => {
    if (!newExpenseName.trim() || !newExpenseAmount) return
    
    const newExpense: Expense = {
      id: Date.now().toString(),
      name: newExpenseName,
      amount: parseFloat(newExpenseAmount),
      date: 'Today',
    }
    setExpenses([...expenses, newExpense])
    setNewExpenseName('')
    setNewExpenseAmount('')
    setShowForm(false)
  }

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  return (
    <div className="space-y-4">
      <GlassCard>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-muted-foreground">Monthly Allowance</p>
            <p className="text-xl font-bold text-foreground">&#8358;{allowance.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Spent</p>
            <p className="text-xl font-bold text-primary">&#8358;{totalSpent.toLocaleString()}</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-right">
          {percentage.toFixed(0)}% used - &#8358;{(allowance - totalSpent).toLocaleString()} remaining
        </p>
      </GlassCard>

      {/* Expense List */}
      <div className="space-y-2">
        {expenses.map((expense) => (
          <GlassCard key={expense.id} className="py-2 px-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{expense.name}</p>
                <p className="text-xs text-muted-foreground">{expense.date}</p>
              </div>
              <p className="text-sm font-medium text-primary">&#8358;{expense.amount.toLocaleString()}</p>
              <button
                onClick={() => removeExpense(expense.id)}
                className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Add Expense Form */}
      {showForm ? (
        <GlassCard className="space-y-3">
          <input
            type="text"
            value={newExpenseName}
            onChange={(e) => setNewExpenseName(e.target.value)}
            placeholder="Expense name"
            className="w-full bg-muted/50 rounded-lg py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="number"
            value={newExpenseAmount}
            onChange={(e) => setNewExpenseAmount(e.target.value)}
            placeholder="Amount"
            className="w-full bg-muted/50 rounded-lg py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 max-w-[100px] glass-card rounded-xl py-2 text-xs font-medium text-muted-foreground"
            >
              Cancel
            </button>
            <button
              onClick={createExpense}
              className="flex-1 max-w-[100px] bg-primary text-primary-foreground rounded-xl py-2 text-xs font-medium"
            >
              Add
            </button>
          </div>
        </GlassCard>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="max-w-[130px] glass-card rounded-xl py-2 px-4 flex items-center justify-center gap-2 text-xs font-medium text-primary hover:border-primary/30 transition-all mx-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Expense
        </button>
      )}
    </div>
  )
}

// Manual Timetable Component
function Timetable() {
  const [entries, setEntries] = useState<TimetableEntry[]>([
    { id: '1', subject: 'Mathematics', time: '08:00', venue: 'LT-201' },
    { id: '2', subject: 'Computer Science', time: '10:00', venue: 'Lab-3' },
    { id: '3', subject: 'Physics', time: '14:00', venue: 'LT-105' },
  ])
  const [showForm, setShowForm] = useState(false)
  const [newSubject, setNewSubject] = useState('')
  const [newTime, setNewTime] = useState('')
  const [newVenue, setNewVenue] = useState('')

  const addEntry = () => {
    if (!newSubject.trim() || !newTime.trim()) return
    
    const newEntry: TimetableEntry = {
      id: Date.now().toString(),
      subject: newSubject,
      time: newTime,
      venue: newVenue,
    }
    setEntries([...entries, newEntry].sort((a, b) => a.time.localeCompare(b.time)))
    setNewSubject('')
    setNewTime('')
    setNewVenue('')
    setShowForm(false)
  }

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-foreground">Your Schedule</p>
        <p className="text-xs text-muted-foreground">Manual Entry</p>
      </div>
      
      {entries.map((entry, index) => (
        <GlassCard 
          key={entry.id} 
          className="flex items-center gap-3 py-2 px-3 animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
        >
          <div className="w-12 text-xs font-medium text-muted-foreground">
            {entry.time}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{entry.subject}</p>
          </div>
          <div className="text-xs text-muted-foreground">
            {entry.venue}
          </div>
          <button
            onClick={() => removeEntry(entry.id)}
            className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </GlassCard>
      ))}

      {/* Add Entry Form */}
      {showForm ? (
        <GlassCard className="space-y-3">
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Subject"
            className="w-full bg-muted/50 rounded-lg py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex gap-2">
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="flex-1 bg-muted/50 rounded-lg py-2 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              value={newVenue}
              onChange={(e) => setNewVenue(e.target.value)}
              placeholder="Venue"
              className="flex-1 bg-muted/50 rounded-lg py-2 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 max-w-[100px] glass-card rounded-xl py-2 text-xs font-medium text-muted-foreground"
            >
              Cancel
            </button>
            <button
              onClick={addEntry}
              className="flex-1 max-w-[100px] bg-primary text-primary-foreground rounded-xl py-2 text-xs font-medium"
            >
              Add
            </button>
          </div>
        </GlassCard>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="max-w-[120px] glass-card rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-medium text-primary hover:border-primary/30 transition-all mx-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Entry
        </button>
      )}
    </div>
  )
}

// Doc Scanner Component
function DocScanner() {
  return (
    <GlassCard className="h-64 flex flex-col items-center justify-center gap-4">
      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
        <Camera className="w-10 h-10 text-primary" />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Position your document within the frame
      </p>
      <button className="max-w-[120px] bg-primary text-primary-foreground text-xs font-medium py-2 px-4 rounded-xl">
        Open Camera
      </button>
    </GlassCard>
  )
}

export function UtilitiesTab({ initialUtility }: UtilitiesTabProps) {
  const [activeUtility, setActiveUtility] = useState<UtilityType>('menu')

  useEffect(() => {
    if (initialUtility && utilities.find(u => u.id === initialUtility)) {
      setActiveUtility(initialUtility as UtilityType)
    }
  }, [initialUtility])

  const renderUtility = () => {
    switch (activeUtility) {
      case 'pdf': return <PDFShare />
      case 'ai': return <StudyAI />
      case 'budget': return <BudgetTracker />
      case 'timetable': return <Timetable />
      case 'scanner': return <DocScanner />
      default: return null
    }
  }

  // Special layout for Study AI - full height with pinned input
  if (activeUtility === 'ai') {
    return (
      <div className="h-full flex flex-col">
        <div className="shrink-0 p-4 pb-2">
          <button
            onClick={() => setActiveUtility('menu')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Utilities
          </button>
          <h2 className="text-lg font-semibold text-foreground">Study AI</h2>
        </div>
        <div className="flex-1 relative min-h-0 px-4">
          <StudyAI />
        </div>
      </div>
    )
  }

  if (activeUtility !== 'menu') {
    const utility = utilities.find(u => u.id === activeUtility)
    return (
      <div className="h-full flex flex-col p-4 pb-0">
        <button
          onClick={() => setActiveUtility('menu')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Utilities
        </button>
        <h2 className="text-lg font-semibold text-foreground mb-4 shrink-0">{utility?.label}</h2>
        <div className="flex-1 overflow-auto min-h-0 pb-4">
          {renderUtility()}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col p-4 gap-4 overflow-auto pb-20">
      <div className="shrink-0">
        <h1 className="text-xl font-semibold text-foreground">Utilities</h1>
        <p className="text-sm text-muted-foreground mt-1">Your academic toolkit</p>
      </div>

      <div className="space-y-2">
        {utilities.map((utility, index) => {
          const Icon = utility.icon
          return (
            <GlassCard
              key={utility.id}
              onClick={() => setActiveUtility(utility.id)}
              className="flex items-center gap-3 animate-fade-in hover:border-primary/30"
              style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{utility.label}</p>
                <p className="text-xs text-muted-foreground">{utility.desc}</p>
              </div>
              <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
