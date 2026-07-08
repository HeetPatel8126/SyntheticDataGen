'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

export default function SignupPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await register({ email, password, full_name: fullName })
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        className="min-h-screen bg-[#ebebeb] flex flex-col items-center justify-center p-4 md:p-8 relative"
      >
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-black hover:opacity-70 transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22H22L12 2Z" fill="black" />
            </svg>
            Synth
          </Link>
        </div>

        <div className="w-full max-w-md bg-white p-12 border border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-sm">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mb-10 text-center"
          >
            <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4">// GET STARTED</div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-black mb-2 uppercase">
              Sign Up
            </h1>
            <p className="text-gray-500 text-sm">
              Create an account to start generating synthetic data.
            </p>
          </motion.div>

          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            onSubmit={handleSubmit} 
            className="space-y-6"
          >
            {error && (
              <div className="p-4 rounded-sm bg-red-50 border border-red-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-black">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                <Input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe" 
                  className="pl-11 h-12 bg-gray-50 border-black/20 text-black rounded-sm font-mono text-sm transition-all focus:border-black focus:bg-white focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-black">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  className="pl-11 h-12 bg-gray-50 border-black/20 text-black rounded-sm font-mono text-sm transition-all focus:border-black focus:bg-white focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-black">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                <Input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="pl-11 pr-11 h-12 bg-gray-50 border-black/20 text-black rounded-sm font-mono text-sm transition-all focus:border-black focus:bg-white focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-black text-white hover:bg-black/90 rounded-sm font-mono text-[11px] uppercase font-bold tracking-widest transition-all"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Create Account <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </motion.form>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-black font-bold uppercase tracking-tight hover:underline underline-offset-4">
                Log in
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
