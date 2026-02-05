'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, MouseEvent, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  radius?: number
  onClick?: () => void
  disabled?: boolean
}

export function MagneticButton({
  children,
  className = '',
  strength = 0.3,
  radius = 100,
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 400, damping: 25 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (disabled || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const distance = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
    )
    
    if (distance < radius) {
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength
      x.set(deltaX)
      y.set(deltaY)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
      style={{ x: xSpring, y: ySpring }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative transition-colors',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </motion.button>
  )
}

// ============================================
// MAGNETIC LINK
// ============================================

interface MagneticLinkProps {
  children: ReactNode
  href: string
  className?: string
  strength?: number
}

export function MagneticLink({
  children,
  href,
  className = '',
  strength = 0.2,
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 400, damping: 25 }
  const xSpring = useSpring(x, springConfig)
  const ySpring = useSpring(y, springConfig)

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    x.set((e.clientX - centerX) * strength)
    y.set((e.clientY - centerY) * strength)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.a>
  )
}
