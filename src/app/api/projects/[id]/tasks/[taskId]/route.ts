import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/projects/[id]/tasks/[taskId] - Get a specific task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id, taskId } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user has access to this project
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: id,
        userId: user.id
      }
    })

    if (!projectMember) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      )
    }

    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId: id
      },
      include: {
        assignee: {
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
            name: true
          }
        }
      }
    })

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id]/tasks/[taskId] - Update a task
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id, taskId } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user has access to this project
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: id,
        userId: user.id
      }
    })

    if (!projectMember) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { title, description, status, priority, assigneeId, dueDate, position } = body

    // If status is changing, we need to handle position
    const updateData: Record<string, unknown> = {}

    if (title !== undefined) {
      if (!title || title.trim().length === 0) {
        return NextResponse.json(
          { error: "Task title is required" },
          { status: 400 }
        )
      }
      updateData.title = title.trim()
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null
    }

    if (priority !== undefined) {
      updateData.priority = priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    }

    if (assigneeId !== undefined) {
      updateData.assigneeId = assigneeId || null
    }

    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null
    }

    // Handle status change and position
    let currentTask: { title: string; priority: string; position: number; status: string; assigneeId: string | null } | null = null
    if (status !== undefined) {
      currentTask = await prisma.task.findUnique({
        where: { id: taskId },
        select: { 
          title: true,
          status: true, 
          position: true,
          priority: true,
          assigneeId: true
        }
      })

      if (!currentTask) {
        return NextResponse.json(
          { error: "Task not found" },
          { status: 404 }
        )
      }

      updateData.status = status as 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'

      // If status is changing, set position at the end of the new column
      if (currentTask.status !== status) {
        const lastTask = await prisma.task.findFirst({
          where: {
            projectId: id,
            status: status as 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE',
            id: { not: taskId }
          },
          orderBy: {
            position: 'desc'
          }
        })

        updateData.position = lastTask ? lastTask.position + 1 : 0
      } else if (position !== undefined) {
        updateData.position = position
      }
    } else if (position !== undefined) {
      updateData.position = position
    }    updateData.updatedAt = new Date()

    const task = await prisma.task.update({
      where: {
        id: taskId,
        projectId: id
      },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    // Create activity log for task updates
    let activityType: 'TASK_UPDATED' | 'TASK_COMPLETED' = 'TASK_UPDATED'
    let activityMessage = `Updated task "${task.title}"`

    // Special case for status changes
    if (status !== undefined && currentTask && currentTask.status !== status) {
      if (status === 'DONE') {
        activityType = 'TASK_COMPLETED'
        activityMessage = `Completed task "${task.title}"`
      } else {
        activityMessage = `Moved task "${task.title}" to ${status.replace('_', ' ').toLowerCase()}`
      }
    }

    await prisma.activity.create({
      data: {
        type: activityType,
        message: activityMessage,
        projectId: id,
        taskId: task.id,
        userId: user.id,
        metadata: {
          taskTitle: task.title,
          oldStatus: currentTask?.status || null,
          newStatus: task.status,
          priority: task.priority,
          assigneeId: task.assigneeId
        }
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id]/tasks/[taskId] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { id, taskId } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user has access to this project (member role is sufficient for deleting tasks)
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: id,
        userId: user.id
      }
    })

    if (!projectMember) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      )
    }

    // Get task info before deletion for activity log
    const taskToDelete = await prisma.task.findFirst({
      where: {
        id: taskId,
        projectId: id
      },
      select: {
        title: true
      }
    })

    if (!taskToDelete) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    await prisma.task.delete({
      where: {
        id: taskId,
        projectId: id
      }
    })

    // Create activity log
    await prisma.activity.create({
      data: {
        type: 'TASK_DELETED',
        message: `Deleted task "${taskToDelete.title}"`,
        projectId: id,
        userId: user.id,
        metadata: {
          taskTitle: taskToDelete.title,
          deletedTaskId: taskId
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
