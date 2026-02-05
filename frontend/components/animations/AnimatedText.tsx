'use client'

import { motion, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ReactNode } from 'react'

// ============================================
// ANIMATED TEXT (LINE BY LINE)
// ============================================

interface AnimatedTextProps {
  text: string | string[]
  className?: string
  delay?: number
  once?: boolean
}

export function AnimatedText({ 
  text, 
  className = '', 
  delay = 0,
  once = true 
}: AnimatedTextProps) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.1,
  })

  const lines = Array.isArray(text) ? text : [text]

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay,
      },
    },
  }

  const child: Variants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
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
      {lines.map((line, index) => (
        <motion.span key={index} variants={child} className="block">
          {line}
        </motion.span>
      ))}
    </motion.div>
  )
}

// ============================================
// ANIMATED WORDS
// ============================================

interface AnimatedWordsProps {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  staggerDelay?: number
  once?: boolean
}

export function AnimatedWords({
  text,
  className = '',
  wordClassName = '',
  delay = 0,
  staggerDelay = 0.05,
  once = true,
}: AnimatedWordsProps) {
  const [ref, inView] = useInView({
    triggerOnce: once,
    threshold: 0.1,
  })

  const words = text.split(' ')

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

  const child: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  }

  return (
    <motion.span
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          className={`inline-block ${wordClassName}`}
          style={{ marginRight: '0.25em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

// ============================================
// ANIMATED LETTERS
// ============================================

interface AnimatedLettersProps {
  text: string
  className?: string
  letterClassName?: string
  delay?: number
  staggerDelay?: number
  once?: boolean
}

export function AnimatedLetters({
  text,
  className = '',
  letterClassName = '',
  delay = 0,
  staggerDelay = 0.02,
  once = true,
}: AnimatedLettersProps) {
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

  const child: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.span
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={child}
          className={`inline-block ${letterClassName}`}
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  )
}

// ============================================
// GRADIENT TEXT
// ============================================

interface GradientTextProps {
  children: ReactNode
  className?: string
  gradient?: string
  animate?: boolean
}

export function GradientText({
  children,
  className = '',
  gradient = 'from-purple-400 via-pink-500 to-indigo-400',
  animate = true,
}: GradientTextProps) {
  return (
    <span
      className={`bg-clip-text text-transparent bg-gradient-to-r ${gradient} ${
        animate ? 'animate-gradient-shift bg-[length:200%_auto]' : ''
      } ${className}`}
    >
      {children}
    </span>
  )
}
