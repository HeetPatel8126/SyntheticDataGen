'use client'

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { useMutation, useQuery } from "@tanstack/react-query"
import { 
  Users, 
  ShoppingCart, 
  Building2, 
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
  Table
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
}

// Animated data type card
function DataTypeCard({ 
  type, 
  isSelected, 
  onClick 
}: { 
  type: typeof DATA_TYPES[0]
  isSelected: boolean
  onClick: () => void
}) {
  const Icon = iconMap[type.icon as keyof typeof iconMap]
  
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "w-full p-4 rounded-xl border text-left transition-all group relative overflow-hidden",
        isSelected
          ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
          : "border-white/10 hover:border-white/20"
      )}
    >
      {/* Animated background gradient */}
      <motion.div
        className={cn(
          "absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300",
          type.color,
          isSelected ? "opacity-10" : "group-hover:opacity-5"
        )}
      />
      
      {/* Selection glow effect */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 border-2 border-purple-500/50 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      <div className="relative flex items-start gap-4">
        <motion.div 
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-lg",
            type.color
          )}
          whileHover={{ scale: 1.1, rotate: 5 }}
          animate={isSelected ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 1.5, repeat: isSelected ? Infinity : 0 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="font-semibold text-lg">{type.name}</p>
            <AnimatePresence>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-sm text-gray-400 mb-3">{type.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {type.fields.slice(0, 4).map((field, i) => (
              <motion.span
                key={field}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <Badge variant="secondary" className="text-xs bg-white/5">
                  {field}
                </Badge>
              </motion.span>
            ))}
            {type.fields.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-white/5">
                +{type.fields.length - 4} more
              </Badge>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  )
}

// Enhanced Generate Button with multiple states
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
        variant="gradient"
        size="xl"
        className={cn(
          "w-full relative overflow-hidden",
          generationComplete && "bg-green-500 hover:bg-green-600",
          isGenerating && "cursor-wait"
        )}
        onClick={onClick}
        disabled={isGenerating || generationComplete}
      >
        {/* Animated background shimmer */}
        {!isGenerating && !generationComplete && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        )}
        
        {/* Loading spinner animation */}
        {isGenerating && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          />
        )}

        <span className="relative flex items-center justify-center gap-2 text-lg font-semibold">
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-5 h-5" />
              </motion.div>
              <span>Generating</span>
              <LoadingDots size="sm" color="white" />
            </>
          ) : generationComplete ? (
            <>
              <AnimatedCheckmark size={20} color="white" />
              <span>Generation Complete!</span>
            </>
          ) : (
            <>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              <span>Generate {formatNumber(recordCount)} Records</span>
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
        <div className="text-5xl font-heading font-bold text-gradient mb-1">
          <AnimatedNumber value={value} duration={0.3} />
        </div>
        <span className="text-gray-400 text-sm">records</span>
      </motion.div>

      {/* Enhanced slider */}
      <div className="relative px-2">
        <Slider
          value={[Math.log10(value)]}
          onValueChange={(v) => onChange(Math.round(Math.pow(10, v[0])))}
          min={2}
          max={6}
          step={0.01}
          className="w-full"
        />
        {/* Scale markers */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
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
                "w-full transition-all",
                value === preset.value && "ring-2 ring-purple-500 ring-offset-2 ring-offset-black"
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
    <Card className="h-full border-white/10 overflow-hidden">
      <CardHeader className="border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-500" />
              Live Preview
            </CardTitle>
            <CardDescription>
              Sample of what will be generated
            </CardDescription>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Download Sample
            </Button>
          </motion.div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-6 pt-4 border-b border-white/10">
            <TabsList className="bg-white/5">
              <TabsTrigger value="table" className="gap-2 data-[state=active]:bg-purple-500/20">
                <Table className="w-4 h-4" />
                Table
              </TabsTrigger>
              <TabsTrigger value="json" className="gap-2 data-[state=active]:bg-purple-500/20">
                <Code className="w-4 h-4" />
                JSON
              </TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <TabsContent value="table" className="mt-0 p-4">
              {isLoading ? (
                <PreviewSkeleton />
              ) : data.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-white/10 rounded-xl overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-b border-white/10">
                        <tr>
                          {Object.keys(data[0] || {}).map((key, i) => (
                            <motion.th
                              key={key}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="px-4 py-3 text-left font-semibold text-purple-300"
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
                            className="border-b border-white/5 hover:bg-purple-500/5 transition-colors"
                          >
                            {Object.values(row).map((value: any, j) => (
                              <td key={j} className="px-4 py-3 text-gray-400 font-mono text-xs">
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

            <TabsContent value="json" className="mt-0 p-4">
              {isLoading ? (
                <PreviewSkeleton />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-white/10 rounded-xl p-4 bg-black/50 max-h-[500px] overflow-auto"
                >
                  <pre className="text-xs font-mono">
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
        <Database className="w-12 h-12 text-purple-500/50 mb-4" />
      </motion.div>
      <p className="text-gray-400">Loading preview...</p>
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
      <Database className="w-12 h-12 text-gray-600 mb-4" />
      <p className="text-gray-400">No preview data available</p>
      <p className="text-gray-500 text-sm">Select a data type to see a preview</p>
    </motion.div>
  )
}

function formatJSON(data: any[]): React.ReactNode {
  const json = JSON.stringify(data, null, 2)
  return json.split('\n').map((line, i) => {
    const colored = line
      .replace(/"([^"]+)":/g, '<span class="text-blue-400">"$1"</span>:')
      .replace(/: "([^"]+)"/g, ': <span class="text-green-400">"$1"</span>')
      .replace(/: (\d+)/g, ': <span class="text-yellow-400">$1</span>')
      .replace(/: (true|false)/g, ': <span class="text-purple-400">$1</span>')
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
  } = useGeneratorStore()

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [generationComplete, setGenerationComplete] = useState(false)

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
      setGenerationComplete(true)
      setIsGenerating(false)
      
      // Epic confetti celebration
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

      const interval: ReturnType<typeof setInterval> = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        })
      }, 250)
      
      toast.success('Generation started!', {
        description: `Job ${job.id} is now processing`,
        icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      })

      setTimeout(() => setGenerationComplete(false), 3000)
    },
    onError: (error: any) => {
      setIsGenerating(false)
      toast.error('Generation failed', {
        description: error.message || 'Something went wrong',
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-heading font-bold">Generate Data</h1>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Zap className="w-8 h-8 text-yellow-500" />
          </motion.div>
        </div>
        <p className="text-gray-400">Configure and generate synthetic datasets</p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Panel - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Type Selection */}
          <FadeInWhenVisible>
            <SpotlightCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-500" />
                  Data Type
                </CardTitle>
                <CardDescription>Choose the type of data to generate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {DATA_TYPES.map((type, i) => (
                  <motion.div
                    key={type.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <DataTypeCard
                      type={type}
                      isSelected={dataType === type.id}
                      onClick={() => setDataType(type.id)}
                    />
                  </motion.div>
                ))}
              </CardContent>
            </SpotlightCard>
          </FadeInWhenVisible>

          {/* Record Count */}
          <FadeInWhenVisible delay={0.1}>
            <SpotlightCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  Record Count
                </CardTitle>
                <CardDescription>
                  Number of records to generate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecordCountSlider value={recordCount} onChange={setRecordCount} />
              </CardContent>
            </SpotlightCard>
          </FadeInWhenVisible>

          {/* Output Format */}
          <FadeInWhenVisible delay={0.2}>
            <SpotlightCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-blue-500" />
                  Output Format
                </CardTitle>
                <CardDescription>Choose the export format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {OUTPUT_FORMATS.map((format, i) => (
                    <motion.div
                      key={format.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setOutputFormat(format.id)}
                        className={cn(
                          "w-full py-4 px-4 rounded-xl border transition-all flex flex-col items-center gap-1",
                          outputFormat === format.id
                            ? "border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20"
                            : "border-white/10 hover:border-white/20"
                        )}
                      >
                        <span className="font-semibold">{format.name}</span>
                        <span className="text-xs text-gray-500">{format.extension}</span>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </SpotlightCard>
          </FadeInWhenVisible>

          {/* Advanced Options */}
          <FadeInWhenVisible delay={0.3}>
            <SpotlightCard>
              <CardHeader>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: showAdvanced ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Settings2 className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </motion.div>
                    <CardTitle>Advanced Options</CardTitle>
                  </div>
                  <motion.div
                    animate={{ rotate: showAdvanced ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>
              </CardHeader>
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardContent className="space-y-4 pt-0">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Locale</label>
                        <select
                          value={locale}
                          onChange={(e) => setLocale(e.target.value)}
                          className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                          {LOCALES.map((loc) => (
                            <option key={loc.value} value={loc.value} className="bg-gray-900">
                              {loc.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </SpotlightCard>
          </FadeInWhenVisible>

          {/* Generate Button */}
          <FadeInWhenVisible delay={0.4}>
            <GenerateButton
              isGenerating={isGenerating}
              generationComplete={generationComplete}
              recordCount={recordCount}
              onClick={handleGenerate}
            />
          </FadeInWhenVisible>

          {/* Estimated time */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-500"
          >
            <Clock className="w-4 h-4" />
            <span>Estimated time: ~{Math.max(1, Math.round(recordCount / 100000))} seconds</span>
          </motion.div>
        </div>

        {/* Right Panel - Preview */}
        <div className="lg:col-span-3">
          <FadeInWhenVisible delay={0.2}>
            <PreviewPanel data={previewData} isLoading={previewLoading} />
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  )
}
