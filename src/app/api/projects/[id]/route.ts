import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/projects/[id] - Get a specific project
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

    const project = await prisma.project.findFirst({
      where: {
        id: id,
        members: {
          some: {
            userId: user.id
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
                email: true
              }
            }
          },
          orderBy: {
            role: 'asc'
          }
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
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

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    // Find the owner and transform the data
    const owner = project.members.find((member: any) => member.role === 'OWNER')?.user || null
    const projectWithOwner = {
      ...project,
      owner,
      ownerId: owner?.id || null
    }

    return NextResponse.json(projectWithOwner)
  } catch (error) {
    console.error("Error fetching project:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id] - Update a project
export async function PUT(
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

    // Check if user has permission to edit (owner or admin)
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: id,
        userId: user.id,
        role: { in: ['OWNER', 'ADMIN'] }
      }
    })

    if (!projectMember) {
      return NextResponse.json(
        { error: "Project not found or insufficient permissions" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { name, description } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      )
    }

    const updatedProject = await prisma.project.update({
      where: { id: id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        updatedAt: new Date()
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
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

    // Find the owner and transform the data
    const owner = updatedProject.members.find((member: any) => member.role === 'OWNER')?.user || null
    const projectWithOwner = {
      ...updatedProject,
      owner,
      ownerId: owner?.id || null
    }

    return NextResponse.json(projectWithOwner)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id] - Delete a project
export async function DELETE(
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

    // Only project owner can delete the project
    const projectMember = await prisma.projectMember.findFirst({
      where: {
        projectId: id,
        userId: user.id,
        role: 'OWNER'
      }
    })

    if (!projectMember) {
      return NextResponse.json(
        { error: "Project not found or insufficient permissions" },
        { status: 404 }
      )
    }

    // Delete project and all related data (cascade)
    await prisma.project.delete({
      where: { id: id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
