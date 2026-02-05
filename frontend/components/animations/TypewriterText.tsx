'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { cn } from '@/lib/utils'

interface TypewriterTextProps {
  text: string | string[]
  className?: string
  speed?: number
  delay?: number
  cursor?: boolean
  cursorChar?: string
  onComplete?: () => void
}

export function TypewriterText({
  text,
  className = '',
  speed = 50,
  delay = 0,
  cursor = true,
  cursorChar = '|',
  onComplete,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('')
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [ref, inView] = useInView({ triggerOnce: true })

  const lines = Array.isArray(text) ? text : [text]

  useEffect(() => {
    if (!inView) return

    const timeout = setTimeout(() => {
      if (currentLineIndex < lines.length) {
        const currentLine = lines[currentLineIndex]
        if (currentCharIndex < currentLine.length) {
          setDisplayText((prev) => prev + currentLine[currentCharIndex])
          setCurrentCharIndex((prev) => prev + 1)
        } else if (currentLineIndex < lines.length - 1) {
          setDisplayText((prev) => prev + '\n')
          setCurrentLineIndex((prev) => prev + 1)
          setCurrentCharIndex(0)
        } else {
          setIsComplete(true)
          onComplete?.()
        }
      }
    }, currentCharIndex === 0 && currentLineIndex > 0 ? speed * 5 : speed)

    return () => clearTimeout(timeout)
  }, [inView, currentCharIndex, currentLineIndex, lines, speed, onComplete])

  // Initial delay
  useEffect(() => {
    if (!inView) return
    const timeout = setTimeout(() => {}, delay)
    return () => clearTimeout(timeout)
  }, [inView, delay])

  return (
    <span ref={ref} className={cn('whitespace-pre-wrap', className)}>
      {displayText}
      {cursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        >
          {cursorChar}
        </motion.span>
      )}
    </span>
  )
}

// ============================================
// WORD ROTATOR
// ============================================

interface WordRotatorProps {
  words: string[]
  className?: string
  interval?: number
}

export function WordRotator({
  words,
  className = '',
  interval = 2000,
}: WordRotatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length)
    }, interval)

    return () => clearInterval(timer)
  }, [words.length, interval])

  return (
    <span className={cn('inline-block relative', className)}>
      {words.map((word, index) => (
        <motion.span
          key={word}
          className="absolute left-0"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: currentIndex === index ? 1 : 0,
            y: currentIndex === index ? 0 : currentIndex > index ? -20 : 20,
          }}
          transition={{ duration: 0.3 }}
        >
          {word}
        </motion.span>
      ))}
      {/* Invisible placeholder to maintain width */}
      <span className="invisible">{words.reduce((a, b) => (a.length > b.length ? a : b))}</span>
    </span>
  )
}

// ============================================
// SCRAMBLE TEXT
// ============================================

interface ScrambleTextProps {
  text: string
  className?: string
  duration?: number
  scrambleSpeed?: number
}

export function ScrambleText({
  text,
  className = '',
  duration = 1000,
  scrambleSpeed = 50,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const [ref, inView] = useInView({ triggerOnce: true })
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  useEffect(() => {
    if (!inView) return

    let iteration = 0
    const totalIterations = duration / scrambleSpeed

    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split('')
          .map((char, index) => {
            if (index < iteration / 3) {
              return text[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )

      iteration += 1

      if (iteration >= totalIterations) {
        setDisplayText(text)
        clearInterval(interval)
      }
    }, scrambleSpeed)

    return () => clearInterval(interval)
  }, [inView, text, duration, scrambleSpeed])

  return (
    <span ref={ref} className={cn('font-mono', className)}>
      {displayText}
    </span>
  )
}

// ============================================
// COUNTING TEXT
// ============================================

interface CountingTextProps {
  from?: number
  to: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
}

export function CountingText({
  from = 0,
  to,
  duration = 2,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
}: CountingTextProps) {
  const [count, setCount] = useState(from)
  const [ref, inView] = useInView({ triggerOnce: true })

  useEffect(() => {
    if (!inView) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const current = from + (to - from) * easeOutCubic

      setCount(current)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [inView, from, to, duration])

  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  )
}
