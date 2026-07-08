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
import { formatDate, formatNumber, formatBytes } from "@/lib/utils"
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
import { Link } from "next-view-transitions"

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
      icon: <AnimatedCheckmark size={20} className="text-emerald-500" />,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-500/30'
    },
    processing: {
      icon: <LoadingSpinner size="sm" />,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-500/30'
    },
    pending: {
      icon: <Clock className="w-5 h-5 text-gray-500" />,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-500/30'
    },
    failed: {
      icon: <AnimatedCross size={20} className="text-red-500" />,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
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
      <div className="absolute left-6 top-16 bottom-0 w-px bg-black/10" />
      
      <motion.div
        whileHover={{ scale: 1.01, x: 4 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Card className={cn(
          "relative overflow-hidden transition-all bg-white rounded-sm",
          "hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-black/10",
          config.borderColor
        )}>
          {/* Status indicator bar */}
          <div className={cn("absolute top-0 left-0 right-0 h-1", config.bgColor)}>
            {job.status === 'processing' && (
              <motion.div
                className="h-full bg-amber-500"
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
                  "w-12 h-12 rounded-sm flex items-center justify-center flex-shrink-0",
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
                  <h3 className="text-[12px] font-bold uppercase tracking-tight text-black">
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
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Job ID</p>
                    <p className="font-mono text-[10px] text-black truncate">{job.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Records</p>
                    <p className="font-mono text-sm text-black font-bold">
                      <AnimatedNumber value={job.record_count} duration={0.5} />
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Format</p>
                    <p className="font-mono font-bold uppercase text-[10px] text-black">{job.output_format}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Created</p>
                    <p className="text-[10px] flex items-center gap-1 text-black font-mono">
                      <Calendar className="w-3 h-3" />
                      {formatDate(job.created_at)}
                    </p>
                  </div>
                </div>

                {/* Progress bar for processing jobs */}
                {job.status === 'processing' && job.progress !== undefined && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest mb-2">
                      <span className="text-gray-500">Processing...</span>
                      <span className="font-bold text-black">{job.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-none overflow-hidden">
                      <motion.div
                        className="h-full bg-black rounded-none"
                        initial={{ width: '0%' }}
                        animate={{ width: `${job.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}

                {/* File size for completed jobs */}
                {job.status === 'completed' && job.file_size && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-[10px] font-mono uppercase text-gray-500 tracking-widest mt-2"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>File size: {formatBytes(job.file_size)}</span>
                  </motion.div>
                )}

                {/* Error message for failed jobs */}
                {job.status === 'failed' && job.error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3 rounded-sm bg-red-50 border border-red-200"
                  >
                    <p className="text-[10px] font-mono uppercase tracking-widest text-red-600 flex items-center gap-2">
                      <XCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      {job.error}
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-shrink-0">
                {job.status === 'completed' && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onDownload}
                      disabled={isDownloading}
                      className="gap-2 border-black/10 hover:border-black hover:bg-black/5 rounded-sm"
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-black" />
                      ) : (
                        <Download className="w-4 h-4 text-black" />
                      )}
                    </Button>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="gap-2 border-red-500/30 hover:border-red-500 hover:bg-red-50 hover:text-red-600 rounded-sm"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-red-500" />
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
          <Card className="bg-white border border-black/10 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all rounded-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500">
                  {stat.label}
                </span>
                <div className="p-2 bg-black text-white rounded-sm">
                  <stat.icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight text-black">
                <AnimatedNumber value={stat.value} duration={1} />
              </p>
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
      const filename = `${job.data_type}_${job.record_count}.${job.output_format}`
      await generatorApi.downloadJob(job.id, filename)
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
            <h1 className="text-4xl font-bold tracking-tight uppercase text-black">Generation History</h1>
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="w-8 h-8 text-black" />
            </motion.div>
          </div>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">View and manage your data generation jobs</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['jobs'] })}
            className="gap-2 border-black/10 text-black hover:bg-black/5 hover:border-black rounded-sm uppercase font-mono text-[10px] font-bold"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isRefetching && "animate-spin")} />
            Refresh
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Summary */}
      {jobs && jobs.length > 0 && <StatsSummary jobs={jobs} />}

      {/* Filters */}
      <FadeInWhenVisible>
        <Card className="bg-white border-black/10 rounded-sm shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                <Input
                  placeholder="Search by data type or job ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white border border-black/10 focus:border-black text-black font-mono text-sm rounded-sm"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', ...Object.keys(JOB_STATUSES)].map((status) => (
                  <motion.div
                    key={status}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={statusFilter === status ? 'default' : 'outline'}
                      onClick={() => setStatusFilter(status)}
                      size="sm"
                      className={cn(
                        "rounded-sm uppercase font-mono text-[10px] font-bold",
                        statusFilter === status 
                          ? "bg-black text-white hover:bg-black/90 ring-1 ring-black ring-offset-1" 
                          : "border-black/10 text-gray-500 hover:text-black hover:border-black hover:bg-black/5 bg-white"
                      )}
                    >
                      {status === 'all' ? 'All' : JOB_STATUSES[status as keyof typeof JOB_STATUSES].label}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
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
                <Skeleton className="h-40 w-full rounded-sm" />
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
            <Card className="bg-white border-black/10 rounded-sm">
              <CardContent className="py-20 text-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Database className="w-16 h-16 mx-auto text-black mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold tracking-tight uppercase text-black mb-3">No jobs found</h3>
                <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-8 max-w-md mx-auto">
                  {search || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filters to find what you\'re looking for' 
                    : 'Start generating data to see your jobs here. It only takes a few seconds!'}
                </p>
                {!search && statusFilter === 'all' && (
                  <Link href="/dashboard/generate">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button className="bg-black text-white hover:bg-black/90 rounded-sm gap-2 uppercase font-mono text-[11px] font-bold tracking-widest h-12 px-6">
                        <Sparkles className="w-4 h-4" />
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
