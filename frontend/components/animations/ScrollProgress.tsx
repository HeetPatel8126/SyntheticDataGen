'use client'

import { motion, useScroll, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ScrollProgressProps {
  className?: string
  color?: string
  height?: number
  position?: 'top' | 'bottom'
}

export function ScrollProgress({
  className = '',
  color = 'bg-gradient-to-r from-purple-500 to-indigo-500',
  height = 3,
  position = 'top',
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className={cn(
        'fixed left-0 right-0 z-50 origin-left',
        position === 'top' ? 'top-0' : 'bottom-0',
        color,
        className
      )}
      style={{
        scaleX,
        height,
      }}
    />
  )
}

// ============================================
// SCROLL INDICATOR
// ============================================

interface ScrollIndicatorProps {
  className?: string
}

export function ScrollIndicator({ className = '' }: ScrollIndicatorProps) {
  return (
    <motion.div
      className={cn(
        'flex flex-col items-center gap-2 text-muted-foreground',
        className
      )}
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <span className="text-sm">Scroll</span>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M19 12l-7 7-7-7" />
      </svg>
    </motion.div>
  )
}

// ============================================
// MOUSE SCROLL INDICATOR
// ============================================

interface MouseScrollIndicatorProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function MouseScrollIndicator({
  className = '',
  size = 'md',
}: MouseScrollIndicatorProps) {
  const sizes = {
    sm: { width: 20, height: 32 },
    md: { width: 26, height: 40 },
    lg: { width: 32, height: 48 },
  }

  const { width, height } = sizes[size]

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 26 40"
        fill="none"
        className="text-muted-foreground"
      >
        <rect
          x="1"
          y="1"
          width="24"
          height="38"
          rx="12"
          stroke="currentColor"
          strokeWidth="2"
        />
        <motion.circle
          cx="13"
          cy="12"
          r="3"
          fill="currentColor"
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </svg>
      <motion.span
        className="text-xs text-muted-foreground"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Scroll down
      </motion.span>
    </div>
  )
}

// ============================================
// SECTION INDICATOR
// ============================================

interface SectionIndicatorProps {
  sections: string[]
  currentSection: number
  className?: string
  onSectionClick?: (index: number) => void
}

export function SectionIndicator({
  sections,
  currentSection,
  className = '',
  onSectionClick,
}: SectionIndicatorProps) {
  return (
    <div
      className={cn(
        'fixed right-6 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-3',
        className
      )}
    >
      {sections.map((section, index) => (
        <button
          key={section}
          onClick={() => onSectionClick?.(index)}
          className="group flex items-center gap-2"
        >
          <motion.span
            className={cn(
              'text-xs opacity-0 transition-opacity group-hover:opacity-100',
              currentSection === index
                ? 'text-foreground'
                : 'text-muted-foreground'
            )}
          >
            {section}
          </motion.span>
          <motion.div
            className={cn(
              'h-2 rounded-full transition-all',
              currentSection === index
                ? 'w-6 bg-purple-500'
                : 'w-2 bg-muted hover:bg-purple-500/50'
            )}
            layout
          />
        </button>
      ))}
    </div>
  )
}
