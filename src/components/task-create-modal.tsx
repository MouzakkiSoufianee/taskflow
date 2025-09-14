"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Plus, Calendar, User } from "lucide-react"

interface TaskCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: {
    title: string
    description?: string
    status: string
    priority: string
    assigneeId?: string
    dueDate?: string
  }) => void
  status: string
  projectMembers: Array<{
    id: string
    user: {
      id: string
      name: string
      email: string
    }
  }>
}

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low', color: 'text-gray-600' },
  { value: 'MEDIUM', label: 'Medium', color: 'text-yellow-600' },
  { value: 'HIGH', label: 'High', color: 'text-orange-600' },
  { value: 'URGENT', label: 'Urgent', color: 'text-red-600' }
]

export default function TaskCreateModal({
  isOpen,
  onClose,
  onSubmit,
  status,
  projectMembers
}: TaskCreateModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("MEDIUM")
  const [assigneeId, setAssigneeId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) return

    setIsSubmitting(true)
    
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        assigneeId: assigneeId || undefined,
        dueDate: dueDate || undefined
      })
      
      // Reset form
      setTitle("")
      setDescription("")
      setPriority("MEDIUM")
      setAssigneeId("")
      setDueDate("")
      onClose()
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg border border-white/20 shadow-2xl bg-white/10 backdrop-blur-md">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                <Plus className="h-5 w-5 text-blue-300" />
              </div>
              <h3 className="text-xl font-bold text-white">Create New Task</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-9 w-9 p-0 hover:bg-red-500/20 hover:text-red-300 text-white btn-scale"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Title *
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                required
                autoFocus
                className="h-12 text-base bg-white/5 border border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 focus:ring-white/20"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 resize-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all"
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Assignee
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={assigneeId}
                    onChange={(e) => setAssigneeId(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 transition-all appearance-none"
                  >
                    <option value="" className="bg-slate-800 text-white">Unassigned</option>
                    {projectMembers.map((member) => (
                      <option key={member.user.id} value={member.user.id} className="bg-slate-800 text-white">
                        {member.user.name || member.user.email}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="pl-10 h-12 text-base bg-white/5 border border-white/20 text-white focus:border-white/40 focus:ring-white/20"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t border-white/20">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-12 font-medium btn-scale border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!title.trim() || isSubmitting}
                className="flex-1 h-12 font-medium btn-scale bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  "Create Task"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}
