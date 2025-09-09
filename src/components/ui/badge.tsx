import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { componentPatterns } from "./design-tokens"

const badgeVariants = cva(
  // Base styles for all badges
  `
    inline-flex items-center font-medium transition-all duration-300 
    focus:outline-none focus:ring-2 focus:ring-blue-500/50
  `,
  {
    variants: {
      variant: {
        // Default - blue theme
        default: `
          bg-blue-500/20 text-blue-300 border border-blue-400/30
          hover:bg-blue-500/30 hover:border-blue-400/50 hover:text-blue-200
        `,
        
        // Success - green theme  
        success: `
          bg-green-500/20 text-green-300 border border-green-400/30
          hover:bg-green-500/30 hover:border-green-400/50 hover:text-green-200
        `,
        
        // Warning - yellow theme
        warning: `
          bg-yellow-500/20 text-yellow-300 border border-yellow-400/30
          hover:bg-yellow-500/30 hover:border-yellow-400/50 hover:text-yellow-200
        `,
        
        // Destructive - red theme
        destructive: `
          bg-red-500/20 text-red-300 border border-red-400/30
          hover:bg-red-500/30 hover:border-red-400/50 hover:text-red-200
        `,
        
        // Secondary - gray theme
        secondary: `
          bg-white/10 text-white/80 border border-white/20
          hover:bg-white/20 hover:border-white/30 hover:text-white
        `,
        
        // Glass - glass morphism
        glass: `
          ${componentPatterns.glassBase} text-white border-white/30
          hover:shadow-lg hover:shadow-white/10 hover:border-white/40
        `,
        
        // Outline - transparent with border
        outline: `
          bg-transparent text-white border border-white/40
          hover:bg-white/10 hover:border-white/60
        `,
        
        // Solid - opaque backgrounds
        solid: `
          bg-slate-700 text-white border border-slate-600
          hover:bg-slate-600 hover:border-slate-500
        `,
      },
      
      size: {
        sm: "px-2 py-0.5 text-xs rounded-md",
        default: "px-2.5 py-0.5 text-xs rounded-lg", 
        lg: "px-3 py-1 text-sm rounded-lg",
        xl: "px-4 py-1.5 text-base rounded-xl",
      },
      
      interactive: {
        none: "",
        hover: "cursor-pointer",
        clickable: "cursor-pointer active:scale-95",
      },
    },
    defaultVariants: {
      variant: "glass",
      size: "default",
      interactive: "none",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  removable?: boolean
  onRemove?: () => void
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size, 
    interactive, 
    icon, 
    iconPosition = "left", 
    removable, 
    onRemove, 
    children, 
    ...props 
  }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(badgeVariants({ variant, size, interactive }), className)} 
        {...props}
      >
        {/* Left icon */}
        {icon && iconPosition === "left" && (
          <span className="mr-1 flex-shrink-0">
            {icon}
          </span>
        )}
        
        {/* Badge content */}
        <span className="truncate">
          {children}
        </span>
        
        {/* Right icon */}
        {icon && iconPosition === "right" && !removable && (
          <span className="ml-1 flex-shrink-0">
            {icon}
          </span>
        )}
        
        {/* Remove button */}
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className={cn(
              "ml-1 flex-shrink-0 rounded-full p-0.5 transition-colors duration-200",
              "hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-white/50"
            )}
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

Badge.displayName = "Badge"

export { Badge, badgeVariants }
