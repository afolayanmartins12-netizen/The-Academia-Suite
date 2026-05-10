'use client'

import { useState } from 'react'
import { Plus, Trash2, ChevronDown, BookOpen } from 'lucide-react'
import { GlassCard } from '../glass-card'
import { cn } from '@/lib/utils'

interface Course {
  id: string
  code: string
  units: number
  grade: string
}

interface Semester {
  id: string
  name: string
  gpa: string
  courses: Course[]
  isExpanded: boolean
}

const gradePoints: Record<string, Record<string, number>> = {
  '4.0': { A: 4.0, B: 3.0, C: 2.0, D: 1.0, F: 0 },
  '5.0': { A: 5.0, B: 4.0, C: 3.0, D: 2.0, E: 1.0, F: 0 },
  '7.0': { A: 7.0, B: 6.0, C: 5.0, D: 4.0, E: 2.0, F: 0 },
  '10.0': { A: 10.0, B: 8.0, C: 6.0, D: 4.0, E: 2.0, F: 0 },
}

const grades = ['A', 'B', 'C', 'D', 'E', 'F']

export function GradesTab() {
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('detailed')
  const [scale, setScale] = useState<'4.0' | '5.0' | '7.0' | '10.0'>('5.0')
  const [semesters, setSemesters] = useState<Semester[]>([
    { 
      id: '1', 
      name: 'Semester 1', 
      gpa: '',
      isExpanded: true,
      courses: [
        { id: '1a', code: 'CSC301', units: 3, grade: 'A' },
        { id: '1b', code: 'MTH201', units: 4, grade: 'B' },
        { id: '1c', code: 'PHY102', units: 3, grade: 'A' },
      ]
    },
    { 
      id: '2', 
      name: 'Semester 2', 
      gpa: '',
      isExpanded: false,
      courses: [
        { id: '2a', code: 'CSC302', units: 3, grade: 'B' },
        { id: '2b', code: 'MTH202', units: 4, grade: 'A' },
      ]
    },
  ])
  const [simpleSemesters, setSimpleSemesters] = useState([
    { id: '1', name: 'Semester 1', gpa: '4.20' },
    { id: '2', name: 'Semester 2', gpa: '3.85' },
  ])
  const [showScaleDropdown, setShowScaleDropdown] = useState(false)

  const addSemester = () => {
    const newSemester: Semester = {
      id: Date.now().toString(),
      name: `Semester ${semesters.length + 1}`,
      gpa: '',
      isExpanded: true,
      courses: [{ id: `${Date.now()}-a`, code: '', units: 3, grade: 'A' }],
    }
    setSemesters([...semesters, newSemester])
  }

  const addSimpleSemester = () => {
    const newSemester = {
      id: Date.now().toString(),
      name: `Semester ${simpleSemesters.length + 1}`,
      gpa: '',
    }
    setSimpleSemesters([...simpleSemesters, newSemester])
  }

  const addCourseToSemester = (semesterId: string) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          courses: [...sem.courses, { id: Date.now().toString(), code: '', units: 3, grade: 'A' }]
        }
      }
      return sem
    }))
  }

  const updateCourse = (semesterId: string, courseId: string, field: keyof Course, value: string | number) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          courses: sem.courses.map(c => c.id === courseId ? { ...c, [field]: value } : c)
        }
      }
      return sem
    }))
  }

  const removeCourse = (semesterId: string, courseId: string) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semesterId) {
        return {
          ...sem,
          courses: sem.courses.filter(c => c.id !== courseId)
        }
      }
      return sem
    }))
  }

  const removeSemester = (id: string) => {
    setSemesters(semesters.filter(s => s.id !== id))
  }

  const removeSimpleSemester = (id: string) => {
    setSimpleSemesters(simpleSemesters.filter(s => s.id !== id))
  }

  const updateSimpleSemester = (id: string, field: 'name' | 'gpa', value: string) => {
    setSimpleSemesters(simpleSemesters.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const toggleSemesterExpand = (id: string) => {
    setSemesters(semesters.map(sem => sem.id === id ? { ...sem, isExpanded: !sem.isExpanded } : sem))
  }

  const calculateSemesterGPA = (courses: Course[]) => {
    if (courses.length === 0) return '0.00'
    let totalPoints = 0
    let totalUnits = 0
    courses.forEach(course => {
      const points = gradePoints[scale][course.grade] || 0
      totalPoints += points * course.units
      totalUnits += course.units
    })
    return totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : '0.00'
  }

  const calculateDetailedCGPA = () => {
    let totalPoints = 0
    let totalUnits = 0
    semesters.forEach(sem => {
      sem.courses.forEach(course => {
        const points = gradePoints[scale][course.grade] || 0
        totalPoints += points * course.units
        totalUnits += course.units
      })
    })
    return totalUnits > 0 ? (totalPoints / totalUnits).toFixed(2) : '0.00'
  }

  const calculateSimpleCGPA = () => {
    const validSemesters = simpleSemesters.filter(s => s.gpa && parseFloat(s.gpa) > 0)
    if (validSemesters.length === 0) return '0.00'
    const total = validSemesters.reduce((sum, s) => sum + parseFloat(s.gpa), 0)
    return (total / validSemesters.length).toFixed(2)
  }

  const cgpa = viewMode === 'detailed' ? calculateDetailedCGPA() : calculateSimpleCGPA()

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 glass-card rounded-none border-t-0 border-x-0 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Total CGPA</p>
            <p className="text-3xl font-bold text-primary">{cgpa}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Scale</p>
            <p className="text-lg font-semibold text-foreground">{scale}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* View Toggle - Simple on LEFT, Detailed on RIGHT */}
          <div className="flex-1 glass-card rounded-xl p-1 flex">
            <button
              onClick={() => setViewMode('simple')}
              className={cn(
                'flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all',
                viewMode === 'simple' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground'
              )}
            >
              Simple
            </button>
            <button
              onClick={() => setViewMode('detailed')}
              className={cn(
                'flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all',
                viewMode === 'detailed' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground'
              )}
            >
              Detailed
            </button>
          </div>

          {/* Scale Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowScaleDropdown(!showScaleDropdown)}
              className="glass-card rounded-xl py-2 px-3 flex items-center gap-2 text-xs font-medium text-foreground"
            >
              {scale}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showScaleDropdown && (
              <div className="absolute right-0 top-full mt-1 dropdown-opaque rounded-xl p-1 min-w-[80px] z-20 shadow-lg">
                {(['4.0', '5.0', '7.0', '10.0'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setScale(s)
                      setShowScaleDropdown(false)
                    }}
                    className={cn(
                      'w-full py-1.5 px-3 rounded-lg text-xs font-medium text-left transition-all',
                      scale === s ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-3 pb-24">
        {viewMode === 'detailed' ? (
          <>
            {/* Detailed Mode: Semester Containers */}
            {semesters.map((semester, semIndex) => (
              <GlassCard 
                key={semester.id} 
                className="p-3 animate-fade-in"
                style={{ animationDelay: `${semIndex * 50}ms` } as React.CSSProperties}
              >
                {/* Semester Header */}
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleSemesterExpand(semester.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{semester.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {semester.courses.length} course{semester.courses.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">GPA</p>
                      <p className="text-sm font-bold text-primary">{calculateSemesterGPA(semester.courses)}</p>
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform",
                      semester.isExpanded && "rotate-180"
                    )} />
                  </div>
                </div>

                {/* Courses List (Expandable) */}
                {semester.isExpanded && (
                  <div className="mt-3 space-y-2 border-t border-border pt-3">
                    {semester.courses.map((course, courseIndex) => (
                      <div key={course.id} className={cn(
                        "flex items-center gap-2 py-2 px-2",
                        courseIndex < semester.courses.length - 1 && "border-b border-border/50"
                      )}>
                        {/* Course Code */}
                        <input
                          type="text"
                          value={course.code}
                          onChange={(e) => updateCourse(semester.id, course.id, 'code', e.target.value.toUpperCase())}
                          placeholder="CSC101"
                          className="w-16 bg-transparent border-b border-border text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                        />

                        {/* Units */}
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={course.units}
                            onChange={(e) => updateCourse(semester.id, course.id, 'units', parseInt(e.target.value) || 0)}
                            min={1}
                            max={10}
                            className="w-8 bg-background/50 rounded-lg text-center text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary py-1"
                          />
                          <span className="text-xs text-muted-foreground">u</span>
                        </div>

                        {/* Grade */}
                        <select
                          value={course.grade}
                          onChange={(e) => updateCourse(semester.id, course.id, 'grade', e.target.value)}
                          className="w-12 bg-background/50 rounded-lg py-1 px-1 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer text-center"
                        >
                          {grades.map((g) => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>

                        {/* Points */}
                        <span className="text-xs text-muted-foreground min-w-[32px] text-right">
                          {gradePoints[scale][course.grade] || 0}pt
                        </span>

                        {/* Delete */}
                        <button
                          onClick={() => removeCourse(semester.id, course.id)}
                          className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors ml-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    {/* Add Course Button */}
                    <button
                      onClick={() => addCourseToSemester(semester.id)}
                      className="w-full py-1.5 rounded-lg border border-dashed border-border text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add Course
                    </button>

                    {/* Remove Semester */}
                    <button
                      onClick={() => removeSemester(semester.id)}
                      className="w-full py-1.5 rounded-lg text-xs font-medium text-destructive/70 hover:text-destructive transition-all flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove Semester
                    </button>
                  </div>
                )}
              </GlassCard>
            ))}

            {/* Add Semester Button */}
            <button
              onClick={addSemester}
              className="max-w-[140px] glass-card rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-medium text-primary hover:border-primary/30 transition-all mx-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Semester
            </button>
          </>
        ) : (
          <>
            {/* Simple Mode: Semester GPA List */}
            {simpleSemesters.map((semester, index) => (
              <GlassCard key={semester.id} className="py-2 px-3 animate-fade-in" style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}>
                <div className="flex items-center gap-3">
                  {/* Semester Name */}
                  <input
                    type="text"
                    value={semester.name}
                    onChange={(e) => updateSimpleSemester(semester.id, 'name', e.target.value)}
                    placeholder="Semester 1"
                    className="flex-1 bg-transparent border-b border-border text-xs font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />

                  {/* GPA Input */}
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">GPA:</span>
                    <input
                      type="number"
                      step="0.01"
                      value={semester.gpa}
                      onChange={(e) => updateSimpleSemester(semester.id, 'gpa', e.target.value)}
                      placeholder="0.00"
                      min={0}
                      max={parseFloat(scale)}
                      className="w-14 bg-muted/50 rounded-lg text-center text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary py-1"
                    />
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeSimpleSemester(semester.id)}
                    className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </GlassCard>
            ))}

            {/* Add Semester Button */}
            <button
              onClick={addSimpleSemester}
              className="max-w-[140px] glass-card rounded-xl py-2 px-3 flex items-center justify-center gap-2 text-xs font-medium text-primary hover:border-primary/30 transition-all mx-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Semester
            </button>
          </>
        )}
      </div>
    </div>
  )
}
