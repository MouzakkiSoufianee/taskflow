import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/projects - Get all projects for the current user
export async function GET() {
  try {
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

    // Get projects where user is a member
    const projects = await prisma.project.findMany({
      where: {
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
          }
        },
        tasks: {
          select: {
            status: true
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

    // Transform the data to include owner information and full members list
    const projectsWithData = projects.map((project) => ({
      ...project,
      owner: project.members.find((member: { role: string; user: unknown }) => member.role === 'OWNER')?.user || null,
      members: project.members // Keep all members for task assignment
    }))

    return NextResponse.json(projectsWithData)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create a new project
export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json()
    const { name, description } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        members: {
          create: {
            userId: user.id,
            role: 'OWNER'
          }
        }
      },
      include: {
        members: {
          where: {
            role: 'OWNER'
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          take: 1
        },
        tasks: {
          select: {
            status: true
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

    // Transform the data to include owner information
    const projectWithOwner = {
      ...project,
      owner: project.members[0]?.user || null,
      members: undefined
    }

    return NextResponse.json(projectWithOwner, { status: 201 })
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
