'use client'

import { useState, useEffect } from 'react'
import { 
  Check, 
  BookOpen, 
  Fingerprint, 
  X, 
  Radio, 
  MapPin, 
  ScanFace, 
  History, 
  TrendingUp 
} from 'lucide-react'
import { GlassCard } from '../glass-card'
import { cn } from '@/lib/utils'

interface Course {
  id: string
  code: string
  name: string
  isRegistered: boolean
}

const ALL_COURSES: Course[] = [
  { id: 'BEACON_301', code: 'CSC301', name: 'Data Structures', isRegistered: true },
  { id: 'BEACON_201', code: 'MTH201', name: 'Linear Algebra', isRegistered: true },
]

export function AttendanceTab() {
  const [mounted, setMounted] = useState(false)
  const [hasEnrolled, setHasEnrolled] = useState<boolean>(false)
  const [nearbyCourse, setNearbyCourse] = useState<Course | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [enrollmentProgress, setEnrollmentProgress] = useState(0)
  const [showHistory, setShowHistory] = useState(false)

  const attendanceHistory = [
    { code: 'CSC301', name: 'Data Structures', percentage: 85, sessions: '12/14', status: 'Present Today' },
    { code: 'MTH201', name: 'Linear Algebra', percentage: 62, sessions: '8/13', status: 'Absent Yesterday' },
    { code: 'CSC305', name: 'Operating Systems', percentage: 90, sessions: '10/11', status: 'Present Oct 24' },
  ]

  useEffect(() => {
    setMounted(true)
    const status = localStorage.getItem('kwasu_enrolled') === 'true'
    setHasEnrolled(status)
    if (status) setIsSearching(true)
  }, [])

  useEffect(() => {
    if (isSearching && mounted) {
      const timer = setTimeout(() => {
        const detectedId = 'BEACON_301' 
        const course = ALL_COURSES.find(c => c.id === detectedId && c.isRegistered)
        setNearbyCourse(course || null)
        setIsSearching(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isSearching, mounted])

  const startEnrollment = () => {
    const interval = setInterval(() => {
      setEnrollmentProgress(p => {
        if (p >= 100) {
          clearInterval(interval)
          localStorage.setItem('kwasu_enrolled', 'true')
          setHasEnrolled(true)
          setIsSearching(true)
          return 100
        }
        return p + 2
      })
    }, 40)
  }

  if (!mounted) return null

  // --- VIEW 1: FACE ENROLLMENT (SCROLL LOCKED) ---
  if (!hasEnrolled) {
    return (
      <div className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center p-8 text-center overflow-hidden touch-none transition-colors duration-500">
        <div className="relative w-64 h-64 border-2 border-foreground/5 rounded-full flex items-center justify-center mb-12 shadow-[0_0_50px_-12px_rgba(var(--primary),0.3)]">
          <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
          <ScanFace className="w-24 h-24 text-primary" />
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle 
              cx="128" cy="128" r="126" 
              fill="transparent" 
              stroke="currentColor" 
              strokeWidth="4" 
              className="text-primary transition-all duration-300" 
              style={{ strokeDasharray: 792, strokeDashoffset: 792 - (792 * enrollmentProgress) / 100 }} 
            />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-foreground italic uppercase tracking-tighter">Initial Enrollment</h2>
        <p className="text-muted-foreground text-[10px] mt-2 mb-8 uppercase font-bold tracking-[0.2em]">Link device to Biometric Profile</p>
        <button 
          onClick={startEnrollment} 
          disabled={enrollmentProgress > 0}
          className="w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl uppercase text-xs tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          {enrollmentProgress > 0 ? `Scanning... ${enrollmentProgress}%` : 'Begin Face Scan'}
        </button>
      </div>
    )
  }

  return (
    <div className="h-full p-5 flex flex-col transition-colors duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-foreground italic uppercase tracking-tighter">Attendance</h1>
        <button 
          onClick={() => setShowHistory(!showHistory)} 
          className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-xl border border-border shadow-sm hover:bg-muted transition-colors"
        >
          {showHistory ? <Radio className="w-4 h-4 text-primary" /> : <History className="w-4 h-4 text-primary" />}
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
            {showHistory ? 'Scanner' : 'History'}
          </span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {showHistory ? (
          /* --- VIEW 2: HISTORY --- */
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
            <GlassCard className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border-primary/20 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Avg Attendance</p>
                  <h2 className="text-4xl font-black text-foreground italic leading-none mt-1">79.0%</h2>
                </div>
                <TrendingUp className="w-10 h-10 text-primary/30" />
              </div>
              <div className="mt-4 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[79%] transition-all duration-1000" />
              </div>
            </GlassCard>

            <div className="space-y-3 pb-20">
              {attendanceHistory.map((item, i) => (
                <GlassCard key={i} className="py-4 border-foreground/[0.05] dark:border-white/[0.05] bg-muted/10">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-foreground text-lg leading-none">{item.code}</h3>
                      <p className="text-[10px] text-muted-foreground uppercase mt-1">{item.status}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-lg font-black italic", item.percentage < 70 ? "text-destructive" : "text-primary")}>
                        {item.percentage}%
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold">{item.sessions}</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-1000", item.percentage < 70 ? "bg-destructive" : "bg-primary")} style={{ width: `${item.percentage}%` }} />
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        ) : (
          /* --- VIEW 3: SCANNER --- */
          <div className="h-full flex flex-col justify-center">
            {isSearching ? (
              <div className="text-center space-y-6">
                <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                  <MapPin className="w-12 h-12 text-primary" />
                </div>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em]">Searching Hall Signals...</p>
              </div>
            ) : nearbyCourse ? (
              <GlassCard className="border-primary/40 bg-primary/5 py-10 text-center relative overflow-hidden shadow-xl">
                <h2 className="text-4xl font-black text-foreground italic tracking-tighter">{nearbyCourse.code}</h2>
                <p className="text-muted-foreground text-sm uppercase font-bold mt-2 tracking-widest">{nearbyCourse.name}</p>
                <button 
                  onClick={() => setIsVerifying(true)} 
                  className="mt-10 w-full py-4 bg-primary text-primary-foreground font-black rounded-2xl uppercase text-xs shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Sign Attendance
                </button>
              </GlassCard>
            ) : (
              <div className="text-center space-y-4">
                <X className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                <p className="text-muted-foreground text-sm font-medium">No beacons detected.</p>
                <button onClick={() => setIsSearching(true)} className="text-primary text-[10px] font-black uppercase underline underline-offset-4">Retry Search</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* OVERLAY: VERIFICATION */}
      {isVerifying && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-xl flex items-center justify-center p-6">
          <GlassCard className="w-full max-w-sm p-8 text-center border-border shadow-2xl bg-card/50 relative">
            <button onClick={() => setIsVerifying(false)} className="absolute top-4 right-4 text-muted-foreground"><X className="w-5 h-5"/></button>
            <Fingerprint className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse" />
            <h3 className="text-xl font-bold text-foreground italic uppercase tracking-tighter">Confirm Presence</h3>
            <button onClick={() => {setIsVerifying(false); setIsSuccess(true)}} className="w-full mt-10 py-4 bg-primary text-primary-foreground font-black rounded-2xl uppercase text-xs">Verify Biometrics</button>
          </GlassCard>
        </div>
      )}

      {/* OVERLAY: SUCCESS */}
      {isSuccess && (
        <div className="fixed inset-0 z-[120] bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
          <div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mb-6 rotate-12">
            <Check className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-4xl font-black text-foreground italic uppercase tracking-tighter">Verified</h2>
          <button onClick={() => {setIsSuccess(false); setIsSearching(true)}} className="mt-12 text-primary text-[10px] font-black uppercase border-b-2 border-primary pb-1">Close Window</button>
        </div>
      )}
    </div>
  )
}