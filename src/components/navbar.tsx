"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            TaskFlow
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {(session?.user?.name || session?.user?.email || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {session?.user?.name || session?.user?.email}
            </span>
          </div>
          
          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Settings className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            className="text-gray-600 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
