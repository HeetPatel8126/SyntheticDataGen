'use client'

import { useState, useCallback, useEffect } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"

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

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null)
  const [selectedUploadId, setSelectedUploadId] = useState<string | null>(null)
  const [recordCount, setRecordCount] = useState<number>(1000)
  const [generatedData, setGeneratedData] = useState<any[]>([])

  const uploadsQuery = useQuery<UploadListResponse>({
    queryKey: ["uploads"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/uploads`, {
        credentials: "include",
      })
      if (!res.ok) {
        throw new Error("Failed to load uploads")
      }
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
    if (f) {
      setFile(f)
    }
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
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-heading font-bold">Upload Real Data</h1>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="w-7 h-7 text-purple-400" />
          </motion.div>
        </div>
        <p className="text-gray-400">
          Upload CSV or JSON files, learn their structure, and generate statistically realistic
          synthetic datasets.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left: upload and controls */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-purple-500" />
                Upload File
              </CardTitle>
              <CardDescription>Drag & drop a CSV or JSON file (max 50MB)</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={(e) => {
                  e.preventDefault()
                  setIsDragging(false)
                }}
                onDrop={handleDrop}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors",
                  isDragging
                    ? "border-purple-500 bg-purple-500/10"
                    : "border-white/10 hover:border-white/30",
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
                <UploadCloud className="w-10 h-10 text-purple-400" />
                <div className="space-y-1">
                  <p className="font-medium">
                    {file ? file.name : "Click to select a file or drop it here"}
                  </p>
                  <p className="text-xs text-gray-500">CSV or JSON · up to 50MB</p>
                </div>
                {uploadMutation.isPending && (
                  <p className="text-xs text-purple-400">Uploading and analyzing...</p>
                )}
              </div>

              {uploadMutation.isError && (
                <div className="mt-4 flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>{uploadMutation.error?.message}</span>
                </div>
              )}

              <Button
                className="mt-4 w-full gap-2"
                variant="gradient"
                disabled={!file || uploadMutation.isPending}
                onClick={handleUploadClick}
              >
                <UploadCloud className="w-4 h-4" />
                {uploadMutation.isPending ? "Uploading..." : "Upload & Analyze"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-400" />
                Generate Synthetic Data
              </CardTitle>
              <CardDescription>
                Use the fitted SDV model to generate statistically realistic samples.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">
                  Select upload
                </label>
                <select
                  className="w-full h-10 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm"
                  value={selectedUploadId || ""}
                  onChange={(e) => setSelectedUploadId(e.target.value || null)}
                >
                  <option value="">Latest upload</option>
                  {uploadsQuery.data?.uploads.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.filename}{" "}
                      {u.model_fitted ? " (ready)" : " (model fitting...)"}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">
                  Record count
                </label>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-semibold">{recordCount.toLocaleString()}</span>
                    <span className="text-xs text-gray-500">records</span>
                  </div>
                  <Slider
                    value={[recordCount]}
                    min={100}
                    max={100000}
                    step={100}
                    onValueChange={(v) => setRecordCount(v[0] || 100)}
                  />
                </div>
              </div>

              <Button
                variant="gradient"
                className="w-full gap-2"
                onClick={handleGenerateClick}
                disabled={generateMutation.isPending || !selectedUploadId}
              >
                <Sparkles className="w-4 h-4" />
                {generateMutation.isPending ? "Generating..." : "Generate Synthetic Data"}
              </Button>

              {generateMutation.isError && (
                <div className="flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>{generateMutation.error?.message}</span>
                </div>
              )}

              {generatedData.length > 0 && (
                <Button
                  variant="outline"
                  className="w-full mt-2 gap-2"
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
                  <Download className="w-4 h-4" />
                  Download Synthetic JSON
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Recent Uploads
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-64 overflow-auto">
              {uploadsQuery.isLoading && <p className="text-sm text-gray-500">Loading...</p>}
              {uploadsQuery.data?.uploads.map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSelectedUploadId(u.id)}
                  className={cn(
                    "w-full text-left text-sm px-2 py-1.5 rounded-md flex items-center justify-between hover:bg-white/5",
                    selectedUploadId === u.id && "bg-purple-500/10",
                  )}
                >
                  <span className="truncate">{u.filename}</span>
                  <Badge
                    variant={u.model_fitted ? "secondary" : "outline"}
                    className={cn(
                      "text-xs",
                      u.model_fitted ? "bg-green-500/20 text-green-400" : "text-gray-400",
                    )}
                  >
                    {u.model_fitted ? "Ready" : "Fitting"}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right: preview, stats, comparison */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-400" />
                Data Preview
              </CardTitle>
              <CardDescription>First 5 rows and per-column statistics.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="preview" className="w-full">
                <TabsList className="bg-white/5">
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="stats">Column Stats</TabsTrigger>
                </TabsList>

                <TabsContent value="preview" className="mt-4">
                  {currentPreview?.preview_rows?.length ? (
                    <div className="border border-white/10 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead className="bg-white/5">
                            <tr>
                              {Object.keys(currentPreview.preview_rows[0]).map((key) => (
                                <th key={key} className="px-3 py-2 text-left font-semibold">
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {currentPreview.preview_rows.map((row, i) => (
                              <tr key={i} className="border-t border-white/5">
                                {Object.values(row).map((v, j) => (
                                  <td key={j} className="px-3 py-2 text-gray-300">
                                    {typeof v === "object" ? JSON.stringify(v) : String(v)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No preview available yet.</p>
                  )}
                </TabsContent>

                <TabsContent value="stats" className="mt-4">
                  {currentPreview?.column_stats ? (
                    <div className="grid md:grid-cols-2 gap-3">
                      {Object.entries(currentPreview.column_stats).map(([name, stats]) => (
                        <div
                          key={name}
                          className="p-3 rounded-lg border border-white/10 bg-white/5 text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{name}</span>
                            <Badge variant="secondary" className="text-[10px]">
                              {stats.dtype}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>Null %</span>
                            <span>{stats.null_pct.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between text-gray-400">
                            <span>Unique</span>
                            <span>{stats.unique_values}</span>
                          </div>
                          {"min" in stats && stats.min !== undefined && (
                            <div className="flex justify-between text-gray-400">
                              <span>Min</span>
                              <span className="truncate max-w-[130px]">
                                {String(stats.min)}
                              </span>
                            </div>
                          )}
                          {"max" in stats && stats.max !== undefined && (
                            <div className="flex justify-between text-gray-400">
                              <span>Max</span>
                              <span className="truncate max-w-[130px]">
                                {String(stats.max)}
                              </span>
                            </div>
                          )}
                          {stats.mean !== null && stats.mean !== undefined && (
                            <div className="flex justify-between text-gray-400">
                              <span>Mean</span>
                              <span>{Number(stats.mean).toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No stats available.</p>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-emerald-400" />
                Original vs Synthetic (mean of numeric columns)
              </CardTitle>
              <CardDescription>
                Quick comparison between original and synthetic distributions (mean values).
              </CardDescription>
            </CardHeader>
            <CardContent>
              {comparisonData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData}>
                      <XAxis dataKey="column" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="original" fill="#6366f1" name="Original" />
                      <Bar dataKey="synthetic" fill="#22c55e" name="Synthetic" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Generate synthetic data to see a comparison chart for numeric columns.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

