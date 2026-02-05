'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  color?: string
  trackColor?: string
  showPercentage?: boolean
  animate?: boolean
  children?: React.ReactNode
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className = '',
  color = 'url(#gradient)',
  trackColor = 'rgba(255, 255, 255, 0.1)',
  showPercentage = true,
  animate: shouldAnimate = true,
  children,
}: ProgressRingProps) {
  const progressValue = useMotionValue(0)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  
  const strokeDashoffset = useTransform(
    progressValue,
    [0, 100],
    [circumference, 0]
  )

  useEffect(() => {
    if (shouldAnimate) {
      const controls = animate(progressValue, progress, {
        duration: 1,
        ease: 'easeOut',
      })
      return controls.stop
    } else {
      progressValue.set(progress)
    }
  }, [progress, progressValue, shouldAnimate])

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset }}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (showPercentage && (
          <motion.span className="text-2xl font-bold">
            {useTransform(progressValue, (v) => `${Math.round(v)}%`)}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

// ============================================
// PROGRESS BAR
// ============================================

interface ProgressBarProps {
  progress: number
  className?: string
  height?: number
  showPercentage?: boolean
  animate?: boolean
  gradient?: boolean
}

export function ProgressBar({
  progress,
  className = '',
  height = 8,
  showPercentage = false,
  animate: shouldAnimate = true,
  gradient = true,
}: ProgressBarProps) {
  const progressValue = useMotionValue(0)

  useEffect(() => {
    if (shouldAnimate) {
      animate(progressValue, progress, {
        duration: 0.8,
        ease: 'easeOut',
      })
    } else {
      progressValue.set(progress)
    }
  }, [progress, progressValue, shouldAnimate])

  const width = useTransform(progressValue, [0, 100], ['0%', '100%'])

  return (
    <div className={cn('relative', className)}>
      <div
        className="w-full overflow-hidden rounded-full bg-white/10"
        style={{ height }}
      >
        <motion.div
          className={cn(
            'h-full rounded-full',
            gradient
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
              : 'bg-purple-500'
          )}
          style={{ width }}
        />
      </div>
      {showPercentage && (
        <motion.span className="absolute right-0 top-full mt-1 text-sm text-muted-foreground">
          {useTransform(progressValue, (v) => `${Math.round(v)}%`)}
        </motion.span>
      )}
    </div>
  )
}

// ============================================
// STEP PROGRESS
// ============================================

interface StepProgressProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function StepProgress({
  steps,
  currentStep,
  className = '',
}: StepProgressProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => (
        <div key={step} className="flex items-center">
          {/* Step circle */}
          <motion.div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium',
              index < currentStep
                ? 'border-purple-500 bg-purple-500 text-white'
                : index === currentStep
                ? 'border-purple-500 text-purple-500'
                : 'border-muted text-muted-foreground'
            )}
            initial={{ scale: 0.8 }}
            animate={{
              scale: index === currentStep ? 1.1 : 1,
              transition: { type: 'spring', stiffness: 300 },
            }}
          >
            {index < currentStep ? (
              <motion.svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            ) : (
              index + 1
            )}
          </motion.div>
          {/* Step label */}
          <span
            className={cn(
              'ml-2 text-sm',
              index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {step}
          </span>
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div className="mx-4 h-[2px] w-12 bg-muted">
              <motion.div
                className="h-full bg-purple-500"
                initial={{ width: '0%' }}
                animate={{ width: index < currentStep ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
