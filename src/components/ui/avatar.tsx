import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { componentPatterns } from "./design-tokens"

const avatarVariants = cva(
  // Base styles for all avatars
  `
    relative flex shrink-0 overflow-hidden transition-all duration-300
  `,
  {
    variants: {
      variant: {
        // Default - subtle border
        default: `
          border-2 border-white/20 
          hover:border-white/40 hover:shadow-lg hover:shadow-white/10
        `,
        
        // Glass - glass morphism effect
        glass: `
          border-2 border-white/30 ${componentPatterns.glassBase}
          hover:border-white/50 hover:shadow-xl hover:shadow-white/20 hover:scale-105
        `,
        
        // Glow - with colored glow effect
        glow: `
          border-2 border-blue-400/50 shadow-lg shadow-blue-500/30
          hover:border-blue-400/70 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105
        `,
        
        // Ring - with status ring
        ring: `
          border-4 border-green-400/80 shadow-lg shadow-green-500/20
          hover:border-green-400 hover:shadow-xl hover:shadow-green-500/30
        `,
        
        // Solid - opaque border
        solid: `
          border-2 border-slate-600
          hover:border-slate-500 hover:shadow-lg
        `,
        
        // None - no border
        none: `
          hover:shadow-lg hover:shadow-white/20 hover:scale-105
        `,
      },
      
      size: {
        xs: "h-6 w-6",
        sm: "h-8 w-8", 
        default: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
        "2xl": "h-20 w-20",
        "3xl": "h-24 w-24",
      },
      
      shape: {
        circle: "rounded-full",
        square: "rounded-lg",
        rounded: "rounded-xl",
      },
      
      status: {
        none: "",
        online: "ring-2 ring-green-500 ring-offset-2 ring-offset-transparent",
        offline: "ring-2 ring-gray-500 ring-offset-2 ring-offset-transparent", 
        away: "ring-2 ring-yellow-500 ring-offset-2 ring-offset-transparent",
        busy: "ring-2 ring-red-500 ring-offset-2 ring-offset-transparent",
      },
    },
    defaultVariants: {
      variant: "glass",
      size: "default",
      shape: "circle",
      status: "none",
    },
  }
)

const avatarFallbackVariants = cva(
  `
    flex h-full w-full items-center justify-center font-medium text-white
    bg-gradient-to-br from-blue-500/30 to-purple-500/30
  `,
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-xs",
        default: "text-sm", 
        lg: "text-base",
        xl: "text-lg",
        "2xl": "text-xl",
        "3xl": "text-2xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: string
  showStatus?: boolean
}

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export interface AvatarFallbackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarFallbackVariants> {}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ 
    className, 
    variant, 
    size, 
    shape, 
    status, 
    src, 
    alt, 
    fallback, 
    showStatus,
    children,
    ...props 
  }, ref) => {
    const [imageError, setImageError] = React.useState(false)
    const [imageLoaded, setImageLoaded] = React.useState(false)

    const handleImageError = () => {
      setImageError(true)
    }

    const handleImageLoad = () => {
      setImageLoaded(true)
      setImageError(false)
    }

    // Generate initials from fallback text
    const getInitials = (text: string) => {
      return text
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ variant, size, shape, status }), className)}
        {...props}
      >
        {/* Avatar Image */}
        {src && !imageError && (
          <img
            src={src}
            alt={alt || fallback || "Avatar"}
            className={cn(
              "aspect-square h-full w-full object-cover transition-opacity duration-300",
              shape === "circle" && "rounded-full",
              shape === "square" && "rounded-lg", 
              shape === "rounded" && "rounded-xl",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
        
        {/* Avatar Fallback */}
        {(!src || imageError || !imageLoaded) && fallback && (
          <div className={cn(avatarFallbackVariants({ size }), shape === "circle" && "rounded-full", shape === "square" && "rounded-lg", shape === "rounded" && "rounded-xl")}>
            {getInitials(fallback)}
          </div>
        )}
        
        {/* Custom children */}
        {(!src || imageError) && !fallback && children && (
          <div className={cn(
            "flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500/30 to-purple-500/30 text-white",
            shape === "circle" && "rounded-full",
            shape === "square" && "rounded-lg",
            shape === "rounded" && "rounded-xl"
          )}>
            {children}
          </div>
        )}

        {/* Status indicator */}
        {showStatus && status !== "none" && (
          <div className={cn(
            "absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-black/20",
            size === "xs" && "h-2 w-2",
            size === "sm" && "h-2.5 w-2.5", 
            size === "default" && "h-3 w-3",
            size === "lg" && "h-3.5 w-3.5",
            size === "xl" && "h-4 w-4",
            size === "2xl" && "h-5 w-5",
            size === "3xl" && "h-6 w-6",
            status === "online" && "bg-green-500",
            status === "offline" && "bg-gray-500",
            status === "away" && "bg-yellow-500", 
            status === "busy" && "bg-red-500"
          )} />
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  )
)
AvatarImage.displayName = "AvatarImage"

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, size, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(avatarFallbackVariants({ size }), className)}
      {...props}
    >
      {children}
    </div>
  )
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback, avatarVariants, avatarFallbackVariants }
