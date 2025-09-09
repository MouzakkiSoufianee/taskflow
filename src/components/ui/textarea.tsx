import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { componentPatterns } from "./design-tokens"

const textareaVariants = cva(
  // Base styles for all textareas
  `
    w-full transition-all duration-300 text-sm resize-none
    placeholder:text-white/40 
    focus:outline-none 
    disabled:cursor-not-allowed disabled:opacity-50
  `,
  {
    variants: {
      variant: {
        // Default - solid background
        default: `
          border border-white/20 bg-white/5 text-white rounded-xl px-4 py-3 min-h-[100px]
          hover:border-white/30 hover:bg-white/10
          focus:border-blue-400/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/30
        `,
        
        // Glass - enhanced glass morphism with floating labels
        glass: `
          ${componentPatterns.glassBase} text-white rounded-xl px-4 py-3 min-h-[120px]
          hover:shadow-lg hover:shadow-white/10
          focus:border-blue-400/50 focus:shadow-xl focus:shadow-blue-500/20
          focus:ring-2 focus:ring-blue-500/30 focus:scale-[1.02] focus:-translate-y-0.5
        `,
        
        // Minimal - borderless
        minimal: `
          bg-transparent text-white border-0 border-b-2 border-white/20 rounded-none px-0 py-3 min-h-[100px]
          hover:border-white/40
          focus:border-blue-400 focus:ring-0
        `,
        
        // Solid - opaque background
        solid: `
          bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 min-h-[100px]
          hover:border-slate-600 hover:bg-slate-700
          focus:border-blue-500 focus:bg-slate-700 focus:ring-2 focus:ring-blue-500/30
        `,
      },
      
      state: {
        default: "",
        error: "border-red-400/50 bg-red-500/10 focus:border-red-400 focus:ring-red-500/30",
        success: "border-green-400/50 bg-green-500/10 focus:border-green-400 focus:ring-green-500/30",
        warning: "border-yellow-400/50 bg-yellow-500/10 focus:border-yellow-400 focus:ring-yellow-500/30",
      },
      
      size: {
        sm: "min-h-[80px] px-3 py-2 text-sm rounded-lg",
        default: "min-h-[100px] px-4 py-3 text-sm rounded-xl",
        lg: "min-h-[120px] px-4 py-3 text-base rounded-xl",
        xl: "min-h-[150px] px-6 py-4 text-base rounded-2xl",
      },
      
      resize: {
        none: "resize-none",
        vertical: "resize-y",
        horizontal: "resize-x",
        both: "resize",
      },
    },
    defaultVariants: {
      variant: "glass",
      state: "default",
      size: "default",
      resize: "vertical",
    },
  }
)

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    VariantProps<typeof textareaVariants> {
  label?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  error?: string
  success?: boolean | string
  hint?: string
  maxLength?: number
  showCharCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant, 
    state, 
    size, 
    resize,
    label, 
    icon, 
    iconPosition = "left", 
    error, 
    success, 
    hint,
    maxLength,
    showCharCount,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(Boolean(props.value || props.defaultValue))
    const [charCount, setCharCount] = React.useState(0)
    
    // Determine the current state
    const currentState = error ? "error" : success ? "success" : state || "default"
    
    // Handle label positioning for glass variant
    const hasFloatingLabel = variant === "glass" && label
    const shouldFloatLabel = hasFloatingLabel && (isFocused || hasValue)
    
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setHasValue(value.length > 0)
      setCharCount(value.length)
      props.onChange?.(e)
    }

    // Calculate padding based on icon and label presence
    const getTextareaClasses = () => {
      let classes = textareaVariants({ variant, state: currentState, size, resize })
      
      // Adjust padding for icons
      if (icon) {
        if (iconPosition === "left") {
          classes += hasFloatingLabel ? " pl-12" : " pl-11"
        } else {
          classes += " pr-11"
        }
      }
      
      // Adjust padding for floating labels
      if (hasFloatingLabel) {
        classes += " pt-8 pb-3"
      }
      
      return classes
    }

    // Character count validation
    const isOverLimit = maxLength && charCount > maxLength
    const isNearLimit = maxLength && charCount > maxLength * 0.8

    return (
      <div className="relative group w-full">
        {/* Static label (non-floating) */}
        {label && !hasFloatingLabel && (
          <label className="block text-sm font-medium text-white/80 mb-2">
            {label}
          </label>
        )}
        
        {/* Floating label */}
        {hasFloatingLabel && (
          <label className={cn(
            "absolute left-4 transition-all duration-300 pointer-events-none z-10 text-white/60",
            shouldFloatLabel 
              ? "top-2 text-xs font-medium text-blue-400" 
              : "top-4 text-sm"
          )}>
            {label}
          </label>
        )}
        
        {/* Left icon */}
        {icon && iconPosition === "left" && (
          <div className={cn(
            "absolute z-10 transition-all duration-300 flex items-start",
            hasFloatingLabel
              ? shouldFloatLabel ? "top-10 left-4" : "top-4 left-4"
              : "top-4 left-4",
            isFocused ? "text-blue-400" : "text-white/40"
          )}>
            {icon}
          </div>
        )}
        
        {/* Textarea element */}
        <textarea
          ref={ref}
          className={cn(getTextareaClasses(), className)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />
        
        {/* Right icon */}
        {icon && iconPosition === "right" && (
          <div className={cn(
            "absolute right-4 top-4 z-10 transition-all duration-300 flex items-start",
            isFocused ? "text-blue-400" : "text-white/40"
          )}>
            {icon}
          </div>
        )}
        
        {/* Enhanced border effect for glass variant */}
        {variant === "glass" && (
          <div className={cn(
            "absolute inset-0 rounded-xl pointer-events-none transition-all duration-300",
            isFocused 
              ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-100" 
              : "opacity-0"
          )} />
        )}
        
        {/* Bottom section with error/success/hint/character count */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex-1">
            {/* Error message */}
            {error && (
              <div className="text-sm text-red-400 flex items-center animate-pulse">
                <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}
            
            {/* Success message */}
            {success && !error && (
              <div className="text-sm text-green-400 flex items-center">
                <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {typeof success === "string" ? success : "Valid"}
              </div>
            )}
            
            {/* Hint text */}
            {hint && !error && (
              <div className="text-sm text-white/50">
                {hint}
              </div>
            )}
          </div>
          
          {/* Character count */}
          {(showCharCount || maxLength) && (
            <div className={cn(
              "text-xs ml-4 flex-shrink-0",
              isOverLimit ? "text-red-400" : 
              isNearLimit ? "text-yellow-400" : 
              "text-white/50"
            )}>
              {maxLength ? `${charCount}/${maxLength}` : charCount}
            </div>
          )}
        </div>
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea, textareaVariants }
