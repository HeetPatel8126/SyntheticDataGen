'use client'

import { useState, useCallback, Fragment } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { 
  Plus, 
  Search, 
  FileText, 
  Trash2, 
  Edit,
  Play,
  Copy,
  X,
  Clock,
  Sparkles,
  Users,
  ShoppingCart,
  Building,
  Code,
  Grid3X3,
  List,
  SlidersHorizontal,
  Eye,
  Download,
  Star,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { generatorApi, Template } from "@/lib/api"
import { formatDate, cn } from "@/lib/utils"
import { toast } from "sonner"
import { useGeneratorStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { 
  FadeInWhenVisible, 
  SpotlightCard,
  TiltCard,
  AnimatedNumber
} from "@/components/animations"

// Template category icons
const categoryIcons: Record<string, typeof Users> = {
  users: Users,
  ecommerce: ShoppingCart,
  company: Building,
  custom: Code,
}

// Category filter component
function CategoryFilter({ 
  categories, 
  selected, 
  onSelect 
}: { 
  categories: string[]
  selected: string
  onSelect: (cat: string) => void 
}) {
  return (
    <motion.div 
      className="flex gap-2 flex-wrap"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <LayoutGroup>
        {['all', ...categories].map((cat) => {
          const isSelected = selected === cat
          const Icon = categoryIcons[cat] || Grid3X3
          
          return (
            <motion.button
              key={cat}
              onClick={() => onSelect(cat)}
              className={cn(
                "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
                "flex items-center gap-2",
                isSelected 
                  ? "text-white" 
                  : "text-gray-400 hover:text-white bg-white/5 hover:bg-white/10"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSelected && (
                <motion.div
                  layoutId="category-pill"
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {cat !== 'all' && <Icon className="w-4 h-4" />}
                <span className="capitalize">{cat}</span>
              </span>
            </motion.button>
          )
        })}
      </LayoutGroup>
    </motion.div>
  )
}

// Template Card component with enhanced animations
function TemplateCard({ 
  template, 
  index,
  onUse,
  onDelete,
  onPreview,
  isDeleting
}: { 
  template: Template
  index: number
  onUse: () => void
  onDelete: () => void
  onPreview: () => void
  isDeleting: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const Icon = categoryIcons[template.data_type] || FileText

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ 
        delay: index * 0.05,
        layout: { type: "spring", stiffness: 300, damping: 30 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <TiltCard maxTilt={5} scale={1.02}>
        <Card className={cn(
          "h-full relative overflow-hidden transition-all duration-300",
          "border-white/10 hover:border-purple-500/50",
          "hover:shadow-2xl hover:shadow-purple-500/20"
        )}>
          {/* Gradient border effect */}
          <motion.div
            className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(99, 102, 241, 0.2))',
              padding: '1px',
            }}
          />

          {/* Glow effect */}
          <motion.div
            className="absolute -inset-1 rounded-lg opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(99, 102, 241, 0.3))',
            }}
          />

          <div className="relative h-full flex flex-col bg-card rounded-lg">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 mb-3">
                {/* Icon container with animated gradient */}
                <motion.div 
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    "bg-gradient-to-br from-purple-500/20 to-indigo-500/20",
                    "border border-purple-500/30"
                  )}
                  animate={isHovered ? { 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-6 h-6 text-purple-400" />
                </motion.div>

                {/* Data type badge */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "capitalize text-xs",
                      "bg-white/5 hover:bg-white/10 transition-colors"
                    )}
                  >
                    {template.data_type}
                  </Badge>
                </motion.div>
              </div>

              <CardTitle className="line-clamp-1 group-hover:text-purple-400 transition-colors">
                {template.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 mt-2">
                {template.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between pt-0">
              {/* Template info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>Created {formatDate(template.created_at)}</span>
                </div>
                
                {/* Schema preview tags */}
                <div className="flex flex-wrap gap-1">
                  {Object.keys(template.schema || {}).slice(0, 3).map((field) => (
                    <span 
                      key={field}
                      className="px-2 py-0.5 rounded-md text-[10px] bg-white/5 text-gray-400"
                    >
                      {field}
                    </span>
                  ))}
                  {Object.keys(template.schema || {}).length > 3 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] bg-purple-500/10 text-purple-400">
                      +{Object.keys(template.schema || {}).length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <motion.div 
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="gradient"
                    size="sm"
                    className="w-full gap-2"
                    onClick={onUse}
                  >
                    <Play className="w-4 h-4" />
                    Use Template
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onPreview}
                    className="border-white/10 hover:border-purple-500/50"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link href={`/dashboard/templates/${template.id}/edit`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-white/10 hover:border-purple-500/50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="border-red-500/30 hover:border-red-500/50 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </div>
        </Card>
      </TiltCard>
    </motion.div>
  )
}

// Preview Modal component
function PreviewModal({ 
  template, 
  onClose,
  onUse
}: { 
  template: Template | null
  onClose: () => void
  onUse: () => void
}) {
  if (!template) return null

  const Icon = categoryIcons[template.data_type] || FileText
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-2xl max-h-[80vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{template.name}</CardTitle>
                    <CardDescription className="mt-1">{template.description}</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Template info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-500 mb-1">Data Type</p>
                  <p className="font-medium capitalize">{template.data_type}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5">
                  <p className="text-xs text-gray-500 mb-1">Created</p>
                  <p className="font-medium">{formatDate(template.created_at)}</p>
                </div>
              </div>

              {/* Schema preview */}
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Code className="w-4 h-4 text-purple-400" />
                  Schema Fields
                </h4>
                <div className="rounded-lg bg-black/50 border border-white/10 p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-gray-300">
                    {JSON.stringify(template.schema, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <Button 
                  variant="gradient" 
                  className="flex-1 gap-2"
                  onClick={onUse}
                >
                  <Play className="w-4 h-4" />
                  Use This Template
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(template.schema, null, 2))
                    toast.success('Schema copied to clipboard')
                  }}
                >
                  <Copy className="w-4 h-4" />
                  Copy Schema
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Empty state component
function EmptyState({ search, onCreateNew }: { search: string, onCreateNew: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="inline-block mb-6"
      >
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center mx-auto">
          <FileText className="w-12 h-12 text-purple-400" />
        </div>
      </motion.div>
      
      <h3 className="text-2xl font-semibold mb-3">
        {search ? 'No templates found' : 'No templates yet'}
      </h3>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        {search 
          ? 'Try adjusting your search terms or filters to find what you\'re looking for' 
          : 'Create your first template to save your favorite data configurations for quick reuse'}
      </p>
      
      {!search && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            variant="gradient" 
            size="lg" 
            className="gap-2"
            onClick={onCreateNew}
          >
            <Sparkles className="w-5 h-5" />
            Create Your First Template
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

// View toggle component
function ViewToggle({ view, onViewChange }: { view: 'grid' | 'list', onViewChange: (v: 'grid' | 'list') => void }) {
  return (
    <div className="flex rounded-lg bg-white/5 p-1">
      {(['grid', 'list'] as const).map((v) => (
        <button
          key={v}
          onClick={() => onViewChange(v)}
          className={cn(
            "p-2 rounded-md transition-all",
            view === v 
              ? "bg-purple-500 text-white" 
              : "text-gray-400 hover:text-white"
          )}
        >
          {v === 'grid' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
        </button>
      ))}
    </div>
  )
}

export default function TemplatesPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  
  const queryClient = useQueryClient()
  const router = useRouter()
  const { setDataType } = useGeneratorStore()

  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: generatorApi.getTemplates,
  })

  const deleteMutation = useMutation({
    mutationFn: generatorApi.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      toast.success('Template deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete template')
    },
  })

  const handleUseTemplate = useCallback((template: Template) => {
    setDataType(template.data_type)
    router.push('/dashboard/generate')
    toast.success(`Using template: ${template.name}`)
  }, [setDataType, router])

  // Get unique categories
  const categories = [...new Set(templates?.map(t => t.data_type) || [])]

  // Filter templates
  const filteredTemplates = templates?.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'all' || template.data_type === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeInWhenVisible>
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <motion.h1 
              className="text-4xl md:text-5xl font-heading font-bold mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Templates
              </span>
            </motion.h1>
            <motion.p 
              className="text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Pre-built and custom data generation templates for quick access
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/dashboard/templates/new">
              <Button variant="gradient" size="lg" className="gap-2 shadow-lg shadow-purple-500/25">
                <Plus className="w-5 h-5" />
                New Template
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </FadeInWhenVisible>

      {/* Stats bar */}
      {templates && templates.length > 0 && (
        <FadeInWhenVisible delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Templates', value: templates.length, icon: FileText },
              { label: 'Categories', value: categories.length, icon: Grid3X3 },
              { label: 'Most Used', value: templates[0]?.name || 'N/A', icon: Star },
              { label: 'Recent', value: formatDate(templates[templates.length - 1]?.created_at || new Date().toISOString()), icon: Clock },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Card className="border-white/10 hover:border-purple-500/30 transition-all">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                      <stat.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">
                        {typeof stat.value === 'number' ? (
                          <AnimatedNumber value={stat.value} duration={0.5} />
                        ) : (
                          <span className="truncate">{stat.value}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </FadeInWhenVisible>
      )}

      {/* Filters */}
      <FadeInWhenVisible delay={0.2}>
        <SpotlightCard>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <Input
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-white/5 border-white/10 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>

              {/* Category filters */}
              {categories.length > 0 && (
                <CategoryFilter 
                  categories={categories} 
                  selected={category} 
                  onSelect={setCategory} 
                />
              )}

              {/* View toggle */}
              <ViewToggle view={view} onViewChange={setView} />
            </div>
          </CardContent>
        </SpotlightCard>
      </FadeInWhenVisible>

      {/* Templates Grid/List */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "grid gap-6",
              view === 'grid' 
                ? "md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            )}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-64">
                  <CardHeader>
                    <Skeleton className="h-12 w-12 rounded-xl mb-3" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 w-9" />
                      <Skeleton className="h-9 w-9" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : filteredTemplates && filteredTemplates.length > 0 ? (
          <motion.div
            key="templates"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "grid gap-6",
              view === 'grid' 
                ? "md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            )}
          >
            <LayoutGroup>
              {filteredTemplates.map((template, index) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  index={index}
                  onUse={() => handleUseTemplate(template)}
                  onDelete={() => {
                    if (confirm('Are you sure you want to delete this template?')) {
                      deleteMutation.mutate(template.id)
                    }
                  }}
                  onPreview={() => setPreviewTemplate(template)}
                  isDeleting={deleteMutation.isPending}
                />
              ))}
            </LayoutGroup>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-white/10">
              <CardContent>
                <EmptyState 
                  search={search} 
                  onCreateNew={() => router.push('/dashboard/templates/new')}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      {previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={() => {
            handleUseTemplate(previewTemplate)
            setPreviewTemplate(null)
          }}
        />
      )}
    </div>
  )
}
