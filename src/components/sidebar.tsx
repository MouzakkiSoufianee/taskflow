"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Activity,
  Plus,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Projects",
    href: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    name: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    name: "Activity",
    href: "/dashboard/activity",
    icon: Activity,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 md:top-[73px] md:bottom-0 z-40">
      <div className="flex-1 flex flex-col min-h-0 glass-morphism m-4 rounded-2xl border border-white/20">
        <div className="flex-1 flex flex-col pt-8 pb-6 overflow-y-auto">
          {/* Header */}
          <div className="px-6 mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Workspace</h3>
                <p className="text-white/60 text-sm">Your productivity hub</p>
              </div>
            </div>
            
            <Link href="/dashboard/projects/new">
              <button className="btn-primary-enhanced w-full flex items-center justify-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>New Project</span>
              </button>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "nav-link-enhanced group flex items-center transition-all duration-300",
                    isActive && "active"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-4 h-6 w-6 flex-shrink-0 transition-colors duration-300",
                      isActive ? "text-white" : "text-white/60 group-hover:text-white"
                    )}
                    aria-hidden="true"
                  />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full animate-pulse"></div>
                  )}
                </Link>
              )
            })}
          </nav>
          
          {/* Quick Stats */}
          <div className="px-6 mt-8">
            <div className="glass-card-enhanced">
              <h4 className="text-white font-semibold text-sm mb-4 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-blue-400" />
                Quick Stats
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Active Projects</span>
                  <span className="text-white font-semibold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Tasks Today</span>
                  <span className="text-white font-semibold">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Completed</span>
                  <span className="text-green-400 font-semibold">5</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer section */}
          <div className="px-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <div className="text-xs text-white/40 mb-2">TaskFlow v2.0</div>
              <div className="text-xs text-white/30">Phase 6: UI Excellence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
