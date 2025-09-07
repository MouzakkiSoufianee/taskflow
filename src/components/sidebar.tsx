"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  Activity,
  Plus
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
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:top-[73px] md:bottom-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200 shadow-sm">
        <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
          <div className="px-4">
            <Link href="/dashboard/projects/new">
              <Button className="w-full mb-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </Link>
          </div>
          
          <nav className="flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600 ml-0"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          
          {/* Footer section */}
          <div className="px-3 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              TaskFlow v1.0
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
