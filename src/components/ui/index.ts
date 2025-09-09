/**
 * TaskFlow UI Component Library
 * 
 * Unified design system with glass morphism + cosmic gradient theme
 * Built with CVA (class-variance-authority) for consistent variants
 * All components follow the same design patterns and behaviors
 */

// Design System Foundation
export * from './design-tokens'

// Core Components
export * from './button'
export * from './input'
export * from './textarea'
export * from './select'

// Layout Components
export * from './card'

// Display Components
export * from './badge'
export * from './avatar'

/**
 * Common Usage Patterns:
 * 
 * Glass Morphism Theme (Default):
 * - All components default to 'glass' variant
 * - Provides consistent backdrop-blur and translucent effects
 * - Perfect for dark cosmic gradient backgrounds
 * 
 * Component Variants:
 * - variant: Controls visual style (glass, solid, outline, etc.)
 * - size: Controls component dimensions (sm, default, lg, xl)
 * - state: Controls validation state (default, error, success, warning)
 * 
 * Interactive States:
 * - All components have consistent hover and focus states
 * - Glass variant includes scale transforms and enhanced shadows
 * - Focus states include blue accent colors and ring effects
 * 
 * Accessibility:
 * - All components are keyboard navigable
 * - Screen reader friendly with proper ARIA attributes
 * - Focus indicators are clearly visible
 * 
 * Example Usage:
 * ```tsx
 * import { Button, Input, Card } from '@/components/ui'
 * 
 * <Card variant="glass" size="lg">
 *   <Input variant="glass" label="Email" type="email" />
 *   <Button variant="primary" size="lg">Submit</Button>
 * </Card>
 * ```
 */
