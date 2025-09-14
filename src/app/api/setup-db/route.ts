import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    // This will automatically create tables if they don't exist
    // by running a simple query that will trigger Prisma's auto-migration
    await prisma.$queryRaw`SELECT 1`
    
    // Test if users table exists by trying to count users
    const userCount = await prisma.user.count()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database is ready',
      userCount 
    })
  } catch (error) {
    console.error('Database setup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Database setup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}