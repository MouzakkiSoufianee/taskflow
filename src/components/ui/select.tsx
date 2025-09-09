import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { componentPatterns } from "./design-tokens"
import { ChevronDown } from "lucide-react"

const selectVariants = cva(
  // Base styles for all selects
  `
    w-full transition-all duration-300 text-sm appearance-none cursor-pointer
    focus:outline-none 
    disabled:cursor-not-allowed disabled:opacity-50
  `,
  {
    variants: {
      variant: {
        // Default - solid background
        default: `
          border border-white/20 bg-white/5 text-white rounded-xl px-4 py-3 h-12
          hover:border-white/30 hover:bg-white/10
          focus:border-blue-400/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/30
        `,
        
        // Glass - enhanced glass morphism with floating labels
        glass: `
          ${componentPatterns.glassBase} text-white rounded-xl px-4 py-3 h-14
          hover:shadow-lg hover:shadow-white/10
          focus:border-blue-400/50 focus:shadow-xl focus:shadow-blue-500/20
          focus:ring-2 focus:ring-blue-500/30 focus:scale-[1.02] focus:-translate-y-0.5
        `,
        
        // Minimal - borderless
        minimal: `
          bg-transparent text-white border-0 border-b-2 border-white/20 rounded-none px-0 py-3 h-auto
          hover:border-white/40
          focus:border-blue-400 focus:ring-0
        `,
        
        // Solid - opaque background
        solid: `
          bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 h-12
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
        sm: "h-10 px-3 py-2 text-sm rounded-lg",
        default: "h-12 px-4 py-3 text-sm rounded-xl",
        lg: "h-14 px-4 py-3 text-base rounded-xl",
      },
    },
    defaultVariants: {
      variant: "glass",
      state: "default", 
      size: "default",
    },
  }
)

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  label?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  error?: string
  success?: boolean | string
  hint?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className, 
    variant, 
    state, 
    size, 
    label, 
    icon, 
    iconPosition = "left", 
    error, 
    success, 
    hint,
    options,
    placeholder,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(Boolean(props.value || props.defaultValue))
    
    // Determine the current state
    const currentState = error ? "error" : success ? "success" : state || "default"
    
    // Handle label positioning for glass variant
    const hasFloatingLabel = variant === "glass" && label
    const shouldFloatLabel = hasFloatingLabel && (isFocused || hasValue)
    
    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setHasValue(e.target.value.length > 0)
      props.onChange?.(e)
    }

    // Calculate padding based on icon and label presence
    const getSelectClasses = () => {
      let classes = selectVariants({ variant, state: currentState, size })
      
      // Adjust padding for icons
      if (icon) {
        if (iconPosition === "left") {
          classes += hasFloatingLabel ? " pl-12" : " pl-11"
        }
      }
      
      // Always add right padding for dropdown arrow
      classes += " pr-12"
      
      // Adjust padding for floating labels
      if (hasFloatingLabel) {
        classes += " pt-6 pb-2"
      }
      
      return classes
    }

    // Group options by group property
    const groupedOptions = React.useMemo(() => {
      const groups: Record<string, SelectOption[]> = {}
      const ungrouped: SelectOption[] = []
      
      options.forEach(option => {
        if (option.group) {
          if (!groups[option.group]) {
            groups[option.group] = []
          }
          groups[option.group].push(option)
        } else {
          ungrouped.push(option)
        }
      })
      
      return { groups, ungrouped }
    }, [options])

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
              : "top-1/2 -translate-y-1/2 text-sm"
          )}>
            {label}
          </label>
        )}
        
        {/* Left icon */}
        {icon && iconPosition === "left" && (
          <div className={cn(
            "absolute z-10 transition-all duration-300 flex items-center",
            hasFloatingLabel
              ? shouldFloatLabel ? "top-10 left-4" : "top-1/2 -translate-y-1/2 left-4"
              : "top-1/2 -translate-y-1/2 left-4",
            isFocused ? "text-blue-400" : "text-white/40"
          )}>
            {icon}
          </div>
        )}
        
        {/* Select element */}
        <select
          ref={ref}
          className={cn(getSelectClasses(), className)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        >
          {/* Placeholder option */}
          {placeholder && (
            <option value="" disabled className="bg-slate-900 text-white/60">
              {placeholder}
            </option>
          )}
          
          {/* Ungrouped options */}
          {groupedOptions.ungrouped.map((option) => (
            <option 
              key={option.value} 
              value={option.value} 
              disabled={option.disabled}
              className="bg-slate-900 text-white hover:bg-slate-800"
            >
              {option.label}
            </option>
          ))}
          
          {/* Grouped options */}
          {Object.entries(groupedOptions.groups).map(([groupName, groupOptions]) => (
            <optgroup key={groupName} label={groupName} className="bg-slate-800 text-white/80">
              {groupOptions.map((option) => (
                <option 
                  key={option.value} 
                  value={option.value} 
                  disabled={option.disabled}
                  className="bg-slate-900 text-white hover:bg-slate-800 pl-4"
                >
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        
        {/* Dropdown arrow */}
        <div className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300",
          isFocused ? "text-blue-400 rotate-180" : "text-white/40"
        )}>
          <ChevronDown className="h-5 w-5" />
        </div>
        
        {/* Enhanced border effect for glass variant */}
        {variant === "glass" && (
          <div className={cn(
            "absolute inset-0 rounded-xl pointer-events-none transition-all duration-300",
            isFocused 
              ? "bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-100" 
              : "opacity-0"
          )} />
        )}
        
        {/* Error message */}
        {error && (
          <div className="mt-2 text-sm text-red-400 flex items-center animate-pulse">
            <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        
        {/* Success message */}
        {success && !error && (
          <div className="mt-2 text-sm text-green-400 flex items-center">
            <svg className="h-4 w-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {typeof success === "string" ? success : "Valid"}
          </div>
        )}
        
        {/* Hint text */}
        {hint && !error && (
          <div className="mt-2 text-sm text-white/50">
            {hint}
          </div>
        )}
      </div>
    )
  }
)

Select.displayName = "Select"

export { Select, selectVariants }
