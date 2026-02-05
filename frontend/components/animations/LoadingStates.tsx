'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ============================================
// LOADING SPINNER
// ============================================

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: string
}

export function LoadingSpinner({
  size = 'md',
  className = '',
  color = 'text-purple-500',
}: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }

  return (
    <svg
      className={cn('animate-spin', sizes[size], color, className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

// ============================================
// LOADING DOTS
// ============================================

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  color?: string
}

export function LoadingDots({
  size = 'md',
  className = '',
  color = 'bg-purple-500',
}: LoadingDotsProps) {
  const sizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
  }

  const gaps = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  }

  return (
    <div className={cn('flex items-center', gaps[size], className)}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={cn('rounded-full', sizes[size], color)}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  )
}

// ============================================
// LOADING BAR
// ============================================

interface LoadingBarProps {
  className?: string
  color?: string
  height?: number
}

export function LoadingBar({
  className = '',
  color = 'bg-purple-500',
  height = 3,
}: LoadingBarProps) {
  return (
    <div
      className={cn('fixed top-0 left-0 right-0 z-50 overflow-hidden', className)}
      style={{ height }}
    >
      <motion.div
        className={cn('h-full', color)}
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: 'easeInOut',
        }}
        style={{ width: '50%' }}
      />
    </div>
  )
}

// ============================================
// SKELETON
// ============================================

interface SkeletonProps {
  className?: string
  variant?: 'default' | 'circular' | 'rounded'
  width?: number | string
  height?: number | string
}

export function Skeleton({
  className = '',
  variant = 'default',
  width,
  height,
}: SkeletonProps) {
  const variants = {
    default: 'rounded',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-muted',
        variants[variant],
        className
      )}
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
        }}
        animate={{ translateX: ['calc(-100%)', 'calc(100%)'] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

// ============================================
// PULSE SKELETON
// ============================================

interface PulseSkeletonProps {
  className?: string
}

export function PulseSkeleton({ className = '' }: PulseSkeletonProps) {
  return (
    <motion.div
      className={cn('rounded bg-muted', className)}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

// ============================================
// LOADING OVERLAY
// ============================================

interface LoadingOverlayProps {
  isLoading: boolean
  className?: string
  blur?: boolean
}

export function LoadingOverlay({
  isLoading,
  className = '',
  blur = true,
}: LoadingOverlayProps) {
  if (!isLoading) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        'absolute inset-0 z-50 flex items-center justify-center bg-background/80',
        blur && 'backdrop-blur-sm',
        className
      )}
    >
      <LoadingSpinner size="lg" />
    </motion.div>
  )
}
