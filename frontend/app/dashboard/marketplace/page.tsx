'use client'

import { useState, useMemo } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import {
  Search,
  Star,
  Download,
  Eye,
  ArrowUpRight,
  TrendingUp,
  Users,
  Database,
  ShoppingCart,
  Heart,
  DollarSign,
  Cpu,
  Shield,
  BarChart3,
  Building2,
  GraduationCap,
  Brain,
  Sparkles,
  Filter,
  ChevronDown,
  ArrowRight,
  Package,
  Globe,
  Clock,
  Play,
  X,
  Table,
  FileText,
  Code,
  Share2,
  Store
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { FadeInWhenVisible } from "@/components/animations"
import { Link } from "next-view-transitions"

// ─── MOCK MARKETPLACE DATA ──────────────────────────────────────────
const CATEGORIES = [
  { id: "all", name: "All", icon: Database },
  { id: "healthcare", name: "Healthcare", icon: Heart },
  { id: "finance", name: "Finance", icon: DollarSign },
  { id: "retail", name: "Retail", icon: ShoppingCart },
  { id: "ml", name: "ML / AI", icon: Brain },
  { id: "hr", name: "HR", icon: Users },
  { id: "iot", name: "IoT", icon: Cpu },
  { id: "security", name: "Security", icon: Shield },
  { id: "education", name: "Education", icon: GraduationCap },
  { id: "real-estate", name: "Real Estate", icon: Building2 },
]

const SORT_OPTIONS = [
  { id: "popular", label: "Most Popular" },
  { id: "recent", label: "Most Recent" },
  { id: "downloads", label: "Most Downloads" },
  { id: "rating", label: "Highest Rated" },
]

interface MarketplaceDataset {
  id: string
  name: string
  description: string
  category: string
  author: string
  authorAvatar: string
  recordCount: number
  fileSize: string
  formats: string[]
  rating: number
  reviews: number
  downloads: number
  tags: string[]
  featured: boolean
  verified: boolean
  createdAt: string
  fields: string[]
}

const DATASETS: MarketplaceDataset[] = [
  {
    id: "ds-001",
    name: "Patient Medical Records",
    description: "Comprehensive synthetic patient data including demographics, diagnoses (ICD-10), medications, lab results, and clinical encounters. HIPAA-safe for healthcare ML training.",
    category: "healthcare",
    author: "MedDataLab",
    authorAvatar: "M",
    recordCount: 50000,
    fileSize: "24 MB",
    formats: ["CSV", "JSON"],
    rating: 4.9,
    reviews: 142,
    downloads: 3240,
    tags: ["HIPAA", "ICD-10", "EHR", "Clinical"],
    featured: true,
    verified: true,
    createdAt: "2026-06-15",
    fields: ["patient_id", "age", "gender", "diagnosis_code", "medication", "visit_date"]
  },
  {
    id: "ds-002",
    name: "Payment Fraud Detection",
    description: "Labeled transaction dataset with genuine and fraudulent payment patterns. Includes temporal features, merchant categories, and anomaly scores for fraud model training.",
    category: "finance",
    author: "FinTechForge",
    authorAvatar: "F",
    recordCount: 80000,
    fileSize: "38 MB",
    formats: ["CSV", "JSON"],
    rating: 4.8,
    reviews: 98,
    downloads: 2890,
    tags: ["Fraud", "Anomaly", "Payments", "Classification"],
    featured: true,
    verified: true,
    createdAt: "2026-06-20",
    fields: ["transaction_id", "amount", "merchant", "is_fraud", "timestamp", "card_type"]
  },
  {
    id: "ds-003",
    name: "E-commerce Clickstream",
    description: "User browsing sessions with page views, add-to-cart events, purchases, and session metadata. Perfect for recommendation engines and conversion funnel analysis.",
    category: "retail",
    author: "RetailAI",
    authorAvatar: "R",
    recordCount: 200000,
    fileSize: "92 MB",
    formats: ["CSV", "JSON"],
    rating: 4.7,
    reviews: 76,
    downloads: 2150,
    tags: ["Clickstream", "Sessions", "Conversion", "Recommendations"],
    featured: true,
    verified: true,
    createdAt: "2026-06-10",
    fields: ["session_id", "user_id", "event_type", "product_id", "timestamp", "device"]
  },
  {
    id: "ds-004",
    name: "Customer Churn Prediction",
    description: "Telecom customer data with usage patterns, billing history, support interactions, and churn labels. Balanced dataset ideal for classification model benchmarking.",
    category: "ml",
    author: "MLBenchmarks",
    authorAvatar: "B",
    recordCount: 25000,
    fileSize: "12 MB",
    formats: ["CSV"],
    rating: 4.9,
    reviews: 203,
    downloads: 4560,
    tags: ["Churn", "Classification", "Telecom", "Benchmark"],
    featured: false,
    verified: true,
    createdAt: "2026-05-28",
    fields: ["customer_id", "tenure", "monthly_charges", "total_charges", "churn", "contract"]
  },
  {
    id: "ds-005",
    name: "IoT Sensor Readings",
    description: "Multi-sensor time-series data from industrial equipment with temperature, vibration, pressure readings and maintenance event flags for predictive maintenance.",
    category: "iot",
    author: "SensorWorks",
    authorAvatar: "S",
    recordCount: 500000,
    fileSize: "156 MB",
    formats: ["CSV", "JSON"],
    rating: 4.6,
    reviews: 54,
    downloads: 1230,
    tags: ["Time-Series", "Sensors", "Predictive", "Industrial"],
    featured: false,
    verified: true,
    createdAt: "2026-06-01",
    fields: ["device_id", "sensor_type", "value", "unit", "timestamp", "anomaly_flag"]
  },
  {
    id: "ds-006",
    name: "Employee HR Records",
    description: "Synthetic workforce data including demographics, departments, salaries, performance scores, tenure, and attrition risk indicators for HR analytics.",
    category: "hr",
    author: "PeopleData",
    authorAvatar: "P",
    recordCount: 15000,
    fileSize: "8 MB",
    formats: ["CSV", "JSON"],
    rating: 4.5,
    reviews: 67,
    downloads: 1890,
    tags: ["HR", "Workforce", "Attrition", "Performance"],
    featured: false,
    verified: false,
    createdAt: "2026-06-08",
    fields: ["employee_id", "department", "salary", "performance", "tenure", "attrition_risk"]
  },
  {
    id: "ds-007",
    name: "Network Traffic Logs",
    description: "Packet-level network flow data with protocol headers, payload sizes, source/destination IPs, and intrusion detection labels for cybersecurity training.",
    category: "security",
    author: "CyberLab",
    authorAvatar: "C",
    recordCount: 300000,
    fileSize: "128 MB",
    formats: ["CSV"],
    rating: 4.7,
    reviews: 41,
    downloads: 980,
    tags: ["Network", "IDS", "Packets", "Cybersecurity"],
    featured: false,
    verified: true,
    createdAt: "2026-05-20",
    fields: ["flow_id", "src_ip", "dst_ip", "protocol", "bytes", "label"]
  },
  {
    id: "ds-008",
    name: "Student Performance Analytics",
    description: "Educational institution data with student demographics, course enrollments, grades, attendance records, and learning outcome predictions.",
    category: "education",
    author: "EduMetrics",
    authorAvatar: "E",
    recordCount: 30000,
    fileSize: "14 MB",
    formats: ["CSV", "JSON"],
    rating: 4.4,
    reviews: 38,
    downloads: 760,
    tags: ["Education", "Grades", "Attendance", "Outcomes"],
    featured: false,
    verified: false,
    createdAt: "2026-06-12",
    fields: ["student_id", "course", "grade", "attendance_pct", "gpa", "outcome"]
  },
  {
    id: "ds-009",
    name: "Real Estate Listings",
    description: "Property listing data with location, pricing, features, square footage, bedroom/bathroom counts, and market valuation estimates for price prediction.",
    category: "real-estate",
    author: "PropTechData",
    authorAvatar: "P",
    recordCount: 40000,
    fileSize: "22 MB",
    formats: ["CSV", "JSON"],
    rating: 4.6,
    reviews: 55,
    downloads: 1340,
    tags: ["Property", "Pricing", "Location", "Valuation"],
    featured: false,
    verified: true,
    createdAt: "2026-06-05",
    fields: ["listing_id", "price", "bedrooms", "sqft", "city", "listing_date"]
  },
  {
    id: "ds-010",
    name: "Insurance Claims",
    description: "Auto and health insurance claims with policy details, claim amounts, fraud indicators, processing timestamps, and outcome labels for claims automation.",
    category: "finance",
    author: "InsureTech",
    authorAvatar: "I",
    recordCount: 60000,
    fileSize: "28 MB",
    formats: ["CSV"],
    rating: 4.5,
    reviews: 49,
    downloads: 1120,
    tags: ["Insurance", "Claims", "Fraud", "Automation"],
    featured: false,
    verified: true,
    createdAt: "2026-05-30",
    fields: ["claim_id", "policy_type", "amount", "status", "fraud_flag", "filed_date"]
  },
  {
    id: "ds-011",
    name: "Restaurant Reviews (NLP)",
    description: "Multi-language restaurant review text with sentiment labels, aspect categories, star ratings, and reviewer metadata. Ideal for NLP and sentiment analysis.",
    category: "ml",
    author: "NLPCorpus",
    authorAvatar: "N",
    recordCount: 100000,
    fileSize: "67 MB",
    formats: ["CSV", "JSON"],
    rating: 4.8,
    reviews: 112,
    downloads: 2780,
    tags: ["NLP", "Sentiment", "Text", "Reviews"],
    featured: false,
    verified: true,
    createdAt: "2026-06-18",
    fields: ["review_id", "text", "rating", "sentiment", "aspect", "restaurant"]
  },
  {
    id: "ds-012",
    name: "Stock Market Ticks",
    description: "Minute-level synthetic market data with OHLCV prices, volume, bid-ask spreads, and technical indicators for 50 equities across a 2-year window.",
    category: "finance",
    author: "QuantData",
    authorAvatar: "Q",
    recordCount: 750000,
    fileSize: "340 MB",
    formats: ["CSV"],
    rating: 4.7,
    reviews: 86,
    downloads: 1950,
    tags: ["Stocks", "OHLCV", "Time-Series", "Trading"],
    featured: false,
    verified: true,
    createdAt: "2026-06-22",
    fields: ["ticker", "open", "high", "low", "close", "volume"]
  },
  {
    id: "ds-013",
    name: "Social Media Engagement",
    description: "Synthetic social media posts with engagement metrics, hashtags, user demographics, content types, and virality scores for marketing analytics.",
    category: "ml",
    author: "SocialMetrics",
    authorAvatar: "S",
    recordCount: 150000,
    fileSize: "72 MB",
    formats: ["CSV", "JSON"],
    rating: 4.3,
    reviews: 29,
    downloads: 640,
    tags: ["Social", "Engagement", "Marketing", "Virality"],
    featured: false,
    verified: false,
    createdAt: "2026-06-25",
    fields: ["post_id", "platform", "likes", "shares", "content_type", "virality_score"]
  },
  {
    id: "ds-014",
    name: "Supply Chain Logistics",
    description: "End-to-end supply chain data covering warehouses, shipments, delivery routes, lead times, and demand forecasts for operations optimization.",
    category: "retail",
    author: "LogiTech",
    authorAvatar: "L",
    recordCount: 45000,
    fileSize: "20 MB",
    formats: ["CSV", "JSON"],
    rating: 4.6,
    reviews: 33,
    downloads: 870,
    tags: ["Supply Chain", "Logistics", "Demand", "Optimization"],
    featured: false,
    verified: true,
    createdAt: "2026-06-14",
    fields: ["shipment_id", "warehouse", "destination", "lead_time", "status", "cost"]
  },
  {
    id: "ds-015",
    name: "Movie Recommendations",
    description: "User-movie interaction matrix with explicit ratings, implicit watch signals, genre preferences, and collaborative filtering features for RecSys benchmarks.",
    category: "ml",
    author: "RecSysBench",
    authorAvatar: "R",
    recordCount: 1000000,
    fileSize: "420 MB",
    formats: ["CSV"],
    rating: 4.8,
    reviews: 167,
    downloads: 3810,
    tags: ["RecSys", "Ratings", "Collaborative", "Movies"],
    featured: false,
    verified: true,
    createdAt: "2026-06-02",
    fields: ["user_id", "movie_id", "rating", "timestamp", "genre", "watch_time"]
  },
]

// ─── HELPERS ─────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const full = Math.floor(rating)
  const fraction = rating - full
  const sizeClass = size === "sm" ? "w-3 h-3" : "w-4 h-4"

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            i < full
              ? "fill-black text-black"
              : i === full && fraction >= 0.5
              ? "fill-black/50 text-black"
              : "fill-transparent text-gray-300"
          )}
        />
      ))}
    </div>
  )
}

// ─── DATASET CARD ────────────────────────────────────────────────────

function DatasetCard({ dataset, index, onPreview }: { dataset: MarketplaceDataset; index: number; onPreview: () => void }) {
  const CategoryIcon = CATEGORIES.find(c => c.id === dataset.category)?.icon || Database

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <Card className="border-black/10 shadow-sm rounded-sm bg-white overflow-hidden h-full group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Category strip */}
        <div className="h-1 bg-black w-full" />

        <CardHeader className="pb-3 pt-5 px-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-gray-50 border border-black/10 rounded-sm flex items-center justify-center flex-shrink-0">
                <CategoryIcon className="w-5 h-5 text-black" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm font-bold uppercase tracking-tight text-black truncate">
                  {dataset.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-4 h-4 bg-black rounded-sm flex items-center justify-center flex-shrink-0">
                    <span className="text-[7px] font-mono text-white font-bold">{dataset.authorAvatar}</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider truncate">{dataset.author}</span>
                  {dataset.verified && (
                    <Badge className="text-[8px] bg-emerald-50 text-emerald-600 border-emerald-200 rounded-sm px-1.5 py-0 h-4 font-mono uppercase">
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5 space-y-4">
          {/* Description */}
          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
            {dataset.description}
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-widest text-gray-500">
            <span className="flex items-center gap-1.5">
              <Database className="w-3 h-3" />
              {formatCount(dataset.recordCount)} records
            </span>
            <span className="flex items-center gap-1.5">
              <Package className="w-3 h-3" />
              {dataset.fileSize}
            </span>
          </div>

          {/* Format badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {dataset.formats.map(f => (
              <Badge key={f} variant="outline" className="text-[9px] font-mono uppercase tracking-widest rounded-sm px-2 py-0.5 border-black/10 text-gray-600 bg-gray-50">
                {f}
              </Badge>
            ))}
            {dataset.tags.slice(0, 2).map(tag => (
              <Badge key={tag} className="text-[9px] font-mono uppercase tracking-widest rounded-sm px-2 py-0.5 bg-black/5 text-gray-600 border-0">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Rating + Downloads */}
          <div className="flex items-center justify-between pt-2 border-t border-black/5">
            <div className="flex items-center gap-2">
              <StarRating rating={dataset.rating} />
              <span className="text-[10px] font-mono text-gray-500">{dataset.rating}</span>
              <span className="text-[10px] font-mono text-gray-400">({dataset.reviews})</span>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              <Download className="w-3 h-3" />
              {formatCount(dataset.downloads)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Link href="/dashboard/generate" className="flex-1">
              <Button
                size="sm"
                className="w-full rounded-sm bg-black text-white hover:bg-black/90 text-[10px] font-mono uppercase tracking-widest font-bold h-9 gap-2"
              >
                <Play className="w-3 h-3" />
                Use Template
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              className="rounded-sm border-black/10 hover:bg-black/5 text-[10px] font-mono uppercase tracking-widest font-bold h-9 px-3"
              onClick={onPreview}
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// ─── FEATURED DATASET CARD ──────────────────────────────────────────

function FeaturedCard({ dataset, index, onPreview }: { dataset: MarketplaceDataset; index: number; onPreview: () => void }) {
  const CategoryIcon = CATEGORIES.find(c => c.id === dataset.category)?.icon || Database

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
      className="min-w-[340px] max-w-[380px] flex-shrink-0"
    >
      <Card className="border-black/10 shadow-sm rounded-sm bg-white overflow-hidden h-full group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative">
        {/* Featured badge strip */}
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-black text-white text-[8px] font-mono uppercase tracking-widest px-3 py-1 font-bold">
            Featured
          </div>
        </div>
        <div className="h-1.5 bg-black w-full" />

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-black rounded-sm flex items-center justify-center flex-shrink-0">
              <CategoryIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-tight text-black">{dataset.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">by {dataset.author}</span>
                {dataset.verified && (
                  <Badge className="text-[8px] bg-emerald-50 text-emerald-600 border-emerald-200 rounded-sm px-1.5 py-0 h-4 font-mono uppercase">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-3">
            {dataset.description}
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-gray-50 border border-black/5">
              <p className="text-lg font-bold font-mono text-black">{formatCount(dataset.recordCount)}</p>
              <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Records</p>
            </div>
            <div className="text-center p-2 bg-gray-50 border border-black/5">
              <p className="text-lg font-bold font-mono text-black">{dataset.rating}</p>
              <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Rating</p>
            </div>
            <div className="text-center p-2 bg-gray-50 border border-black/5">
              <p className="text-lg font-bold font-mono text-black">{formatCount(dataset.downloads)}</p>
              <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Downloads</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {dataset.tags.map(tag => (
              <Badge key={tag} className="text-[9px] font-mono uppercase tracking-widest rounded-sm px-2 py-0.5 bg-black/5 text-gray-600 border-0">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <Link href="/dashboard/generate" className="flex-1">
              <Button
                size="sm"
                className="w-full rounded-sm bg-black text-white hover:bg-black/90 text-[10px] font-mono uppercase tracking-widest font-bold h-10 gap-2"
              >
                <Play className="w-3.5 h-3.5" />
                Use This Dataset
              </Button>
            </Link>
            <Button
              size="sm"
              variant="outline"
              className="rounded-sm border-black/10 hover:bg-black/5 text-[10px] font-mono uppercase tracking-widest font-bold h-10 px-4 gap-2"
              onClick={onPreview}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// ─── DATASET PREVIEW MODAL ──────────────────────────────────────────

function PreviewModal({ dataset, onClose }: { dataset: MarketplaceDataset; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white border border-black/10 max-w-2xl w-full max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-black/10 bg-gray-50">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-tight text-black">{dataset.name}</h3>
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-1">by {dataset.author}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-black/5">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-[12px] text-gray-600 leading-relaxed">{dataset.description}</p>

          {/* Schema preview */}
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 mb-3">Schema Fields</h4>
            <div className="border border-black/10 rounded-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-black/10">
                    <th className="text-left text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 px-4 py-2">Field</th>
                    <th className="text-left text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 px-4 py-2">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {dataset.fields.map((field, i) => (
                    <tr key={field} className={cn("border-b border-black/5 last:border-0", i % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                      <td className="text-[11px] font-mono text-black px-4 py-2.5">{field}</td>
                      <td className="text-[11px] font-mono text-gray-400 px-4 py-2.5">string</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {dataset.tags.map(tag => (
                <Badge key={tag} className="text-[9px] font-mono uppercase tracking-widest rounded-sm px-2.5 py-1 bg-black/5 text-gray-600 border-0">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3">
            <div className="p-3 bg-gray-50 border border-black/5 text-center">
              <p className="text-lg font-bold font-mono text-black">{formatCount(dataset.recordCount)}</p>
              <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Records</p>
            </div>
            <div className="p-3 bg-gray-50 border border-black/5 text-center">
              <p className="text-lg font-bold font-mono text-black">{dataset.fileSize}</p>
              <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Size</p>
            </div>
            <div className="p-3 bg-gray-50 border border-black/5 text-center">
              <p className="text-lg font-bold font-mono text-black">{dataset.rating}</p>
              <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Rating</p>
            </div>
            <div className="p-3 bg-gray-50 border border-black/5 text-center">
              <p className="text-lg font-bold font-mono text-black">{formatCount(dataset.downloads)}</p>
              <p className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">Downloads</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href="/dashboard/generate" className="flex-1">
              <Button className="w-full rounded-sm bg-black text-white hover:bg-black/90 text-[10px] font-mono uppercase tracking-widest font-bold h-10 gap-2">
                <Play className="w-3.5 h-3.5" />
                Use This Dataset
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [previewDataset, setPreviewDataset] = useState<MarketplaceDataset | null>(null)

  const featuredDatasets = DATASETS.filter(d => d.featured)

  const filteredDatasets = useMemo(() => {
    let filtered = DATASETS

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(d => d.category === selectedCategory)
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q)) ||
        d.author.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      )
    }

    // Sort
    switch (sortBy) {
      case "recent":
        filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "downloads":
        filtered = [...filtered].sort((a, b) => b.downloads - a.downloads)
        break
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating)
        break
      case "popular":
      default:
        filtered = [...filtered].sort((a, b) => (b.downloads + b.reviews * 10) - (a.downloads + a.reviews * 10))
    }

    return filtered
  }, [search, selectedCategory, sortBy])

  // Global stats
  const totalDatasets = DATASETS.length
  const totalDownloads = DATASETS.reduce((sum, d) => sum + d.downloads, 0)

  return (
    <div className="max-w-[1400px] mx-auto space-y-10">

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <FadeInWhenVisible>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-black rounded-sm flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight uppercase text-black">
                  Dataset Marketplace
                </h1>
                <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mt-0.5">
                  Community-curated datasets for every use case
                </p>
              </div>
            </div>
          </div>

          {/* Stats pills */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-sm">
              <Database className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] font-mono font-bold text-black">{totalDatasets}</span>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Datasets</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-sm">
              <Users className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] font-mono font-bold text-black">12</span>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Contributors</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-black/10 rounded-sm">
              <Download className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] font-mono font-bold text-black">{formatCount(totalDownloads)}</span>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Downloads</span>
            </div>
          </div>
        </div>
      </FadeInWhenVisible>

      {/* ── SEARCH + SORT BAR ───────────────────────────────────── */}
      <FadeInWhenVisible delay={0.1}>
        <Card className="border-black/10 shadow-sm rounded-sm bg-white overflow-hidden">
          <div className="p-4 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search datasets by name, category, tag, or author..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-10 border-black/10 rounded-sm text-[11px] font-mono placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-black"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-10 pl-3 pr-8 text-[11px] font-mono border border-black/10 rounded-sm appearance-none bg-white hover:border-black/30 transition-colors uppercase cursor-pointer tracking-widest"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>
        </Card>
      </FadeInWhenVisible>

      {/* ── CATEGORY PILLS ──────────────────────────────────────── */}
      <FadeInWhenVisible delay={0.15}>
        <div className="flex gap-2 flex-wrap">
          <LayoutGroup>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id
              const count = cat.id === "all" ? DATASETS.length : DATASETS.filter(d => d.category === cat.id).length
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "relative px-4 py-2.5 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest transition-colors",
                    "flex items-center gap-2 border",
                    isSelected
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-black/10 hover:border-black/30 hover:bg-black/5"
                  )}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                  <span className={cn(
                    "text-[9px] ml-1 px-1.5 py-0.5 rounded-sm font-bold",
                    isSelected ? "bg-white/20 text-white" : "bg-black/5 text-gray-500"
                  )}>
                    {count}
                  </span>
                </motion.button>
              )
            })}
          </LayoutGroup>
        </div>
      </FadeInWhenVisible>

      {/* ── FEATURED SECTION ────────────────────────────────────── */}
      {selectedCategory === "all" && !search && (
        <FadeInWhenVisible delay={0.2}>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <TrendingUp className="w-4 h-4 text-black" />
              <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-black">
                Featured Datasets
              </h2>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <div className="flex gap-5 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide">
              {featuredDatasets.map((dataset, index) => (
                <FeaturedCard key={dataset.id} dataset={dataset} index={index} onPreview={() => setPreviewDataset(dataset)} />
              ))}
            </div>
          </div>
        </FadeInWhenVisible>
      )}

      {/* ── ALL DATASETS GRID ───────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-black" />
            <h2 className="text-[11px] font-mono font-bold uppercase tracking-widest text-black">
              {selectedCategory === "all" ? "All Datasets" : CATEGORIES.find(c => c.id === selectedCategory)?.name + " Datasets"}
            </h2>
            <div className="h-px flex-1 bg-black/10 min-w-[40px]" />
          </div>
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            {filteredDatasets.length} result{filteredDatasets.length !== 1 ? "s" : ""}
          </span>
        </div>

        {filteredDatasets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredDatasets.map((dataset, index) => (
              <DatasetCard key={dataset.id} dataset={dataset} index={index} onPreview={() => setPreviewDataset(dataset)} />
            ))}
          </div>
        ) : (
          <Card className="border-black/10 shadow-sm rounded-sm bg-white p-12 text-center">
            <Search className="w-8 h-8 mx-auto text-gray-300 mb-4" />
            <h3 className="text-sm font-bold uppercase tracking-tight text-black mb-2">No Datasets Found</h3>
            <p className="text-[11px] font-mono text-gray-400 uppercase tracking-widest">
              Try a different search term or category
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSearch(""); setSelectedCategory("all") }}
              className="mt-4 rounded-sm border-black/10 text-[10px] font-mono uppercase tracking-widest font-bold"
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>

      {/* ── CTA BANNER ──────────────────────────────────────────── */}
      <FadeInWhenVisible>
        <Card className="border-black/10 shadow-sm rounded-sm bg-black overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/10 rounded-sm flex items-center justify-center flex-shrink-0">
                <Share2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-white">
                  Share Your Dataset
                </h3>
                <p className="text-[11px] font-mono text-white/60 uppercase tracking-widest mt-1">
                  Contribute to the community — Upload your synthetic data templates for others to use
                </p>
              </div>
            </div>
            <Link href="/dashboard/upload">
              <Button className="rounded-sm bg-white text-black hover:bg-white/90 text-[10px] font-mono uppercase tracking-widest font-bold h-11 px-8 gap-2 flex-shrink-0">
                <ArrowUpRight className="w-4 h-4" />
                Upload Dataset
              </Button>
            </Link>
          </div>
        </Card>
      </FadeInWhenVisible>

      {/* ── Preview Modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {previewDataset && (
          <PreviewModal dataset={previewDataset} onClose={() => setPreviewDataset(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}
