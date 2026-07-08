'use client'

import { Link } from "next-view-transitions"
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
  User,
  Store,
  Upload
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Toaster } from "sonner"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "purple" },
  { name: "Generate Data", href: "/dashboard/generate", icon: Sparkles, color: "yellow" },
  { name: "Marketplace", href: "/dashboard/marketplace", icon: Store, color: "orange" },
  { name: "History", href: "/dashboard/history", icon: History, color: "blue" },
  { name: "Templates", href: "/dashboard/templates", icon: FileText, color: "green" },
  { name: "Upload", href: "/dashboard/upload", icon: Upload, color: "cyan" },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, color: "gray" },
]

function NavItem({ item, isActive, onClick }: { item: typeof navigation[0], isActive: boolean, onClick?: () => void }) {
  return (
    <Link href={item.href} onClick={onClick}>
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 text-[11px] font-mono uppercase tracking-widest border-l-2 transition-all relative group cursor-pointer",
          isActive
            ? "border-black bg-black text-white"
            : "border-transparent text-gray-500 hover:text-black hover:bg-black/5"
        )}
      >
        <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-gray-400 group-hover:text-black")} />
        <span className="flex-1">{item.name}</span>
        
        {isActive && (
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        )}
      </div>
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/5 transition-colors border-t border-black/10"
      >
        <div className="w-8 h-8 bg-black flex items-center justify-center text-[10px] font-mono text-white">
          {initials}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[11px] font-mono font-bold uppercase truncate text-black">{displayName}</p>
          <p className="text-[10px] font-mono text-gray-500 truncate">{displayEmail}</p>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 right-0 mb-2 p-2 bg-white border border-black/10 shadow-xl"
          >
            <Link href="/dashboard/settings" onClick={() => setIsOpen(false)}>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-mono uppercase text-gray-600 hover:text-black hover:bg-black/5 transition-colors">
                <User className="w-3.5 h-3.5" />
                Profile
              </button>
            </Link>
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-mono uppercase text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 mt-1"
            >
              <LogOut className="w-3.5 h-3.5" />
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
    <div className="min-h-screen bg-[#ebebeb] text-black">
      <Toaster 
        theme="light" 
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.1)',
            color: '#000',
            borderRadius: '0px',
            fontFamily: 'monospace'
          },
        }}
      />

      {/* Sidebar for desktop */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col z-50">
        <div className="flex flex-col flex-grow border-r border-black/10 bg-[#ebebeb] overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6 py-6 border-b border-black/10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-black flex items-center justify-center rounded-sm">
                <Database className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight uppercase">SynthData</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6">
            <p className="px-6 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-4">
              Main Menu
            </p>
            {navigation.map((item) => (
              <NavItem 
                key={item.name}
                item={item} 
                isActive={pathname === item.href}
              />
            ))}
          </nav>

          {/* Usage card */}
          <div className="px-4 py-6 border-t border-black/10">
            <div className="p-4 bg-white border border-black/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase text-gray-500">Usage</span>
                <span className="text-[9px] font-mono font-bold text-black bg-gray-100 px-2 py-0.5">PRO</span>
              </div>
              <div className="w-full h-1 bg-gray-100 mb-3">
                <div className="h-full bg-black w-[45%]" />
              </div>
              <p className="text-[10px] font-mono text-gray-500 uppercase">45k / 100k records</p>
            </div>
          </div>

          {/* User profile */}
          <UserProfile />
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[#ebebeb] border-r border-black/10 md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-6 border-b border-black/10">
                <Link href="/" className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black flex items-center justify-center rounded-sm">
                    <Database className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-tight">SynthData</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-black hover:bg-black/5">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <nav className="flex-1 py-6">
                {navigation.map((item) => (
                  <NavItem
                    key={item.name}
                    item={item}
                    isActive={pathname === item.href}
                    onClick={() => setSidebarOpen(false)}
                  />
                ))}
              </nav>
              <UserProfile />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-16 flex-shrink-0 items-center gap-4 border-b border-black/10 bg-[#ebebeb]/90 backdrop-blur-xl px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-black hover:bg-black/5"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search bar */}
          <div className="flex-1 max-w-md">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full h-9 pl-10 pr-4 bg-transparent border border-black/10 rounded-none text-[11px] font-mono placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all text-black"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[9px] text-gray-500 bg-black/5 border border-black/10 font-mono">
                ⌘K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-black hover:bg-black/5">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-black rounded-full" />
            </Button>

            {/* Quick generate */}
            <Link href="/dashboard/generate">
              <Button className="hidden sm:flex gap-2 rounded-none bg-black text-white hover:bg-black/90 h-9 px-4 text-[11px] font-mono uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Generate
              </Button>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-12">
          {children}
        </main>
      </div>
    </div>
  )
}
