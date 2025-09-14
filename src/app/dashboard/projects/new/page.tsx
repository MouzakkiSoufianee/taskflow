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
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-gray-600">
          Start organizing your work with a new project
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Choose a name and description for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Project Name *
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
              <p className="text-xs text-gray-500">
                {formData.name.length}/100 characters
              </p>
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                placeholder="Describe what this project is about (optional)"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t">
              <Link href="/dashboard/projects">
                <Button variant="outline" disabled={loading}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={loading || !formData.name.trim()}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Project Creation Guidelines</h3>
          <ul className="text-sm text-blue-700 space-y-1">
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
