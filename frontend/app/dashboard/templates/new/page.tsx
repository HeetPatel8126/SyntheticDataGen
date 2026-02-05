'use client'

import { useState, useCallback } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  Save, 
  Play, 
  Check, 
  X, 
  Info,
  Code,
  FileText,
  Sparkles,
  Zap,
  AlertCircle,
  CheckCircle2,
  Copy,
  RefreshCw,
  Users,
  ShoppingCart,
  Building,
  Wand2
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { generatorApi } from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { 
  FadeInWhenVisible, 
  SpotlightCard,
  LoadingSpinner
} from "@/components/animations"

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

// Data type options with icons
const dataTypes = [
  { id: 'users', label: 'Users / People', icon: Users, color: 'purple' },
  { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart, color: 'green' },
  { id: 'companies', label: 'Companies', icon: Building, color: 'blue' },
]

// Schema templates
const schemaTemplates: Record<string, object> = {
  users: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string" },
      email: { type: "string", format: "email" },
      age: { type: "number", minimum: 18, maximum: 100 },
      created_at: { type: "string", format: "date-time" }
    }
  },
  ecommerce: {
    type: "object",
    properties: {
      product_id: { type: "string", format: "uuid" },
      name: { type: "string" },
      price: { type: "number", minimum: 0 },
      category: { type: "string" },
      in_stock: { type: "boolean" }
    }
  },
  companies: {
    type: "object",
    properties: {
      company_id: { type: "string", format: "uuid" },
      name: { type: "string" },
      industry: { type: "string" },
      employees: { type: "number" },
      founded: { type: "string", format: "date" }
    }
  }
}

// Animated input component
function AnimatedInput({ 
  label, 
  placeholder,
  value,
  onChange,
  icon: Icon
}: { 
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  icon?: React.ElementType
}) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <motion.div
      animate={isFocused ? { scale: 1.01 } : { scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 35 }}
    >
      <label className="text-sm font-medium mb-2 block text-gray-300">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
            isFocused ? "text-purple-400" : "text-gray-500"
          )} />
        )}
        <Input 
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "bg-white/5 border-white/10 transition-all",
            "focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
            Icon && "pl-10"
          )}
        />
        <motion.div
          className="absolute inset-0 rounded-md pointer-events-none"
          animate={isFocused ? { 
            boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.2)"
          } : { 
            boxShadow: "0 0 0 0px rgba(139, 92, 246, 0)"
          }}
        />
      </div>
    </motion.div>
  )
}

// Data type selector
function DataTypeSelector({ 
  selected, 
  onSelect,
  onSchemaUpdate
}: { 
  selected: string
  onSelect: (type: string) => void
  onSchemaUpdate: (schema: string) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {dataTypes.map((type) => {
        const isSelected = selected === type.id
        return (
          <motion.button
            key={type.id}
            onClick={() => {
              onSelect(type.id)
              onSchemaUpdate(JSON.stringify(schemaTemplates[type.id], null, 2))
            }}
            className={cn(
              "relative p-4 rounded-xl border transition-all text-left",
              isSelected 
                ? "border-purple-500 bg-purple-500/10" 
                : "border-white/10 hover:border-white/20 bg-white/5"
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSelected && (
              <motion.div
                layoutId="type-indicator"
                className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <type.icon className={cn(
              "w-6 h-6 mb-2",
              isSelected ? "text-purple-400" : "text-gray-400"
            )} />
            <p className={cn(
              "text-sm font-medium",
              isSelected ? "text-white" : "text-gray-400"
            )}>
              {type.label}
            </p>
          </motion.button>
        )
      })}
    </div>
  )
}

// Schema format reference
function SchemaReference() {
  const formats = [
    { format: 'uuid', desc: 'Unique identifier', example: 'a1b2c3d4-...' },
    { format: 'email', desc: 'Email address', example: 'user@example.com' },
    { format: 'date-time', desc: 'ISO timestamp', example: '2024-01-15T10:30:00Z' },
    { format: 'date', desc: 'Date only', example: '2024-01-15' },
    { format: 'string', desc: 'Text data', example: 'Hello World' },
    { format: 'number', desc: 'Numeric data', example: '42' },
    { format: 'boolean', desc: 'True/False', example: 'true' },
  ]

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-400">
        Supported schema formats:
      </p>
      <div className="space-y-2">
        {formats.map((f, i) => (
          <motion.div
            key={f.format}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 text-sm"
          >
            <div className="flex items-center gap-3">
              <code className="text-purple-400 font-mono text-xs">{f.format}</code>
              <span className="text-gray-400">{f.desc}</span>
            </div>
            <span className="text-gray-500 font-mono text-xs">{f.example}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Validation status component
function ValidationStatus({ isValid, error }: { isValid: boolean, error: string | null }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isValid ? 'valid' : 'invalid'}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
          isValid 
            ? "bg-green-500/10 text-green-400 border border-green-500/30"
            : "bg-red-500/10 text-red-400 border border-red-500/30"
        )}
      >
        {isValid ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            <span>Valid JSON</span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4" />
            <span>{error || 'Invalid JSON'}</span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

// Save button with states
function SaveButton({ 
  onClick, 
  isLoading,
  isDisabled
}: { 
  onClick: () => void
  isLoading: boolean
  isDisabled: boolean
}) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button 
        variant="gradient" 
        onClick={onClick}
        disabled={isLoading || isDisabled}
        className="gap-2 shadow-lg shadow-purple-500/25"
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <RefreshCw className="w-4 h-4 animate-spin" />
            </motion.div>
          ) : (
            <motion.div
              key="save"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Save className="w-4 h-4" />
            </motion.div>
          )}
        </AnimatePresence>
        <span>{isLoading ? 'Saving...' : 'Save Template'}</span>
      </Button>
    </motion.div>
  )
}

export default function NewTemplatePage() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [dataType, setDataType] = useState("users")
  const [schema, setSchema] = useState(JSON.stringify(schemaTemplates.users, null, 2))
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isValidJson, setIsValidJson] = useState(true)
  
  const router = useRouter()
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: generatorApi.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] })
      toast.success('Template created successfully', {
        description: 'Your new template is ready to use'
      })
      router.push('/dashboard/templates')
    },
    onError: (error: any) => {
      toast.error('Failed to create template', {
        description: error.message || 'Something went wrong',
      })
    },
  })

  const handleSave = useCallback(() => {
    if (!name.trim()) {
      toast.error('Please enter a template name')
      return
    }

    try {
      const parsedSchema = JSON.parse(schema)
      createMutation.mutate({
        name,
        description,
        data_type: dataType,
        schema: parsedSchema,
      })
    } catch (error) {
      toast.error('Invalid JSON schema')
      setValidationError('Invalid JSON syntax')
    }
  }, [name, description, dataType, schema, createMutation])

  const handleSchemaChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setSchema(value)
      try {
        JSON.parse(value)
        setValidationError(null)
        setIsValidJson(true)
      } catch (error) {
        setValidationError('Invalid JSON syntax')
        setIsValidJson(false)
      }
    }
  }, [])

  const handleCopySchema = useCallback(() => {
    navigator.clipboard.writeText(schema)
    toast.success('Schema copied to clipboard')
  }, [schema])

  const handleFormatSchema = useCallback(() => {
    try {
      const parsed = JSON.parse(schema)
      setSchema(JSON.stringify(parsed, null, 2))
      toast.success('Schema formatted')
    } catch {
      toast.error('Cannot format invalid JSON')
    }
  }, [schema])

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeInWhenVisible>
        <motion.div 
          className="flex flex-col md:flex-row md:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 flex-1">
            <motion.div whileHover={{ scale: 1.1, x: -3 }} whileTap={{ scale: 0.9 }}>
              <Link href="/dashboard/templates">
                <Button variant="ghost" size="icon" className="hover:bg-white/10">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  New Template
                </span>
              </h1>
              <p className="text-gray-400 text-sm mt-1">Create a custom data generation template</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button variant="outline" className="gap-2 border-white/10">
                <Play className="w-4 h-4" />
                Test
              </Button>
            </motion.div>
            <SaveButton 
              onClick={handleSave}
              isLoading={createMutation.isPending}
              isDisabled={!!validationError || !name.trim()}
            />
          </div>
        </motion.div>
      </FadeInWhenVisible>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Left Panel - Settings */}
        <div className="lg:col-span-2 space-y-6">
          <FadeInWhenVisible delay={0.1}>
            <SpotlightCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Template Details
                </CardTitle>
                <CardDescription>Basic information about your template</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <AnimatedInput
                  label="Name"
                  placeholder="E.g., User Profile Template"
                  value={name}
                  onChange={setName}
                  icon={Wand2}
                />
                
                <div>
                  <label className="text-sm font-medium mb-2 block text-gray-300">Description</label>
                  <motion.textarea
                    placeholder="Describe what this template generates..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={cn(
                      "w-full min-h-[100px] rounded-md border bg-white/5 border-white/10 px-3 py-2 text-sm resize-none",
                      "focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
                    )}
                    whileFocus={{ scale: 1.01 }}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-3 block text-gray-300">Data Type</label>
                  <DataTypeSelector 
                    selected={dataType} 
                    onSelect={setDataType}
                    onSchemaUpdate={setSchema}
                  />
                </div>
              </CardContent>
            </SpotlightCard>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.2}>
            <SpotlightCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-purple-400" />
                  Schema Reference
                </CardTitle>
                <CardDescription>JSON Schema format guide</CardDescription>
              </CardHeader>
              <CardContent>
                <SchemaReference />
              </CardContent>
            </SpotlightCard>
          </FadeInWhenVisible>
        </div>

        {/* Right Panel - Editor */}
        <div className="lg:col-span-3">
          <FadeInWhenVisible delay={0.15}>
            <SpotlightCard className="h-[calc(100vh-12rem)]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-purple-400" />
                      Schema Editor
                    </CardTitle>
                    <CardDescription>Define your JSON schema structure</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <ValidationStatus isValid={isValidJson} error={validationError} />
                    
                    <div className="flex gap-1">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleCopySchema}
                          className="hover:bg-white/10"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={handleFormatSchema}
                          className="hover:bg-white/10"
                        >
                          <Sparkles className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-6rem)]">
                <motion.div 
                  className={cn(
                    "h-full border rounded-lg overflow-hidden transition-colors",
                    isValidJson ? "border-white/10" : "border-red-500/30"
                  )}
                  animate={isValidJson ? {} : { 
                    boxShadow: ["0 0 0 0 rgba(239, 68, 68, 0)", "0 0 0 4px rgba(239, 68, 68, 0.1)", "0 0 0 0 rgba(239, 68, 68, 0)"]
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <MonacoEditor
                    height="100%"
                    language="json"
                    theme="vs-dark"
                    value={schema}
                    onChange={handleSchemaChange}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      padding: { top: 16, bottom: 16 },
                      folding: true,
                      bracketPairColorization: { enabled: true },
                      renderLineHighlight: 'gutter',
                      wordWrap: 'on',
                    }}
                  />
                </motion.div>
              </CardContent>
            </SpotlightCard>
          </FadeInWhenVisible>
        </div>
      </div>
    </div>
  )
}
