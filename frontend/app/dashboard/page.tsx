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

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-black/10 px-4 py-3 shadow-xl rounded-none">
        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-black font-mono">
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
  title, value, suffix = '', icon: Icon, delay, isLoading, color, trend
}: {
  title: string; value: number; suffix?: string; icon: React.ElementType
  delay: number; isLoading: boolean; color?: string; trend?: { value: number; positive: boolean }
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <div className="group relative overflow-hidden bg-white border border-black/10 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-sm">
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-mono font-bold uppercase text-gray-500 tracking-widest">
              {title}
            </span>
            <div className="p-2 bg-black text-white rounded-sm">
              <Icon className="w-3.5 h-3.5" />
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2.5">
              <Skeleton className="h-10 w-28 rounded-none" />
              <Skeleton className="h-4 w-20 rounded-none" />
            </div>
          ) : (
            <>
              <div className="text-4xl font-bold tracking-tight text-black mb-1">
                <AnimatedNumber value={value} suffix={suffix} duration={1.5} />
              </div>
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
    user: 'User Data',
    ecommerce: 'E-commerce',
    company: 'Company Data',
  }

  const IconComp = typeIcons[job.data_type] || Database
  const label = typeLabels[job.data_type] || job.data_type

  const isCompleted = job.status === 'completed'
  const isProcessing = job.status === 'processing'

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ x: 3 }}
      className="flex items-center justify-between p-4 border border-black/10 bg-white hover:bg-black/5 transition-all cursor-pointer group rounded-sm"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0 rounded-sm">
          <IconComp className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[12px] font-bold uppercase tracking-tight text-black">
            {label}
          </p>
          <p className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5 mt-1 uppercase">
            <Clock className="w-3 h-3" />
            {formatDate(job.created_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-sm border",
          isCompleted && "bg-emerald-50 text-emerald-600 border-emerald-200",
          isProcessing && "bg-amber-50 text-amber-600 border-amber-200",
          !isCompleted && !isProcessing && "bg-gray-50 text-gray-600 border-gray-200"
        )}>
          {isCompleted && <CheckCircle2 className="w-3 h-3" />}
          {isProcessing && <Loader2 className="w-3 h-3 animate-spin" />}
          {isCompleted ? 'Completed' : isProcessing ? 'Processing' : JOB_STATUSES[job.status as keyof typeof JOB_STATUSES]?.label || 'Pending'}
        </div>

        <span className="text-[11px] text-gray-500 font-mono tabular-nums min-w-[80px] text-right hidden sm:block uppercase">
          {Number(job.record_count).toLocaleString()} recs
        </span>

        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
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
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold tracking-tight uppercase">Dashboard</h1>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
          >
            <Sparkles className="w-6 h-6 text-black" />
          </motion.div>
        </div>
        <p className="text-[12px] font-mono text-gray-500 uppercase tracking-widest">Overview of your data generation activity</p>
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
          <div className="bg-white border border-black/10 p-6 rounded-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[10px] font-mono font-bold uppercase text-gray-500 tracking-widest flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-black" />
                  Records Generated
                </h3>
                <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-sm border bg-emerald-50 text-emerald-600 border-emerald-200">
                <TrendingUp className="w-3 h-3" />
                +24.5%
              </div>
            </div>
            <div className="h-[220px] -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#000000" stopOpacity={0.05} />
                      <stop offset="100%" stopColor="#000000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#6b7280', fontSize: 10, fontFamily: 'monospace' }}
                    dx={-8}
                    tickFormatter={(v: number) => v >= 1000 ? `${v / 1000}k` : String(v)}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(0,0,0,0.1)', strokeWidth: 1 }} />
                  <Area
                    type="monotone"
                    dataKey="records"
                    stroke="#000000"
                    strokeWidth={2}
                    fill="url(#chartGradient)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      fill: '#000000',
                      stroke: '#ffffff',
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
          <div className="bg-white border border-black/10 p-6 rounded-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-mono font-bold uppercase text-gray-500 tracking-widest">Storage</h3>
              <span className="text-[10px] font-mono text-gray-500 uppercase">
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
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-sm">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Datasets</p>
                <p className="text-lg font-bold">128</p>
              </div>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-sm">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Avg Size</p>
                <p className="text-lg font-bold">265 KB</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-black/10 p-6 rounded-sm">
            <h3 className="text-[10px] font-mono font-bold uppercase text-gray-500 tracking-widest flex items-center gap-2 mb-4">
              <Zap className="w-3.5 h-3.5 text-black" />
              Quick Start
            </h3>
            <div className="space-y-2">
              {[
                { href: '/dashboard/generate?type=user', icon: Users, label: 'User Data' },
                { href: '/dashboard/generate?type=ecommerce', icon: ShoppingCart, label: 'E-commerce' },
                { href: '/dashboard/templates', icon: FileText, label: 'Templates' },
              ].map((item) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-sm bg-gray-50 hover:bg-black border border-transparent hover:border-black transition-all group cursor-pointer"
                  >
                    <item.icon className="w-4 h-4 text-black group-hover:text-white transition-colors" />
                    <span className="text-sm font-bold uppercase text-black group-hover:text-white transition-colors flex-1">{item.label}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-black group-hover:text-white transition-colors" />
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
          <div className="relative h-full overflow-hidden bg-black border border-black p-8 flex flex-col justify-between min-h-[260px] rounded-sm text-white group">
            <div className="relative">
              <h3 className="text-2xl font-bold tracking-tight uppercase mb-4 group-hover:tracking-widest transition-all duration-500">
                Start Generating
              </h3>
              <p className="text-xs text-gray-400 font-mono leading-relaxed">
                Choose from multiple data types, configure your settings, and generate production-ready synthetic data instantly. No compliance risks.
              </p>
            </div>

            <Link href="/dashboard/generate" className="relative mt-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  className="w-full bg-white text-black hover:bg-gray-200 rounded-sm font-mono uppercase text-[11px] font-bold tracking-widest h-12"
                >
                  <span className="flex items-center gap-2">
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
          <div className="bg-white border border-black/10 p-6 h-full rounded-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-[10px] font-mono font-bold uppercase text-gray-500 tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-black" />
                  Recent Generations
                </h3>
                <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase">Your latest data generation jobs</p>
              </div>
              <Link href="/dashboard/history">
                <motion.div whileHover={{ x: 2 }}>
                  <Button variant="ghost" size="sm" className="text-[10px] font-mono font-bold uppercase text-gray-500 hover:text-black gap-1 h-8 rounded-sm hover:bg-gray-100">
                    View All
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </motion.div>
              </Link>
            </div>

            {jobsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-sm" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence>
                  {displayJobs.map((job: any, index: number) => (
                    <Link key={job.id || `job-index-${index}`} href={`/dashboard/history?job=${job.id || ''}`}>
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
