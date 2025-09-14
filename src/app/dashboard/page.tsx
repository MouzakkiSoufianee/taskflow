"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { 
  FolderOpen, 
  CheckSquare, 
  Users, 
  Activity,
  Plus,
  TrendingUp,
  Sparkles,
  Target,
  Clock,
  Award,
  Zap
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
    { id: 1, action: "Created task", target: "Setup authentication", time: "2 hours ago", type: "create" },
    { id: 2, action: "Completed task", target: "Database schema", time: "4 hours ago", type: "complete" },
    { id: 3, action: "Added member", target: "John Doe to TaskFlow Demo", time: "1 day ago", type: "member" },
    { id: 4, action: "Updated project", target: "Website Redesign milestone", time: "2 days ago", type: "update" },
  ]

  const recentProjects = [
    { id: 1, name: "TaskFlow Demo Project", tasks: 6, completed: 4, members: 3, priority: "high" },
    { id: 2, name: "Website Redesign", tasks: 8, completed: 2, members: 2, priority: "medium" },
    { id: 3, name: "Mobile App", tasks: 4, completed: 2, members: 4, priority: "low" },
  ]

  const quickActions = [
    { name: "New Project", icon: Plus, href: "/dashboard/projects/new", color: "blue" },
    { name: "Add Task", icon: CheckSquare, href: "/dashboard/tasks/new", color: "green" },
    { name: "Invite Member", icon: Users, href: "/dashboard/team/invite", color: "purple" },
    { name: "View Reports", icon: TrendingUp, href: "/dashboard/reports", color: "orange" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative space-y-8 p-6 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between animate-fadeInUp">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-4">
              Welcome back, {session?.user?.name || 'User'}!
            </h1>
            <p className="text-white/70 text-xl">
              Overview of your current projects and tasks.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="btn-secondary-enhanced">
              <Target className="h-5 w-5 mr-2" />
              Set Goals
            </button>
            <Link href="/dashboard/projects/new">
              <button className="btn-primary-enhanced">
                <Plus className="h-5 w-5 mr-2" />
                New Project
              </button>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
          {quickActions.map((action) => (
            <Link key={action.name} href={action.href}>
              <div className="glass-card-enhanced group cursor-pointer hover:scale-105 transition-all duration-300">
                <div className={`w-12 h-12 bg-gradient-to-r ${
                  action.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  action.color === 'green' ? 'from-green-500 to-green-600' :
                  action.color === 'purple' ? 'from-purple-500 to-purple-600' :
                  'from-orange-500 to-orange-600'
                } rounded-xl flex items-center justify-center mb-3 group-hover:shadow-lg transition-all duration-300`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-sm">{action.name}</h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
          <div className="glass-card-enhanced">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <FolderOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white mb-1">{stats.totalProjects}</div>
                <p className="text-sm text-white/60">Total Projects</p>
              </div>
            </div>
            <div className="flex items-center text-green-400 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              +2 from last month
            </div>
          </div>

          <div className="glass-card-enhanced">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white mb-1">{stats.totalTasks}</div>
                <p className="text-sm text-white/60">Total Tasks</p>
              </div>
            </div>
            <div className="text-white/60 text-sm">
              {stats.completedTasks} completed this week
            </div>
          </div>

          <div className="glass-card-enhanced">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white mb-1">{stats.teamMembers}</div>
                <p className="text-sm text-white/60">Team Members</p>
              </div>
            </div>
            <div className="text-white/60 text-sm">
              Across all projects
            </div>
          </div>

          <div className="glass-card-enhanced">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white mb-1">
                  {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
                </div>
                <p className="text-sm text-white/60">Completion Rate</p>
              </div>
            </div>
            <div className="text-white/60 text-sm">
              This month
            </div>
          </div>
        </div>

        {/* Recent Projects and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeInUp" style={{animationDelay: '0.6s'}}>
          <div className="glass-card-enhanced">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <FolderOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Recent Projects</h3>
                  <p className="text-white/60 text-sm">Your most active projects</p>
                </div>
              </div>
              <Sparkles className="h-5 w-5 text-white/40" />
            </div>

            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                  <div className="project-card-enhanced group cursor-pointer" style={{animationDelay: `${index * 0.1}s`}}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${
                          project.priority === 'high' ? 'bg-red-500' :
                          project.priority === 'medium' ? 'bg-yellow-500' :
                          'bg-green-500'
                        } shadow-lg`}></div>
                        <div>
                          <p className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {project.name}
                          </p>
                          <p className="text-sm text-white/60">
                            {project.completed}/{project.tasks} tasks completed
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-white/60">
                          <Users className="h-4 w-4" />
                          <span className="font-medium">{project.members}</span>
                        </div>
                        <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-700"
                            style={{width: `${(project.completed / project.tasks) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="glass-card-enhanced">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                  <p className="text-white/60 text-sm">Latest updates from your team</p>
                </div>
              </div>
              <Zap className="h-5 w-5 text-white/40" />
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="activity-item-enhanced" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="flex items-start space-x-4">
                    <div className={`w-3 h-3 rounded-full mt-2 shadow-lg ${
                      activity.type === 'create' ? 'bg-blue-500' :
                      activity.type === 'complete' ? 'bg-green-500' :
                      activity.type === 'member' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-white">
                        <span className="font-semibold">{activity.action}</span>
                        {' "'}
                        <span className="text-blue-300 font-medium hover:text-blue-200 cursor-pointer transition-colors">
                          {activity.target}
                        </span>
                        {'"'}
                      </p>
                      <p className="text-xs text-white/50 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <button className="btn-secondary-enhanced w-full">
                <Activity className="h-4 w-4 mr-2" />
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
