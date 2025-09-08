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
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Welcome back, {session?.user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-3 text-lg">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 btn-scale h-12 px-6">
            <Plus className="h-5 w-5 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-blue-700">Total Projects</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <FolderOpen className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 mb-2">{stats.totalProjects}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-green-700">Total Tasks</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900 mb-2">{stats.totalTasks}</div>
            <p className="text-xs text-green-600">
              {stats.completedTasks} completed this week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-purple-700">Team Members</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900 mb-2">{stats.teamMembers}</div>
            <p className="text-xs text-purple-600">
              Across all projects
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold text-orange-700">Completion Rate</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900 mb-2">
              {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
            </div>
            <p className="text-xs text-orange-600">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white shadow-lg border-0 card-hover">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-blue-500" />
              Recent Projects
            </CardTitle>
            <CardDescription className="text-gray-600">
              Your most active projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md transition-all duration-200 cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-sm"></div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-700">{project.name}</p>
                        <p className="text-sm text-gray-600">
                          {project.completed}/{project.tasks} tasks completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">{project.members}</span>
                      </div>
                      <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
                          style={{width: `${(project.completed / project.tasks) * 100}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-0 card-hover">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Recent Activity
            </CardTitle>
            <CardDescription className="text-gray-600">
              Latest updates from your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                  } shadow-sm`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{activity.action}</span>
                      {' "'}
                      <span className="text-blue-600 font-medium hover:text-blue-700 cursor-pointer">{activity.target}</span>
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
            <div className="mt-6 pt-4 border-t border-gray-100">
              <Button variant="outline" className="w-full btn-scale">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
