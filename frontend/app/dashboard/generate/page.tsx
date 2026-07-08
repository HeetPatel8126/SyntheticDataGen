'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { useMutation, useQuery } from "@tanstack/react-query"
import { 
  Users, 
  ShoppingCart, 
  Building2, 
  Heart,
  DollarSign,
  GraduationCap,
  Share2,
  Sparkles, 
  Download,
  Settings2,
  ChevronDown,
  Loader2,
  Check,
  Zap,
  Clock,
  Database,
  FileText,
  Code,
  Table,
  Lock,
  Activity,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useGeneratorStore } from "@/lib/store"
import { generatorApi } from "@/lib/api"
import { DATA_TYPES, OUTPUT_FORMATS, LOCALES, RECORD_COUNT_PRESETS } from "@/lib/constants"
import { formatNumber } from "@/lib/utils"
import { toast } from "sonner"
import confetti from "canvas-confetti"
import { cn } from "@/lib/utils"
import { FadeInWhenVisible, SpotlightCard } from "@/components/animations"
import { AnimatedNumber } from "@/components/animations/AnimatedNumber"
import { ProgressRing } from "@/components/animations/ProgressRing"
import { LoadingDots } from "@/components/animations/LoadingStates"
import { AnimatedCheckmark } from "@/components/animations/AnimatedIcon"

const iconMap = {
  Users,
  ShoppingCart,
  Building2,
  Heart,
  DollarSign,
  GraduationCap,
  Share2,
}

// Animated data type card
function DataTypeCard({ 
  type, 
  isSelected, 
  onClick 
}: { 
  type: (typeof DATA_TYPES)[number]
  isSelected: boolean
  onClick: () => void
}) {
  const Icon = iconMap[type.icon as keyof typeof iconMap]
  const isComingSoon = 'comingSoon' in type && type.comingSoon
  
  return (
    <motion.button
      whileHover={isComingSoon ? {} : { scale: 1.02, y: -2 }}
      whileTap={isComingSoon ? {} : { scale: 0.98 }}
      onClick={isComingSoon ? undefined : onClick}
      disabled={isComingSoon ? true : false}
      className={cn(
        "w-full p-4 rounded-sm border text-left transition-all group relative overflow-hidden",
        isComingSoon
          ? "border-black/5 bg-gray-50 opacity-60 cursor-not-allowed"
          : isSelected
          ? "border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] bg-gray-50"
          : "border-black/10 hover:border-black/30 hover:shadow-sm bg-white"
      )}
    >
      <div className="relative flex items-start gap-4">
        <motion.div 
          className={cn(
            "w-12 h-12 rounded-sm flex items-center justify-center border transition-all",
            isComingSoon
              ? "bg-gray-100 border-black/5"
              : isSelected ? "bg-black border-black shadow-none" : "bg-white border-black/10 shadow-sm"
          )}
          whileHover={isComingSoon ? {} : { scale: 1.05 }}
          animate={isSelected && !isComingSoon ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1.5, repeat: isSelected && !isComingSoon ? Infinity : 0 }}
        >
          {Icon && <Icon className={cn("w-6 h-6", isComingSoon ? "text-gray-400" : isSelected ? "text-white" : "text-black")} />}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <p className={cn("font-bold text-lg uppercase tracking-tight", isComingSoon ? "text-gray-400" : "text-black")}>{type.name}</p>
              {isComingSoon && (
                <Badge className="text-[8px] bg-gray-200 text-gray-500 border-0 rounded-sm px-2 py-0.5 font-mono uppercase tracking-widest">
                  <Lock className="w-2.5 h-2.5 mr-1" />
                  Coming Soon
                </Badge>
              )}
            </div>
            <AnimatePresence>
              {isSelected && !isComingSoon && (
                <motion.div
                  key="check-icon"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <div className="w-6 h-6 rounded-sm bg-black flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-[10px] text-gray-500 mb-3 font-mono uppercase tracking-widest">{type.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {type.fields.slice(0, 4).map((field, i) => (
              <motion.span
                key={field}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Badge variant="outline" className={cn("text-[10px] font-mono rounded-sm uppercase border-black/10 bg-white", isComingSoon ? "text-gray-400" : "text-gray-600")}>
                  {field}
                </Badge>
              </motion.span>
            ))}
            {type.fields.length > 4 && (
              <Badge variant="outline" className="text-[10px] font-mono rounded-sm uppercase border-black/10 text-gray-600 bg-white">
                +{type.fields.length - 4} MORE
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  )
}

function GenerateButton({ 
  isGenerating, 
  generationComplete, 
  recordCount, 
  onClick 
}: { 
  isGenerating: boolean
  generationComplete: boolean
  recordCount: number
  onClick: () => void
}) {
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
    generating: { scale: 1 },
    complete: { scale: 1 }
  }

  const getButtonState = () => {
    if (generationComplete) return 'complete'
    if (isGenerating) return 'generating'
    return 'idle'
  }

  return (
    <motion.div
      variants={buttonVariants}
      initial="idle"
      animate={getButtonState()}
      whileHover={!isGenerating && !generationComplete ? "hover" : undefined}
      whileTap={!isGenerating && !generationComplete ? "tap" : undefined}
    >
      <Button
        size="xl"
        className={cn(
          "w-full relative overflow-hidden rounded-sm font-mono uppercase tracking-widest text-[12px] h-14 transition-all duration-300",
          generationComplete ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100" : "bg-black text-white hover:bg-gray-800",
          isGenerating && "cursor-wait bg-gray-900 shadow-inner"
        )}
        onClick={onClick}
        disabled={isGenerating || generationComplete}
      >
        <span className="relative flex items-center justify-center gap-3 font-bold">
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-5 h-5" />
              </motion.div>
              <span>GENERATING</span>
              <LoadingDots size="sm" color="white" />
            </>
          ) : generationComplete ? (
            <>
              <AnimatedCheckmark size={20} className="text-emerald-500" />
              <span>GENERATION COMPLETE</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>GENERATE {formatNumber(recordCount)} RECORDS</span>
            </>
          )}
        </span>
      </Button>
    </motion.div>
  )
}

// Animated record count display
function RecordCountSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-6">
      {/* Large animated number display */}
      <motion.div 
        className="text-center py-4"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="text-5xl font-bold tracking-tight text-black mb-1 font-mono">
          <AnimatedNumber value={value} duration={0.3} />
        </div>
        <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">RECORDS</span>
      </motion.div>

      {/* Enhanced slider */}
      <div className="relative px-2 mt-4">
        <Slider
          value={[Math.log10(value)]}
          onValueChange={(v) => onChange(Math.round(Math.pow(10, v[0])))}
          min={2}
          max={6}
          step={0.01}
          className="w-full"
        />
        {/* Scale markers */}
        <div className="flex justify-between mt-4 text-[10px] font-bold font-mono text-gray-400 uppercase">
          <span>100</span>
          <span>1K</span>
          <span>10K</span>
          <span>100K</span>
          <span>1M</span>
        </div>
      </div>

      {/* Quick preset buttons */}
      <div className="flex gap-2">
        {RECORD_COUNT_PRESETS.map((preset, i) => (
          <motion.div
            key={preset.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex-1"
          >
            <Button
              variant={value === preset.value ? "default" : "outline"}
              size="sm"
              onClick={() => onChange(preset.value)}
              className={cn(
                "w-full transition-all rounded-sm font-mono text-[10px] uppercase font-bold",
                value === preset.value 
                  ? "bg-black text-white hover:bg-gray-800 border-transparent shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)]" 
                  : "bg-white text-black border-black/10 hover:border-black/30 hover:bg-gray-50 shadow-none"
              )}
            >
              {preset.label}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Enhanced preview component
function PreviewPanel({ data, isLoading }: { data: any[]; isLoading: boolean }) {
  const [activeTab, setActiveTab] = useState('table')

  return (
    <Card className="h-full border-black/10 overflow-hidden rounded-sm bg-white">
      <CardHeader className="border-b border-black/10 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 font-bold uppercase tracking-tight">
              <Database className="w-4 h-4 text-black" />
              Live Preview
            </CardTitle>
            <CardDescription className="text-[10px] font-mono uppercase tracking-widest mt-1">
              Sample of what will be generated
            </CardDescription>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" size="sm" className="gap-2 rounded-sm font-mono text-[10px] uppercase h-8 border-black/10 hover:border-black">
              <Download className="w-3.5 h-3.5" />
              Download Sample
            </Button>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4 border-b border-black/10">
            <TabsList className="bg-gray-100 rounded-sm">
              <TabsTrigger value="table" className="gap-2 rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm font-mono text-[10px] uppercase">
                <Table className="w-3 h-3" />
                Table
              </TabsTrigger>
              <TabsTrigger value="json" className="gap-2 rounded-sm data-[state=active]:bg-white data-[state=active]:shadow-sm font-mono text-[10px] uppercase">
                <Code className="w-3 h-3" />
                JSON
              </TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent key="table-tab" value="table" className="mt-0 p-4">
              {isLoading ? (
                <PreviewSkeleton />
              ) : data.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-black/10 rounded-sm overflow-hidden bg-white"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-black/10">
                        <tr>
                          {Object.keys(data[0] || {}).map((key, i) => (
                            <motion.th
                              key={key}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-black"
                            >
                              {key}
                            </motion.th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((row, i) => (
                          <motion.tr 
                            key={i} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="border-b border-black/5 hover:bg-gray-50 transition-colors"
                          >
                            {Object.values(row).map((value: any, j) => (
                              <td key={j} className="px-4 py-3 text-gray-600 font-mono text-xs">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </td>
                            ))}
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : (
                <EmptyPreview />
              )}
            </TabsContent>

            <TabsContent key="json-tab" value="json" className="mt-0 p-4">
              {isLoading ? (
                <PreviewSkeleton />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-black/10 rounded-sm p-4 bg-gray-50 max-h-[500px] overflow-auto"
                >
                  <pre className="text-xs font-mono text-gray-800">
                    {formatJSON(data)}
                  </pre>
                </motion.div>
              )}
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function PreviewSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Database className="w-8 h-8 text-black mb-4 opacity-20" />
      </motion.div>
      <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-2">Loading preview...</p>
      <LoadingDots size="md" />
    </div>
  )
}

function EmptyPreview() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <Database className="w-8 h-8 text-black opacity-20 mb-4" />
      <p className="text-black font-bold uppercase tracking-widest mb-1 text-[12px]">No preview data available</p>
      <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Select a data type to see a preview</p>
    </motion.div>
  )
}

function formatJSON(data: any[]): React.ReactNode {
  const json = JSON.stringify(data, null, 2)
  return json.split('\n').map((line, i) => {
    const colored = line
      .replace(/"([^"]+)":/g, '<span class="text-gray-800 font-bold">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="text-blue-600">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="text-emerald-600">$1</span>')
      .replace(/: (true|false)/g, ': <span class="text-purple-600">$1</span>')
    return (
      <div key={i} dangerouslySetInnerHTML={{ __html: colored }} />
    )
  })
}

export default function GeneratePage() {
  const {
    dataType,
    recordCount,
    outputFormat,
    locale,
    setDataType,
    setRecordCount,
    setOutputFormat,
    setLocale,
    isGenerating,
    setIsGenerating,
    previewData,
    setPreviewData,
    addJob,
    updateJob,
  } = useGeneratorStore()

  const [activeJobId, setActiveJobId] = useState<string | null>(null)
  const [jobProgress, setJobProgress] = useState(0)
  const [jobStatus, setJobStatus] = useState<string | null>(null)

  // Poll for job status after generation
  useEffect(() => {
    if (!activeJobId) return
    let cancelled = false

    const poll = async () => {
      try {
        const job = await generatorApi.getJob(activeJobId)
        if (cancelled) return
        
        setJobProgress(job.progress ?? 0)
        setJobStatus(job.status)
        
        if (job.status === 'completed') {
          setIsGenerating(false)
          // Update the job in store
          updateJob(activeJobId, { ...job })
          
          // Confetti celebration
          const duration = 3 * 1000
          const animationEnd = Date.now() + duration
          const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }
          const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min
          const interval: ReturnType<typeof setInterval> = setInterval(() => {
            const timeLeft = animationEnd - Date.now()
            if (timeLeft <= 0) return clearInterval(interval)
            const particleCount = 50 * (timeLeft / duration)
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
          }, 250)
          
          toast.success('Generation complete!', {
            description: `${formatNumber(recordCount)} records generated successfully`,
            icon: <Sparkles className="w-5 h-5 text-green-500" />,
            action: {
              label: 'Download',
              onClick: () => {
                generatorApi.downloadJob(activeJobId, `${dataType}_${recordCount}.${outputFormat}`)
              },
            },
          })
          
          return
        }

        if (job.status === 'failed') {
          setIsGenerating(false)
          setActiveJobId(null)
          toast.error('Generation failed', { description: job.error || 'Unknown error' })
          return
        }

        // Still processing, poll again
        setTimeout(poll, 1000)
      } catch (err) {
        if (!cancelled) setTimeout(poll, 2000)
      }
    }

    poll()
    return () => { cancelled = true }
  }, [activeJobId])

  // Load preview data
  const { refetch: loadPreview, isFetching: previewLoading } = useQuery({
    queryKey: ['preview', dataType, locale],
    queryFn: () => generatorApi.preview({
      data_type: dataType,
      record_count: 10,
      output_format: 'json',
      locale,
    }),
    enabled: false,
  })

  useEffect(() => {
    loadPreview().then((result) => {
      if (result.data) {
        setPreviewData(result.data)
      }
    })
  }, [dataType, locale])

  // Generate mutation
  const generateMutation = useMutation({
    mutationFn: generatorApi.generate,
    onSuccess: (job) => {
      addJob(job)
      setActiveJobId(job.id)
      setJobProgress(0)
      setJobStatus('pending')
      
      toast.success('Generation started!', {
        description: `Generating ${formatNumber(recordCount)} ${dataType} records...`,
        icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      })
    },
    onError: (error: any) => {
      setIsGenerating(false)
      toast.error('Generation failed', {
        description: error.response?.data?.error || error.message || 'Something went wrong',
      })
    },
  })

  const handleGenerate = () => {
    setIsGenerating(true)
    generateMutation.mutate({
      data_type: dataType,
      record_count: recordCount,
      output_format: outputFormat,
      locale,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black uppercase tracking-tight">Generate Data</h1>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Configure your dataset parameters</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-black/10 shadow-sm rounded-sm bg-white">
            <CardHeader className="border-b border-black/10">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-black flex items-center gap-2">
                <Database className="w-4 h-4" />
                Data Type
              </CardTitle>
              <CardDescription className="text-[10px] font-mono uppercase tracking-widest">
                Select the structure of your synthetic data
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-3">
                {DATA_TYPES.map((type) => (
                  <DataTypeCard
                    key={type.id}
                    type={type}
                    isSelected={dataType === type.id}
                    onClick={() => setDataType(type.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-black/10 shadow-sm rounded-sm bg-white">
            <CardHeader className="border-b border-black/10">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-black flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Volume & Output
              </CardTitle>
              <CardDescription className="text-[10px] font-mono uppercase tracking-widest">
                Configure scale and format
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <RecordCountSlider value={recordCount} onChange={setRecordCount} />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-bold font-mono uppercase text-gray-500 tracking-widest">
                    Format
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {OUTPUT_FORMATS.map((format) => (
                      <Button
                        key={format.id}
                        variant={outputFormat === format.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setOutputFormat(format.id)}
                        className={cn(
                          "rounded-sm font-mono text-[10px] uppercase font-bold",
                          outputFormat === format.id 
                            ? "bg-black text-white" 
                            : "bg-white text-black border-black/10 hover:border-black/30"
                        )}
                      >
                        {format.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold font-mono uppercase text-gray-500 tracking-widest">
                    Locale
                  </label>
                  <div className="relative">
                    <select
                      value={locale}
                      onChange={(e) => setLocale(e.target.value)}
                      className="w-full h-9 pl-3 pr-8 text-[11px] font-mono border border-black/10 rounded-sm appearance-none bg-white hover:border-black/30 transition-colors uppercase cursor-pointer"
                    >
                      {LOCALES.map((l) => (
                        <option key={l.value} value={l.value}>
                          {l.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ROADMAP SECTION */}
          <Card className="border-black/10 shadow-sm rounded-sm bg-white overflow-hidden opacity-75">
            <CardHeader className="bg-gray-50 border-b border-black/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-black flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    Advanced Features
                  </CardTitle>
                  <CardDescription className="text-[10px] font-mono uppercase tracking-widest mt-1">
                    Platform Roadmap
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="text-[9px] uppercase font-mono tracking-widest bg-purple-100 text-purple-700 rounded-sm">
                  COMING SOON
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-black/10">
                <div className="p-4 flex items-center justify-between bg-white">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-tight text-gray-700">LLM Dictionary Expansion</h4>
                    <p className="text-[9px] font-mono text-gray-400 mt-1 uppercase">Expand fields using contextual LLM generation</p>
                  </div>
                  <div className="w-10 h-5 bg-gray-200 rounded-full cursor-not-allowed"></div>
                </div>
                <div className="p-4 flex items-center justify-between bg-white">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-tight text-gray-700">Differential Privacy</h4>
                    <p className="text-[9px] font-mono text-gray-400 mt-1 uppercase">Mathematical guarantees for sensitive fields</p>
                  </div>
                  <div className="w-10 h-5 bg-gray-200 rounded-full cursor-not-allowed"></div>
                </div>
                <div className="p-4 flex items-center justify-between bg-white">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-tight text-gray-700">Correlated Fields</h4>
                    <p className="text-[9px] font-mono text-gray-400 mt-1 uppercase">Maintain relational integrity across tables</p>
                  </div>
                  <div className="w-10 h-5 bg-gray-200 rounded-full cursor-not-allowed"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <GenerateButton
            isGenerating={isGenerating}
            generationComplete={jobStatus === 'completed'}
            recordCount={recordCount}
            onClick={handleGenerate}
          />

          <AnimatePresence>
            {(isGenerating || jobStatus === 'completed') && activeJobId && (
              <motion.div
                key="job-progress-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="border-black/10 shadow-sm rounded-sm bg-white overflow-hidden mt-6">
                  <CardHeader className="border-b border-black/10 bg-gray-50 pb-4">
                    <CardTitle className="text-[10px] font-mono uppercase tracking-widest text-black flex items-center gap-2">
                      <Activity className="w-4 h-4 text-black" />
                      TASK ID: {activeJobId.slice(0, 8)}...
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest font-bold">
                      <span className="text-black flex items-center gap-2">
                        {jobStatus === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                        )}
                        {jobStatus === 'completed' ? 'BATCH COMPLETED' :
                         jobStatus === 'processing' ? 'PROCESSING BATCH...' :
                         'QUEUED...'}
                      </span>
                      <span className="text-black text-xs">{Math.round(jobProgress)}%</span>
                    </div>
                    
                    <ProgressRing progress={jobProgress} className="h-2 rounded-full" />

                    {jobStatus === 'completed' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Button
                          className="w-full gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-sm font-mono text-[10px] uppercase font-bold tracking-widest h-10 mt-4 border border-emerald-200"
                          onClick={() => {
                            generatorApi.downloadJob(activeJobId, `${dataType}_${recordCount}.${outputFormat}`)
                          }}
                        >
                          <Download className="w-4 h-4" />
                          DOWNLOAD {outputFormat.toUpperCase()}
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-500 pt-4">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>Estimated time: ~{Math.max(1, Math.round(recordCount / 100000))} seconds</span>
          </div>
        </div>

        {/* Right Column: Preview Panel */}
        <div className="lg:col-span-2">
          <PreviewPanel data={previewData} isLoading={previewLoading} />
        </div>
      </div>
    </div>
  )
}
