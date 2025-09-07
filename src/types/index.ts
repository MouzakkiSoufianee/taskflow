import { 
  User,
  Project,
  Task,
  Comment,
  Activity,
  ProjectMember,
  ProjectStatus,
  ProjectRole,
  TaskStatus,
  TaskPriority,
  ActivityType
} from '@prisma/client'

// Extended types with relations
export type UserWithProjects = User & {
  projects: (ProjectMember & {
    project: Project
  })[]
}

export type ProjectWithMembers = Project & {
  members: (ProjectMember & {
    user: User
  })[]
  tasks: Task[]
  _count: {
    tasks: number
    members: number
  }
}

export type TaskWithDetails = Task & {
  assignee: User | null
  project: Project
  comments: (Comment & {
    user: User
  })[]
  _count: {
    comments: number
  }
}

export type ActivityWithDetails = Activity & {
  user: User
  project: Project
  task: Task | null
}

export type CommentWithUser = Comment & {
  user: User
}

// Form types
export interface CreateProjectData {
  name: string
  description?: string
  color?: string
}

export interface CreateTaskData {
  title: string
  description?: string
  priority?: TaskPriority
  dueDate?: Date
  assigneeId?: string
  projectId: string
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: Date | null
  assigneeId?: string | null
  position?: number
}

export interface CreateCommentData {
  content: string
  taskId: string
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Socket.io event types
export interface SocketEvents {
  // Task events
  'task:created': TaskWithDetails
  'task:updated': TaskWithDetails
  'task:deleted': { id: string; projectId: string }
  'task:assigned': TaskWithDetails
  
  // Comment events
  'comment:added': CommentWithUser & { taskId: string }
  
  // Project events
  'project:updated': ProjectWithMembers
  'member:added': ProjectMember & { user: User; project: Project }
  'member:removed': { userId: string; projectId: string }
  
  // Activity events
  'activity:new': ActivityWithDetails
  
  // User presence
  'user:online': { userId: string; projectId: string }
  'user:offline': { userId: string; projectId: string }
}

// Re-export Prisma enums
export {
  ProjectStatus,
  ProjectRole,
  TaskStatus,
  TaskPriority,
  ActivityType
}
