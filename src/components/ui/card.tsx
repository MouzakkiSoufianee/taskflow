import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { componentPatterns } from "./design-tokens"

const cardVariants = cva(
  // Base styles for all cards
  "rounded-xl transition-all duration-300 group",
  {
    variants: {
      variant: {
        // Default - subtle glass effect
        default: `
          bg-white/5 border border-white/20 text-white
          hover:bg-white/10 hover:border-white/30 hover:shadow-lg hover:shadow-white/10
        `,
        
        // Glass - enhanced glass morphism
        glass: `
          ${componentPatterns.glassBase} text-white
          hover:shadow-xl hover:shadow-white/20 hover:scale-[1.02] hover:-translate-y-1
        `,
        
        // Elevated - strong shadow
        elevated: `
          bg-white/10 border border-white/30 text-white shadow-xl shadow-black/20
          hover:shadow-2xl hover:shadow-black/30 hover:bg-white/15 hover:scale-[1.02]
        `,
        
        // Solid - opaque background
        solid: `
          bg-slate-800 border border-slate-700 text-white shadow-lg
          hover:bg-slate-700 hover:border-slate-600 hover:shadow-xl
        `,
        
        // Gradient - with cosmic gradient
        gradient: `
          bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 
          border border-white/30 text-white backdrop-blur-md
          hover:from-blue-600/30 hover:via-purple-600/30 hover:to-pink-600/30
          hover:border-white/40 hover:shadow-xl hover:shadow-purple-500/20
        `,
        
        // Outline - transparent with border
        outline: `
          bg-transparent border-2 border-white/30 text-white
          hover:bg-white/5 hover:border-white/50
        `,
      },
      
      size: {
        sm: "p-4 rounded-lg",
        default: "p-6 rounded-xl", 
        lg: "p-8 rounded-2xl",
        xl: "p-10 rounded-3xl",
      },
      
      interactive: {
        none: "",
        hover: "cursor-pointer transform-gpu",
        clickable: "cursor-pointer transform-gpu active:scale-[0.98]",
      },
    },
    defaultVariants: {
      variant: "glass",
      size: "default",
      interactive: "none",
    },
  }
)

const cardHeaderVariants = cva(
  "flex flex-col space-y-1.5",
  {
    variants: {
      size: {
        sm: "p-4 pb-2",
        default: "p-6 pb-3",
        lg: "p-8 pb-4", 
        xl: "p-10 pb-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const cardContentVariants = cva(
  "",
  {
    variants: {
      size: {
        sm: "p-4 pt-2",
        default: "p-6 pt-3",
        lg: "p-8 pt-4",
        xl: "p-10 pt-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const cardFooterVariants = cva(
  "flex items-center",
  {
    variants: {
      size: {
        sm: "p-4 pt-2",
        default: "p-6 pt-3", 
        lg: "p-8 pt-4",
        xl: "p-10 pt-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  children?: React.ReactNode
}

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, interactive, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, size, interactive }), className)}
      {...props}
    >
      {children}
      {/* Shine effect for glass variant */}
      {variant === "glass" && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 via-transparent to-transparent" />
        </div>
      )}
    </div>
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, size, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(cardHeaderVariants({ size }), className)} 
      {...props} 
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    level?: 1 | 2 | 3 | 4 | 5 | 6
  }
>(({ className, level = 3, children, ...props }, ref) => {
  const Tag = `h${level}` as const
  
  return (
    <Tag
      ref={ref}
      className={cn(
        "font-semibold leading-none tracking-tight text-white",
        level === 1 && "text-4xl",
        level === 2 && "text-3xl", 
        level === 3 && "text-2xl",
        level === 4 && "text-xl",
        level === 5 && "text-lg",
        level === 6 && "text-base",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-white/70 leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, size, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(cardContentVariants({ size }), className)} 
      {...props} 
    />
  )
)
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, size, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(cardFooterVariants({ size }), className)} 
      {...props} 
    />
  )
)
CardFooter.displayName = "CardFooter"

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  cardVariants,
  cardHeaderVariants,
  cardContentVariants,
  cardFooterVariants
}
