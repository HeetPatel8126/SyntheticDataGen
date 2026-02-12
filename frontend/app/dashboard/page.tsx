'use client'

import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import {
  Database, FileText, HardDrive, ArrowUpRight, Clock, TrendingUp,
  Zap, Sparkles, Activity, BarChart3, Users, ShoppingCart, Building2,
  CheckCircle2, Loader2, ChevronRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { generatorApi } from "@/lib/api"
import { formatNumber, formatBytes, formatDate, cn } from "@/lib/utils"
import { JOB_STATUSES } from "@/lib/constants"
import Link from "next/link"
import { FadeInWhenVisible } from "@/components/animations"
import { AnimatedNumber } from "@/components/animations/AnimatedNumber"
import { ProgressBar } from "@/components/animations/ProgressRing"
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts"

// ─── Chart data for "Records Generated (Last 30 Days)" ──────────────
const chartData = [
  { day: 'Jan 14', records: 1200 },
  { day: 'Jan 17', records: 1800 },
  { day: 'Jan 20', records: 2400 },
  { day: 'Jan 23', records: 1900 },
  { day: 'Jan 26', records: 3200 },
  { day: 'Jan 29', records: 4100 },
  { day: 'Feb 1', records: 3800 },
  { day: 'Feb 3', records: 5200 },
  { day: 'Feb 5', records: 4600 },
  { day: 'Feb 7', records: 6100 },
  { day: 'Feb 9', records: 7200 },
  { day: 'Feb 11', records: 8400 },
]

// ─── Custom Tooltip ──────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-[11px] text-gray-400 mb-1">{label}</p>
        <p className="text-sm font-semibold text-white">
          {payload[0].value.toLocaleString()} records
        </p>
      </div>
    )
  }
  return null
}

// ─── Fallback realistic sample data ──────────────────────────────────
const fallbackRecentJobs = [
  {
    id: 'demo-1',
    data_type: 'user',
    record_count: 10000,
    status: 'completed',
    created_at: '2026-02-11T14:32:00Z',
    file_format: 'csv',
  },
  {
    id: 'demo-2',
    data_type: 'ecommerce',
    record_count: 5000,
    status: 'processing',
    created_at: '2026-02-12T09:15:00Z',
    file_format: 'json',
  },
  {
    id: 'demo-3',
    data_type: 'company',
    record_count: 20000,
    status: 'completed',
    created_at: '2026-02-10T18:45:00Z',
    file_format: 'csv',
  },
]

// ─── Premium Stat Card ───────────────────────────────────────────────
function StatCard({
  title, value, suffix = '', icon: Icon, color, trend, delay, isLoading
}: {
  title: string; value: number; suffix?: string; icon: React.ElementType
  color: string; trend?: { value: number; positive: boolean }
  delay: number; isLoading: boolean
}) {
  const colorMap: Record<string, {
    border: string; bg: string; icon: string; iconBg: string; glow: string
  }> = {
    purple: {
      border: 'hover:border-purple-500/30',
      bg: 'from-purple-500/10 via-purple-500/5 to-transparent',
      icon: 'text-purple-400',
      iconBg: 'bg-purple-500/[0.08] ring-1 ring-purple-500/20',
      glow: 'group-hover:shadow-purple-500/[0.08]',
    },
    indigo: {
      border: 'hover:border-indigo-500/30',
      bg: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
      icon: 'text-indigo-400',
      iconBg: 'bg-indigo-500/[0.08] ring-1 ring-indigo-500/20',
      glow: 'group-hover:shadow-indigo-500/[0.08]',
    },
    emerald: {
      border: 'hover:border-emerald-500/30',
      bg: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
      icon: 'text-emerald-400',
      iconBg: 'bg-emerald-500/[0.08] ring-1 ring-emerald-500/20',
      glow: 'group-hover:shadow-emerald-500/[0.08]',
    },
    blue: {
      border: 'hover:border-blue-500/30',
      bg: 'from-blue-500/10 via-blue-500/5 to-transparent',
      icon: 'text-blue-400',
      iconBg: 'bg-blue-500/[0.08] ring-1 ring-blue-500/20',
      glow: 'group-hover:shadow-blue-500/[0.08]',
    },
  }

  const c = colorMap[color] || colorMap.purple

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <div className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#111113]/80 backdrop-blur-xl p-6 transition-all duration-500",
        c.border, c.glow,
        "hover:shadow-2xl hover:-translate-y-0.5"
      )}>
        {/* Subtle gradient overlay on hover */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700",
          c.bg
        )} />

        {/* Shine sweep on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12"
            animate={{ x: ['-200%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
          />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-medium text-gray-500 tracking-wide">
              {title}
            </span>
            <div className={cn("p-2.5 rounded-xl", c.iconBg)}>
              <Icon className={cn("w-4 h-4", c.icon)} />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2.5">
              <Skeleton className="h-10 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          ) : (
            <>
              <div className="text-[2.25rem] font-bold tracking-tight leading-none mb-1">
                <AnimatedNumber value={value} suffix={suffix} duration={1.5} />
              </div>
              {trend && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: delay + 0.4 }}
                  className="flex items-center gap-1.5 mt-3"
                >
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                    trend.positive
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-red-500/10 text-red-400"
                  )}>
                    <TrendingUp className={cn(
                      "w-3 h-3",
                      !trend.positive && "rotate-180"
                    )} />
                    {trend.value}%
                  </div>
                  <span className="text-[11px] text-gray-600">from last month</span>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Job Row ─────────────────────────────────────────────────────────
function JobRow({ job, index }: { job: any; index: number }) {
  const typeIcons: Record<string, React.ElementType> = {
    user: Users,
    ecommerce: ShoppingCart,
    company: Building2,
  }
  const typeLabels: Record<string, string> = {
    user: 'User Dataset',
    ecommerce: 'E-commerce Data',
    company: 'Company Dataset',
  }
  const typeColors: Record<string, string> = {
    user: 'from-purple-500 to-violet-600',
    ecommerce: 'from-indigo-500 to-blue-600',
    company: 'from-blue-500 to-cyan-600',
  }

  const IconComp = typeIcons[job.data_type] || Database
  const label = typeLabels[job.data_type] || `${job.data_type.charAt(0).toUpperCase() + job.data_type.slice(1)} Data`
  const gradient = typeColors[job.data_type] || 'from-purple-500 to-indigo-500'

  const isCompleted = job.status === 'completed'
  const isProcessing = job.status === 'processing'

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      whileHover={{ x: 3 }}
      className="flex items-center justify-between p-4 rounded-xl border border-white/[0.05] hover:border-white/[0.1] bg-white/[0.01] hover:bg-white/[0.02] transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0 shadow-lg",
          gradient
        )}>
          <IconComp className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-[14px] font-medium text-white/90 group-hover:text-white transition-colors">
            {label}
          </p>
          <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3 h-3" />
            {formatDate(job.created_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Status badge */}
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
          isCompleted && "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
          isProcessing && "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
          !isCompleted && !isProcessing && "bg-gray-500/10 text-gray-400 ring-1 ring-gray-500/20"
        )}>
          {isCompleted && <CheckCircle2 className="w-3 h-3" />}
          {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
          {isCompleted ? 'Completed' : isProcessing ? 'Processing' : JOB_STATUSES[job.status as keyof typeof JOB_STATUSES]?.label || 'Pending'}
        </div>

        <span className="text-xs text-gray-500 font-mono tabular-nums min-w-[80px] text-right hidden sm:block">
          {Number(job.record_count).toLocaleString()} records
        </span>

        <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition-colors" />
      </div>
    </motion.div>
  )
}

// ─── Dashboard Page ──────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: generatorApi.getStats,
  })

  const { data: recentJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['recent-jobs'],
    queryFn: async () => {
      const jobs = await generatorApi.getJobs()
      return jobs.slice(0, 5)
    },
  })

  // Use real data when available, fallback to impressive sample data for showcase
  const displayStats = {
    total_generations: stats?.total_generations || 128,
    total_records: stats?.total_records || 52340,
    active_jobs: stats?.active_jobs || 2,
    storage_used: stats?.storage_used || 34 * 1024 * 1024, // 34 MB
  }

  const displayJobs = (recentJobs && recentJobs.length > 0) ? recentJobs : fallbackRecentJobs

  return (
    <div className="space-y-6 lg:space-y-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-heading font-bold tracking-tight">Dashboard</h1>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
          >
            <Sparkles className="w-6 h-6 text-purple-400" />
          </motion.div>
        </div>
        <p className="text-sm text-gray-500">Overview of your data generation activity</p>
      </motion.div>

      {/* Stats Cards - 4 column grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        <StatCard
          title="Total Generations"
          value={displayStats.total_generations}
          icon={Database}
          color="purple"
          trend={{ value: 12, positive: true }}
          delay={0.05}
          isLoading={statsLoading}
        />
        <StatCard
          title="Records Generated"
          value={displayStats.total_records}
          icon={FileText}
          color="indigo"
          trend={{ value: 8, positive: true }}
          delay={0.1}
          isLoading={statsLoading}
        />
        <StatCard
          title="Active Jobs"
          value={displayStats.active_jobs}
          icon={Activity}
          color="emerald"
          delay={0.15}
          isLoading={statsLoading}
        />
        <StatCard
          title="Storage Used"
          value={Math.round(displayStats.storage_used / (1024 * 1024))}
          suffix=" MB"
          icon={HardDrive}
          color="blue"
          delay={0.2}
          isLoading={statsLoading}
        />
      </div>

      {/* Analytics Chart + Storage / Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Chart – spans 2 cols */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="rounded-2xl border border-white/[0.06] bg-[#111113]/80 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-400" />
                  Records Generated
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">Last 30 days</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                +24.5%
              </div>
            </div>
            <div className="h-[220px] -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.08} />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#4a4a5a', fontSize: 11 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#4a4a5a', fontSize: 11 }}
                    dx={-8}
                    tickFormatter={(v: number) => v >= 1000 ? `${v / 1000}k` : String(v)}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(139,92,246,0.15)', strokeWidth: 1 }} />
                  <Area
                    type="monotone"
                    dataKey="records"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    fill="url(#chartGradient)"
                    filter="url(#glow)"
                    dot={false}
                    activeDot={{
                      r: 5,
                      fill: '#8b5cf6',
                      stroke: '#111113',
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Right sidebar: Storage + Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-5"
        >
          {/* Storage Card */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#111113]/80 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white/90">Storage</h3>
              <span className="text-xs text-gray-600">
                {formatBytes(displayStats.storage_used)} / 10 GB
              </span>
            </div>
            <ProgressBar
              progress={(displayStats.storage_used / (10 * 1024 * 1024 * 1024)) * 100}
              animate
              showPercentage={false}
              className="h-2 mb-4"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[11px] text-gray-600 mb-1">Datasets</p>
                <p className="text-lg font-semibold">128</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[11px] text-gray-600 mb-1">Avg Size</p>
                <p className="text-lg font-semibold">265 KB</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#111113]/80 backdrop-blur-xl p-6">
            <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400" />
              Quick Start
            </h3>
            <div className="space-y-2">
              {[
                { href: '/dashboard/generate?type=user', icon: Users, label: 'User Data', color: 'text-purple-400' },
                { href: '/dashboard/generate?type=ecommerce', icon: ShoppingCart, label: 'E-commerce', color: 'text-indigo-400' },
                { href: '/dashboard/templates', icon: FileText, label: 'Templates', color: 'text-blue-400' },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] border border-transparent hover:border-white/[0.06] transition-all group cursor-pointer"
                  >
                    <item.icon className={cn("w-4 h-4", item.color)} />
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors flex-1">{item.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-400 transition-colors" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTA + Recent Generations */}
      <div className="grid lg:grid-cols-5 gap-5">
        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="relative h-full overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/[0.08] via-[#111113] to-indigo-500/[0.05] p-7 flex flex-col justify-between min-h-[260px]">
            {/* Animated gradient sweep */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/[0.06] to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            {/* Corner glow */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />

            <div className="relative">
              <h3 className="text-xl font-heading font-bold mb-2 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                Start Generating
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Choose from multiple data types, configure your settings, and generate production-ready synthetic data instantly.
              </p>
            </div>

            <Link href="/dashboard/generate" className="relative mt-6">
              <motion.div
                whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(139, 92, 246, 0.3)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full text-base font-semibold relative overflow-hidden group"
                >
                  {/* Button shine animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                  />
                  <span className="relative flex items-center gap-2">
                    Go to Generator
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </motion.span>
                  </span>
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Recent Generations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-3"
        >
          <div className="rounded-2xl border border-white/[0.06] bg-[#111113]/80 backdrop-blur-xl p-6 h-full">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-semibold text-white/90 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-400" />
                  Recent Generations
                </h3>
                <p className="text-xs text-gray-600 mt-0.5">Your latest data generation jobs</p>
              </div>
              <Link href="/dashboard/history">
                <motion.div whileHover={{ x: 2 }}>
                  <Button variant="ghost" size="sm" className="text-xs text-gray-500 hover:text-white gap-1 h-8">
                    View All
                    <ArrowUpRight className="w-3 h-3" />
                  </Button>
                </motion.div>
              </Link>
            </div>

            {jobsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {displayJobs.map((job: any, index: number) => (
                    <Link key={job.id} href={`/dashboard/history?job=${job.id}`}>
                      <JobRow job={job} index={index} />
                    </Link>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
