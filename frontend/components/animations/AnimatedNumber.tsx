'use client'

import { useEffect, useRef } from 'react'
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface AnimatedNumberProps {
  value: number
  duration?: number
  className?: string
  format?: (value: number) => string
  prefix?: string
  suffix?: string
}

export function AnimatedNumber({
  value,
  duration = 2,
  className = '',
  format,
  prefix = '',
  suffix = '',
}: AnimatedNumberProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  })
  
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  })
  
  const display = useTransform(springValue, (latest) => {
    const rounded = Math.round(latest)
    if (format) return format(rounded)
    return rounded.toLocaleString()
  })

  useEffect(() => {
    if (inView) {
      motionValue.set(value)
    }
  }, [inView, motionValue, value])

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

// Alternative with percentage support
interface AnimatedPercentageProps {
  value: number
  decimals?: number
  duration?: number
  className?: string
  showSign?: boolean
}

export function AnimatedPercentage({
  value,
  decimals = 1,
  duration = 1.5,
  className = '',
  showSign = true,
}: AnimatedPercentageProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  })
  
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  })
  
  const display = useTransform(springValue, (latest) => {
    const formatted = latest.toFixed(decimals)
    const sign = showSign && latest > 0 ? '+' : ''
    return `${sign}${formatted}%`
  })

  useEffect(() => {
    if (inView) {
      motionValue.set(value)
    }
  }, [inView, motionValue, value])

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  )
}
