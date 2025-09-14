"use client"

import { useState, useEffect, use, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import KanbanBoard from "@/components/kanban-board"
import TaskCreateModal from "@/components/task-create-modal"
import { 
  ArrowLeft, 
  Settings, 
  Plus
} from "lucide-react"

interface Task {
  id: string
  title: string
  description?: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  position: number
  dueDate?: string | null
  createdAt: string
  updatedAt: string
  assignee?: {
    id: string
    name: string
    email: string
    avatar?: string | null
  } | null
}

interface ProjectMember {
  id: string
  role: 'OWNER' | 'ADMIN' | 'MEMBER'
  joinedAt: string
  user: {
    id: string
    name: string
    email: string
    avatar?: string | null
  }
}

interface Project {
  id: string
  name: string
  description?: string | null
  color: string
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  createdAt: string
  updatedAt: string
  owner?: {
    id: string
    name: string
    email: string
  } | null
  members: ProjectMember[]
  tasks: Task[]
  _count: {
    tasks: number
    members: number
  }
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const resolvedParams = use(params)
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [createModalStatus, setCreateModalStatus] = useState("TODO")

  const fetchProject = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch project')
      }
      const data = await response.json()
      setProject(data)
    } catch (error) {
      console.error('Error fetching project:', error)
      setError("Failed to load project")
    }
  }, [resolvedParams.id])

  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}/tasks`)
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }, [resolvedParams.id])

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
      return
    }
    
    fetchProject()
    fetchTasks()
  }, [session, status, resolvedParams.id, fetchProject, fetchTasks, router])

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
  }

  const handleTaskCreate = (status: string) => {
    setCreateModalStatus(status)
    setIsCreateModalOpen(true)
  }



  const handleCreateTask = async (taskData: { title: string; description?: string; priority?: string; assigneeId?: string; dueDate?: string }) => {
    try {
      const response = await fetch(`/api/projects/${resolvedParams.id}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      const newTask = await response.json()
      setTasks([...tasks, newTask])
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Button 
          onClick={() => router.back()} 
          variant="outline" 
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Project not found</p>
        <Button 
          onClick={() => router.back()} 
          variant="outline" 
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    )
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-500/20 text-green-300 border border-green-400/30'
      case 'DONE': return 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
      case 'ARCHIVED': return 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
      default: return 'bg-gray-500/20 text-gray-300 border border-gray-400/30'
    }
  }

  const todoTasks = tasks.filter(task => task.status === 'TODO').length
  const inProgressTasks = tasks.filter(task => task.status === 'IN_PROGRESS').length
  const completedTasks = tasks.filter(task => task.status === 'DONE').length

  return (
    <div className="space-y-8 p-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard/projects')}
            className="flex items-center gap-2 hover:bg-white/10 text-white btn-scale"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="btn-scale border-white/20 text-white hover:bg-white/10">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Project Info */}
      <Card className="p-8 card-hover shadow-xl bg-white/10 backdrop-blur-md border border-white/20">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                {project.name}
              </h1>
              <Badge className={`${getStatusBadgeColor(project.status)} px-3 py-1 font-medium text-sm`}>
                {project.status}
              </Badge>
            </div>
            {project.description && (
              <p className="text-slate-300 mb-6 text-lg leading-relaxed">{project.description}</p>
            )}
            
            {/* Project Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="text-3xl font-bold text-white mb-1">{todoTasks}</div>
                <div className="text-sm text-slate-400 font-medium">To Do</div>
              </div>
              <div className="text-center p-4 bg-blue-500/10 rounded-xl border border-blue-400/20 backdrop-blur-sm">
                <div className="text-3xl font-bold text-blue-300 mb-1">{inProgressTasks}</div>
                <div className="text-sm text-blue-300 font-medium">In Progress</div>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-400/20 backdrop-blur-sm">
                <div className="text-3xl font-bold text-green-300 mb-1">{completedTasks}</div>
                <div className="text-sm text-green-300 font-medium">Completed</div>
              </div>
              <div className="text-center p-4 bg-purple-500/10 rounded-xl border border-purple-400/20 backdrop-blur-sm">
                <div className="text-3xl font-bold text-purple-300 mb-1">{project._count.members}</div>
                <div className="text-sm text-purple-300 font-medium">Members</div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="flex flex-col items-end gap-3 ml-8">
            <div className="text-sm text-slate-400 font-medium">Team</div>
            <div className="flex -space-x-3">
              {project.members.slice(0, 5).map((member) => (
                <Avatar key={member.id} className="h-10 w-10 border-3 border-white/20 shadow-lg ring-2 ring-white/10 hover:ring-blue-400/30 transition-all">
                  <AvatarImage
                    src={member.user.avatar || `/api/avatar/${member.user.email}`}
                    alt={member.user.name}
                  />
                  <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {member.user.name?.charAt(0) || member.user.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.members.length > 5 && (
                <div className="h-10 w-10 rounded-full bg-white/10 backdrop-blur-md border-3 border-white/20 shadow-lg ring-2 ring-white/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    +{project.members.length - 5}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Kanban Board */}
      <Card className="p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Task Board</h2>
          <Button onClick={() => handleTaskCreate('TODO')} size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
        
        <KanbanBoard
          projectId={resolvedParams.id}
          initialTasks={tasks}
          onTaskUpdate={handleTaskUpdate}
          onTaskCreate={handleTaskCreate}
        />
      </Card>

      {/* Task Create Modal */}
      <TaskCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        status={createModalStatus}
        projectMembers={project.members}
      />
    </div>
  )
}
