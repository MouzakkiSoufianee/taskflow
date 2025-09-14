import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Image from 'next/image'

// Activity type definition
type ActivityWithRelations = {
  type: string
  message: string
  user: { name: string | null; email: string } | null
  project: { name: string } | null
  task: { title: string } | null
}

// Activity type icons
const getActivityIcon = (type: string) => {
  const iconClasses = "w-4 h-4"
  switch (type) {
    case 'TASK_CREATED':
      return <div className={`${iconClasses} bg-green-400 rounded-full`} />
    case 'TASK_UPDATED':
      return <div className={`${iconClasses} bg-blue-400 rounded-full`} />
    case 'TASK_COMPLETED':
      return <div className={`${iconClasses} bg-purple-400 rounded-full`} />
    case 'TASK_DELETED':
      return <div className={`${iconClasses} bg-red-400 rounded-full`} />
    case 'PROJECT_CREATED':
      return <div className={`${iconClasses} bg-indigo-400 rounded-full`} />
    case 'PROJECT_UPDATED':
      return <div className={`${iconClasses} bg-cyan-400 rounded-full`} />
    case 'MEMBER_ADDED':
      return <div className={`${iconClasses} bg-yellow-400 rounded-full`} />
    case 'MEMBER_REMOVED':
      return <div className={`${iconClasses} bg-orange-400 rounded-full`} />
    case 'COMMENT_ADDED':
      return <div className={`${iconClasses} bg-pink-400 rounded-full`} />
    default:
      return <div className={`${iconClasses} bg-gray-400 rounded-full`} />
  }
}

// Format activity message
const formatActivityMessage = (activity: ActivityWithRelations) => {
  const { type, message, project, task } = activity
  
  switch (type) {
    case 'TASK_CREATED':
      return `created task "${task?.title}" in ${project?.name}`
    case 'TASK_UPDATED':
      return `updated task "${task?.title}" in ${project?.name}`
    case 'TASK_COMPLETED':
      return `completed task "${task?.title}" in ${project?.name}`
    case 'TASK_DELETED':
      return `deleted task "${task?.title}" from ${project?.name}`
    case 'PROJECT_CREATED':
      return `created project "${project?.name}"`
    case 'PROJECT_UPDATED':
      return `updated project "${project?.name}"`
    case 'MEMBER_ADDED':
      return `joined project "${project?.name}"`
    case 'MEMBER_REMOVED':
      return `left project "${project?.name}"`
    case 'COMMENT_ADDED':
      return `commented on "${task?.title}" in ${project?.name}`
    default:
      return message || `performed an action in ${project?.name}`
  }
}

// Time formatting function
const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  } else {
    return date.toLocaleDateString()
  }
}

async function getActivityData(userId: string) {
  // Get all projects user has access to
  const userProjects = await prisma.projectMember.findMany({
    where: { userId },
    select: { projectId: true }
  })

  const projectIds = userProjects.map(p => p.projectId)

  // Get recent activities
  const activities = await prisma.activity.findMany({
    where: {
      projectId: {
        in: projectIds
      }
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      },
      project: {
        select: {
          id: true,
          name: true,
          color: true
        }
      },
      task: {
        select: {
          id: true,
          title: true,
          status: true,
          priority: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50
  })

  // Get activity stats
  const totalActivities = await prisma.activity.count({
    where: {
      projectId: {
        in: projectIds
      }
    }
  })

  const todayActivities = await prisma.activity.count({
    where: {
      projectId: {
        in: projectIds
      },
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    }
  })

  const weekActivities = await prisma.activity.count({
    where: {
      projectId: {
        in: projectIds
      },
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }
  })

  // Get most active users
  const activeUsers = await prisma.activity.groupBy({
    by: ['userId'],
    where: {
      projectId: {
        in: projectIds
      },
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    },
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    take: 5
  })

  const activeUsersWithData = await Promise.all(
    activeUsers.map(async (user) => {
      const userData = await prisma.user.findUnique({
        where: { id: user.userId },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      })
      return {
        ...userData,
        activityCount: user._count.id
      }
    })
  )

  return {
    activities,
    stats: {
      total: totalActivities,
      today: todayActivities,
      week: weekActivities
    },
    activeUsers: activeUsersWithData
  }
}

export default async function ActivityPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    redirect('/auth/signin')
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!currentUser) {
    redirect('/auth/signin')
  }

  const { activities, stats, activeUsers } = await getActivityData(currentUser.id)

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Activity Feed</h1>
          <p className="text-slate-300">Track what&apos;s happening across your projects</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Total Activities</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">Today&apos;s Activities</p>
                <p className="text-3xl font-bold text-white">{stats.today}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full" />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-300 text-sm">This Week</p>
                <p className="text-3xl font-bold text-white">{stats.week}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <div className="w-8 h-8 bg-slate-500 rounded-full" />
                    </div>
                    <p className="text-slate-400">No activities yet</p>
                    <p className="text-slate-500 text-sm">Start working on your projects to see activity here</p>
                  </div>
                ) : (
                  activities.map((activity: ActivityWithRelations & { 
                    id: string; 
                    createdAt: Date; 
                    user: { name: string | null; email: string; avatar: string | null; id: string }; 
                    project: { name: string; color?: string; id: string } | null;
                    task: { title: string; status?: string; id?: string; priority?: string } | null;
                  }) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200">
                      {/* User Avatar */}
                      <div className="flex-shrink-0">
                        {activity.user.avatar ? (
                          <Image
                            src={activity.user.avatar}
                            alt={activity.user.name || 'User'}
                            width={40}
                            height={40}
                            className="rounded-full ring-2 ring-white/20"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {activity.user.name?.[0] || activity.user.email[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          {getActivityIcon(activity.type)}
                          <span className="text-white font-medium">
                            {activity.user.name || activity.user.email}
                          </span>
                          <span className="text-slate-300">
                            {formatActivityMessage(activity)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <span>{formatTimeAgo(new Date(activity.createdAt))}</span>
                          {activity.project && (
                            <>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: activity.project.color || '#6366f1' }}
                                />
                                <span>{activity.project.name}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Most Active Users */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Most Active This Week</h3>
              
              <div className="space-y-3">
                {activeUsers.length === 0 ? (
                  <p className="text-slate-400 text-sm">No activity this week</p>
                ) : (
                  activeUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name || 'User'}
                            width={32}
                            height={32}
                            className="rounded-full ring-2 ring-white/10"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-xs">
                              {user.name?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="text-white text-sm font-medium">
                            {user.name || user.email}
                          </p>
                        </div>
                      </div>
                      <span className="text-slate-300 text-sm font-medium">
                        {user.activityCount}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Activity Types Legend */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Activity Types</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <span className="text-slate-300">Task Created</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full" />
                  <span className="text-slate-300">Task Updated</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full" />
                  <span className="text-slate-300">Task Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <span className="text-slate-300">Member Added</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-pink-400 rounded-full" />
                  <span className="text-slate-300">Comment Added</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
