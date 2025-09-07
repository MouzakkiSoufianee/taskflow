"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  FolderOpen, 
  CheckSquare, 
  Users, 
  Activity,
  Plus,
  Calendar,
  TrendingUp
} from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()

  // Mock data - will be replaced with real data from API
  const stats = {
    totalProjects: 3,
    totalTasks: 12,
    completedTasks: 8,
    teamMembers: 5
  }

  const recentActivity = [
    { id: 1, action: "Created task", target: "Setup authentication", time: "2 hours ago" },
    { id: 2, action: "Completed task", target: "Database schema", time: "4 hours ago" },
    { id: 3, action: "Added member", target: "John Doe to TaskFlow Demo", time: "1 day ago" },
  ]

  const recentProjects = [
    { id: 1, name: "TaskFlow Demo Project", tasks: 6, completed: 4, members: 3 },
    { id: 2, name: "Website Redesign", tasks: 8, completed: 2, members: 2 },
    { id: 3, name: "Mobile App", tasks: 4, completed: 2, members: 4 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {session?.user?.name || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Projects</CardTitle>
            <FolderOpen className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalProjects}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
            <CheckSquare className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.totalTasks}</div>
            <p className="text-xs text-gray-600 mt-1">
              {stats.completedTasks} completed this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Team Members</CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{stats.teamMembers}</div>
            <p className="text-xs text-gray-600 mt-1">
              Across all projects
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
            <Activity className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Recent Projects</CardTitle>
            <CardDescription className="text-gray-600">
              Your most active projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:bg-gray-50 hover:shadow-sm transition-all duration-200 cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-semibold text-gray-900">{project.name}</p>
                        <p className="text-sm text-gray-600">
                          {project.completed}/{project.tasks} tasks completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{project.members}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Recent Activity</CardTitle>
            <CardDescription className="text-gray-600">
              Latest updates from your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.action}</span>
                      {' "'}
                      <span className="text-blue-600 font-medium">{activity.target}</span>
                      {'"'}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
