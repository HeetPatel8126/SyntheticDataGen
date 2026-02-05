'use client'

import { motion, useAnimationFrame } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface FloatingElementProps {
  children: ReactNode
  className?: string
  amplitude?: number
  frequency?: number
  delay?: number
}

export function FloatingElement({
  children,
  className = '',
  amplitude = 10,
  frequency = 2,
  delay = 0,
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0],
      }}
      transition={{
        duration: frequency,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// FLOATING 3D CARD
// ============================================

interface Floating3DCardProps {
  children: ReactNode
  className?: string
}

export function Floating3DCard({ children, className = '' }: Floating3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rotationRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })

  useAnimationFrame(() => {
    if (!cardRef.current) return

    // Smooth interpolation
    rotationRef.current.x += (targetRef.current.x - rotationRef.current.x) * 0.1
    rotationRef.current.y += (targetRef.current.y - rotationRef.current.y) * 0.1

    cardRef.current.style.transform = `
      perspective(1000px)
      rotateX(${rotationRef.current.x}deg)
      rotateY(${rotationRef.current.y}deg)
    `
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    targetRef.current = {
      x: ((e.clientY - centerY) / (rect.height / 2)) * -5,
      y: ((e.clientX - centerX) / (rect.width / 2)) * 5,
    }
  }

  const handleMouseLeave = () => {
    targetRef.current = { x: 0, y: 0 }
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn('transition-shadow duration-300', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ y: 0 }}
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// ORBITING ELEMENTS
// ============================================

interface OrbitingElementsProps {
  items: ReactNode[]
  centerElement?: ReactNode
  radius?: number
  speed?: number
  className?: string
}

export function OrbitingElements({
  items,
  centerElement,
  radius = 100,
  speed = 20,
  className = '',
}: OrbitingElementsProps) {
  return (
    <div className={cn('relative', className)} style={{ width: radius * 2, height: radius * 2 }}>
      {/* Center element */}
      {centerElement && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {centerElement}
        </div>
      )}
      {/* Orbiting elements */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, index) => {
          const angle = (360 / items.length) * index
          return (
            <motion.div
              key={index}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `rotate(${angle}deg) translateY(-${radius}px)`,
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
            >
              {item}
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

// ============================================
// FLOATING PARTICLES
// ============================================

interface FloatingParticlesProps {
  count?: number
  className?: string
  color?: string
  minSize?: number
  maxSize?: number
}

export function FloatingParticles({
  count = 20,
  className = '',
  color = 'bg-purple-500/20',
  minSize = 4,
  maxSize = 12,
}: FloatingParticlesProps) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * (maxSize - minSize) + minSize,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }))

  return (
    <div className={cn('absolute inset-0 overflow-hidden', className)}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={cn('absolute rounded-full', color)}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ============================================
// BOUNCING ELEMENT
// ============================================

interface BouncingElementProps {
  children: ReactNode
  className?: string
  height?: number
}

export function BouncingElement({
  children,
  className = '',
  height = 20,
}: BouncingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -height, 0],
      }}
      transition={{
        duration: 0.6,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  )
}
