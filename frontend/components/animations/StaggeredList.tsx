'use client'

import { motion, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ReactNode, Children, isValidElement, cloneElement } from 'react'
import { cn } from '@/lib/utils'

interface StaggeredListProps {
  children: ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  once?: boolean
}

export function StaggeredList({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.1,
  direction = 'up',
  distance = 20,
  once = true,
}: StaggeredListProps) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.1,
  })

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: distance }
      case 'down': return { y: -distance }
      case 'left': return { x: distance }
      case 'right': return { x: -distance }
    }
  }

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  }

  const item: Variants = {
    hidden: { opacity: 0, ...getInitialPosition() },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {Children.map(children, (child, index) => (
        <motion.div key={index} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// ============================================
// STAGGERED GRID
// ============================================

interface StaggeredGridProps {
  children: ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
  once?: boolean
}

export function StaggeredGrid({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.08,
  once = true,
}: StaggeredGridProps) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.1,
  })

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  }

  const item: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {Children.map(children, (child, index) => (
        <motion.div key={index} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

// ============================================
// STAGGERED FADE
// ============================================

interface StaggeredFadeProps {
  children: ReactNode
  className?: string
  delay?: number
  staggerDelay?: number
  once?: boolean
}

export function StaggeredFade({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.15,
  once = true,
}: StaggeredFadeProps) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.1,
  })

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  }

  const item: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6 },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {Children.map(children, (child, index) => (
        <motion.div key={index} variants={item}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
