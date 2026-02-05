'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'

interface RevealSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  duration?: number
  once?: boolean
}

export function RevealSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 50,
  duration = 0.6,
  once = true,
}: RevealSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.2,
  })

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance }
      case 'down': return { y: -distance }
      case 'left': return { x: distance }
      case 'right': return { x: -distance }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...getInitialPosition() }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// REVEAL WITH MASK
// ============================================

interface RevealMaskProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function RevealMask({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  direction = 'up',
}: RevealMaskProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })

  const getClipPath = (revealed: boolean) => {
    switch (direction) {
      case 'up':
        return revealed ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)'
      case 'down':
        return revealed ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)'
      case 'left':
        return revealed ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)'
      case 'right':
        return revealed ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)'
    }
  }

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      <motion.div
        initial={{ clipPath: getClipPath(false) }}
        animate={{ clipPath: inView ? getClipPath(true) : getClipPath(false) }}
        transition={{
          duration,
          delay,
          ease: [0.77, 0, 0.175, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

// ============================================
// SCROLL-TRIGGERED REVEAL
// ============================================

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  scrub?: boolean
}

export function ScrollReveal({
  children,
  className = '',
  scrub = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1])
  const y = useTransform(scrollYProgress, [0, 1], [100, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1])

  if (!scrub) {
    return (
      <RevealSection className={className}>
        {children}
      </RevealSection>
    )
  }

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ============================================
// SPLIT TEXT REVEAL
// ============================================

interface SplitRevealProps {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  stagger?: number
}

export function SplitReveal({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.05,
}: SplitRevealProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const words = text.split(' ')

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
          <motion.span
            className={cn('inline-block', wordClassName)}
            initial={{ y: '100%' }}
            animate={inView ? { y: 0 } : { y: '100%' }}
            transition={{
              duration: 0.5,
              delay: delay + i * stagger,
              ease: [0.25, 0.4, 0.25, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  )
}
