'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { useAnimation, AnimationControls } from 'framer-motion'

// ============================================
// SCROLL-TRIGGERED ANIMATION
// ============================================

export function useScrollAnimation(threshold: number = 0.1) {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      controls.start('animate')
    }
  }, [controls, inView])

  return { ref, controls, inView }
}

// ============================================
// COUNTER ANIMATION
// ============================================

export function useCountUp(
  end: number,
  duration: number = 2000,
  startOnView: boolean = true
) {
  const [count, setCount] = useState(0)
  const [ref, inView] = useInView({ triggerOnce: true })
  const countRef = useRef(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (startOnView && !inView) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Ease out cubic
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const currentCount = Math.floor(easeOutCubic * end)
      
      countRef.current = currentCount
      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setIsComplete(true)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, inView, startOnView])

  return { count, ref, isComplete }
}

// ============================================
// MAGNETIC CURSOR EFFECT
// ============================================

export function useMagneticEffect(strength: number = 0.3) {
  const ref = useRef<HTMLElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength

      setPosition({ x: deltaX, y: deltaY })
    },
    [strength]
  )

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  return { ref, position }
}

// ============================================
// MOUSE POSITION
// ============================================

export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return position
}

// ============================================
// ELEMENT MOUSE POSITION (RELATIVE)
// ============================================

export function useRelativeMousePosition() {
  const ref = useRef<HTMLElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isInside, setIsInside] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const handleMouseEnter = () => setIsInside(true)
    const handleMouseLeave = () => setIsInside(false)

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return { ref, position, isInside }
}

// ============================================
// REDUCED MOTION PREFERENCE
// ============================================

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// ============================================
// SCROLL PROGRESS
// ============================================

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = scrollTop / docHeight
      setProgress(Math.min(scrollProgress, 1))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progress
}

// ============================================
// ELEMENT SCROLL PROGRESS
// ============================================

export function useElementScrollProgress() {
  const ref = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleScroll = () => {
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      const elementHeight = rect.height

      // Calculate progress from when element enters viewport to when it leaves
      const start = windowHeight
      const end = -elementHeight
      const current = elementTop
      const totalDistance = start - end
      const currentDistance = start - current

      const scrollProgress = currentDistance / totalDistance
      setProgress(Math.max(0, Math.min(1, scrollProgress)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { ref, progress }
}

// ============================================
// TILT EFFECT
// ============================================

export function useTiltEffect(maxTilt: number = 10) {
  const ref = useRef<HTMLElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const percentX = (e.clientX - centerX) / (rect.width / 2)
      const percentY = (e.clientY - centerY) / (rect.height / 2)

      setTilt({
        x: percentY * maxTilt * -1, // Invert for natural feel
        y: percentX * maxTilt,
      })
    },
    [maxTilt]
  )

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    const element = ref.current
    if (!element) return

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseMove, handleMouseLeave])

  return { ref, tilt }
}

// ============================================
// STAGGER INDEX HELPER
// ============================================

export function useStaggerIndex(baseDelay: number = 0.1) {
  const getDelay = useCallback(
    (index: number) => ({
      initial: "initial",
      animate: "animate",
      transition: { delay: index * baseDelay },
    }),
    [baseDelay]
  )

  return getDelay
}

// ============================================
// TYPEWRITER EFFECT
// ============================================

export function useTypewriter(
  text: string,
  speed: number = 50,
  startOnView: boolean = true
) {
  const [displayText, setDisplayText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [ref, inView] = useInView({ triggerOnce: true })

  useEffect(() => {
    if (startOnView && !inView) return

    let currentIndex = 0
    setDisplayText('')
    setIsComplete(false)

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, inView, startOnView])

  return { displayText, ref, isComplete }
}

// ============================================
// PARALLAX EFFECT
// ============================================

export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      setOffset((scrollProgress - 0.5) * 100 * speed)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return { ref, offset }
}

// ============================================
// SPRING VALUE ANIMATION
// ============================================

export function useSpringValue(
  targetValue: number,
  config: { stiffness?: number; damping?: number } = {}
) {
  const { stiffness = 200, damping = 20 } = config
  const [value, setValue] = useState(targetValue)
  const velocityRef = useRef(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    const animate = () => {
      const delta = targetValue - value
      const spring = delta * (stiffness / 1000)
      velocityRef.current = (velocityRef.current + spring) * (1 - damping / 1000)
      
      if (Math.abs(delta) < 0.01 && Math.abs(velocityRef.current) < 0.01) {
        setValue(targetValue)
        return
      }

      setValue(v => v + velocityRef.current)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [targetValue, stiffness, damping, value])

  return value
}
