import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function TeamPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  // Get current user
  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!currentUser) {
    redirect('/auth/signin')
  }

  // Get all projects where user is a member
  const projects = await prisma.project.findMany({
    where: {
      members: {
        some: {
          userId: currentUser.id
        }
      }
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        },
        orderBy: {
          role: 'asc' // OWNER, ADMIN, MEMBER
        }
      },
      _count: {
        select: {
          tasks: true,
          activities: true
        }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  // Get all unique team members across projects
  const allMembers = new Map()
  projects.forEach(project => {
    project.members.forEach(member => {
      if (!allMembers.has(member.user.id)) {
        allMembers.set(member.user.id, {
          ...member.user,
          projects: []
        })
      }
      allMembers.get(member.user.id).projects.push({
        id: project.id,
        name: project.name,
        role: member.role
      })
    })
  })

  const teamMembers = Array.from(allMembers.values())

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Team Management</h1>
        <p className="text-slate-300">Manage team members across all your projects</p>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Total Projects</p>
                <p className="text-2xl font-bold text-white">{projects.length}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Team Members</p>
                <p className="text-2xl font-bold text-white">{teamMembers.length}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2c0-.656.126-1.283.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Total Tasks</p>
                <p className="text-2xl font-bold text-white">
                  {projects.reduce((sum, project) => sum + project._count.tasks, 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">Activities</p>
                <p className="text-2xl font-bold text-white">
                  {projects.reduce((sum, project) => sum + project._count.activities, 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Team Members</h2>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center space-x-3">
                    <img
                      src={`/api/avatar/${member.email}`}
                      alt={member.name || 'User'}
                      className="h-10 w-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-white">{member.name || 'Unknown'}</p>
                      <p className="text-sm text-slate-300">{member.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">{member.projects.length} project(s)</p>
                    <div className="flex space-x-1 mt-1">
                      {member.projects.slice(0, 3).map((project: { role: string; project: { name: string } }, index: number) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            project.role === 'OWNER'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : project.role === 'ADMIN'
                              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {project.role}
                        </span>
                      ))}
                      {member.projects.length > 3 && (
                        <span className="text-xs text-slate-400">+{member.projects.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {teamMembers.length === 0 && (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.121M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M7 20v-2c0-.656.126-1.283.356-1.857M7 20H2v-2a3 3 0 015.196-2.121M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No team members</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a project and inviting team members.</p>
                </div>
              )}
            </div>
          </div>

          {/* Project Teams */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Project Teams</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-white">{project.name}</h3>
                    <span className="text-sm text-slate-300">{project.members.length} members</span>
                  </div>
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 5).map((member) => (
                      <img
                        key={member.id}
                        src={`/api/avatar/${member.user.email}`}
                        alt={member.user.name || 'User'}
                        className="h-8 w-8 rounded-full border-2 border-slate-800"
                        title={`${member.user.name} (${member.role})`}
                      />
                    ))}
                    {project.members.length > 5 && (
                      <div className="h-8 w-8 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center">
                        <span className="text-xs font-medium text-white">+{project.members.length - 5}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-white">No projects</h3>
                  <p className="mt-1 text-sm text-slate-400">Create your first project to start collaborating with your team.</p>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  )
}
