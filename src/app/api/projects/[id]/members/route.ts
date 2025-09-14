import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/projects/[id]/members - Get project members
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

    const members = await prisma.projectMember.findMany({
      where: {
        projectId: id
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
      orderBy: {
        role: 'asc'
      }
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error("Error fetching project members:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/members - Add member to project
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
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

    // Check if user has permission to add members (owner or admin)
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
    const { email, role = 'MEMBER' } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Find the user to add
    const userToAdd = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!userToAdd) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user is already a member
    const existingMember = await prisma.projectMember.findFirst({
      where: {
        projectId: id,
        userId: userToAdd.id
      }
    })

    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a member of this project" },
        { status: 400 }
      )
    }

    // Add the member
    const newMember = await prisma.projectMember.create({
      data: {
        projectId: id,
        userId: userToAdd.id,
        role: role
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(newMember, { status: 201 })
  } catch (error) {
    console.error("Error adding project member:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id]/members - Remove member from project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { id } = await params
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get memberId from request body
    const body = await request.json()
    const { memberId } = body

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
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

    // Check if user has permission to remove members (owner or admin)
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

    // Cannot remove project owner
    const memberToRemove = await prisma.projectMember.findUnique({
      where: { id: memberId }
    })

    if (!memberToRemove) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      )
    }

    if (memberToRemove.role === 'OWNER') {
      return NextResponse.json(
        { error: "Cannot remove project owner" },
        { status: 400 }
      )
    }

    await prisma.projectMember.delete({
      where: { id: memberId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing project member:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
