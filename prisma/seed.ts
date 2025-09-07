import { PrismaClient, TaskStatus, TaskPriority, ProjectRole, ActivityType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo users
  const hashedPassword = await bcrypt.hash('password123', 10)

  const demoUser1 = await prisma.user.upsert({
    where: { email: 'demo@taskflow.com' },
    update: {},
    create: {
      email: 'demo@taskflow.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  })

  const demoUser2 = await prisma.user.upsert({
    where: { email: 'alice@taskflow.com' },
    update: {},
    create: {
      email: 'alice@taskflow.com',
      name: 'Alice Johnson',
      password: hashedPassword,
    },
  })

  const demoUser3 = await prisma.user.upsert({
    where: { email: 'bob@taskflow.com' },
    update: {},
    create: {
      email: 'bob@taskflow.com',
      name: 'Bob Smith',
      password: hashedPassword,
    },
  })

  console.log('✅ Users created')

  // Create demo project
  const demoProject = await prisma.project.create({
    data: {
      name: 'TaskFlow Demo Project',
      description: 'A sample project to showcase TaskFlow features',
      color: '#3B82F6',
      members: {
        create: [
          {
            userId: demoUser1.id,
            role: ProjectRole.OWNER,
          },
          {
            userId: demoUser2.id,
            role: ProjectRole.ADMIN,
          },
          {
            userId: demoUser3.id,
            role: ProjectRole.MEMBER,
          },
        ],
      },
    },
  })

  console.log('✅ Project created')

  // Create demo tasks
  const tasks = [
    {
      title: 'Set up project structure',
      description: 'Initialize the project with proper folder structure and dependencies',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      assigneeId: demoUser1.id,
      position: 0,
    },
    {
      title: 'Design user interface mockups',
      description: 'Create wireframes and design mockups for the main application screens',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      assigneeId: demoUser2.id,
      position: 1,
    },
    {
      title: 'Implement user authentication',
      description: 'Set up NextAuth.js with email/password and OAuth providers',
      status: TaskStatus.IN_REVIEW,
      priority: TaskPriority.MEDIUM,
      assigneeId: demoUser1.id,
      position: 2,
    },
    {
      title: 'Create task management features',
      description: 'Build CRUD operations for tasks with drag-and-drop functionality',
      status: TaskStatus.TODO,
      priority: TaskPriority.HIGH,
      assigneeId: demoUser3.id,
      position: 3,
    },
    {
      title: 'Add real-time collaboration',
      description: 'Implement Socket.io for real-time updates and user presence',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      position: 4,
    },
    {
      title: 'Write documentation',
      description: 'Create comprehensive documentation for the project',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      position: 5,
    },
  ]

  for (const taskData of tasks) {
    await prisma.task.create({
      data: {
        ...taskData,
        projectId: demoProject.id,
      },
    })
  }

  console.log('✅ Tasks created')

  // Create some demo comments
  const firstTask = await prisma.task.findFirst({
    where: { projectId: demoProject.id },
  })

  if (firstTask) {
    await prisma.comment.create({
      data: {
        content: 'Great work on setting this up! The project structure looks clean.',
        taskId: firstTask.id,
        userId: demoUser2.id,
      },
    })

    await prisma.comment.create({
      data: {
        content: 'Thanks! I made sure to follow best practices for scalability.',
        taskId: firstTask.id,
        userId: demoUser1.id,
      },
    })
  }

  console.log('✅ Comments created')

  // Create some activities
  await prisma.activity.create({
    data: {
      type: ActivityType.PROJECT_CREATED,
      message: `Created project "${demoProject.name}"`,
      userId: demoUser1.id,
      projectId: demoProject.id,
    },
  })

  await prisma.activity.create({
    data: {
      type: ActivityType.MEMBER_ADDED,
      message: `Added ${demoUser2.name} to the project`,
      userId: demoUser1.id,
      projectId: demoProject.id,
    },
  })

  await prisma.activity.create({
    data: {
      type: ActivityType.MEMBER_ADDED,
      message: `Added ${demoUser3.name} to the project`,
      userId: demoUser1.id,
      projectId: demoProject.id,
    },
  })

  console.log('✅ Activities created')
  console.log('🎉 Seeding completed successfully!')
  
  console.log('\n📋 Demo credentials:')
  console.log('Email: demo@taskflow.com')
  console.log('Password: password123')
  console.log('\nOther demo users:')
  console.log('alice@taskflow.com / password123')
  console.log('bob@taskflow.com / password123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
