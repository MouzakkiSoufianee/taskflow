import { prisma } from './prisma'
import {
  CreateProjectData,
  CreateTaskData,
  UpdateTaskData,
  CreateCommentData,
  UserWithProjects,
  ProjectWithMembers,
  TaskWithDetails,
  ActivityWithDetails
} from '@/types'
import { ProjectRole, ActivityType } from '@prisma/client'

/**
 * User operations
 */
export const userService = {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        projects: {
          include: {
            project: {
              include: {
                _count: {
                  select: {
                    tasks: true,
                    members: true
                  }
                }
              }
            }
          }
        }
      }
    })
  },

  async findById(id: string): Promise<UserWithProjects | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        projects: {
          include: {
            project: {
              include: {
                _count: {
                  select: {
                    tasks: true,
                    members: true
                  }
                }
              }
            }
          }
        }
      }
    })
  },

  async create(data: { email: string; name?: string; password?: string }) {
    return prisma.user.create({
      data
    })
  }
}

/**
 * Project operations
 */
export const projectService = {
  async create(data: CreateProjectData, ownerId: string) {
    return prisma.$transaction(async (tx) => {
      // Create project
      const project = await tx.project.create({
        data: {
          ...data,
          members: {
            create: {
              userId: ownerId,
              role: ProjectRole.OWNER
            }
          }
        },
        include: {
          members: {
            include: {
              user: true
            }
          },
          tasks: true,
          _count: {
            select: {
              tasks: true,
              members: true
            }
          }
        }
      })

      // Create activity
      await tx.activity.create({
        data: {
          type: ActivityType.PROJECT_CREATED,
          message: `Created project "${project.name}"`,
          userId: ownerId,
          projectId: project.id
        }
      })

      return project
    })
  },

  async findById(id: string): Promise<ProjectWithMembers | null> {
    return prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: true
          }
        },
        tasks: {
          orderBy: {
            position: 'asc'
          }
        },
        _count: {
          select: {
            tasks: true,
            members: true
          }
        }
      }
    })
  },

  async findByUserId(userId: string) {
    return prisma.project.findMany({
      where: {
        members: {
          some: {
            userId
          }
        }
      },
      include: {
        members: {
          include: {
            user: true
          }
        },
        _count: {
          select: {
            tasks: true,
            members: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
  },

  async addMember(projectId: string, userId: string, role: ProjectRole = ProjectRole.MEMBER) {
    return prisma.$transaction(async (tx) => {
      const member = await tx.projectMember.create({
        data: {
          projectId,
          userId,
          role
        },
        include: {
          user: true,
          project: true
        }
      })

      await tx.activity.create({
        data: {
          type: ActivityType.MEMBER_ADDED,
          message: `Added ${member.user.name || member.user.email} to the project`,
          userId,
          projectId
        }
      })

      return member
    })
  }
}

/**
 * Task operations
 */
export const taskService = {
  async create(data: CreateTaskData, userId: string) {
    return prisma.$transaction(async (tx) => {
      // Get the highest position for ordering
      const lastTask = await tx.task.findFirst({
        where: { projectId: data.projectId },
        orderBy: { position: 'desc' }
      })

      const position = lastTask ? lastTask.position + 1 : 0

      const task = await tx.task.create({
        data: {
          ...data,
          position
        },
        include: {
          assignee: true,
          project: true,
          comments: {
            include: {
              user: true
            }
          },
          _count: {
            select: {
              comments: true
            }
          }
        }
      })

      // Create activity
      await tx.activity.create({
        data: {
          type: ActivityType.TASK_CREATED,
          message: `Created task "${task.title}"`,
          userId,
          projectId: data.projectId,
          taskId: task.id
        }
      })

      return task
    })
  },

  async findById(id: string): Promise<TaskWithDetails | null> {
    return prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
        project: true,
        comments: {
          include: {
            user: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })
  },

  async update(id: string, data: UpdateTaskData, userId: string) {
    return prisma.$transaction(async (tx) => {
      const task = await tx.task.update({
        where: { id },
        data,
        include: {
          assignee: true,
          project: true,
          comments: {
            include: {
              user: true
            }
          },
          _count: {
            select: {
              comments: true
            }
          }
        }
      })

      // Create activity
      await tx.activity.create({
        data: {
          type: ActivityType.TASK_UPDATED,
          message: `Updated task "${task.title}"`,
          userId,
          projectId: task.projectId,
          taskId: task.id,
          metadata: JSON.parse(JSON.stringify(data))
        }
      })

      return task
    })
  },

  async delete(id: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({
        where: { id },
        select: { title: true, projectId: true }
      })

      if (!task) throw new Error('Task not found')

      await tx.task.delete({
        where: { id }
      })

      await tx.activity.create({
        data: {
          type: ActivityType.TASK_DELETED,
          message: `Deleted task "${task.title}"`,
          userId,
          projectId: task.projectId
        }
      })

      return { success: true }
    })
  },

  async findByProjectId(projectId: string) {
    return prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: true,
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        position: 'asc'
      }
    })
  }
}

/**
 * Comment operations
 */
export const commentService = {
  async create(data: CreateCommentData, userId: string) {
    return prisma.$transaction(async (tx) => {
      const comment = await tx.comment.create({
        data: {
          ...data,
          userId
        },
        include: {
          user: true,
          task: {
            select: {
              title: true,
              projectId: true
            }
          }
        }
      })

      await tx.activity.create({
        data: {
          type: ActivityType.COMMENT_ADDED,
          message: `Added a comment to "${comment.task.title}"`,
          userId,
          projectId: comment.task.projectId,
          taskId: data.taskId
        }
      })

      return comment
    })
  },

  async findByTaskId(taskId: string) {
    return prisma.comment.findMany({
      where: { taskId },
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    })
  }
}

/**
 * Activity operations
 */
export const activityService = {
  async findByProjectId(projectId: string, limit: number = 20): Promise<ActivityWithDetails[]> {
    return prisma.activity.findMany({
      where: { projectId },
      include: {
        user: true,
        project: true,
        task: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })
  }
}
