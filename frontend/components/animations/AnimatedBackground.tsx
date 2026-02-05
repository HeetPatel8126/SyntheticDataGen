'use client'

import { useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedBackgroundProps {
  className?: string
  variant?: 'grid' | 'dots' | 'waves' | 'gradient'
  interactive?: boolean
}

export function AnimatedBackground({
  className = '',
  variant = 'grid',
  interactive = true,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrame: number
    let particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
    }> = []

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const createParticles = () => {
      particles = []
      const count = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
        })
      }
    }

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)'
      ctx.lineWidth = 1

      const gridSize = 50
      const offsetX = interactive ? (mouseRef.current.x / canvas.width - 0.5) * 20 : 0
      const offsetY = interactive ? (mouseRef.current.y / canvas.height - 0.5) * 20 : 0

      for (let x = offsetX % gridSize; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = offsetY % gridSize; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }
    }

    const drawDots = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`
        ctx.fill()

        // Connect nearby particles
        particles.forEach((other) => {
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance / 100)})`
            ctx.stroke()
          }
        })
      })
    }

    const drawWaves = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const time = Date.now() / 1000

      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)

        for (let x = 0; x < canvas.width; x += 5) {
          const y =
            canvas.height / 2 +
            Math.sin((x / 100 + time + i) * 2) * 50 +
            Math.sin((x / 50 + time * 2) * 2) * 25
          ctx.lineTo(x, y)
        }

        ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 - i * 0.03})`
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    const drawGradient = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const time = Date.now() / 2000

      const gradient = ctx.createRadialGradient(
        canvas.width / 2 + Math.sin(time) * 100,
        canvas.height / 2 + Math.cos(time) * 100,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      )

      gradient.addColorStop(0, 'rgba(139, 92, 246, 0.2)')
      gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.1)')
      gradient.addColorStop(1, 'transparent')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const animate = () => {
      switch (variant) {
        case 'grid':
          drawGrid()
          break
        case 'dots':
          drawDots()
          break
        case 'waves':
          drawWaves()
          break
        case 'gradient':
          drawGradient()
          break
      }
      animationFrame = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    resize()
    createParticles()
    animate()

    window.addEventListener('resize', resize)
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [variant, interactive])

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

// ============================================
// GRADIENT ORB
// ============================================

interface GradientOrbProps {
  className?: string
  size?: number
  color?: string
}

export function GradientOrb({
  className = '',
  size = 400,
  color = 'rgba(139, 92, 246, 0.3)',
}: GradientOrbProps) {
  return (
    <div
      className={cn('absolute rounded-full blur-3xl animate-pulse', className)}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
    />
  )
}
