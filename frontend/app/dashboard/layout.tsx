'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { 
  LayoutDashboard, 
  Sparkles, 
  History, 
  FileText, 
  Settings, 
  Database,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
  LogOut,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Toaster } from "sonner"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "purple" },
  { name: "Generate Data", href: "/dashboard/generate", icon: Sparkles, color: "yellow" },
  { name: "History", href: "/dashboard/history", icon: History, color: "blue" },
  { name: "Templates", href: "/dashboard/templates", icon: FileText, color: "green" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, color: "gray" },
]

function NavItem({ item, isActive, onClick }: { item: typeof navigation[0], isActive: boolean, onClick?: () => void }) {
  return (
    <Link href={item.href} onClick={onClick}>
      <motion.div
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all relative group",
          isActive
            ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/10 text-white"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        )}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeNav"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
        
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={cn(
            "p-2 rounded-lg transition-colors",
            isActive 
              ? "bg-purple-500/20 text-purple-400" 
              : "text-gray-400 group-hover:text-white group-hover:bg-white/5"
          )}
        >
          <item.icon className="w-5 h-5" />
        </motion.div>
        
        <span className="flex-1">{item.name}</span>
        
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ChevronRight className="w-4 h-4 text-purple-400" />
          </motion.div>
        )}
      </motion.div>
    </Link>
  )
}

function UserProfile() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout, isLoading } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  const displayName = user?.full_name || user?.email?.split('@')[0] || 'User'
  const displayEmail = user?.email || 'user@example.com'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors"
      >
        <div className="relative">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/20">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111111]" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium truncate">{displayName}</p>
          <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl"
          >
            <Link href="/dashboard/settings" onClick={() => setIsOpen(false)}>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <User className="w-4 h-4" />
                Profile
              </button>
            </Link>
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              {isLoggingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Toaster 
        theme="dark" 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
          },
        }}
      />

      {/* Sidebar for desktop */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="hidden md:fixed md:inset-y-0 md:flex md:w-72 md:flex-col"
      >
        <div className="flex flex-col flex-grow border-r border-white/10 bg-[#111111] overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-white/10">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-lg shadow-purple-500/20"
              >
                <Database className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <span className="text-xl font-heading font-bold">SynthData</span>
                <p className="text-xs text-gray-500">Data Generator</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Main Menu
            </p>
            {navigation.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <NavItem 
                  item={item} 
                  isActive={pathname === item.href}
                />
              </motion.div>
            ))}
          </nav>

          {/* Usage card */}
          <div className="px-4 py-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Usage this month</span>
                <span className="text-xs text-purple-400">Pro Plan</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '45%' }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                />
              </div>
              <p className="text-xs text-gray-400">45,000 / 100,000 records</p>
            </motion.div>
          </div>

          {/* User profile */}
          <div className="px-4 py-4 border-t border-white/10">
            <UserProfile />
          </div>
        </div>
      </motion.aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-[#111111] border-r border-white/10 md:hidden"
            >
              <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
                <Link href="/" className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-heading font-bold">SynthData</span>
                </Link>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
              <nav className="px-4 py-6 space-y-1">
                {navigation.map((item) => (
                  <NavItem
                    key={item.name}
                    item={item}
                    isActive={pathname === item.href}
                    onClick={() => setSidebarOpen(false)}
                  />
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="md:pl-72 flex flex-col flex-1">
        {/* Top bar */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="sticky top-0 z-40 flex h-16 flex-shrink-0 items-center gap-4 border-b border-white/10 bg-[#111111]/80 backdrop-blur-xl px-6"
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Search bar */}
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-10 pl-10 pr-4 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-gray-500 bg-white/5 rounded">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
              </Button>
            </motion.div>

            {/* Quick generate */}
            <Link href="/dashboard/generate">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="gradient" size="sm" className="hidden sm:flex gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
