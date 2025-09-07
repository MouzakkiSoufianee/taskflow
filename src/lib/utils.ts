import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'relative' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'relative') {
    const now = new Date()
    const diffInMs = now.getTime() - dateObj.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }
  
  return dateObj.toLocaleDateString('en-US', 
    format === 'long' 
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' }
  )
}

/**
 * Generate a random color for projects
 */
export function getRandomColor(): string {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F97316', // Orange
    '#84CC16', // Lime
    '#EC4899', // Pink
    '#6B7280', // Gray
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * Generate initials from a name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Get task status color
 */
export function getTaskStatusColor(status: string): string {
  switch (status) {
    case 'TODO':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'IN_REVIEW':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'DONE':
      return 'bg-green-100 text-green-800 border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

/**
 * Get task priority color
 */
export function getTaskPriorityColor(priority: string): string {
  switch (priority) {
    case 'LOW':
      return 'bg-gray-100 text-gray-600 border-gray-200'
    case 'MEDIUM':
      return 'bg-blue-100 text-blue-600 border-blue-200'
    case 'HIGH':
      return 'bg-orange-100 text-orange-600 border-orange-200'
    case 'URGENT':
      return 'bg-red-100 text-red-600 border-red-200'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

/**
 * Format task status for display
 */
export function formatTaskStatus(status: string): string {
  switch (status) {
    case 'TODO':
      return 'To Do'
    case 'IN_PROGRESS':
      return 'In Progress'
    case 'IN_REVIEW':
      return 'In Review'
    case 'DONE':
      return 'Done'
    default:
      return status
  }
}

/**
 * Format task priority for display
 */
export function formatTaskPriority(priority: string): string {
  return priority.charAt(0) + priority.slice(1).toLowerCase()
}

/**
 * Check if a date is overdue
 */
export function isOverdue(dueDate: Date | string): boolean {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate
  return due < new Date()
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}
