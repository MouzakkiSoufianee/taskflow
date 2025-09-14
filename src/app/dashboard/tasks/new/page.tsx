"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Plus,
  Calendar,
  User,
  Flag,
  AlertCircle,
  CheckCircle,
  Building,
  Type,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"

interface Project {
  id: string
  name: string
  color: string
  members: {
    user: {
      id: string
      name: string
      email: string
    }
  }[]
}

export default function NewTaskPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assigneeId: "",
    dueDate: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        // Ensure each project has members array
        const projectsWithMembers = data.map((project: { id: string; name: string; members?: unknown[] }) => ({
          ...project,
          members: project.members || []
        }))
        setProjects(projectsWithMembers)
        if (projectsWithMembers.length > 0) {
          setSelectedProject(projectsWithMembers[0].id)
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProject) return

    setLoading(true)
    setErrors({})

    try {
      const response = await fetch(`/api/projects/${selectedProject}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          assigneeId: formData.assigneeId || null,
          dueDate: formData.dueDate || null,
        }),
      })

      if (response.ok) {
        router.push(`/dashboard/projects/${selectedProject}`)
      } else {
        const error = await response.json()
        setErrors({ submit: error.error || "Failed to create task" })
      }
    } catch {
      setErrors({ submit: "An unexpected error occurred" })
    } finally {
      setLoading(false)
    }
  }

  const selectedProjectData = projects.find(p => p.id === selectedProject)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-8 animate-fadeInUp">
            <Link href="/dashboard">
              <button className="nav-button-enhanced">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Create New Task
              </h1>
              <p className="text-white/70 text-lg mt-2">
                Add a new task to your project and assign it to team members
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <div className="glass-card-enhanced animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Project Selection */}
                  <div>
                    <Select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      variant="glass"
                      label="Select Project"
                      icon={<Building className="h-5 w-5" />}
                      options={[
                        { value: "", label: "Choose a project..." },
                        ...projects.map((project) => ({
                          value: project.id,
                          label: project.name
                        }))
                      ]}
                      required
                    />
                  </div>

                  {/* Task Title */}
                  <div>
                    <Input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      variant="glass"
                      label="Task Title"
                      icon={<Type className="h-5 w-5" />}
                      error={errors.title}
                    />
                  </div>

                  {/* Task Description */}
                  <div>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      variant="glass"
                      label="Description"
                      icon={<FileText className="h-5 w-5" />}
                      rows={4}
                    />
                  </div>

                  {/* Priority & Due Date */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        variant="glass"
                        label="Priority"
                        icon={<Flag className="h-5 w-5" />}
                        options={[
                          { value: "LOW", label: "Low Priority" },
                          { value: "MEDIUM", label: "Medium Priority" },
                          { value: "HIGH", label: "High Priority" },
                          { value: "URGENT", label: "Urgent" }
                        ]}
                      />
                    </div>

                    <div>
                      <Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        variant="glass"
                        label="Due Date"
                        icon={<Calendar className="h-5 w-5" />}
                      />
                    </div>
                  </div>

                  {/* Assignee */}
                  {selectedProjectData && selectedProjectData.members && selectedProjectData.members.length > 0 && (
                    <div>
                      <Select
                        value={formData.assigneeId}
                        onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                        variant="glass"
                        label="Assign To"
                        icon={<User className="h-5 w-5" />}
                        options={[
                          { value: "", label: "Unassigned" },
                          ...selectedProjectData.members.map((member) => ({
                            value: member.user.id,
                            label: member.user.name || member.user.email
                          }))
                        ]}
                      />
                    </div>
                  )}

                  {/* Error Message */}
                  {errors.submit && (
                    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                      <p className="text-red-400 flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        {errors.submit}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-4 pt-6">
                    <Button
                      type="submit"
                      disabled={loading || !selectedProject}
                      variant="primary"
                      size="lg"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Create Task
                        </>
                      )}
                    </Button>
                    <Link href="/dashboard">
                      <Button type="button" variant="glass" className="h-14 px-8">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <div className="glass-card-enhanced animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-blue-400" />
                  Task Creation Guidelines
                </h3>
                <div className="space-y-3 text-white/70 text-sm">
                  <p>• Choose a clear, descriptive title for your task</p>
                  <p>• Add detailed descriptions to help team members understand the requirements</p>
                  <p>• Set appropriate priority levels to help with task management</p>
                  <p>• Assign due dates to keep projects on track</p>
                </div>
              </div>

              {selectedProjectData && (
                <div className="glass-card-enhanced animate-fadeInUp" style={{animationDelay: '0.6s'}}>
                  <h3 className="text-white font-semibold text-lg mb-4">
                    Project: {selectedProjectData.name}
                  </h3>
                  <div className="space-y-3 text-white/70 text-sm">
                    <p>Team Members: {selectedProjectData.members ? selectedProjectData.members.length : 0}</p>
                    {selectedProjectData.members && selectedProjectData.members.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedProjectData.members.slice(0, 3).map((member) => (
                          <div key={member.user.id} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                            {(member.user.name || member.user.email).charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {selectedProjectData.members.length > 3 && (
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white text-xs">
                            +{selectedProjectData.members.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                    {(!selectedProjectData.members || selectedProjectData.members.length === 0) && (
                      <p className="text-white/50 text-xs">No team members found for this project</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
