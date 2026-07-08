'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { 
  Settings as SettingsIcon, 
  User, 
  Key, 
  Bell, 
  Shield,
  Check,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  RefreshCw,
  Palette,
  Moon,
  Sun,
  Monitor,
  Zap,
  Clock,
  Globe,
  Save,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { 
  FadeInWhenVisible, 
  SpotlightCard,
  AnimatedCheckmark
} from "@/components/animations"
import { useAuth } from "@/lib/auth-context"
import { authApi } from "@/lib/api"

// Animated Tab component
function AnimatedTab({ 
  tabs, 
  activeTab, 
  onChange 
}: { 
  tabs: { id: string; label: string; icon: React.ElementType }[]
  activeTab: string
  onChange: (tab: string) => void
}) {
  return (
    <div className="flex gap-1 p-1 rounded-sm border border-black bg-white">
      <LayoutGroup>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative px-4 py-2.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest transition-colors",
                "flex items-center gap-2",
                isActive ? "text-white" : "text-gray-500 hover:text-black hover:bg-black/5"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-bg"
                  className="absolute inset-0 bg-black rounded-sm border border-black"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <tab.icon className={cn("w-3.5 h-3.5 relative z-10", isActive ? "text-white" : "text-gray-500")} />
              <span className="relative z-10">{tab.label}</span>
            </button>
          )
        })}
      </LayoutGroup>
    </div>
  )
}

// Animated Toggle Switch
function ToggleSwitch({ 
  checked, 
  onChange, 
  label,
  description 
}: { 
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description: string
}) {
  return (
    <motion.div 
      className="flex items-center justify-between p-4 rounded-sm border border-black/10 bg-white hover:border-black transition-colors"
      whileHover={{ scale: 1.01 }}
    >
      <div>
        <p className="font-bold text-black uppercase tracking-tight">{label}</p>
        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-14 h-8 rounded-sm transition-colors duration-300 border border-black",
          checked ? "bg-black" : "bg-gray-100"
        )}
      >
        <motion.div
          className="absolute top-1 w-6 h-6 rounded-sm shadow-sm"
          animate={{ 
            left: checked ? '1.75rem' : '0.25rem',
            backgroundColor: checked ? '#fff' : '#000'
          }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Check className="w-4 h-4 text-black" />
            </motion.div>
          )}
        </motion.div>
      </button>
    </motion.div>
  )
}

function AnimatedInput({ 
  label, 
  type = "text",
  placeholder,
  value,
  onChange,
  icon: Icon
}: { 
  label: string
  type?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  icon?: React.ElementType
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const inputType = type === 'password' && showPassword ? 'text' : type

  return (
    <motion.div
      animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
    >
      <label className="text-[10px] font-mono font-bold uppercase tracking-widest mb-2 block text-black">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
            isFocused ? "text-black" : "text-gray-400"
          )} />
        )}
        <Input 
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "bg-white border-black/20 text-black rounded-sm font-mono text-sm transition-all shadow-none",
            "focus:border-black focus:ring-0 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
            Icon && "pl-10",
            type === 'password' && "pr-10"
          )}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </motion.div>
  )
}

// API Key Card component
function APIKeyCard({ 
  name, 
  keyValue, 
  createdAt, 
  onRevoke, 
  onCopy 
}: { 
  name: string
  keyValue: string
  createdAt: string
  onRevoke: () => void
  onCopy: () => void
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 rounded-sm border border-black/10 bg-white hover:border-black transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-black flex items-center justify-center border border-black">
            <Key className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold uppercase tracking-tight text-black">{name}</p>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Created {createdAt}</p>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopy}
              className="border-black/10 hover:border-black rounded-sm text-black h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRevoke}
              className="border-red-500/30 hover:border-red-500 hover:bg-red-50 hover:text-red-600 rounded-sm h-8 w-8 p-0"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </motion.div>
        </div>
      </div>
      <div className="font-mono text-sm text-black border border-black/10 bg-gray-50 px-3 py-2 rounded-sm overflow-x-auto whitespace-nowrap">
        {keyValue}
      </div>
    </motion.div>
  )
}

// Theme Selector
function ThemeSelector({ selected, onSelect }: { selected: string, onSelect: (theme: string) => void }) {
  const themes = [
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div className="grid grid-cols-3 gap-3">
      {themes.map((theme) => (
        <motion.button
          key={theme.id}
          onClick={() => onSelect(theme.id)}
          className={cn(
            "p-4 rounded-sm border transition-all flex flex-col items-center gap-2",
            selected === theme.id 
              ? "border-black bg-black text-white" 
              : "border-black/10 bg-white hover:border-black/50 text-gray-500 hover:text-black"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <theme.icon className={cn(
            "w-5 h-5",
            selected === theme.id ? "text-white" : ""
          )} />
          <span className={cn(
            "text-[10px] font-mono font-bold uppercase tracking-widest",
            selected === theme.id ? "text-white" : ""
          )}>
            {theme.label}
          </span>
          {selected === theme.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-1.5 h-1.5 rounded-none bg-white"
            />
          )}
        </motion.button>
      ))}
    </div>
  )
}

// Save Button with loading state
function SaveButton({ 
  onClick, 
  isLoading,
  children 
}: { 
  onClick: () => void
  isLoading: boolean
  children: React.ReactNode
}) {
  const [isSaved, setIsSaved] = useState(false)

  const handleClick = async () => {
    onClick()
    // Simulate save
    setTimeout(() => {
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    }, 500)
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button 
        onClick={handleClick}
        disabled={isLoading}
        className="gap-2 min-w-[140px] bg-black text-white hover:bg-black/90 rounded-sm font-mono text-[10px] uppercase font-bold tracking-widest h-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
            </motion.div>
          ) : isSaved ? (
            <motion.div
              key="saved"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Check className="w-4 h-4 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="save"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Save className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
        <span>{isSaved ? 'Saved!' : children}</span>
      </Button>
    </motion.div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(false)
  const { user, refreshUser } = useAuth()
  
  // Profile state - initialize from user
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })

  // Populate profile from user data
  useEffect(() => {
    if (user) {
      const parts = (user.full_name || '').split(' ')
      setProfile({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        email: user.email || '',
      })
    }
  }, [user])
  
  // Notification state
  const [notifications, setNotifications] = useState({
    generationComplete: true,
    systemUpdates: true,
    weeklyDigest: false,
    securityAlerts: true,
  })
  
  // Security state
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  
  // Appearance state
  const [theme, setTheme] = useState('dark')
  
  // API Keys state
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Production Key', key: 'sk_live_••••••••••••••••', createdAt: 'Jan 15, 2026' },
    { id: '2', name: 'Development Key', key: 'sk_dev_••••••••••••••••', createdAt: 'Jan 20, 2026' },
  ])

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'security') {
        // Handle password change
        if (!passwords.current || !passwords.new || !passwords.confirm) {
          toast.error('Please fill in all password fields')
          setIsLoading(false)
          return
        }
        if (passwords.new !== passwords.confirm) {
          toast.error('New passwords do not match')
          setIsLoading(false)
          return
        }
        if (passwords.new.length < 6) {
          toast.error('Password must be at least 6 characters')
          setIsLoading(false)
          return
        }
        await authApi.changePassword({ 
          current_password: passwords.current, 
          new_password: passwords.new 
        })
        setPasswords({ current: '', new: '', confirm: '' })
        toast.success('Password changed successfully')
      } else {
        const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ')
        await authApi.updateMe({ full_name: fullName || undefined, email: profile.email || undefined })
        await refreshUser()
        toast.success('Settings saved successfully')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to save settings')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeInWhenVisible>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight text-black mb-2">
            Settings
          </h1>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Manage your account preferences and configurations</p>
        </motion.div>
      </FadeInWhenVisible>

      {/* Tabs */}
      <FadeInWhenVisible delay={0.1}>
        <AnimatedTab tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </FadeInWhenVisible>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <Card className="bg-white border-black/10 shadow-sm rounded-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bold uppercase tracking-tight text-black">
                    <User className="w-5 h-5 text-black" />
                    Profile Information
                  </CardTitle>
                  <CardDescription className="font-mono text-[10px] uppercase tracking-widest">Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <AnimatedInput
                      label="First Name"
                      placeholder="John"
                      value={profile.firstName}
                      onChange={(v) => setProfile({ ...profile, firstName: v })}
                      icon={User}
                    />
                    <AnimatedInput
                      label="Last Name"
                      placeholder="Doe"
                      value={profile.lastName}
                      onChange={(v) => setProfile({ ...profile, lastName: v })}
                      icon={User}
                    />
                  </div>
                  <AnimatedInput
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={profile.email}
                    onChange={(v) => setProfile({ ...profile, email: v })}
                    icon={Globe}
                  />
                  <SaveButton onClick={handleSave} isLoading={isLoading}>
                    Save Changes
                  </SaveButton>
                </CardContent>
              </Card>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <Card className="bg-white border-black/10 shadow-sm rounded-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bold uppercase tracking-tight text-black">
                    <Key className="w-5 h-5 text-black" />
                    API Keys
                  </CardTitle>
                  <CardDescription className="font-mono text-[10px] uppercase tracking-widest">Manage your API keys for programmatic access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <AnimatePresence>
                    {apiKeys.map((key, index) => (
                      <motion.div
                        key={key.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <APIKeyCard
                          name={key.name}
                          keyValue={key.key}
                          createdAt={key.createdAt}
                          onRevoke={() => {
                            setApiKeys(apiKeys.filter(k => k.id !== key.id))
                            toast.success(`${key.name} revoked`)
                          }}
                          onCopy={() => {
                            navigator.clipboard.writeText(key.key)
                            toast.success('API key copied to clipboard')
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className="gap-2 bg-black text-white hover:bg-black/90 rounded-sm font-mono text-[10px] uppercase font-bold tracking-widest h-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      onClick={() => {
                        const newKey = {
                          id: Date.now().toString(),
                          name: `Key ${apiKeys.length + 1}`,
                          key: 'sk_live_••••••••••••••••',
                          createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        }
                        setApiKeys([...apiKeys, newKey])
                        toast.success('New API key created')
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Create New Key
                    </Button>
                  </motion.div>

                  <div className="p-4 rounded-sm bg-amber-50 border border-amber-200 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Keep your keys secure</p>
                      <p className="text-xs text-amber-700/80 mt-1">
                        Never share your API keys publicly or commit them to version control.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <Card className="bg-white border-black/10 shadow-sm rounded-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bold uppercase tracking-tight text-black">
                    <Bell className="w-5 h-5 text-black" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription className="font-mono text-[10px] uppercase tracking-widest">Choose what updates you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ToggleSwitch
                    checked={notifications.generationComplete}
                    onChange={(v) => setNotifications({ ...notifications, generationComplete: v })}
                    label="Generation Complete"
                    description="Get notified when your data generation is complete"
                  />
                  <ToggleSwitch
                    checked={notifications.systemUpdates}
                    onChange={(v) => setNotifications({ ...notifications, systemUpdates: v })}
                    label="System Updates"
                    description="Receive notifications about platform updates and new features"
                  />
                  <ToggleSwitch
                    checked={notifications.weeklyDigest}
                    onChange={(v) => setNotifications({ ...notifications, weeklyDigest: v })}
                    label="Weekly Digest"
                    description="Get a weekly summary of your data generation activity"
                  />
                  <ToggleSwitch
                    checked={notifications.securityAlerts}
                    onChange={(v) => setNotifications({ ...notifications, securityAlerts: v })}
                    label="Security Alerts"
                    description="Important security notifications about your account"
                  />
                  <SaveButton onClick={handleSave} isLoading={isLoading}>
                    Save Preferences
                  </SaveButton>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <Card className="bg-white border-black/10 shadow-sm rounded-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bold uppercase tracking-tight text-black">
                    <Palette className="w-5 h-5 text-black" />
                    Appearance
                  </CardTitle>
                  <CardDescription className="font-mono text-[10px] uppercase tracking-widest">Customize the look and feel of your dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Theme</label>
                    <ThemeSelector selected={theme} onSelect={setTheme} />
                  </div>
                  
                  <div className="p-4 rounded-sm bg-gray-50 border border-black/10">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-5 h-5 text-black" />
                      <p className="font-bold uppercase tracking-tight text-black">Reduce Motion</p>
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-4">
                      Reduces animations and transitions for better accessibility
                    </p>
                    <ToggleSwitch
                      checked={false}
                      onChange={() => {}}
                      label=""
                      description=""
                    />
                  </div>
                  
                  <SaveButton onClick={handleSave} isLoading={isLoading}>
                    Save Appearance
                  </SaveButton>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card className="bg-white border-black/10 shadow-sm rounded-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bold uppercase tracking-tight text-black">
                    <Shield className="w-5 h-5 text-black" />
                    Security Settings
                  </CardTitle>
                  <CardDescription className="font-mono text-[10px] uppercase tracking-widest">Manage your account security and password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <AnimatedInput
                    label="Current Password"
                    type="password"
                    placeholder="Enter your current password"
                    value={passwords.current}
                    onChange={(v) => setPasswords({ ...passwords, current: v })}
                  />
                  <AnimatedInput
                    label="New Password"
                    type="password"
                    placeholder="Enter a new password"
                    value={passwords.new}
                    onChange={(v) => setPasswords({ ...passwords, new: v })}
                  />
                  <AnimatedInput
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm your new password"
                    value={passwords.confirm}
                    onChange={(v) => setPasswords({ ...passwords, confirm: v })}
                  />
                  
                  {/* Password requirements */}
                  <div className="p-4 rounded-sm bg-gray-50 border border-black/10">
                    <p className="font-bold uppercase tracking-tight text-black mb-3">Password Requirements</p>
                    <ul className="space-y-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
                      {[
                        'At least 8 characters',
                        'Contains uppercase and lowercase letters',
                        'Contains at least one number',
                        'Contains a special character',
                      ].map((req, i) => (
                        <motion.li 
                          key={i}
                          className="flex items-center gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className="w-1.5 h-1.5 rounded-none bg-black" />
                          {req}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <SaveButton onClick={handleSave} isLoading={isLoading}>
                    Update Password
                  </SaveButton>
                </CardContent>
              </Card>

              {/* Two-Factor Authentication */}
              <Card className="bg-white border-black/10 shadow-sm rounded-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-bold uppercase tracking-tight text-black">
                    <Clock className="w-5 h-5 text-black" />
                    Two-Factor Authentication
                  </CardTitle>
                  <CardDescription className="font-mono text-[10px] uppercase tracking-widest">Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-sm bg-gray-50 border border-black/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-sm bg-white flex items-center justify-center border border-black/20">
                        <Shield className="w-6 h-6 text-black" />
                      </div>
                      <div>
                        <p className="font-bold uppercase tracking-tight text-black">2FA is not enabled</p>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Protect your account with two-factor authentication</p>
                      </div>
                    </div>
                    <Button className="gap-2 bg-black text-white hover:bg-black/90 rounded-sm font-mono text-[10px] uppercase font-bold tracking-widest h-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <Plus className="w-4 h-4" />
                      Enable 2FA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
