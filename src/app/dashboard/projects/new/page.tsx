"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function NewProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })
  const [errors, setErrors] = useState<{
    name?: string
    description?: string
    submit?: string
  }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Basic validation
    const newErrors: typeof errors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required"
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Project name must be at least 3 characters"
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Project name must be less than 100 characters"
    }

    if (formData.description && formData.description.trim().length > 500) {
      newErrors.description = "Description must be less than 500 characters"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create project')
      }

      const project = await response.json()
      router.push(`/dashboard/projects/${project.id}`)
    } catch (error) {
      console.error('Error creating project:', error)
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to create project'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard/projects">
          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">Create New Project</h1>
        <p className="text-slate-300">
          Start organizing your work with a new project
        </p>
      </div>

      {/* Form */}
      <Card className="bg-white/10 backdrop-blur-md border border-white/20 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Project Details</CardTitle>
          <CardDescription className="text-slate-300">
            Choose a name and description for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-white">
                Project Name *
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-white/40 focus:ring-white/20 ${errors.name ? 'border-red-400' : ''}`}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-red-400">{errors.name}</p>
              )}
              <p className="text-xs text-slate-400">
                {formData.name.length}/100 characters
              </p>
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-white">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe what this project is about (optional)"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-3 py-2 bg-white/5 border border-white/20 rounded-md shadow-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40 ${
                  errors.description ? 'border-red-400' : ''
                }`}
                disabled={loading}
              />
              {errors.description && (
                <p className="text-sm text-red-400">{errors.description}</p>
              )}
              <p className="text-xs text-slate-400">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-500/20 border border-red-400/30 rounded-md backdrop-blur-sm">
                <p className="text-sm text-red-300">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/20">
              <Link href="/dashboard/projects">
                <Button variant="outline" disabled={loading} className="border-white/20 text-white hover:bg-white/10">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading || !formData.name.trim()} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-500/10 border border-blue-400/20 backdrop-blur-md shadow-xl">
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-blue-300 mb-2">Project Creation Guidelines</h3>
          <ul className="text-sm text-blue-200 space-y-1">
            <li>• Choose a clear, descriptive name that team members will understand</li>
            <li>• Add a description to help others understand the project&apos;s goals</li>
            <li>• You can always edit these details later from the project settings</li>
            <li>• You&apos;ll be able to invite team members after creating the project</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
