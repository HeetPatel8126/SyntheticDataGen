'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedBadgeProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'pulse' | 'glow' | 'gradient'
  color?: string
}

export function AnimatedBadge({
  children,
  className = '',
  variant = 'default',
  color = 'purple',
}: AnimatedBadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium'
  
  const variants = {
    default: `bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`,
    pulse: `bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`,
    glow: `bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`,
    gradient: 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-purple-400 border border-purple-500/20',
  }

  if (variant === 'pulse') {
    return (
      <motion.span
        className={cn(baseClasses, variants[variant], className)}
        animate={{
          boxShadow: [
            `0 0 0 0 rgba(139, 92, 246, 0)`,
            `0 0 0 4px rgba(139, 92, 246, 0.2)`,
            `0 0 0 0 rgba(139, 92, 246, 0)`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.span>
    )
  }

  if (variant === 'glow') {
    return (
      <motion.span
        className={cn(baseClasses, variants[variant], className)}
        animate={{
          boxShadow: [
            `0 0 10px rgba(139, 92, 246, 0.2)`,
            `0 0 20px rgba(139, 92, 246, 0.4)`,
            `0 0 10px rgba(139, 92, 246, 0.2)`,
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {children}
      </motion.span>
    )
  }

  return (
    <motion.span
      className={cn(baseClasses, variants[variant], className)}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  )
}

// ============================================
// NOTIFICATION BADGE
// ============================================

interface NotificationBadgeProps {
  count: number
  className?: string
  maxCount?: number
}

export function NotificationBadge({
  count,
  className = '',
  maxCount = 99,
}: NotificationBadgeProps) {
  const displayCount = count > maxCount ? `${maxCount}+` : count

  if (count === 0) return null

  return (
    <motion.span
      className={cn(
        'absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white',
        className
      )}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 15,
      }}
    >
      {displayCount}
    </motion.span>
  )
}

// ============================================
// STATUS BADGE
// ============================================

interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending'
  children: ReactNode
  className?: string
  showDot?: boolean
  animate?: boolean
}

export function StatusBadge({
  status,
  children,
  className = '',
  showDot = true,
  animate = true,
}: StatusBadgeProps) {
  const statusColors = {
    success: { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-400' },
    warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', dot: 'bg-yellow-400' },
    error: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
    info: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
    pending: { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400' },
  }

  const colors = statusColors[status]

  return (
    <motion.span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        colors.bg,
        colors.text,
        className
      )}
      initial={animate ? { opacity: 0, scale: 0.9 } : undefined}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
    >
      {showDot && (
        <motion.span
          className={cn('h-1.5 w-1.5 rounded-full', colors.dot)}
          animate={
            status === 'pending'
              ? {
                  opacity: [1, 0.5, 1],
                  scale: [1, 0.8, 1],
                }
              : undefined
          }
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
      {children}
    </motion.span>
  )
}

// ============================================
// NEW BADGE
// ============================================

interface NewBadgeProps {
  className?: string
}

export function NewBadge({ className = '' }: NewBadgeProps) {
  return (
    <motion.span
      className={cn(
        'inline-flex items-center rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white',
        className
      )}
      animate={{
        boxShadow: [
          '0 0 0 0 rgba(139, 92, 246, 0)',
          '0 0 0 4px rgba(139, 92, 246, 0.2)',
          '0 0 0 0 rgba(139, 92, 246, 0)',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      New
    </motion.span>
  )
}
