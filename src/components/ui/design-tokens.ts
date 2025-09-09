/**
 * TaskFlow Design System Tokens
 * Centralized design tokens for consistent styling across all UI components
 */

export const designTokens = {
  // Spacing
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem',  // 8px
    md: '0.75rem', // 12px
    lg: '1rem',    // 16px
    xl: '1.5rem',  // 24px
    '2xl': '2rem', // 32px
    '3xl': '3rem', // 48px
  },

  // Border Radius
  radius: {
    sm: '0.5rem',  // 8px
    md: '0.75rem', // 12px
    lg: '1rem',    // 16px
    xl: '1.5rem',  // 24px
    '2xl': '2rem', // 32px
    full: '9999px',
  },

  // Typography
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
  },

  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Shadows
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glow: '0 0 20px rgba(59, 130, 246, 0.5)',
    float: '0 20px 40px -12px rgba(0, 0, 0, 0.25)',
    depth: '0 32px 64px -12px rgba(0, 0, 0, 0.4)',
  },

  // Transitions
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Glass morphism
  glass: {
    bg: 'rgba(255, 255, 255, 0.1)',
    bgHover: 'rgba(255, 255, 255, 0.15)',
    bgActive: 'rgba(255, 255, 255, 0.2)',
    border: 'rgba(255, 255, 255, 0.2)',
    borderHover: 'rgba(255, 255, 255, 0.3)',
    backdrop: 'blur(12px)',
    backdropStrong: 'blur(20px)',
  },

  // Z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
} as const

export type DesignTokens = typeof designTokens

// Component-specific design patterns
export const componentPatterns = {
  // Glass morphism base classes
  glassBase: `
    backdrop-blur-md border border-white/20 
    transition-all duration-300 
    bg-white/5 hover:bg-white/10
  `,
  
  // Interactive glass elements
  glassInteractive: `
    backdrop-blur-md border border-white/20 
    transition-all duration-300 
    bg-white/5 hover:bg-white/10 hover:border-white/30
    hover:shadow-lg hover:shadow-white/10
    active:scale-95
  `,

  // Focus styles
  focusRing: `
    focus:outline-none focus:ring-2 focus:ring-blue-500/30 
    focus:border-blue-400/50
  `,

  // Loading spinner
  spinner: `
    w-4 h-4 border-2 border-current border-t-transparent 
    rounded-full animate-spin
  `,

  // Gradient backgrounds
  gradientPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600',
  gradientSecondary: 'bg-gradient-to-r from-slate-600 to-slate-700',
  gradientSuccess: 'bg-gradient-to-r from-green-600 to-emerald-600',
  gradientWarning: 'bg-gradient-to-r from-yellow-600 to-orange-600',
  gradientDanger: 'bg-gradient-to-r from-red-600 to-rose-600',
} as const

export type ComponentPatterns = typeof componentPatterns
