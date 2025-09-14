"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { 
  ArrowLeft, 
  UserPlus,
  Mail,
  Users,
  Send,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Copy,
  ExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"

interface Project {
  id: string
  name: string
  color: string
  members: {
    id: string
    role: string
    user: {
      id: string
      name: string
      email: string
    }
  }[]
}

export default function TeamInvitePage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [inviteMethod, setInviteMethod] = useState<"email" | "link">("email")
  const [formData, setFormData] = useState({
    email: "",
    role: "MEMBER",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState<string>("")
  const [inviteLink, setInviteLink] = useState<string>("")

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        const adminProjects = data.filter((project: Project) => 
          project.members.some(member => 
            member.user.email === session?.user?.email && 
            ['OWNER', 'ADMIN'].includes(member.role)
          )
        )
        setProjects(adminProjects)
        if (adminProjects.length > 0) {
          setSelectedProject(adminProjects[0].id)
        }
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
    }
  }, [session?.user?.email])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleEmailInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProject) return

    setLoading(true)
    setErrors({})
    setSuccess("")

    try {
      const response = await fetch(`/api/projects/${selectedProject}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          role: formData.role,
        }),
      })

      if (response.ok) {
        setSuccess(`Invitation sent to ${formData.email} successfully!`)
        setFormData({ email: "", role: "MEMBER" })
      } else {
        const error = await response.json()
        setErrors({ submit: error.error || "Failed to send invitation" })
      }
    } catch {
      setErrors({ submit: "An unexpected error occurred" })
    } finally {
      setLoading(false)
    }
  }

  const generateInviteLink = () => {
    if (!selectedProject) return
    
    const baseUrl = window.location.origin
    const token = btoa(`${selectedProject}:${Date.now()}`) // Simple token generation
    const link = `${baseUrl}/invite/${token}`
    setInviteLink(link)
  }

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    setSuccess("Invite link copied to clipboard!")
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
            <Link href="/dashboard/team">
              <button className="nav-button-enhanced">
                <ArrowLeft className="h-5 w-5" />
              </button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                Invite Team Members
              </h1>
              <p className="text-white/70 text-lg mt-2">
                Manage project access and team member permissions
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Project Selection */}
              <div className="glass-card-enhanced animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                <h3 className="text-white font-semibold text-xl mb-6 flex items-center">
                  <Sparkles className="h-6 w-6 mr-3 text-blue-400" />
                  Select Project
                </h3>
                
                {projects.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">You don&apos;t have permission to invite members to any projects.</p>
                    <p className="text-white/40 text-sm mt-2">Only project owners and admins can invite new members.</p>
                  </div>
                ) : (
                  <Select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    variant="glass"
                    label=""
                    icon={<Sparkles className="h-5 w-5" />}
                    options={projects.map((project) => ({
                      value: project.id,
                      label: project.name
                    }))}
                    required
                  />
                )}
              </div>

              {/* Invite Method Selection */}
              {selectedProject && (
                <div className="glass-card-enhanced animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                  <h3 className="text-white font-semibold text-xl mb-6">
                    Invitation Method
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      onClick={() => setInviteMethod("email")}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        inviteMethod === "email"
                          ? "border-blue-500 bg-blue-500/20"
                          : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      <Mail className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-white font-medium">Email Invitation</p>
                      <p className="text-white/60 text-sm">Send direct email invite</p>
                    </button>
                    
                    <button
                      onClick={() => setInviteMethod("link")}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        inviteMethod === "link"
                          ? "border-purple-500 bg-purple-500/20"
                          : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      <ExternalLink className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-white font-medium">Invite Link</p>
                      <p className="text-white/60 text-sm">Generate shareable link</p>
                    </button>
                  </div>

                  {/* Email Invitation Form */}
                  {inviteMethod === "email" && (
                    <form onSubmit={handleEmailInvite} className="space-y-6">
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        variant="glass"
                        label="Email Address"
                        icon={<Mail className="h-5 w-5" />}
                      />

                      <Select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        variant="glass"
                        label="Role"
                        icon={<Users className="h-5 w-5" />}
                        options={[
                          { value: "MEMBER", label: "Member" },
                          { value: "ADMIN", label: "Admin" }
                        ]}
                      />
                      <div className="text-white/60 text-sm mt-2">
                        <p>Members can view and edit tasks. Admins can also manage team members.</p>
                      </div>

                      <Button
                        type="submit"
                        disabled={loading}
                        variant="primary"
                        size="lg"
                        className="w-full"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                            Sending Invitation...
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-2" />
                            Send Invitation
                          </>
                        )}
                      </Button>
                    </form>
                  )}

                  {/* Invite Link Generation */}
                  {inviteMethod === "link" && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <Button
                          onClick={generateInviteLink}
                          variant="primary"
                          size="lg"
                        >
                          <ExternalLink className="h-5 w-5 mr-2" />
                          Generate Invite Link
                        </Button>
                      </div>

                      {inviteLink && (
                        <div className="p-4 bg-white/5 rounded-xl border border-white/20">
                          <label className="text-white font-semibold mb-2 block">
                            Shareable Invite Link:
                          </label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="text"
                              value={inviteLink}
                              readOnly
                              variant="glass"
                              className="flex-1"
                            />
                            <Button
                              onClick={copyInviteLink}
                              variant="glass"
                              size="icon"
                              className="h-14 w-14"
                            >
                              <Copy className="h-5 w-5" />
                            </Button>
                          </div>
                          <p className="text-white/60 text-sm mt-2">
                            Share this link with team members to join the project
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Messages */}
              {errors.submit && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl animate-fadeInUp">
                  <p className="text-red-400 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {errors.submit}
                  </p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl animate-fadeInUp">
                  <p className="text-green-400 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {success}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {selectedProjectData && (
                <div className="glass-card-enhanced animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                  <h3 className="text-white font-semibold text-lg mb-4">
                    {selectedProjectData.name}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-white/60 text-sm mb-2">Current Team</p>
                      <div className="space-y-2">
                        {selectedProjectData.members.slice(0, 5).map((member) => (
                          <div key={member.id} className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                              {(member.user.name || member.user.email).charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">
                                {member.user.name || member.user.email}
                              </p>
                              <p className="text-white/60 text-xs">{member.role}</p>
                            </div>
                          </div>
                        ))}
                        {selectedProjectData.members.length > 5 && (
                          <p className="text-white/60 text-sm">
                            +{selectedProjectData.members.length - 5} more members
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="glass-card-enhanced animate-fadeInUp" style={{animationDelay: '0.6s'}}>
                <h3 className="text-white font-semibold text-lg mb-4 flex items-center">
                  <UserPlus className="h-5 w-5 mr-2 text-blue-400" />
                  Tips
                </h3>
                <div className="space-y-3 text-white/70 text-sm">
                  <p>• Members can view and create tasks in the project</p>
                  <p>• Admins can manage team members and project settings</p>
                  <p>• Only owners can delete projects or remove other owners</p>
                  <p>• Invite links expire after 7 days for security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
