"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { 
  LogOut, 
  Settings, 
  User, 
  Search,
  Bell,
  Sparkles,
  Command,
  Zap,
  ChevronDown,
  Menu,
  X,
  Home,
  FolderOpen,
  Calendar,
  BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { data: session, status } = useSession()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [notificationCount, setNotificationCount] = useState(3)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement
        searchInput?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleSignOut = () => {
    setDropdownOpen(false)
    signOut({ callbackUrl: "/" })
  }

  const clearNotifications = () => {
    setNotificationCount(0)
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-blue-900/10 pointer-events-none"></div>
        
        <div className="relative mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Left section */}
            <div className="flex items-center space-x-6 lg:space-x-8">
              {/* Mobile menu button */}
              {session && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5 text-white" />
                  ) : (
                    <Menu className="h-5 w-5 text-white" />
                  )}
                </button>
              )}

              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-3">
                    <Sparkles className="h-5 w-5 text-white transition-transform duration-500 group-hover:rotate-12" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-lg"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent transition-all duration-300 group-hover:from-blue-200 group-hover:via-purple-200 group-hover:to-blue-200">
                  TaskFlow
                </span>
              </Link>

              {/* Navigation links - Desktop */}
              {session && (
                <div className="hidden lg:flex items-center space-x-1">
                  <Link href="/dashboard" className="nav-link-enhanced">
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link href="/dashboard/projects" className="nav-link-enhanced">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Projects
                  </Link>
                  <Link href="/dashboard/calendar" className="nav-link-enhanced">
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar
                  </Link>
                  <Link href="/dashboard/reports" className="nav-link-enhanced">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Reports
                  </Link>
                </div>
              )}
            </div>

            {/* Center section - Search */}
            {session && (
              <div className="hidden md:block flex-1 max-w-lg mx-8">
                <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-105 shadow-2xl shadow-blue-500/20' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className={`h-4 w-4 transition-all duration-300 ${searchFocused ? 'text-blue-400 scale-110' : 'text-white/40'}`} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search projects, tasks, team members..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className={`
                      w-full h-12 pl-11 pr-16 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40
                      backdrop-blur-md transition-all duration-300
                      hover:bg-white/10 hover:border-white/30
                      focus:outline-none focus:bg-white/10 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/30
                      ${searchFocused ? 'bg-white/10 border-blue-400/50 shadow-lg shadow-blue-500/20' : ''}
                    `}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                  />
                  <div className={`absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none transition-all duration-300 ${searchFocused ? 'opacity-100 scale-110' : 'opacity-60'}`}>
                    <div className="flex items-center space-x-1 text-xs text-white/30 bg-white/10 px-2 py-1 rounded-md">
                      <Command className="h-3 w-3" />
                      <span>K</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Right section */}
            <div className="flex items-center space-x-3">
              {status === "loading" ? (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/10 rounded-full animate-pulse"></div>
                  <div className="w-20 h-4 bg-white/10 rounded animate-pulse hidden md:block"></div>
                </div>
              ) : session ? (
                <>
                  {/* Quick Actions */}
                  <div className="hidden md:flex items-center space-x-2">
                    {/* Notifications */}
                    <button 
                      onClick={clearNotifications}
                      className="relative p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 group"
                    >
                      <Bell className="h-5 w-5 text-white/80 group-hover:text-white transition-colors duration-300" />
                      {notificationCount > 0 && (
                        <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-black/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-white leading-none">
                            {notificationCount > 9 ? '9+' : notificationCount}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </button>

                    {/* Quick Actions */}
                    <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 group">
                      <Zap className="h-5 w-5 text-white/80 group-hover:text-yellow-400 transition-colors duration-300" />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </button>
                  </div>

                  {/* User menu */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`
                        flex items-center space-x-3 px-4 py-2 rounded-xl bg-white/5 border border-white/20
                        hover:bg-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105 active:scale-95
                        ${dropdownOpen ? 'bg-white/10 border-white/30 scale-105 shadow-xl shadow-blue-500/20' : ''}
                      `}
                    >
                      <div className="relative">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                          <span className="text-white text-sm font-bold">
                            {(session?.user?.name || session?.user?.email || "U").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
                      </div>
                      <div className="hidden md:block">
                        <span className="text-white font-medium text-sm">
                          {session.user?.name || session.user?.email}
                        </span>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-white/60 transition-all duration-300 ${dropdownOpen ? 'rotate-180 text-blue-400' : ''}`} />
                    </button>

                    {/* Dropdown menu */}
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-3 w-72 bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 animate-fadeInUp overflow-hidden">
                        {/* User info section */}
                        <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white text-lg font-bold">
                                {(session?.user?.name || session?.user?.email || "U").charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-semibold text-sm truncate">
                                {session.user?.name || "User"}
                              </p>
                              <p className="text-white/60 text-xs truncate">
                                {session.user?.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Menu items */}
                        <div className="py-2">
                          <button className="w-full px-6 py-3 text-left flex items-center space-x-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group">
                            <User className="h-4 w-4 group-hover:text-blue-400 transition-colors duration-200" />
                            <span className="font-medium">Profile Settings</span>
                          </button>
                          <button className="w-full px-6 py-3 text-left flex items-center space-x-3 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 group">
                            <Settings className="h-4 w-4 group-hover:text-purple-400 transition-colors duration-200" />
                            <span className="font-medium">Preferences</span>
                          </button>
                          
                          <hr className="my-2 border-white/10" />
                          
                          <button
                            onClick={handleSignOut}
                            className="w-full px-6 py-3 text-left flex items-center space-x-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group"
                          >
                            <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/signin">
                    <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="primary" className="shadow-lg shadow-blue-500/25">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {session && mobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="fixed top-16 left-0 right-0 z-40 bg-black/40 backdrop-blur-2xl border-b border-white/20 shadow-2xl animate-fadeInDown md:hidden"
        >
          <div className="px-4 py-6 space-y-2">
            <Link 
              href="/dashboard" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link 
              href="/dashboard/projects" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <FolderOpen className="h-5 w-5" />
              <span className="font-medium">Projects</span>
            </Link>
            <Link 
              href="/dashboard/calendar" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <Calendar className="h-5 w-5" />
              <span className="font-medium">Calendar</span>
            </Link>
            <Link 
              href="/dashboard/reports" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="font-medium">Reports</span>
            </Link>
            
            {/* Mobile search */}
            <div className="pt-4 border-t border-white/10">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-white/40" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:bg-white/10 focus:border-blue-400/50"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
