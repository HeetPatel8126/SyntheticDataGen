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
  user: Users,
  users: Users,
  ecommerce: ShoppingCart,
  company: Building,
  companies: Building,
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
                "relative px-4 py-2 rounded-sm text-[10px] font-mono font-bold uppercase tracking-widest transition-colors",
                "flex items-center gap-2 border border-black",
                isSelected 
                  ? "bg-black text-white" 
                  : "bg-white text-black hover:bg-black/5"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {cat !== 'all' && <Icon className="w-3.5 h-3.5" />}
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
          "border-black/10 hover:border-black rounded-sm bg-white",
          "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        )}>
          <div className="relative h-full flex flex-col bg-white rounded-sm">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 mb-3">
                {/* Icon container */}
                <motion.div 
                  className={cn(
                    "w-12 h-12 rounded-sm flex items-center justify-center bg-black"
                  )}
                  animate={isHovered ? { 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>

                {/* Data type badge */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "capitalize text-[10px] font-mono uppercase tracking-widest",
                      "border-black/10 text-gray-500 bg-gray-50 rounded-sm"
                    )}
                  >
                    {template.data_type}
                  </Badge>
                </motion.div>
              </div>

              <CardTitle className="line-clamp-1 text-black text-xl font-bold uppercase tracking-tight group-hover:tracking-widest transition-all">
                {template.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 mt-2 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                {template.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-between pt-0">
              {/* Template info */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Created {formatDate(template.created_at)}</span>
                </div>
                
                {/* Schema preview tags */}
                <div className="flex flex-wrap gap-1">
                  {Object.keys(template.schema || {}).slice(0, 3).map((field) => (
                    <span 
                      key={field}
                      className="px-2 py-0.5 border border-black/10 rounded-none text-[10px] font-mono bg-gray-50 text-gray-500"
                    >
                      {field}
                    </span>
                  ))}
                  {Object.keys(template.schema || {}).length > 3 && (
                    <span className="px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-black text-white">
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
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 border-black/10 hover:border-black rounded-sm font-mono text-[10px] uppercase font-bold"
                    onClick={onUse}
                  >
                    <Play className="w-3.5 h-3.5" />
                    Use Template
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onPreview}
                    className="border-black/10 hover:border-black rounded-sm"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link href={`/dashboard/templates/${template.id}/edit`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-black/10 hover:border-black rounded-sm"
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
                    className="border-red-500/30 hover:border-red-500 hover:bg-red-50 hover:text-red-600 rounded-sm"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
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
          <Card className="border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm bg-white">
            <CardHeader className="border-b border-black/10">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-sm bg-black flex items-center justify-center">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold uppercase tracking-tight text-black">{template.name}</CardTitle>
                    <CardDescription className="mt-1 font-mono text-[10px] uppercase tracking-widest text-gray-500">{template.description}</CardDescription>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="hover:bg-black/5 text-black"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Template info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-sm bg-gray-50 border border-black/10">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">Data Type</p>
                  <p className="font-bold capitalize text-black">{template.data_type}</p>
                </div>
                <div className="p-4 rounded-sm bg-gray-50 border border-black/10">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">Created</p>
                  <p className="font-bold text-black font-mono text-sm">{formatDate(template.created_at)}</p>
                </div>
              </div>

              {/* Schema preview */}
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-widest font-bold mb-3 flex items-center gap-2 text-black">
                  <Code className="w-4 h-4 text-black" />
                  Schema Fields
                </h4>
                <div className="rounded-sm bg-gray-50 border border-black/10 p-4 font-mono text-xs overflow-x-auto">
                  <pre className="text-black">
                    {JSON.stringify(template.schema, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-black/10">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2 bg-black text-white hover:bg-black/90 hover:text-white rounded-sm font-mono text-[10px] uppercase font-bold tracking-widest"
                  onClick={onUse}
                >
                  <Play className="w-4 h-4" />
                  Use This Template
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2 border-black/10 hover:border-black rounded-sm text-black font-mono text-[10px] uppercase font-bold tracking-widest"
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
        <div className="w-24 h-24 rounded-sm bg-black border border-black flex items-center justify-center mx-auto">
          <FileText className="w-12 h-12 text-white" />
        </div>
      </motion.div>
      
      <h3 className="text-2xl font-bold uppercase tracking-tight text-black mb-3">
        {search ? 'No templates found' : 'No templates yet'}
      </h3>
      <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest mb-8 max-w-md mx-auto">
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
            className="gap-2 bg-black text-white hover:bg-black/90 rounded-sm font-mono text-[11px] uppercase font-bold tracking-widest px-6 h-12"
            onClick={onCreateNew}
          >
            <Sparkles className="w-4 h-4" />
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
    <div className="flex rounded-sm bg-gray-100 p-1 border border-black/10">
      {(['grid', 'list'] as const).map((v) => (
        <button
          key={v}
          onClick={() => onViewChange(v)}
          className={cn(
            "p-2 rounded-sm transition-all",
            view === v 
              ? "bg-white text-black shadow-sm border border-black/10" 
              : "text-gray-400 hover:text-black"
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

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold tracking-tight uppercase text-black">Templates</h1>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <FileText className="w-8 h-8 text-black" />
            </motion.div>
          </div>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">Save and reuse your favorite data generation schemas</p>
        </div>
        <Link href="/dashboard/templates/new">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button className="gap-2 bg-black text-white hover:bg-black/90 rounded-sm font-mono text-[11px] uppercase font-bold tracking-widest px-6 h-12">
              <Plus className="w-4 h-4" />
              Create Template
            </Button>
          </motion.div>
        </Link>
      </motion.div>

      {/* Filters and Search */}
      <FadeInWhenVisible>
        <Card className="bg-white border-black/10 rounded-sm shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <CategoryFilter 
                categories={categories}
                selected={category}
                onSelect={setCategory}
              />
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64 group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
                  <Input
                    placeholder="Search templates..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 bg-white border border-black/10 focus:border-black text-black font-mono text-sm rounded-sm"
                  />
                </div>
                <ViewToggle view={view} onViewChange={setView} />
              </div>
            </div>
          </CardContent>
        </Card>
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
                <Skeleton className="h-[280px] w-full rounded-sm bg-gray-100" />
              </motion.div>
            ))}
          </motion.div>
        ) : filteredTemplates && filteredTemplates.length > 0 ? (
          <motion.div
            key="templates"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout
            className={cn(
              "grid gap-6",
              view === 'grid' 
                ? "md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            )}
          >
            <AnimatePresence mode="popLayout">
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
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-black rounded-sm bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
