"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { 
  CheckSquare, 
  Users, 
  Zap, 
  Shield,
  ArrowRight,
  Star,
  Activity,
  BarChart3
} from "lucide-react"

export default function HomePage() {
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic-enhanced">
        <div className="glass-card-enhanced p-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-400 mx-auto"></div>
          <p className="text-white text-center mt-4 text-lg">Loading TaskFlow...</p>
        </div>
      </div>
    )
  }

  if (status === "authenticated") {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-cosmic-enhanced relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-40 right-40 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card-enhanced">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <h1 className="text-2xl font-bold text-white">TaskFlow</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin">
                  <button className="btn-secondary-enhanced">Sign In</button>
                </Link>
                <Link href="/auth/signup">
                  <button className="btn-primary-enhanced">Get Started</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Productivity
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience the future of task management with our intuitive platform designed for modern teams. 
              Collaborate seamlessly, track progress effortlessly, and achieve more together.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
              <Link href="/auth/signup">
                <button className="btn-primary-enhanced text-lg px-12 py-5">
                  Start Free Trial
                  <ArrowRight className="ml-3 h-6 w-6" />
                </button>
              </Link>
              <Link href="/auth/signin">
                <button className="btn-secondary-enhanced text-lg px-12 py-5">
                  Watch Demo
                </button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-in-right">
            <div className="glass-card-enhanced text-left hover-lift-enhanced">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <CheckSquare className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart Task Management</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Organize tasks with intelligent categorization, priority levels, and automated workflow suggestions.
              </p>
            </div>

            <div className="glass-card-enhanced text-left hover-lift-enhanced">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Team Collaboration</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Real-time collaboration with team members, instant updates, and seamless communication channels.
              </p>
            </div>

            <div className="glass-card-enhanced text-left hover-lift-enhanced">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Advanced Analytics</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                Comprehensive insights into team performance, project progress, and productivity metrics.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Powerful features designed to help teams collaborate effectively and deliver projects on time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card-enhanced hover-lift-enhanced">
              <Zap className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Real-time Updates</h3>
              <p className="text-white/70">
                Stay synchronized with instant notifications and live collaboration features.
              </p>
            </div>

            <div className="glass-card-enhanced hover-lift-enhanced">
              <Shield className="w-12 h-12 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Enterprise Security</h3>
              <p className="text-white/70">
                Bank-level security with role-based permissions and data encryption.
              </p>
            </div>

            <div className="glass-card-enhanced hover-lift-enhanced">
              <Star className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Priority Management</h3>
              <p className="text-white/70">
                Smart priority levels with due dates and automated reminders.
              </p>
            </div>

            <div className="glass-card-enhanced hover-lift-enhanced">
              <Activity className="w-12 h-12 text-red-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Activity Tracking</h3>
              <p className="text-white/70">
                Comprehensive activity feeds and team performance insights.
              </p>
            </div>

            <div className="glass-card-enhanced hover-lift-enhanced">
              <ArrowRight className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Seamless Integration</h3>
              <p className="text-white/70">
                Connect with your favorite tools through our flexible API.
              </p>
            </div>

            <div className="glass-card-enhanced hover-lift-enhanced">
              <CheckSquare className="w-12 h-12 text-cyan-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Kanban Boards</h3>
              <p className="text-white/70">
                Visual project management with drag-and-drop functionality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card-enhanced">
            <h2 className="text-4xl font-bold text-white mb-6">
              Try TaskFlow Right Now
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Experience TaskFlow with pre-loaded demo projects and tasks. No setup required.
            </p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 max-w-md mx-auto border border-white/20">
              <p className="text-white/60 mb-4 text-sm uppercase tracking-wide">Demo Account</p>
              <div className="space-y-2">
                <p className="font-mono text-white bg-white/10 px-4 py-2 rounded-lg">demo@taskflow.com</p>
                <p className="font-mono text-white bg-white/10 px-4 py-2 rounded-lg">password123</p>
              </div>
            </div>

            <Link href="/auth/signin">
              <button className="btn-primary-enhanced text-lg px-12 py-5">
                Try Demo Now
                <ArrowRight className="ml-3 h-6 w-6" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card-enhanced">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="animate-scale-in">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">10K+</div>
                <div className="text-white/70 text-lg">Active Users</div>
              </div>
              <div className="animate-scale-in" style={{animationDelay: '100ms'}}>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">50K+</div>
                <div className="text-white/70 text-lg">Tasks Completed</div>
              </div>
              <div className="animate-scale-in" style={{animationDelay: '200ms'}}>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">99.9%</div>
                <div className="text-white/70 text-lg">Uptime</div>
              </div>
              <div className="animate-scale-in" style={{animationDelay: '300ms'}}>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/70 text-lg">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card-enhanced">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of teams already using TaskFlow to streamline their projects and boost productivity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup">
                <button className="btn-primary-enhanced text-lg px-12 py-5">
                  Start Your Free Trial
                  <ArrowRight className="ml-3 h-6 w-6" />
                </button>
              </Link>
              <div className="text-white/60 text-sm">
                No credit card required • 14-day free trial
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card-enhanced">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="text-white font-semibold text-lg">TaskFlow</span>
              </div>
              
              <div className="text-white/60 text-center md:text-right">
                <p>&copy; 2025 TaskFlow. All rights reserved.</p>
                <p className="text-sm">Built with Next.js, TypeScript, and Tailwind CSS</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
