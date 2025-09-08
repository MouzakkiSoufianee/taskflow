import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/projects/[id]/tasks - Get all tasks for a project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const tasks = await prisma.task.findMany({
      where: {
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
        }
      },
      orderBy: [
        { status: 'asc' },
        { position: 'asc' }
      ]
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/tasks - Create a new task
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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
    const { title, description, status = 'TODO', priority = 'MEDIUM', assigneeId, dueDate } = body

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      )
    }

    // Get the highest position for the status column
    const lastTask = await prisma.task.findFirst({
      where: {
        projectId: id,
        status: status as 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'
      },
      orderBy: {
        position: 'desc'
      }
    })

    const position = lastTask ? lastTask.position + 1 : 0

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status as 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE',
        priority: priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
        projectId: id,
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        position
      },
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

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
