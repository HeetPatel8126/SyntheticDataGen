'use client'

import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { Database, FileText, HardDrive, ArrowUpRight, Clock, TrendingUp, Zap, Sparkles, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { generatorApi } from "@/lib/api"
import { formatNumber, formatBytes, formatDate, cn } from "@/lib/utils"
import { JOB_STATUSES } from "@/lib/constants"
import Link from "next/link"
import { FadeInWhenVisible, SpotlightCard } from "@/components/animations"
import { AnimatedNumber } from "@/components/animations/AnimatedNumber"
import { ProgressBar } from "@/components/animations/ProgressRing"
import { StatusBadge } from "@/components/animations/AnimatedBadge"
import { LoadingSpinner } from "@/components/animations/LoadingStates"
import { AnimatedCheckmark } from "@/components/animations/AnimatedIcon"

// Animated stat card component
function StatCard({ 
  title, 
  value, 
  suffix = '', 
  icon: Icon, 
  color, 
  trend, 
  delay,
  isLoading
}: { 
  title: string
  value: number
  suffix?: string
  icon: React.ElementType
  color: string
  trend?: { value: number; positive: boolean }
  delay: number
  isLoading: boolean
}) {
  const colorClasses: Record<string, { border: string; bg: string; icon: string; glow: string }> = {
    purple: {
      border: 'hover:border-purple-500/50',
      bg: 'from-purple-500/20 to-purple-600/5',
      icon: 'text-purple-500',
      glow: 'group-hover:shadow-purple-500/20'
    },
    indigo: {
      border: 'hover:border-indigo-500/50',
      bg: 'from-indigo-500/20 to-indigo-600/5',
      icon: 'text-indigo-500',
      glow: 'group-hover:shadow-indigo-500/20'
    },
    blue: {
      border: 'hover:border-blue-500/50',
      bg: 'from-blue-500/20 to-blue-600/5',
      icon: 'text-blue-500',
      glow: 'group-hover:shadow-blue-500/20'
    },
    green: {
      border: 'hover:border-green-500/50',
      bg: 'from-green-500/20 to-green-600/5',
      icon: 'text-green-500',
      glow: 'group-hover:shadow-green-500/20'
    }
  }

  const colors = colorClasses[color] || colorClasses.purple

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      <Card className={cn(
        "relative overflow-hidden group transition-all duration-300",
        colors.border,
        colors.glow,
        "group-hover:shadow-lg"
      )}>
        {/* Animated gradient background */}
        <motion.div 
          className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", colors.bg)}
        />
        
        {/* Animated glow effect */}
        <motion.div
          className="absolute -inset-px bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
        
        <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
          <CardTitle className="text-sm font-medium text-gray-400">
            {title}
          </CardTitle>
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Icon className={cn("w-5 h-5", colors.icon)} />
          </motion.div>
        </CardHeader>
        <CardContent className="relative">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          ) : (
            <>
              <div className="text-4xl font-heading font-bold tracking-tight">
                <AnimatedNumber 
                  value={value} 
                  suffix={suffix}
                  duration={1.5}
                />
              </div>
              {trend && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: delay + 0.3 }}
                  className="flex items-center gap-1 mt-2"
                >
                  <motion.span
                    animate={{ y: trend.positive ? [0, -2, 0] : [0, 2, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <TrendingUp className={cn(
                      "w-4 h-4",
                      trend.positive ? "text-green-500" : "text-red-500 rotate-180"
                    )} />
                  </motion.span>
                  <span className={cn(
                    "text-sm font-medium",
                    trend.positive ? "text-green-500" : "text-red-500"
                  )}>
                    {trend.value}%
                  </span>
                  <span className="text-xs text-gray-500">from last month</span>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Animated job row component
function JobRow({ job, index }: { job: any; index: number }) {
  const statusConfig: Record<string, { color: string; pulse?: boolean }> = {
    completed: { color: 'success' },
    processing: { color: 'warning', pulse: true },
    pending: { color: 'default', pulse: true },
    failed: { color: 'error' }
  }

  const config = statusConfig[job.status] || statusConfig.pending

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.01, x: 4 }}
      className="flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.02] transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <motion.div 
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Database className="w-6 h-6 text-white" />
        </motion.div>
        <div>
          <p className="font-medium text-white group-hover:text-purple-300 transition-colors">
            {job.data_type.charAt(0).toUpperCase() + job.data_type.slice(1)} Data
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Clock className="w-3 h-3" />
            {formatDate(job.created_at)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <StatusBadge 
          status={config.color as any} 
          pulse={config.pulse}
        >
          {JOB_STATUSES[job.status].label}
        </StatusBadge>
        <span className="text-sm text-gray-400 font-mono">
          {formatNumber(job.record_count)} records
        </span>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ArrowUpRight className="w-4 h-4 text-purple-400" />
        </motion.div>
      </div>
    </motion.div>
  )
}

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-heading font-bold">Dashboard</h1>
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Sparkles className="w-8 h-8 text-purple-500" />
          </motion.div>
        </div>
        <p className="text-gray-400">Overview of your data generation activity</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          title="Total Generations"
          value={stats?.total_generations || 0}
          icon={Database}
          color="purple"
          trend={{ value: 12, positive: true }}
          delay={0.1}
          isLoading={statsLoading}
        />
        <StatCard
          title="Records Generated"
          value={stats?.total_records || 0}
          icon={FileText}
          color="indigo"
          trend={{ value: 8, positive: true }}
          delay={0.2}
          isLoading={statsLoading}
        />
        <StatCard
          title="Active Jobs"
          value={recentJobs?.filter((j: any) => j.status === 'processing').length || 0}
          icon={Activity}
          color="green"
          delay={0.3}
          isLoading={jobsLoading}
        />
        <StatCard
          title="Storage Used"
          value={Math.round((stats?.storage_used || 0) / (1024 * 1024))}
          suffix=" MB"
          icon={HardDrive}
          color="blue"
          delay={0.4}
          isLoading={statsLoading}
        />
      </div>

      {/* Storage Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Storage Usage</span>
              <span className="text-sm font-medium">
                {formatBytes(stats?.storage_used || 0)} / 10 GB
              </span>
            </div>
            <ProgressBar 
              value={((stats?.storage_used || 0) / (10 * 1024 * 1024 * 1024)) * 100}
              animated
              showValue={false}
              className="h-2"
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <FadeInWhenVisible delay={0.2}>
          <SpotlightCard className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Quick Start
              </CardTitle>
              <CardDescription>Generate data in seconds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { href: '/dashboard/generate?type=users', icon: Database, label: 'Generate User Data', color: 'purple' },
                { href: '/dashboard/generate?type=ecommerce', icon: FileText, label: 'Generate E-commerce Data', color: 'indigo' },
                { href: '/dashboard/templates', icon: FileText, label: 'Browse Templates', color: 'blue' },
              ].map((item, i) => (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="outline" className="w-full justify-start group" size="lg">
                      <item.icon className={cn("mr-3 w-5 h-5 transition-colors", `group-hover:text-${item.color}-400`)} />
                      {item.label}
                      <ArrowUpRight className="ml-auto w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </motion.div>
                </Link>
              ))}
            </CardContent>
          </SpotlightCard>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.3}>
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="h-full relative overflow-hidden border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-indigo-500/5">
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              
              <CardHeader className="relative">
                <CardTitle className="text-gradient text-2xl">Start Generating</CardTitle>
                <CardDescription>Create your first dataset</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <p className="text-sm text-gray-400 mb-6">
                  Choose from multiple data types, configure your settings, and generate production-ready synthetic data instantly.
                </p>
                <Link href="/dashboard/generate">
                  <motion.div
                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="gradient" size="lg" className="w-full text-lg">
                      Go to Generator
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowUpRight className="ml-2 w-5 h-5" />
                      </motion.span>
                    </Button>
                  </motion.div>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </FadeInWhenVisible>
      </div>

      {/* Recent Generations */}
      <FadeInWhenVisible delay={0.4}>
        <Card className="border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  Recent Generations
                </CardTitle>
                <CardDescription>Your latest data generation jobs</CardDescription>
              </div>
              <Link href="/dashboard/history">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="sm" className="group">
                    View All
                    <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {jobsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Skeleton className="h-20 w-full rounded-xl" />
                  </motion.div>
                ))}
              </div>
            ) : recentJobs && recentJobs.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {recentJobs.map((job: any, index: number) => (
                    <Link key={job.id} href={`/dashboard/history?job=${job.id}`}>
                      <JobRow job={job} index={index} />
                    </Link>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Database className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                </motion.div>
                <p className="text-gray-400 mb-6">No generations yet</p>
                <Link href="/dashboard/generate">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="gradient" size="lg">
                      <Sparkles className="mr-2 w-5 h-5" />
                      Generate Your First Dataset
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </FadeInWhenVisible>
    </div>
  )
}
