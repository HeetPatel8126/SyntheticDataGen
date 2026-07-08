'use client'

import { useState, useCallback } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import {
  UploadCloud,
  FileText,
  AlertCircle,
  Database,
  Sparkles,
  BarChart2,
  Download,
  ChevronDown,
  Loader2,
  CheckCircle2,
  Trash2,
  Clock,
  Table,
  ArrowRight,
  Upload
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { FadeInWhenVisible } from "@/components/animations"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"

// ─── TYPES ──────────────────────────────────────────────────────────

type ColumnStats = {
  dtype: string
  null_count: number
  null_pct: number
  unique_values: number
  min?: any
  max?: any
  mean?: number | null
}

type UploadSchemaPreview = {
  column_stats: Record<string, ColumnStats>
  preview_rows: any[]
}

type UploadResponse = {
  upload_id: string
  schema_preview: UploadSchemaPreview
}

type UploadedFileInfo = {
  id: string
  filename: string
  file_path: string
  model_path?: string | null
  column_stats?: Record<string, ColumnStats> | null
  row_count?: number | null
  column_count?: number | null
  created_at: string
  model_fitted: boolean
}

type UploadListResponse = {
  uploads: UploadedFileInfo[]
  total: number
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ""

// ─── CUSTOM CHART TOOLTIP ───────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-black/10 px-4 py-3 shadow-xl">
        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-[11px] font-mono font-bold text-black">
            {entry.name}: {Number(entry.value).toFixed(2)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null)
  const [selectedUploadId, setSelectedUploadId] = useState<string | null>(null)
  const [recordCount, setRecordCount] = useState<number>(1000)
  const [generatedData, setGeneratedData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"preview" | "stats">("preview")

  const uploadsQuery = useQuery<UploadListResponse>({
    queryKey: ["uploads"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/uploads`, {
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to load uploads")
      return res.json()
    },
  })

  const uploadMutation = useMutation<UploadResponse, Error, File>({
    mutationFn: async (fileToUpload) => {
      const formData = new FormData()
      formData.append("file", fileToUpload)
      const res = await fetch(`${API_BASE}/api/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.detail || err?.error || "Upload failed")
      }
      return res.json()
    },
    onSuccess: (data) => {
      setUploadResult(data)
      setSelectedUploadId(data.upload_id)
      uploadsQuery.refetch()
      toast.success("File uploaded", {
        description: `Detected ${Object.keys(data.schema_preview.column_stats).length} columns`,
      })
    },
    onError: (error) => {
      toast.error("Upload failed", { description: error.message })
    },
  })

  const generateMutation = useMutation<any[], Error, { upload_id: string; record_count: number }>({
    mutationFn: async ({ upload_id, record_count }) => {
      const res = await fetch(`${API_BASE}/api/generate-from-upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upload_id, record_count }),
        credentials: "include",
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.detail || err?.error || "Generation failed")
      }
      const json = await res.json()
      return json.data || []
    },
    onSuccess: (data) => {
      setGeneratedData(data)
      toast.success("Synthetic data generated", {
        description: `Generated ${data.length} synthetic rows`,
      })
    },
    onError: (error) => {
      toast.error("Generation failed", { description: error.message })
    },
  })

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f) setFile(f)
  }, [])

  const handleUploadClick = useCallback(() => {
    if (!file) {
      toast.error("Select a file first")
      return
    }
    uploadMutation.mutate(file)
  }, [file, uploadMutation])

  const handleGenerateClick = useCallback(() => {
    if (!selectedUploadId) {
      toast.error("Select an upload first")
      return
    }
    generateMutation.mutate({ upload_id: selectedUploadId, record_count: recordCount })
  }, [selectedUploadId, recordCount, generateMutation])

  const currentPreview =
    uploadResult?.schema_preview ||
    (uploadsQuery.data?.uploads.find((u) => u.id === selectedUploadId)?.column_stats
      ? {
          column_stats:
            uploadsQuery.data.uploads.find((u) => u.id === selectedUploadId)!.column_stats!,
          preview_rows: [],
        }
      : null)

  const numericColumns =
    currentPreview?.column_stats
      ? Object.entries(currentPreview.column_stats)
          .filter(([_, v]) => v.mean !== null && typeof v.mean === "number")
          .map(([name, v]) => ({ name, mean: v.mean as number }))
      : []

  const comparisonData = numericColumns.map((col) => {
    let synthMean = col.mean
    if (generatedData.length > 0) {
      const values = generatedData
        .map((row) => Number(row[col.name]))
        .filter((v) => !Number.isNaN(v))
      if (values.length > 0) {
        synthMean = values.reduce((a, b) => a + b, 0) / values.length
      }
    }
    return {
      column: col.name,
      original: col.mean,
      synthetic: synthMean,
    }
  })

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <FadeInWhenVisible>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-sm flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight uppercase text-black">
              Upload & Analyze
            </h1>
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mt-0.5">
              Upload real data — learn its structure — generate synthetic equivalents
            </p>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* ── MAIN LAYOUT ─────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-5 gap-6">

        {/* ── LEFT COLUMN: Upload + Generate + Recent ────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Upload File Card */}
          <FadeInWhenVisible delay={0.05}>
            <Card className="border-black/10 shadow-sm rounded-sm bg-white overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-black/10">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-black flex items-center gap-2">
                  <UploadCloud className="w-4 h-4" />
                  Upload File
                </CardTitle>
                <CardDescription className="text-[10px] font-mono uppercase tracking-widest">
                  Drag & drop a CSV or JSON file (max 50MB)
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
                  onDrop={handleDrop}
                  className={cn(
                    "relative flex flex-col items-center justify-center gap-3 border-2 border-dashed p-8 text-center cursor-pointer transition-all rounded-sm",
                    isDragging
                      ? "border-black bg-black/5"
                      : file
                      ? "border-emerald-300 bg-emerald-50/50"
                      : "border-black/15 hover:border-black/40 hover:bg-black/[0.02]",
                  )}
                  onClick={() => {
                    const input = document.createElement("input")
                    input.type = "file"
                    input.accept = ".csv,.json"
                    input.onchange = (e: any) => {
                      const f = e.target.files?.[0]
                      if (f) setFile(f)
                    }
                    input.click()
                  }}
                >
                  {file ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  ) : (
                    <UploadCloud className={cn("w-8 h-8", isDragging ? "text-black" : "text-gray-400")} />
                  )}
                  <div className="space-y-1">
                    <p className={cn("text-[12px] font-bold uppercase tracking-tight", file ? "text-emerald-700" : "text-black")}>
                      {file ? file.name : "Click to select a file or drop it here"}
                    </p>
                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                      {file ? `${(file.size / 1024).toFixed(1)} KB` : "CSV or JSON · up to 50MB"}
                    </p>
                  </div>
                  {uploadMutation.isPending && (
                    <div className="flex items-center gap-2 text-[10px] font-mono text-black uppercase tracking-widest">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Uploading and analyzing...
                    </div>
                  )}
                </div>

                {uploadMutation.isError && (
                  <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-red-500 uppercase tracking-widest bg-red-50 border border-red-200 p-3 rounded-sm">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{uploadMutation.error?.message}</span>
                  </div>
                )}

                <Button
                  className="mt-4 w-full gap-2 rounded-sm bg-black text-white hover:bg-black/90 text-[10px] font-mono uppercase tracking-widest font-bold h-10"
                  disabled={!file || uploadMutation.isPending}
                  onClick={handleUploadClick}
                >
                  {uploadMutation.isPending ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...</>
                  ) : (
                    <><UploadCloud className="w-3.5 h-3.5" /> Upload & Analyze</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </FadeInWhenVisible>

          {/* Generate Synthetic Data Card */}
          <FadeInWhenVisible delay={0.1}>
            <Card className="border-black/10 shadow-sm rounded-sm bg-white overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-black/10">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-black flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate Synthetic Data
                </CardTitle>
                <CardDescription className="text-[10px] font-mono uppercase tracking-widest">
                  Use the fitted SDV model to generate statistically realistic samples
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                {/* Select upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono font-bold uppercase text-gray-500 tracking-widest">
                    Source Upload
                  </label>
                  <div className="relative">
                    <select
                      className="w-full h-9 pl-3 pr-8 text-[11px] font-mono border border-black/10 rounded-sm appearance-none bg-white hover:border-black/30 transition-colors uppercase cursor-pointer"
                      value={selectedUploadId || ""}
                      onChange={(e) => setSelectedUploadId(e.target.value || null)}
                    >
                      <option value="">Latest upload</option>
                      {uploadsQuery.data?.uploads.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.filename}{u.model_fitted ? " (ready)" : " (model fitting...)"}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Record count */}
                <div className="space-y-3">
                  <label className="text-[10px] font-mono font-bold uppercase text-gray-500 tracking-widest">
                    Record Count
                  </label>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold font-mono text-black">{recordCount.toLocaleString()}</span>
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">records</span>
                  </div>
                  <Slider
                    value={[recordCount]}
                    min={100}
                    max={100000}
                    step={100}
                    onValueChange={(v) => setRecordCount(v[0] || 100)}
                    className="py-1"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                    <span>100</span>
                    <span>100K</span>
                  </div>
                </div>

                <Button
                  className="w-full gap-2 rounded-sm bg-black text-white hover:bg-black/90 text-[10px] font-mono uppercase tracking-widest font-bold h-10"
                  onClick={handleGenerateClick}
                  disabled={generateMutation.isPending || !selectedUploadId}
                >
                  {generateMutation.isPending ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="w-3.5 h-3.5" /> Generate Synthetic Data</>
                  )}
                </Button>

                {generateMutation.isError && (
                  <div className="flex items-center gap-2 text-[10px] font-mono text-red-500 uppercase tracking-widest bg-red-50 border border-red-200 p-3 rounded-sm">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{generateMutation.error?.message}</span>
                  </div>
                )}

                <AnimatePresence>
                  {generatedData.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full gap-2 rounded-sm border-black/10 hover:bg-black/5 text-[10px] font-mono uppercase tracking-widest font-bold h-10"
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(generatedData, null, 2)], {
                            type: "application/json",
                          })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement("a")
                          a.href = url
                          a.download = "synthetic_data.json"
                          a.click()
                          URL.revokeObjectURL(url)
                        }}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Synthetic JSON ({generatedData.length} rows)
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </FadeInWhenVisible>

          {/* Recent Uploads Card */}
          <FadeInWhenVisible delay={0.15}>
            <Card className="border-black/10 shadow-sm rounded-sm bg-white overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-black/10">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-black flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Uploads
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {uploadsQuery.isLoading ? (
                  <div className="p-6 text-[10px] font-mono text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                  </div>
                ) : !uploadsQuery.data?.uploads?.length ? (
                  <div className="p-6 text-center">
                    <FileText className="w-6 h-6 mx-auto text-gray-300 mb-2" />
                    <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">No uploads yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-black/5 max-h-56 overflow-auto">
                    {uploadsQuery.data.uploads.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => setSelectedUploadId(u.id)}
                        className={cn(
                          "w-full text-left px-4 py-3 flex items-center justify-between transition-all",
                          selectedUploadId === u.id
                            ? "bg-black text-white"
                            : "hover:bg-black/5"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <FileText className={cn("w-4 h-4 flex-shrink-0", selectedUploadId === u.id ? "text-white" : "text-gray-400")} />
                          <div className="min-w-0">
                            <p className={cn("text-[11px] font-mono font-bold uppercase truncate", selectedUploadId === u.id ? "text-white" : "text-black")}>
                              {u.filename}
                            </p>
                            {u.row_count && (
                              <p className={cn("text-[9px] font-mono uppercase tracking-widest", selectedUploadId === u.id ? "text-white/60" : "text-gray-400")}>
                                {u.row_count} rows · {u.column_count} columns
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge
                          className={cn(
                            "text-[8px] font-mono uppercase tracking-widest rounded-sm px-2 py-0.5 border-0 flex-shrink-0",
                            u.model_fitted
                              ? selectedUploadId === u.id ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-600"
                              : selectedUploadId === u.id ? "bg-white/20 text-white" : "bg-amber-50 text-amber-600"
                          )}
                        >
                          {u.model_fitted ? "Ready" : "Fitting"}
                        </Badge>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeInWhenVisible>
        </div>

        {/* ── RIGHT COLUMN: Preview + Stats + Chart ──────────── */}
        <div className="lg:col-span-3 space-y-6">

          {/* Data Preview Card */}
          <FadeInWhenVisible delay={0.1}>
            <Card className="border-black/10 shadow-sm rounded-sm bg-white overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-black/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-black flex items-center gap-2">
                      <Table className="w-4 h-4" />
                      Data Preview
                    </CardTitle>
                    <CardDescription className="text-[10px] font-mono uppercase tracking-widest mt-1">
                      First 5 rows and per-column statistics
                    </CardDescription>
                  </div>
                  {/* Tab buttons */}
                  <div className="flex border border-black/10 rounded-sm overflow-hidden">
                    <button
                      onClick={() => setActiveTab("preview")}
                      className={cn(
                        "px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors",
                        activeTab === "preview" ? "bg-black text-white" : "bg-white text-black hover:bg-black/5"
                      )}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setActiveTab("stats")}
                      className={cn(
                        "px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest transition-colors border-l border-black/10",
                        activeTab === "stats" ? "bg-black text-white" : "bg-white text-black hover:bg-black/5"
                      )}
                    >
                      Column Stats
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {activeTab === "preview" ? (
                  currentPreview?.preview_rows?.length ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-[11px] font-mono">
                        <thead>
                          <tr className="border-b border-black/10 bg-gray-50">
                            {Object.keys(currentPreview.preview_rows[0]).map((key) => (
                              <th key={key} className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-2.5">
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {currentPreview.preview_rows.map((row, i) => (
                            <tr key={i} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-colors">
                              {Object.values(row).map((v, j) => (
                                <td key={j} className="px-4 py-2.5 text-gray-700 whitespace-nowrap">
                                  {typeof v === "object" ? JSON.stringify(v) : String(v)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-10 text-center">
                      <Database className="w-8 h-8 mx-auto text-gray-300 mb-3" />
                      <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                        No preview available yet
                      </p>
                      <p className="text-[10px] font-mono text-gray-300 uppercase tracking-widest mt-1">
                        Upload a file to see its data
                      </p>
                    </div>
                  )
                ) : (
                  // Stats tab
                  currentPreview?.column_stats ? (
                    <div className="p-4">
                      <div className="border border-black/10 rounded-sm overflow-hidden">
                        <table className="w-full text-[11px] font-mono">
                          <thead>
                            <tr className="bg-gray-50 border-b border-black/10">
                              <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-2">Column</th>
                              <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-2">Type</th>
                              <th className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-2">Null %</th>
                              <th className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-2">Unique</th>
                              <th className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-2">Min</th>
                              <th className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-2">Max</th>
                              <th className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-2">Mean</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(currentPreview.column_stats).map(([name, stats], i) => (
                              <tr key={name} className={cn("border-b border-black/5 last:border-0", i % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                                <td className="px-4 py-2.5 font-bold text-black">{name}</td>
                                <td className="px-4 py-2.5">
                                  <Badge className="text-[8px] bg-gray-100 text-gray-600 border-0 rounded-sm px-1.5 py-0 font-mono uppercase">
                                    {stats.dtype}
                                  </Badge>
                                </td>
                                <td className="px-4 py-2.5 text-right text-gray-500">{stats.null_pct.toFixed(1)}%</td>
                                <td className="px-4 py-2.5 text-right text-gray-500">{stats.unique_values}</td>
                                <td className="px-4 py-2.5 text-right text-gray-500 truncate max-w-[80px]">
                                  {stats.min !== undefined ? String(stats.min) : "—"}
                                </td>
                                <td className="px-4 py-2.5 text-right text-gray-500 truncate max-w-[80px]">
                                  {stats.max !== undefined ? String(stats.max) : "—"}
                                </td>
                                <td className="px-4 py-2.5 text-right text-gray-500">
                                  {stats.mean !== null && stats.mean !== undefined ? Number(stats.mean).toFixed(2) : "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="p-10 text-center">
                      <BarChart2 className="w-8 h-8 mx-auto text-gray-300 mb-3" />
                      <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                        No statistics available
                      </p>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </FadeInWhenVisible>

          {/* Comparison Chart Card */}
          <FadeInWhenVisible delay={0.15}>
            <Card className="border-black/10 shadow-sm rounded-sm bg-white overflow-hidden">
              <CardHeader className="bg-gray-50 border-b border-black/10">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-black flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" />
                  Original vs Synthetic
                </CardTitle>
                <CardDescription className="text-[10px] font-mono uppercase tracking-widest">
                  Mean comparison across numeric columns
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {comparisonData.length > 0 ? (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                        <XAxis
                          dataKey="column"
                          tick={{ fontSize: 10, fontFamily: "monospace", fill: "#9ca3af" }}
                          axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fontSize: 10, fontFamily: "monospace", fill: "#9ca3af" }}
                          axisLine={{ stroke: "rgba(0,0,0,0.1)" }}
                          tickLine={false}
                        />
                        <Tooltip content={<ChartTooltip />} />
                        <Bar dataKey="original" fill="#000000" name="Original" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="synthetic" fill="#d1d5db" name="Synthetic" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <BarChart2 className="w-8 h-8 mx-auto text-gray-300 mb-3" />
                    <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                      Generate synthetic data to see comparison
                    </p>
                    <p className="text-[10px] font-mono text-gray-300 uppercase tracking-widest mt-1">
                      Numeric column means will be charted here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  )
}
