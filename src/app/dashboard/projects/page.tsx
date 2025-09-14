"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  FolderOpen, 
  Users, 
  Calendar,
  Search,
  Plus,
  MoreVertical,
  CheckSquare
} from "lucide-react"

interface Project {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  ownerId: string
  _count: {
    tasks: number
    members: number
  }
  owner: {
    name: string | null
    email: string
  }
  tasks: Array<{
    status: string
  }>
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getCompletedTasksCount = (project: Project) => {
    return project.tasks.filter(task => task.status === 'DONE').length
  }

  const getCompletionRate = (project: Project) => {
    const totalTasks = project._count.tasks
    if (totalTasks === 0) return 0
    const completedTasks = getCompletedTasksCount(project)
    return Math.round((completedTasks / totalTasks) * 100)
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Projects</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-6 bg-white/20 rounded w-3/4"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-white/20 rounded"></div>
                  <div className="h-4 bg-white/20 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-300 mt-2">
            Manage and track all your projects in one place
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button variant="glass" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          variant="glass"
          className="pl-10 bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 focus:ring-white/20"
        />
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-12 text-center shadow-xl">
          <FolderOpen className="mx-auto h-16 w-16 text-slate-400 mb-6" />
          <h3 className="text-xl font-semibold text-white mb-3">
            {searchTerm ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-slate-300 mb-8 max-w-md mx-auto">
            {searchTerm 
              ? 'Try adjusting your search criteria to find what you\'re looking for'
              : 'Get started by creating your first project and begin organizing your work'
            }
          </p>
          {!searchTerm && (
            <Link href="/dashboard/projects/new">
              <Button variant="glass" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:border-white/30 transition-all duration-300 cursor-pointer overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 group">
              <Link href={`/dashboard/projects/${project.id}`}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold line-clamp-2 text-white mb-2 group-hover:text-blue-300 transition-colors">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="line-clamp-2 text-slate-300 text-sm">
                          {project.description}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/10">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-slate-300">
                        <CheckSquare className="h-4 w-4 mr-2 text-blue-400" />
                        <span className="font-medium">{getCompletedTasksCount(project)}/{project._count.tasks} tasks</span>
                      </div>
                      <div className="flex items-center text-slate-300">
                        <Users className="h-4 w-4 mr-2 text-green-400" />
                        <span className="font-medium">{project._count.members} members</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span className="font-medium">Progress</span>
                        <span className="font-semibold text-blue-400">{getCompletionRate(project)}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${getCompletionRate(project)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/10">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="font-medium">by {project.owner?.name || project.owner?.email}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
