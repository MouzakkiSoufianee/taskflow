import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { componentPatterns } from "./design-tokens"

const buttonVariants = cva(
  // Base styles - consistent across all variants
  `
    inline-flex items-center justify-center whitespace-nowrap font-medium
    transition-all duration-300 cursor-pointer select-none
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
    disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95 relative overflow-hidden
  `,
  {
    variants: {
      variant: {
        // Primary - gradient with glass morphism
        primary: `
          ${componentPatterns.gradientPrimary} text-white font-semibold
          hover:from-blue-700 hover:to-purple-700 
          hover:shadow-xl hover:shadow-blue-500/25
          focus:ring-blue-500/30 focus:from-blue-700 focus:to-purple-700
          disabled:from-gray-600 disabled:to-gray-700
        `,
        
        // Secondary - glass morphism with subtle gradient
        secondary: `
          ${componentPatterns.glassInteractive} text-white font-medium
          bg-gradient-to-r from-slate-600/20 to-slate-700/20
          hover:from-slate-600/30 hover:to-slate-700/30
          focus:ring-slate-500/30
        `,
        
        // Success - green gradient
        success: `
          ${componentPatterns.gradientSuccess} text-white font-semibold
          hover:from-green-700 hover:to-emerald-700
          hover:shadow-xl hover:shadow-green-500/25
          focus:ring-green-500/30
        `,
        
        // Warning - orange/yellow gradient
        warning: `
          ${componentPatterns.gradientWarning} text-white font-semibold
          hover:from-yellow-700 hover:to-orange-700
          hover:shadow-xl hover:shadow-yellow-500/25
          focus:ring-yellow-500/30
        `,
        
        // Destructive - red gradient
        destructive: `
          ${componentPatterns.gradientDanger} text-white font-semibold
          hover:from-red-700 hover:to-rose-700
          hover:shadow-xl hover:shadow-red-500/25
          focus:ring-red-500/30
        `,
        
        // Outline - transparent with border
        outline: `
          border-2 border-white/30 bg-transparent text-white font-medium
          hover:bg-white/10 hover:border-white/50
          focus:ring-white/30 focus:bg-white/10
        `,
        
        // Ghost - minimal hover state
        ghost: `
          bg-transparent text-white/80 font-medium
          hover:bg-white/10 hover:text-white
          focus:ring-white/20 focus:bg-white/10
        `,
        
        // Link - text only
        link: `
          bg-transparent text-blue-400 font-medium underline-offset-4
          hover:underline hover:text-blue-300
          focus:ring-blue-500/30
        `,
        
        // Glass - pure glass morphism
        glass: `
          ${componentPatterns.glassBase} text-white font-medium
          hover:shadow-lg hover:shadow-white/10
          focus:ring-white/30
        `,
      },
      
      size: {
        sm: "h-9 px-3 text-sm rounded-lg",
        default: "h-12 px-6 py-3 text-sm rounded-xl",
        lg: "h-14 px-8 py-4 text-base rounded-xl",
        xl: "h-16 px-10 py-5 text-lg rounded-2xl",
        icon: "h-12 w-12 rounded-xl",
        "icon-sm": "h-9 w-9 rounded-lg",
        "icon-lg": "h-14 w-14 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false, 
    icon, 
    iconPosition = "left", 
    children, 
    disabled,
    ...props 
  }, ref) => {
    const showIcon = icon && !loading
    const showChildren = children && !loading
    
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <>
            <div className={componentPatterns.spinner + " mr-2"} />
            <span>Loading...</span>
          </>
        )}
        
        {!loading && (
          <>
            {showIcon && iconPosition === "left" && (
              <span className={cn("flex items-center", showChildren && "mr-2")}>
                {icon}
              </span>
            )}
            
            {showChildren && <span>{children}</span>}
            
            {showIcon && iconPosition === "right" && (
              <span className={cn("flex items-center", showChildren && "ml-2")}>
                {icon}
              </span>
            )}
          </>
        )}
        
        {/* Shine effect on hover for primary variants */}
        {(variant === "primary" || variant === "success" || variant === "warning" || variant === "destructive") && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
        )}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }

// Usage examples:
/*
// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// With icons
<Button icon={<PlusIcon />}>Add Item</Button>
<Button icon={<ArrowIcon />} iconPosition="right">Next</Button>

// Icon only
<Button variant="ghost" size="icon" icon={<CloseIcon />} />

// Loading state
<Button loading>Processing...</Button>

// Disabled
<Button disabled>Disabled</Button>
*/
