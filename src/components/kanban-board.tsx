"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DroppableStateSnapshot, DraggableProvided, DraggableStateSnapshot } from "@hello-pangea/dnd"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { 
  Plus, 
  Calendar, 
  User, 
  MoreVertical, 
  Edit, 
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle2
} from "lucide-react"

interface Task {
  id: string
  title: string
  description?: string | null
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  position: number
  dueDate?: string | null
  createdAt: string
  updatedAt: string
  assignee?: {
    id: string
    name: string
    email: string
    avatar?: string | null
  } | null
}

interface KanbanBoardProps {
  projectId: string
  initialTasks: Task[]
  onTaskUpdate: (task: Task) => void
  onTaskCreate: (status: string) => void
  onTaskDelete: (taskId: string) => void
}

const COLUMNS = [
  { 
    id: 'TODO', 
    title: 'To Do', 
    color: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200',
    accent: 'bg-slate-500'
  },
  { 
    id: 'IN_PROGRESS', 
    title: 'In Progress', 
    color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
    accent: 'bg-blue-500'
  },
  { 
    id: 'IN_REVIEW', 
    title: 'In Review', 
    color: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
    accent: 'bg-yellow-500'
  },
  { 
    id: 'DONE', 
    title: 'Done', 
    color: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
    accent: 'bg-green-500'
  }
]

const PRIORITY_COLORS = {
  LOW: 'priority-low',
  MEDIUM: 'priority-medium',
  HIGH: 'priority-high',
  URGENT: 'priority-urgent'
}

const PRIORITY_ICONS = {
  LOW: <div className="w-3 h-3 rounded-full priority-low shadow-sm" />,
  MEDIUM: <div className="w-3 h-3 rounded-full priority-medium shadow-sm" />,
  HIGH: <div className="w-3 h-3 rounded-full priority-high shadow-sm" />,
  URGENT: <AlertCircle className="w-4 h-4 text-red-500 priority-urgent" />
}

export default function KanbanBoard({ 
  projectId, 
  initialTasks, 
  onTaskUpdate, 
  onTaskCreate,
  onTaskDelete 
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const getTasksByStatus = (status: string) => {
    return tasks
      .filter(task => task.status === status)
      .sort((a, b) => a.position - b.position)
  }

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const task = tasks.find(t => t.id === draggableId)
    if (!task) return

    const newStatus = destination.droppableId as Task['status']
    const newTasks = Array.from(tasks)

    // Remove the task from its current position
    const taskIndex = newTasks.findIndex(t => t.id === draggableId)
    const [movedTask] = newTasks.splice(taskIndex, 1)

    // Update the task status
    movedTask.status = newStatus

    // Find tasks in the destination column
    const destinationTasks = newTasks.filter(t => t.status === newStatus)
    
    // Calculate new position
    let newPosition: number
    if (destination.index === 0) {
      newPosition = destinationTasks.length > 0 ? destinationTasks[0].position - 1 : 0
    } else if (destination.index >= destinationTasks.length) {
      newPosition = destinationTasks.length > 0 ? destinationTasks[destinationTasks.length - 1].position + 1 : 0
    } else {
      const prevTask = destinationTasks[destination.index - 1]
      const nextTask = destinationTasks[destination.index]
      newPosition = (prevTask.position + nextTask.position) / 2
    }

    movedTask.position = newPosition

    // Insert the task at the new position
    newTasks.splice(taskIndex, 0, movedTask)

    // Optimistically update the UI
    setTasks(newTasks)

    try {
      setIsLoading(true)
      const response = await fetch(`/api/projects/${projectId}/tasks/${draggableId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          position: newPosition
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const updatedTask = await response.json()
      onTaskUpdate(updatedTask)
    } catch (error) {
      console.error('Error updating task:', error)
      // Revert the optimistic update
      setTasks(tasks)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-white p-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {COLUMNS.map((column) => (
            <div key={column.id} className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.accent}`}></div>
                    <h3 className="font-bold text-lg text-gray-900">{column.title}</h3>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs font-medium ${column.accent} text-white border-0`}
                  >
                    {getTasksByStatus(column.id).length}
                  </Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onTaskCreate(column.id)}
                  className="h-9 w-9 p-0 rounded-lg hover:bg-gray-100 btn-scale"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Droppable droppableId={column.id}>
                {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[300px] p-4 rounded-xl border-2 border-dashed transition-all duration-300 ${
                      snapshot.isDraggingOver 
                        ? `${column.color} border-opacity-100 scale-105` 
                        : 'bg-gray-50/50 border-gray-200 border-opacity-50'
                    }`}
                  >
                    <div className="space-y-4">
                      {getTasksByStatus(column.id).map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                          isDragDisabled={isLoading}
                        >
                          {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-5 cursor-grab active:cursor-grabbing card-hover border-0 shadow-sm bg-white/80 backdrop-blur-sm ${
                                snapshot.isDragging 
                                  ? 'shadow-2xl rotate-3 scale-105 z-50' 
                                  : 'hover:shadow-lg'
                              }`}
                            >
                              <div className="space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                  <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-relaxed">
                                    {task.title}
                                  </h4>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {PRIORITY_ICONS[task.priority]}
                                    <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                      <MoreVertical className="h-3.5 w-3.5 text-gray-400" />
                                    </button>
                                  </div>
                                </div>

                                {task.description && (
                                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed bg-gray-50 p-3 rounded-lg">
                                    {task.description}
                                  </p>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                  <div className="flex items-center gap-3">
                                    {task.dueDate && (
                                      <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
                                        isOverdue(task.dueDate) 
                                          ? 'bg-red-50 text-red-600 border border-red-200' 
                                          : 'bg-gray-50 text-gray-600 border border-gray-200'
                                      }`}>
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(task.dueDate)}
                                      </div>
                                    )}
                                  </div>

                                  {task.assignee && (
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-7 w-7 ring-2 ring-white shadow-sm">
                                        <AvatarImage
                                          src={task.assignee.avatar || `/api/avatar/${task.assignee.email}`}
                                          alt={task.assignee.name}
                                        />
                                        <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                          {task.assignee.name?.charAt(0) || task.assignee.email.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                    </div>
                                  )}
                                </div>

                                {task.status === 'DONE' && (
                                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span className="text-xs font-medium">Done</span>
                                  </div>
                                )}
                              </div>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
