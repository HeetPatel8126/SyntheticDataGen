'use client'

import { motion, Variants } from 'framer-motion'
import { ReactNode, ComponentType } from 'react'
import { cn } from '@/lib/utils'
import { LucideProps } from 'lucide-react'

interface AnimatedIconProps {
  icon: ComponentType<LucideProps>
  className?: string
  size?: number
  animation?: 'bounce' | 'pulse' | 'spin' | 'shake' | 'scale' | 'none'
  trigger?: 'hover' | 'always' | 'click'
  onClick?: () => void
}

export function AnimatedIcon({
  icon: Icon,
  className = '',
  size = 24,
  animation = 'bounce',
  trigger = 'hover',
  onClick,
}: AnimatedIconProps) {
  const animations: Record<string, Variants> = {
    bounce: {
      initial: { y: 0 },
      animate: { y: [0, -5, 0] },
    },
    pulse: {
      initial: { scale: 1 },
      animate: { scale: [1, 1.1, 1] },
    },
    spin: {
      initial: { rotate: 0 },
      animate: { rotate: 360 },
    },
    shake: {
      initial: { x: 0 },
      animate: { x: [-2, 2, -2, 2, 0] },
    },
    scale: {
      initial: { scale: 1 },
      animate: { scale: 1.2 },
    },
    none: {
      initial: {},
      animate: {},
    },
  }

  const variant = animations[animation]

  const getMotionProps = () => {
    if (trigger === 'always') {
      return {
        initial: 'initial',
        animate: 'animate',
        transition: { repeat: Infinity, duration: 1 },
      }
    }
    if (trigger === 'hover') {
      return {
        initial: 'initial',
        whileHover: 'animate',
        transition: { duration: 0.3 },
      }
    }
    return {
      initial: 'initial',
      whileTap: 'animate',
      transition: { duration: 0.2 },
    }
  }

  return (
    <motion.div
      variants={variant}
      {...getMotionProps()}
      onClick={onClick}
      className={cn('inline-flex', onClick && 'cursor-pointer', className)}
    >
      <Icon size={size} />
    </motion.div>
  )
}

// ============================================
// ICON WITH DRAW ANIMATION
// ============================================

interface DrawIconProps {
  children: ReactNode
  className?: string
  duration?: number
  delay?: number
}

export function DrawIcon({
  children,
  className = '',
  duration = 1,
  delay = 0,
}: DrawIconProps) {
  return (
    <motion.svg
      className={className}
      initial="hidden"
      animate="visible"
    >
      <motion.g
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
              pathLength: { duration, delay, ease: 'easeInOut' },
              opacity: { duration: 0.01 },
            },
          },
        }}
      >
        {children}
      </motion.g>
    </motion.svg>
  )
}

// ============================================
// CHECKMARK ANIMATION
// ============================================

interface CheckmarkProps {
  size?: number
  className?: string
  delay?: number
}

export function AnimatedCheckmark({
  size = 24,
  className = '',
  delay = 0,
}: CheckmarkProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay }}
      />
      <motion.path
        d="M8 12l2.5 2.5L16 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.5 }}
      />
    </motion.svg>
  )
}

// ============================================
// CROSS/X ANIMATION
// ============================================

interface CrossProps {
  size?: number
  className?: string
  delay?: number
}

export function AnimatedCross({
  size = 24,
  className = '',
  delay = 0,
}: CrossProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay }}
      />
      <motion.path
        d="M15 9l-6 6M9 9l6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.5 }}
      />
    </motion.svg>
  )
}

// ============================================
// LOADING ICON
// ============================================

interface LoadingIconProps {
  size?: number
  className?: string
}

export function LoadingIcon({ size = 24, className = '' }: LoadingIconProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </motion.svg>
  )
}
