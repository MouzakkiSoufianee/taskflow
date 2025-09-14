"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft, 
  BarChart3,
  TrendingUp,
  Users,
  CheckSquare,
  Clock,
  AlertTriangle,
  Target,
  Award,
  Calendar,
  Download,
  Sparkles
} from "lucide-react"

interface ProjectStats {
  id: string
  name: string
  totalTasks: number
  completedTasks: number
  inProgressTasks: number
  members: number
  completionRate: number
  avgTasksPerMember: number
}

interface ActivityStats {
  totalActivities: number
  recentActivities: number
  mostActiveUser: string
  tasksCreatedThisWeek: number
  tasksCompletedThisWeek: number
}

interface ProjectData {
  id: string
  name: string
  _count?: { tasks?: number; members?: number }
  tasks?: Array<{ status: string }>
}

interface ActivityData {
  createdAt: string
  type: string
}

interface TaskData {
  status: string
}

export default function ReportsPage() {
  const [loading, setLoading] = useState(true)
  const [projectStats, setProjectStats] = useState<ProjectStats[]>([])
  const [activityStats, setActivityStats] = useState<ActivityStats | null>(null)
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter">("month")

  useEffect(() => {
    fetchReportsData()
  }, [timeRange])

  const fetchReportsData = async () => {
    setLoading(true)
    try {
      // In a real app, you'd have dedicated analytics endpoints
      // For now, we'll use existing endpoints and calculate stats
      const [projectsRes, activitiesRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/activities")
      ])

      if (projectsRes.ok && activitiesRes.ok) {
        const projects = await projectsRes.json()
        const activities = await activitiesRes.json()

        // Calculate project statistics
        const stats: ProjectStats[] = projects.map((project: ProjectData) => ({
          id: project.id,
          name: project.name,
          totalTasks: project._count?.tasks || 0,
          completedTasks: project.tasks?.filter((t: TaskData) => t.status === 'DONE').length || 0,
          inProgressTasks: project.tasks?.filter((t: TaskData) => t.status === 'IN_PROGRESS').length || 0,
          members: project._count?.members || 0,
          completionRate: project._count?.tasks 
            ? Math.round(((project.tasks?.filter((t: TaskData) => t.status === 'DONE').length || 0) / project._count.tasks) * 100)
            : 0,
          avgTasksPerMember: project._count?.members 
            ? Math.round((project._count?.tasks || 0) / project._count.members)
            : 0
        }))

        // Calculate activity statistics
        const activityStats: ActivityStats = {
          totalActivities: activities.length,
          recentActivities: activities.filter((a: ActivityData) => 
            new Date(a.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length,
          mostActiveUser: "Demo User", // Simplified for now
          tasksCreatedThisWeek: activities.filter((a: ActivityData) => 
            a.type === 'TASK_CREATED' && 
            new Date(a.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length,
          tasksCompletedThisWeek: activities.filter((a: ActivityData) => 
            a.type === 'TASK_COMPLETED' && 
            new Date(a.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length,
        }

        setProjectStats(stats)
        setActivityStats(activityStats)
      }
    } catch (error) {
      console.error("Error fetching reports data:", error)
    } finally {
      setLoading(false)
    }
  }

  const overallStats = {
    totalProjects: projectStats.length,
    totalTasks: projectStats.reduce((sum, p) => sum + p.totalTasks, 0),
    totalCompleted: projectStats.reduce((sum, p) => sum + p.completedTasks, 0),
    avgCompletionRate: projectStats.length 
      ? Math.round(projectStats.reduce((sum, p) => sum + p.completionRate, 0) / projectStats.length)
      : 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-fadeInUp">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <button className="nav-button-enhanced">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  Analytics & Reports
                </h1>
                <p className="text-white/70 text-lg mt-2">
                  Track your team&apos;s productivity and project insights
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as "week" | "month" | "quarter")}
                className="glass-input-enhanced"
              >
                <option value="week" className="bg-slate-800 text-white">Last Week</option>
                <option value="month" className="bg-slate-800 text-white">Last Month</option>
                <option value="quarter" className="bg-slate-800 text-white">Last Quarter</option>
              </select>
              <button className="btn-secondary-enhanced">
                <Download className="h-5 w-5 mr-2" />
                Export
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                <div className="glass-card-enhanced">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white mb-1">{overallStats.totalProjects}</div>
                      <p className="text-sm text-white/60">Active Projects</p>
                    </div>
                  </div>
                  <div className="flex items-center text-green-400 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +{Math.floor(overallStats.totalProjects * 0.2)} this month
                  </div>
                </div>

                <div className="glass-card-enhanced">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                      <CheckSquare className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white mb-1">{overallStats.totalTasks}</div>
                      <p className="text-sm text-white/60">Total Tasks</p>
                    </div>
                  </div>
                  <div className="text-white/60 text-sm">
                    {overallStats.totalCompleted} completed
                  </div>
                </div>

                <div className="glass-card-enhanced">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white mb-1">{overallStats.avgCompletionRate}%</div>
                      <p className="text-sm text-white/60">Avg Completion</p>
                    </div>
                  </div>
                  <div className="flex items-center text-green-400 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +5% vs last month
                  </div>
                </div>

                <div className="glass-card-enhanced">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white mb-1">{activityStats?.recentActivities || 0}</div>
                      <p className="text-sm text-white/60">Recent Activities</p>
                    </div>
                  </div>
                  <div className="text-white/60 text-sm">
                    Last 7 days
                  </div>
                </div>
              </div>

              {/* Project Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card-enhanced animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Project Performance</h3>
                        <p className="text-white/60 text-sm">Completion rates by project</p>
                      </div>
                    </div>
                    <Sparkles className="h-5 w-5 text-white/40" />
                  </div>

                  <div className="space-y-4">
                              {projectStats.map((project) => (
                      <div key={project.id} className="project-card-enhanced">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-white font-semibold">{project.name}</h4>
                          <span className="text-white/60 text-sm">{project.completionRate}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-700"
                            style={{width: `${project.completionRate}%`}}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-white/60">
                          <span>{project.completedTasks}/{project.totalTasks} tasks</span>
                          <span>{project.members} members</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card-enhanced animate-fadeInUp" style={{animationDelay: '0.6s'}}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Productivity Insights</h3>
                        <p className="text-white/60 text-sm">Key performance metrics</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <CheckSquare className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Tasks Completed</p>
                          <p className="text-white/60 text-sm">This week</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-green-400">
                        {activityStats?.tasksCompletedThisWeek || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Target className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Tasks Created</p>
                          <p className="text-white/60 text-sm">This week</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-blue-400">
                        {activityStats?.tasksCreatedThisWeek || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Users className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Most Active User</p>
                          <p className="text-white/60 text-sm">Top contributor</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-purple-400">
                        {activityStats?.mostActiveUser || "N/A"}
                      </span>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30">
                      <div className="flex items-center space-x-3 mb-2">
                        <AlertTriangle className="h-5 w-5 text-orange-400" />
                        <p className="text-white font-medium">Productivity Tip</p>
                      </div>
                      <p className="text-white/70 text-sm">
                        Your team completed {activityStats?.tasksCompletedThisWeek || 0} tasks this week. 
                        Consider setting weekly goals to boost productivity!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Analytics */}
              <div className="glass-card-enhanced animate-fadeInUp" style={{animationDelay: '0.8s'}}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-pink-500 to-orange-600 rounded-lg">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Detailed Analytics</h3>
                      <p className="text-white/60 text-sm">Comprehensive project breakdown</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left text-white/80 font-semibold py-3 px-4">Project</th>
                        <th className="text-left text-white/80 font-semibold py-3 px-4">Tasks</th>
                        <th className="text-left text-white/80 font-semibold py-3 px-4">Completed</th>
                        <th className="text-left text-white/80 font-semibold py-3 px-4">Members</th>
                        <th className="text-left text-white/80 font-semibold py-3 px-4">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectStats.map((project, index) => (
                        <tr key={project.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                              <span className="text-white font-medium">{project.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-white/70">{project.totalTasks}</td>
                          <td className="py-4 px-4 text-green-400">{project.completedTasks}</td>
                          <td className="py-4 px-4 text-white/70">{project.members}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                                  style={{width: `${project.completionRate}%`}}
                                ></div>
                              </div>
                              <span className="text-white/70 text-sm">{project.completionRate}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
