'use client'

import { motion, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
}

export function FadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 20,
}: FadeInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance }
      case 'down':
        return { y: -distance }
      case 'left':
        return { x: distance }
      case 'right':
        return { x: -distance }
      default:
        return {}
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...getInitialPosition() }}
      animate={{ opacity: 1, x: 0, y: 0 }}
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

interface FadeInWhenVisibleProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  distance?: number
  threshold?: number
  once?: boolean
}

export function FadeInWhenVisible({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  direction = 'up',
  distance = 30,
  threshold = 0.1,
  once = true,
}: FadeInWhenVisibleProps) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  })

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance }
      case 'down':
        return { y: -distance }
      case 'left':
        return { x: distance }
      case 'right':
        return { x: -distance }
      default:
        return {}
    }
  }

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Scale variant
interface ScaleInWhenVisibleProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  scale?: number
  threshold?: number
  once?: boolean
}

export function ScaleInWhenVisible({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  scale = 0.9,
  threshold = 0.1,
  once = true,
}: ScaleInWhenVisibleProps) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale }}
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
