'use client'

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Download, 
  Trash2, 
  Search, 
  Filter,
  Clock,
  Database,
  MoreVertical,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Loader2,
  Calendar,
  FileText,
  Activity,
  TrendingUp,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { generatorApi, Job } from "@/lib/api"
import { formatDate, formatNumber, formatBytes, downloadFile } from "@/lib/utils"
import { JOB_STATUSES } from "@/lib/constants"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { 
  FadeInWhenVisible,
  ProgressBar,
  StatusBadge,
  AnimatedCheckmark,
  AnimatedCross,
  LoadingSpinner,
  AnimatedNumber,
  TiltCard,
  SpotlightCard
} from "@/components/animations"
import Link from "next/link"

// Timeline Job Card Component
function JobCard({ job, index, onDownload, onDelete, isDeleting, isDownloading }: { 
  job: Job
  index: number
  onDownload: () => void
  onDelete: () => void
  isDeleting: boolean
  isDownloading: boolean
}) {
  const statusConfig: Record<string, { 
    icon: React.ReactNode
    color: string
    bgColor: string
    borderColor: string
  }> = {
    completed: {
      icon: <AnimatedCheckmark size={20} className="text-green-400" />,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30'
    },
    processing: {
      icon: <LoadingSpinner size="sm" />,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30'
    },
    pending: {
      icon: <Clock className="w-5 h-5 text-blue-400" />,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30'
    },
    failed: {
      icon: <AnimatedCross size={20} className="text-red-400" />,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30'
    }
  }

  const config = statusConfig[job.status] || statusConfig.pending

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 30 }}
      transition={{ delay: index * 0.05 }}
      className="relative"
    >
      {/* Timeline connector */}
      <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-purple-500/50 to-transparent" />
      
      <motion.div
        whileHover={{ scale: 1.01, x: 4 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Card className={cn(
          "relative overflow-hidden transition-all",
          "hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10",
          config.borderColor
        )}>
          {/* Status indicator bar */}
          <div className={cn("absolute top-0 left-0 right-0 h-1", config.bgColor)}>
            {job.status === 'processing' && (
              <motion.div
                className="h-full bg-yellow-500/50"
                initial={{ width: '0%' }}
                animate={{ width: `${job.progress || 0}%` }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>

          <CardContent className="p-6 pt-8">
            <div className="flex items-start gap-4">
              {/* Status icon */}
              <motion.div 
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                  config.bgColor
                )}
                animate={job.status === 'processing' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 1.5, repeat: job.status === 'processing' ? Infinity : 0 }}
              >
                {config.icon}
              </motion.div>

              {/* Job details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold capitalize">
                    {job.data_type.replace('_', ' ')} Data
                  </h3>
                  <StatusBadge 
                    status={job.status === 'completed' ? 'success' : 
                            job.status === 'failed' ? 'error' :
                            job.status === 'processing' ? 'warning' : 'pending'}
                  >
                    {JOB_STATUSES[job.status].label}
                  </StatusBadge>
                </div>
                
                {/* Stats grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Job ID</p>
                    <p className="font-mono text-sm text-purple-400 truncate">{job.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Records</p>
                    <p className="font-semibold">
                      <AnimatedNumber value={job.record_count} duration={0.5} />
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Format</p>
                    <p className="font-medium uppercase text-sm">{job.output_format}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Created</p>
                    <p className="text-sm flex items-center gap-1 text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(job.created_at)}
                    </p>
                  </div>
                </div>

                {/* Progress bar for processing jobs */}
                {job.status === 'processing' && job.progress !== undefined && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-400">Processing...</span>
                      <span className="font-semibold text-yellow-400">{job.progress}%</span>
                    </div>
                    <ProgressBar 
                      progress={job.progress} 
                      showPercentage={false}
                      height={8}
                    />
                  </div>
                )}

                {/* File size for completed jobs */}
                {job.status === 'completed' && job.file_size && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-sm text-gray-400 mt-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>File size: {formatBytes(job.file_size)}</span>
                  </motion.div>
                )}

                {/* Error message for failed jobs */}
                {job.status === 'failed' && job.error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
                  >
                    <p className="text-sm text-red-400 flex items-center gap-2">
                      <XCircle className="w-4 h-4 flex-shrink-0" />
                      {job.error}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-shrink-0">
                {job.status === 'completed' && (
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onDownload}
                      disabled={isDownloading}
                      className="gap-2 border-green-500/30 hover:border-green-500/50 hover:bg-green-500/10"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 text-green-400" />
                      )}
                    </Button>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="gap-2 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-400" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

// Stats Summary Component
function StatsSummary({ jobs }: { jobs: Job[] }) {
  const completed = jobs.filter(j => j.status === 'completed').length
  const processing = jobs.filter(j => j.status === 'processing').length
  const totalRecords = jobs.reduce((sum, j) => sum + j.record_count, 0)

  const stats = [
    { label: 'Total Jobs', value: jobs.length, icon: Database, color: 'purple' },
    { label: 'Completed', value: completed, icon: CheckCircle2, color: 'green' },
    { label: 'Processing', value: processing, icon: Activity, color: 'yellow' },
    { label: 'Total Records', value: totalRecords, icon: TrendingUp, color: 'blue' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="border-white/10 hover:border-purple-500/30 transition-all">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  `bg-${stat.color}-500/10`
                )}>
                  <stat.icon className={cn("w-5 h-5", `text-${stat.color}-400`)} />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    <AnimatedNumber value={stat.value} duration={1} />
                  </p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

export default function HistoryPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const queryClient = useQueryClient()

  const { data: jobs, isLoading, isRefetching } = useQuery({
    queryKey: ['jobs'],
    queryFn: generatorApi.getJobs,
    refetchInterval: 5000,
  })

  const deleteMutation = useMutation({
    mutationFn: generatorApi.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] })
      toast.success('Job deleted successfully', {
        icon: <Trash2 className="w-5 h-5 text-red-400" />,
      })
    },
    onError: () => {
      toast.error('Failed to delete job')
    },
  })

  const downloadMutation = useMutation({
    mutationFn: async (job: Job) => {
      const blob = await generatorApi.downloadJob(job.id)
      const filename = `${job.data_type}_${job.record_count}.${job.output_format}`
      downloadFile(await blob.text(), filename, blob.type)
    },
    onSuccess: () => {
      toast.success('Download started', {
        icon: <Download className="w-5 h-5 text-green-400" />,
      })
    },
    onError: () => {
      toast.error('Failed to download file')
    },
  })

  const filteredJobs = jobs?.filter((job) => {
    const matchesSearch = job.data_type.toLowerCase().includes(search.toLowerCase()) ||
                         job.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-heading font-bold">Generation History</h1>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="w-8 h-8 text-purple-500" />
            </motion.div>
          </div>
          <p className="text-gray-400">View and manage your data generation jobs</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['jobs'] })}
            className="gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", isRefetching && "animate-spin")} />
            Refresh
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Summary */}
      {jobs && jobs.length > 0 && <StatsSummary jobs={jobs} />}

      {/* Filters */}
      <FadeInWhenVisible>
        <SpotlightCard>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <Input
                  placeholder="Search by data type or job ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 focus:border-purple-500"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', ...Object.keys(JOB_STATUSES)].map((status) => (
                  <motion.div
                    key={status}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={statusFilter === status ? 'default' : 'outline'}
                      onClick={() => setStatusFilter(status)}
                      size="sm"
                      className={cn(
                        statusFilter === status && "ring-2 ring-purple-500 ring-offset-2 ring-offset-black"
                      )}
                    >
                      {status === 'all' ? 'All' : JOB_STATUSES[status as keyof typeof JOB_STATUSES].label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </SpotlightCard>
      </FadeInWhenVisible>

      {/* Jobs Timeline */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Skeleton className="h-40 w-full rounded-xl" />
              </motion.div>
            ))}
          </div>
        ) : filteredJobs && filteredJobs.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredJobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                index={index}
                onDownload={() => downloadMutation.mutate(job)}
                onDelete={() => {
                  if (confirm('Are you sure you want to delete this job?')) {
                    deleteMutation.mutate(job.id)
                  }
                }}
                isDeleting={deleteMutation.isPending}
                isDownloading={downloadMutation.isPending}
              />
            ))}
          </AnimatePresence>
        ) : (
          <FadeInWhenVisible>
            <Card className="border-white/10">
              <CardContent className="py-20 text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Database className="w-20 h-20 mx-auto text-gray-600 mb-6" />
                </motion.div>
                <h3 className="text-2xl font-semibold mb-3">No jobs found</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  {search || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters to find what you\'re looking for' 
                    : 'Start generating data to see your jobs here. It only takes a few seconds!'}
                </p>
                {!search && statusFilter === 'all' && (
                  <Link href="/dashboard/generate">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button variant="gradient" size="lg" className="gap-2">
                        <Sparkles className="w-5 h-5" />
                        Generate Your First Dataset
                      </Button>
                    </motion.div>
                  </Link>
                )}
              </CardContent>
            </Card>
          </FadeInWhenVisible>
        )}
      </div>
    </div>
  )
}
