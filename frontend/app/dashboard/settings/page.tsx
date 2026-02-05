'use client'

import { useState } from "react"
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
    <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
      <LayoutGroup>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                "flex items-center gap-2",
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-tab-bg"
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 rounded-lg border border-purple-500/30"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <tab.icon className={cn("w-4 h-4 relative z-10", isActive && "text-purple-400")} />
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
      className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      whileHover={{ scale: 1.01 }}
    >
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-14 h-8 rounded-full transition-colors duration-300",
          checked ? "bg-gradient-to-r from-purple-500 to-indigo-500" : "bg-white/10"
        )}
      >
        <motion.div
          className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
          animate={{ left: checked ? '1.75rem' : '0.25rem' }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Check className="w-3 h-3 text-purple-500" />
            </motion.div>
          )}
        </motion.div>
      </button>
    </motion.div>
  )
}

// Animated Input Field
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
      animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
    >
      <label className="text-sm font-medium mb-2 block text-gray-300">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
            isFocused ? "text-purple-400" : "text-gray-500"
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
            "bg-white/5 border-white/10 transition-all",
            "focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
            Icon && "pl-10",
            type === 'password' && "pr-10"
          )}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        <motion.div
          className="absolute inset-0 rounded-md pointer-events-none"
          animate={isFocused ? { 
            boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.2)"
          } : { 
            boxShadow: "0 0 0 0px rgba(139, 92, 246, 0)"
          }}
        />
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
      className="p-4 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/30 transition-all group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center border border-purple-500/30">
            <Key className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-gray-500">Created {createdAt}</p>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCopy}
              className="border-white/10 hover:border-purple-500/50"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
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
              className="border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          </motion.div>
        </div>
      </div>
      <div className="font-mono text-sm text-purple-400 bg-black/30 px-3 py-2 rounded-lg">
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
            "p-4 rounded-xl border transition-all flex flex-col items-center gap-2",
            selected === theme.id 
              ? "border-purple-500 bg-purple-500/10" 
              : "border-white/10 hover:border-white/20 bg-white/5"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <theme.icon className={cn(
            "w-6 h-6",
            selected === theme.id ? "text-purple-400" : "text-gray-400"
          )} />
          <span className={cn(
            "text-sm font-medium",
            selected === theme.id ? "text-white" : "text-gray-400"
          )}>
            {theme.label}
          </span>
          {selected === theme.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 rounded-full bg-purple-500"
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
        variant="gradient" 
        onClick={handleClick}
        disabled={isLoading}
        className="gap-2 min-w-[140px]"
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
              <Check className="w-4 h-4 text-green-400" />
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
  
  // Profile state
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })
  
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

  const handleSave = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Settings saved successfully')
    }, 1000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeInWhenVisible>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Settings
            </span>
          </h1>
          <p className="text-gray-400">Manage your account preferences and configurations</p>
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
              <SpotlightCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-400" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
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
              </SpotlightCard>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <SpotlightCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-purple-400" />
                    API Keys
                  </CardTitle>
                  <CardDescription>Manage your API keys for programmatic access</CardDescription>
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
                      variant="gradient" 
                      className="gap-2"
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

                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-400">Keep your keys secure</p>
                      <p className="text-xs text-yellow-400/70 mt-1">
                        Never share your API keys publicly or commit them to version control.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </SpotlightCard>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <SpotlightCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-purple-400" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose what updates you want to receive</CardDescription>
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
              </SpotlightCard>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <SpotlightCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-400" />
                    Appearance
                  </CardTitle>
                  <CardDescription>Customize the look and feel of your dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="text-sm font-medium mb-3 block">Theme</label>
                    <ThemeSelector selected={theme} onSelect={setTheme} />
                  </div>
                  
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-5 h-5 text-purple-400" />
                      <p className="font-medium">Reduce Motion</p>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">
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
              </SpotlightCard>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <SpotlightCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your account security and password</CardDescription>
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
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-sm font-medium mb-3">Password Requirements</p>
                    <ul className="space-y-2 text-sm text-gray-400">
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
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          {req}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  <SaveButton onClick={handleSave} isLoading={isLoading}>
                    Update Password
                  </SaveButton>
                </CardContent>
              </SpotlightCard>

              {/* Two-Factor Authentication */}
              <SpotlightCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    Two-Factor Authentication
                  </CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center border border-green-500/30">
                        <Shield className="w-6 h-6 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">2FA is not enabled</p>
                        <p className="text-sm text-gray-400">Protect your account with two-factor authentication</p>
                      </div>
                    </div>
                    <Button variant="gradient" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Enable 2FA
                    </Button>
                  </div>
                </CardContent>
              </SpotlightCard>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
