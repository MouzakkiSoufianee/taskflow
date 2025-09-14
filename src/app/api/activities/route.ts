import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ActivityType, Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const type = searchParams.get('type')

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Build where clause
    const where: Prisma.ActivityWhereInput = {}

    // If projectId is specified, check if user has access to the project
    if (projectId) {
      const hasAccess = await prisma.projectMember.findFirst({
        where: {
          projectId,
          userId: currentUser.id
        }
      })

      if (!hasAccess) {
        return NextResponse.json({ error: 'Access denied to project' }, { status: 403 })
      }

      where.projectId = projectId
    } else {
      // Get all projects user has access to
      const userProjects = await prisma.projectMember.findMany({
        where: { userId: currentUser.id },
        select: { projectId: true }
      })

      where.projectId = {
        in: userProjects.map(p => p.projectId)
      }
    }

    // Filter by activity type if specified
    if (type) {
      where.type = type as ActivityType
    }

    // Get activities with related data
    const activities = await prisma.activity.findMany({
      where,
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
      take: limit,
      skip: offset
    })

    // Get total count for pagination
    const totalCount = await prisma.activity.count({ where })

    return NextResponse.json({
      activities,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      }
    })

  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, message, projectId, taskId, metadata } = await request.json()

    // Get current user
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Verify user has access to the project
    const hasAccess = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId: currentUser.id
      }
    })

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied to project' }, { status: 403 })
    }

    // Create activity
    const activity = await prisma.activity.create({
      data: {
        type,
        message,
        projectId,
        taskId,
        userId: currentUser.id,
        metadata: metadata || null
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
      }
    })

    return NextResponse.json(activity, { status: 201 })

  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    )
  }
}
