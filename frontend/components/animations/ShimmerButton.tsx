'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ShimmerButtonProps {
  children: ReactNode
  className?: string
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  background?: string
  onClick?: () => void
  disabled?: boolean
}

export function ShimmerButton({
  children,
  className = '',
  shimmerColor = 'rgba(255, 255, 255, 0.2)',
  shimmerSize = '0.1em',
  borderRadius = '0.5rem',
  background = 'linear-gradient(135deg, rgba(139, 92, 246, 1), rgba(99, 102, 241, 1))',
  onClick,
  disabled = false,
}: ShimmerButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative inline-flex items-center justify-center overflow-hidden px-6 py-3 font-medium text-white transition-all',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={{ borderRadius, background }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <span className="relative z-10">{children}</span>
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
        }}
        animate={{
          translateX: ['calc(-100%)', 'calc(100%)'],
        }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: 2,
          ease: 'linear',
          repeatDelay: 1,
        }}
      />
    </motion.button>
  )
}

// ============================================
// GLOW BUTTON
// ============================================

interface GlowButtonProps {
  children: ReactNode
  className?: string
  glowColor?: string
  onClick?: () => void
  disabled?: boolean
}

export function GlowButton({
  children,
  className = '',
  glowColor = 'rgba(139, 92, 246, 0.5)',
  onClick,
  disabled = false,
}: GlowButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 font-medium text-white',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <span className="relative z-10">{children}</span>
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0"
        style={{ boxShadow: `0 0 40px ${glowColor}` }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: disabled ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  )
}

// ============================================
// RIPPLE BUTTON
// ============================================

interface RippleButtonProps {
  children: ReactNode
  className?: string
  rippleColor?: string
  onClick?: () => void
  disabled?: boolean
}

export function RippleButton({
  children,
  className = '',
  rippleColor = 'rgba(255, 255, 255, 0.3)',
  onClick,
  disabled = false,
}: RippleButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return
    
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const ripple = document.createElement('span')
    const diameter = Math.max(rect.width, rect.height)
    const radius = diameter / 2
    
    ripple.style.width = ripple.style.height = `${diameter}px`
    ripple.style.left = `${e.clientX - rect.left - radius}px`
    ripple.style.top = `${e.clientY - rect.top - radius}px`
    ripple.style.position = 'absolute'
    ripple.style.borderRadius = '50%'
    ripple.style.backgroundColor = rippleColor
    ripple.style.transform = 'scale(0)'
    ripple.style.animation = 'ripple 0.6s linear'
    ripple.style.pointerEvents = 'none'
    
    button.appendChild(ripple)
    
    setTimeout(() => ripple.remove(), 600)
    onClick?.()
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 px-6 py-3 font-medium text-white',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {children}
    </motion.button>
  )
}

// ============================================
// GRADIENT BORDER BUTTON
// ============================================

interface GradientBorderButtonProps {
  children: ReactNode
  className?: string
  gradientColors?: string[]
  onClick?: () => void
  disabled?: boolean
}

export function GradientBorderButton({
  children,
  className = '',
  gradientColors = ['#8B5CF6', '#6366F1', '#3B82F6'],
  onClick,
  disabled = false,
}: GradientBorderButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative inline-flex items-center justify-center overflow-hidden rounded-lg p-[2px]',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      style={{
        background: `linear-gradient(135deg, ${gradientColors.join(', ')})`,
      }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <span className="relative z-10 inline-flex items-center justify-center rounded-[calc(0.5rem-2px)] bg-background px-6 py-3 font-medium text-foreground">
        {children}
      </span>
    </motion.button>
  )
}
