'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Check,
  AlertCircle,
  Loader2,
  Github,
  Chrome,
  Shield,
  Zap,
  Database,
  FileJson
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

// Floating particles background
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute rounded-full blur-3xl opacity-20",
            i % 3 === 0 ? "bg-purple-500" : i % 3 === 1 ? "bg-indigo-500" : "bg-blue-500"
          )}
          style={{
            width: Math.random() * 400 + 200,
            height: Math.random() * 400 + 200,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

// Animated input field
function AnimatedInput({
  label,
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  showPasswordToggle,
}: {
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  icon: React.ElementType
  error?: string
  showPasswordToggle?: boolean
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-2"
    >
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="relative">
        <Icon
          className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200",
            isFocused ? "text-purple-400" : "text-gray-500",
            error && "text-red-400"
          )}
        />
        <motion.div
          animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Input
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              "pl-12 pr-12 h-14 text-base bg-white/5 border-white/10 rounded-xl",
              "transition-all duration-200",
              "focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
              error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
            )}
          />
        </motion.div>
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        
        {/* Focus glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={isFocused ? {
            boxShadow: "0 0 0 4px rgba(139, 92, 246, 0.15), 0 0 40px rgba(139, 92, 246, 0.1)"
          } : {
            boxShadow: "0 0 0 0px rgba(139, 92, 246, 0)"
          }}
          transition={{ duration: 0.2 }}
        />
      </div>
      
      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="text-sm text-red-400 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Password strength indicator
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "At least 8 characters", check: password.length >= 8 },
    { label: "Contains uppercase", check: /[A-Z]/.test(password) },
    { label: "Contains number", check: /\d/.test(password) },
    { label: "Contains special char", check: /[!@#$%^&*]/.test(password) },
  ]
  
  const strength = checks.filter(c => c.check).length

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="space-y-3"
    >
      {/* Strength bar */}
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((level) => (
          <motion.div
            key={level}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              level <= strength
                ? strength === 1 ? "bg-red-500"
                : strength === 2 ? "bg-yellow-500"
                : strength === 3 ? "bg-blue-500"
                : "bg-green-500"
                : "bg-white/10"
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: level <= strength ? 1 : 1 }}
            transition={{ delay: level * 0.1 }}
          />
        ))}
      </div>
      
      {/* Checks list */}
      <div className="grid grid-cols-2 gap-2">
        {checks.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2 text-xs"
          >
            <motion.div
              animate={item.check ? { scale: [1, 1.2, 1] } : {}}
              className={cn(
                "w-4 h-4 rounded-full flex items-center justify-center",
                item.check ? "bg-green-500/20" : "bg-white/5"
              )}
            >
              {item.check && <Check className="w-3 h-3 text-green-400" />}
            </motion.div>
            <span className={item.check ? "text-green-400" : "text-gray-500"}>
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Sign up button with states
function SignUpButton({ 
  onClick, 
  isLoading, 
  isSuccess 
}: { 
  onClick: () => void
  isLoading: boolean
  isSuccess: boolean 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <motion.button
        onClick={onClick}
        disabled={isLoading || isSuccess}
        className={cn(
          "w-full h-14 rounded-xl font-semibold text-base",
          "flex items-center justify-center gap-3",
          "transition-all duration-300",
          isSuccess
            ? "bg-green-500 text-white"
            : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
          "hover:shadow-lg hover:shadow-purple-500/25",
          "disabled:opacity-70 disabled:cursor-not-allowed"
        )}
        whileHover={!isLoading && !isSuccess ? { scale: 1.02 } : {}}
        whileTap={!isLoading && !isSuccess ? { scale: 0.98 } : {}}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating account...</span>
            </motion.div>
          ) : isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Check className="w-5 h-5" />
              </motion.div>
              <span>Account created!</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-center gap-2"
            >
              <span>Create Account</span>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}

// Social login buttons
function SocialLogins() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-4"
    >
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-black text-gray-500">or sign up with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-3 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
        >
          <Github className="w-5 h-5" />
          <span>GitHub</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-3 h-12 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all"
        >
          <Chrome className="w-5 h-5" />
          <span>Google</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function SignUpPage() {
  const router = useRouter()
  const { register, isAuthenticated } = useAuth()
  
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [errors, setErrors] = useState<{ 
    fullName?: string
    email?: string
    password?: string
    confirmPassword?: string
    terms?: string
    general?: string 
  }>({})

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const validateForm = () => {
    const newErrors: typeof errors = {}
    
    if (!fullName.trim()) {
      newErrors.fullName = "Name is required"
    }
    
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address"
    }
    
    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    
    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})
    
    try {
      await register({ email, password, full_name: fullName })
      setIsSuccess(true)
      
      // Redirect after success animation
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } catch (error: any) {
      setErrors({ 
        general: error.message || "Failed to create account" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left side - Feature showcase */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-r border-white/10 relative overflow-hidden">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 max-w-lg"
        >
          {/* Welcome text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-4xl font-bold mb-4">
              Start generating
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
                realistic data
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Join thousands of developers and data scientists using SynthData
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="space-y-4">
            {[
              { icon: Database, title: "1M+ Records", desc: "Generate massive datasets instantly" },
              { icon: FileJson, title: "Multiple Formats", desc: "CSV, JSON, SQL and more" },
              { icon: Zap, title: "Lightning Fast", desc: "Parallel processing engine" },
              { icon: Shield, title: "Secure & Private", desc: "Your data never leaves your account" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-purple-500/30">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <p className="text-gray-300 italic mb-4">
              "SynthData has completely transformed our testing workflow. We can now generate
              realistic test data in seconds instead of hours."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500" />
              <div>
                <p className="font-medium">Sarah Chen</p>
                <p className="text-sm text-gray-500">Lead Engineer at TechCorp</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-y-auto">
        <FloatingOrbs />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10 py-8"
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">SynthData</span>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold mb-2">Create an account</h1>
            <p className="text-gray-400">
              Get started with your free account today
            </p>
          </motion.div>

          {/* Error message */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400">{errors.general}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <div className="space-y-5" onKeyDown={handleKeyPress}>
            <AnimatedInput
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={setFullName}
              icon={User}
              error={errors.fullName}
            />

            <AnimatedInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              icon={Mail}
              error={errors.email}
            />
            
            <AnimatedInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              icon={Lock}
              error={errors.password}
              showPasswordToggle
            />

            {password && <PasswordStrength password={password} />}

            <AnimatedInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={setConfirmPassword}
              icon={Lock}
              error={errors.confirmPassword}
              showPasswordToggle
            />

            {/* Terms checkbox */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="space-y-2"
            >
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-purple-500/20"
                />
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  I agree to the{" "}
                  <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                    Terms of Service
                  </Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                    Privacy Policy
                  </Link>
                </span>
              </label>
              <AnimatePresence>
                {errors.terms && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm text-red-400 flex items-center gap-1 ml-7"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.terms}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <SignUpButton
              onClick={handleSubmit}
              isLoading={isLoading}
              isSuccess={isSuccess}
            />

            <SocialLogins />
          </div>

          {/* Sign in link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center text-gray-400"
          >
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
