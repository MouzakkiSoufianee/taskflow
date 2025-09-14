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
  MoreVertical, 
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
}

const COLUMNS = [
  { 
    id: 'TODO', 
    title: 'To Do', 
    color: 'bg-slate-500/10 backdrop-blur-sm border-slate-400/20',
    accent: 'bg-slate-400'
  },
  { 
    id: 'IN_PROGRESS', 
    title: 'In Progress', 
    color: 'bg-blue-500/10 backdrop-blur-sm border-blue-400/20',
    accent: 'bg-blue-400'
  },
  { 
    id: 'IN_REVIEW', 
    title: 'In Review', 
    color: 'bg-yellow-500/10 backdrop-blur-sm border-yellow-400/20',
    accent: 'bg-yellow-400'
  },
  { 
    id: 'DONE', 
    title: 'Done', 
    color: 'bg-green-500/10 backdrop-blur-sm border-green-400/20',
    accent: 'bg-green-400'
  }
]

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
  onTaskCreate
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
    <div className="h-full p-6">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {COLUMNS.map((column) => (
            <div key={column.id} className={`flex flex-col bg-white/5 backdrop-blur-md rounded-2xl shadow-xl border ${column.color} p-6`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.accent}`}></div>
                    <h3 className="font-bold text-lg text-white">{column.title}</h3>
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
                  className="h-9 w-9 p-0 rounded-lg hover:bg-white/10 text-white btn-scale"
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
                        : 'bg-white/5 border-white/20 border-opacity-50'
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
                              className={`p-5 cursor-grab active:cursor-grabbing card-hover border border-white/20 shadow-xl bg-white/10 backdrop-blur-md ${
                                snapshot.isDragging 
                                  ? 'shadow-2xl rotate-3 scale-105 z-50' 
                                  : 'hover:shadow-lg hover:bg-white/15'
                              }`}
                            >
                              <div className="space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                  <h4 className="text-sm font-semibold text-white line-clamp-2 leading-relaxed">
                                    {task.title}
                                  </h4>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {PRIORITY_ICONS[task.priority]}
                                    <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                      <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                                    </button>
                                  </div>
                                </div>

                                {task.description && (
                                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-white/5 p-3 rounded-lg border border-white/10">
                                    {task.description}
                                  </p>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-white/20">
                                  <div className="flex items-center gap-3">
                                    {task.dueDate && (
                                      <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
                                        isOverdue(task.dueDate) 
                                          ? 'bg-red-500/20 text-red-300 border border-red-400/30' 
                                          : 'bg-white/10 text-slate-300 border border-white/20'
                                      }`}>
                                        <Calendar className="h-3 w-3" />
                                        {formatDate(task.dueDate)}
                                      </div>
                                    )}
                                  </div>

                                  {task.assignee && (
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-7 w-7 ring-2 ring-white/20 shadow-sm">
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
                                  <div className="flex items-center gap-2 text-green-300 bg-green-500/20 px-3 py-2 rounded-lg border border-green-400/30">
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
