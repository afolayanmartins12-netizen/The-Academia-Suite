'use client'

import { useState } from 'react'
import { X, BookOpen, Lock, Phone, CreditCard, Search, Plus, Trash2, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SideDrawerProps {
  isOpen: boolean
  onClose: () => void
}

type MenuView = 'main' | 'id' | 'courses' | 'password' | 'phone'

interface RegisteredCourse {
  id: string
  code: string
  name: string
  units: number
}

const menuItems = [
  { id: 'id' as const, label: 'My ID', icon: CreditCard, desc: 'View student ID' },
  { id: 'courses' as const, label: 'Register Courses', icon: BookOpen, desc: 'Add or drop courses' },
  { id: 'password' as const, label: 'Password Manager', icon: Lock, desc: 'Manage your passwords' },
  { id: 'phone' as const, label: 'Phone Number', icon: Phone, desc: 'Update contact info' },
]

// Course search data
const availableCourses = [
  { code: 'CSC301', name: 'Data Structures', units: 3 },
  { code: 'CSC302', name: 'Algorithms', units: 3 },
  { code: 'MTH201', name: 'Linear Algebra', units: 4 },
  { code: 'MTH202', name: 'Calculus II', units: 4 },
  { code: 'PHY102', name: 'Physics II', units: 3 },
  { code: 'ENG101', name: 'Technical Writing', units: 2 },
  { code: 'STA201', name: 'Statistics', units: 3 },
  { code: 'CSC305', name: 'Operating Systems', units: 3 },
]

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const [view, setView] = useState<MenuView>('main')
  const [searchQuery, setSearchQuery] = useState('')
  const [registeredCourses, setRegisteredCourses] = useState<RegisteredCourse[]>([
    { id: '1', code: 'CSC301', name: 'Data Structures', units: 3 },
    { id: '2', code: 'MTH201', name: 'Linear Algebra', units: 4 },
    { id: '3', code: 'PHY102', name: 'Physics II', units: 3 },
  ])
  const [phoneNumber, setPhoneNumber] = useState('+234 801 234 5678')
  const [isEditingPhone, setIsEditingPhone] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    setView('main')
    onClose()
  }

  const filteredCourses = availableCourses.filter(
    course => 
      !registeredCourses.find(r => r.code === course.code) &&
      (course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
       course.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const addCourse = (course: typeof availableCourses[0]) => {
    setRegisteredCourses([
      ...registeredCourses,
      { id: Date.now().toString(), ...course }
    ])
    setSearchQuery('')
  }

  const removeCourse = (id: string) => {
    setRegisteredCourses(registeredCourses.filter(c => c.id !== id))
  }

  const renderContent = () => {
    switch (view) {
      case 'id':
        return (
          <div className="p-4 space-y-4">
            <button
              onClick={() => setView('main')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Student ID</h2>
            </div>

            {/* Read-only ID Info */}
            <div className="space-y-3">
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                <p className="text-sm font-medium text-foreground">Afolayan Eniola Martin</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-1">Matric Number</p>
                <p className="text-sm font-medium text-foreground">CSC/2021/0542</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-1">Department</p>
                <p className="text-sm font-medium text-foreground">Computer Science</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-1">Faculty</p>
                <p className="text-sm font-medium text-foreground">Faculty of Science</p>
              </div>
            </div>
          </div>
        )

      case 'courses':
        return (
          <div className="p-4 space-y-4 h-full flex flex-col">
            <button
              onClick={() => setView('main')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <h2 className="text-lg font-semibold text-foreground shrink-0">Register Courses</h2>

            {/* Search */}
            <div className="bg-muted/50 rounded-xl p-2 flex items-center gap-2 shrink-0">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            {/* Search Results */}
            {searchQuery && (
              <div className="space-y-2 max-h-32 overflow-auto shrink-0">
                {filteredCourses.map((course) => (
                  <div 
                    key={course.code}
                    className="bg-muted/30 rounded-xl p-2 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-medium text-foreground">{course.code}</p>
                      <p className="text-xs text-muted-foreground">{course.name}</p>
                    </div>
                    <button
                      onClick={() => addCourse(course)}
                      className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {filteredCourses.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-2">No courses found</p>
                )}
              </div>
            )}

            {/* Registered Courses */}
            <div className="flex-1 overflow-auto min-h-0">
              <p className="text-xs text-muted-foreground mb-2">Registered ({registeredCourses.length})</p>
              <div className="space-y-2">
                {registeredCourses.map((course) => (
                  <div 
                    key={course.id}
                    className="bg-muted/30 rounded-xl p-2 flex items-center justify-between"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{course.code}</p>
                      <p className="text-xs text-muted-foreground truncate">{course.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{course.units}u</span>
                      <button
                        onClick={() => removeCourse(course.id)}
                        className="w-7 h-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Units */}
            <div className="border-t border-border pt-3 shrink-0">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Total Units</p>
                <p className="text-sm font-bold text-primary">
                  {registeredCourses.reduce((sum, c) => sum + c.units, 0)} units
                </p>
              </div>
            </div>
          </div>
        )

      case 'password':
        return (
          <div className="p-4 space-y-4">
            <button
              onClick={() => setView('main')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <h2 className="text-lg font-semibold text-foreground">Password Manager</h2>

            <div className="space-y-3">
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-2">Current Password</p>
                <input
                  type="password"
                  value="••••••••"
                  disabled
                  className="w-full bg-transparent text-sm text-foreground"
                />
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-2">New Password</p>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-2">Confirm Password</p>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <button className="w-full max-w-[140px] bg-primary text-primary-foreground rounded-xl py-2 text-xs font-medium">
                Update Password
              </button>
            </div>
          </div>
        )

      case 'phone':
        return (
          <div className="p-4 space-y-4">
            <button
              onClick={() => setView('main')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <h2 className="text-lg font-semibold text-foreground">Phone Number</h2>

            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-2">Current Number</p>
              {isEditingPhone ? (
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-transparent text-sm text-foreground focus:outline-none"
                  autoFocus
                />
              ) : (
                <p className="text-sm font-medium text-foreground">{phoneNumber}</p>
              )}
            </div>

            <button
              onClick={() => setIsEditingPhone(!isEditingPhone)}
              className="w-full max-w-[140px] bg-primary text-primary-foreground rounded-xl py-2 text-xs font-medium"
            >
              {isEditingPhone ? 'Save' : 'Edit Number'}
            </button>
          </div>
        )

      default:
        return (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Menu</h2>
                <p className="text-xs text-muted-foreground">Afolayan Eniola</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-foreground" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all animate-fade-in text-left',
                    )}
                    style={{ animationDelay: `${index * 50}ms` } as React.CSSProperties}
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-40 animate-fade-backdrop"
        onClick={handleClose}
      />
      
      {/* Drawer - FULLY OPAQUE */}
      <div className="fixed top-0 right-0 h-full w-[280px] z-50 bg-background border-l border-border animate-slide-in-right overflow-hidden">
        {renderContent()}
        
        {/* Footer */}
        {view === 'main' && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
            <p className="text-xs text-muted-foreground text-center">Academia Suite v1.0</p>
          </div>
        )}
      </div>
    </>
  )
}
