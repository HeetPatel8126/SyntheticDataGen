'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  speed?: number
  direction?: 'up' | 'down'
}

export function ParallaxSection({
  children,
  className = '',
  speed = 0.5,
  direction = 'up',
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const multiplier = direction === 'up' ? -1 : 1
  const y = useTransform(scrollYProgress, [0, 1], [0, 200 * speed * multiplier])

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  )
}

// ============================================
// PARALLAX LAYERS
// ============================================

interface ParallaxLayersProps {
  layers: {
    content: ReactNode
    speed: number
    zIndex?: number
  }[]
  className?: string
  height?: string
}

export function ParallaxLayers({
  layers,
  className = '',
  height = '100vh',
}: ParallaxLayersProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  return (
    <div ref={ref} className={cn('relative', className)} style={{ height }}>
      {layers.map((layer, index) => {
        const y = useTransform(
          scrollYProgress,
          [0, 1],
          [0, -200 * layer.speed]
        )
        
        return (
          <motion.div
            key={index}
            className="absolute inset-0"
            style={{ y, zIndex: layer.zIndex || index }}
          >
            {layer.content}
          </motion.div>
        )
      })}
    </div>
  )
}

// ============================================
// PARALLAX IMAGE
// ============================================

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
  speed?: number
}

export function ParallaxImage({
  src,
  alt,
  className = '',
  containerClassName = '',
  speed = 0.3,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.1, 1])

  return (
    <div ref={ref} className={cn('relative overflow-hidden', containerClassName)}>
      <motion.img
        src={src}
        alt={alt}
        className={cn('w-full h-full object-cover', className)}
        style={{ y, scale }}
      />
    </div>
  )
}

// ============================================
// PARALLAX TEXT
// ============================================

interface ParallaxTextProps {
  children: ReactNode
  className?: string
  speed?: number
  opacity?: boolean
}

export function ParallaxText({
  children,
  className = '',
  speed = 0.5,
  opacity = true,
}: ParallaxTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed])
  const opacityValue = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])

  return (
    <div ref={ref} className={cn('relative', className)}>
      <motion.div
        style={{
          y,
          opacity: opacity ? opacityValue : 1,
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
