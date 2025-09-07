"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  Settings, 
  Users, 
  CheckSquare,
  Calendar,
  MoreVertical,
  Edit3,
  Trash2,
  UserPlus,
  Plus
} from "lucide-react"

interface ProjectMember {
  id: string
  role: string
  user: {
    id: string
    name: string | null
    email: string
  }
}

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  priority: string
  position: number
  assignee: {
    id: string
    name: string | null
    email: string
  } | null
}

interface Project {
  id: string
  name: string
  description: string | null
  createdAt: string
  updatedAt: string
  ownerId: string
  owner: {
    id: string
    name: string | null
    email: string
  }
  members: ProjectMember[]
  tasks: Task[]
  _count: {
    tasks: number
    members: number
  }
}

export default function ProjectDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session } = useSession()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    description: ""
  })

  useEffect(() => {
    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`)
      if (!response.ok) {
        if (response.status === 404) {
          setError("Project not found")
        } else {
          setError("Failed to load project")
        }
        return
      }
      const data = await response.json()
      setProject(data)
      setEditForm({
        name: data.name,
        description: data.description || ""
      })
    } catch (error) {
      console.error('Error fetching project:', error)
      setError("Failed to load project")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    if (!project) return

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        const updatedProject = await response.json()
        setProject(updatedProject)
        setIsEditing(false)
      } else {
        setError("Failed to update project")
      }
    } catch (error) {
      console.error('Error updating project:', error)
      setError("Failed to update project")
    }
  }

  const getTasksByStatus = (status: string) => {
    return project?.tasks.filter(task => task.status === status) || []
  }

  const getCompletionRate = () => {
    if (!project || project._count.tasks === 0) return 0
    const completedTasks = getTasksByStatus('COMPLETED').length
    return Math.round((completedTasks / project._count.tasks) * 100)
  }

  const canEdit = () => {
    if (!project || !session?.user?.email) return false
    return project.members.some(member => 
      member.user.email === session.user?.email && 
      ['OWNER', 'ADMIN'].includes(member.role)
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {error || "Project not found"}
        </h1>
        <Link href="/dashboard/projects">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/projects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
        {canEdit() && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        )}
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Project Name
                    </label>
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Project name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Description
                    </label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Project description"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button onClick={handleUpdate} size="sm">
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <CardTitle className="text-2xl">{project.name}</CardTitle>
                  {project.description && (
                    <CardDescription className="text-base">
                      {project.description}
                    </CardDescription>
                  )}
                </>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {project._count.tasks}
                  </div>
                  <div className="text-sm text-blue-600">Total Tasks</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {getTasksByStatus('COMPLETED').length}
                  </div>
                  <div className="text-sm text-green-600">Completed</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {getTasksByStatus('IN_PROGRESS').length}
                  </div>
                  <div className="text-sm text-yellow-600">In Progress</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {getCompletionRate()}%
                  </div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Tasks</CardTitle>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {project.tasks.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No tasks yet. Create your first task to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {project.tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          task.status === 'COMPLETED' ? 'bg-green-500' :
                          task.status === 'IN_PROGRESS' ? 'bg-yellow-500' :
                          'bg-gray-400'
                        }`}></div>
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-500">
                            {task.assignee ? `Assigned to ${task.assignee.name || task.assignee.email}` : 'Unassigned'}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                        task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                  {project.tasks.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="ghost" size="sm">
                        View all {project.tasks.length} tasks
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Owner</div>
                <div className="font-medium">
                  {project.owner.name || project.owner.email}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Created</div>
                <div className="font-medium">
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="font-medium">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Team Members</CardTitle>
                {canEdit() && (
                  <Button size="sm" variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {(member.user.name || member.user.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {member.user.name || member.user.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {member.role.toLowerCase().replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
