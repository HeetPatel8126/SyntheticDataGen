export const DATA_TYPES = [
  {
    id: "user",
    name: "User",
    description: "Realistic user profiles with names, emails, addresses, and demographics.",
    icon: "Users",
    color: "from-purple-500 to-violet-600",
    fields: ["id", "name", "email", "phone", "address", "created_at"]
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Orders, customers, products, prices, and transaction metadata.",
    icon: "ShoppingCart",
    color: "from-emerald-500 to-teal-600",
    fields: ["order_id", "customer", "product", "price", "quantity", "status"]
  },
  {
    id: "company",
    name: "Company",
    description: "Company profiles with industries, sizes, revenue, domains, and locations.",
    icon: "Building2",
    color: "from-blue-500 to-cyan-600",
    fields: ["id", "name", "industry", "employees", "revenue", "website"]
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Patient records, diagnoses, medications, and clinical encounters.",
    icon: "Heart",
    color: "from-rose-500 to-pink-600",
    fields: ["patient_id", "diagnosis", "medication", "provider", "visit_date", "status"],
    comingSoon: true
  },
  {
    id: "finance",
    name: "Finance",
    description: "Transactions, accounts, statements, and fintech instrument data.",
    icon: "DollarSign",
    color: "from-amber-500 to-orange-600",
    fields: ["transaction_id", "account", "amount", "currency", "timestamp", "type"],
    comingSoon: true
  },
  {
    id: "iot",
    name: "IoT / Sensors",
    description: "Sensor readings, device telemetry, timestamps, and anomaly flags.",
    icon: "Share2",
    color: "from-sky-500 to-indigo-600",
    fields: ["device_id", "sensor_type", "value", "unit", "timestamp", "location"],
    comingSoon: true
  }
] as const;

export const OUTPUT_FORMATS = [
  { id: "csv", name: "CSV", extension: ".csv", description: "Spreadsheet-friendly comma-separated values" },
  { id: "json", name: "JSON", extension: ".json", description: "Structured JSON records for APIs and apps" }
] as const;

export const LOCALES = [
  { value: "en_US", label: "English (US)" },
  { value: "en_GB", label: "English (UK)" },
  { value: "en_CA", label: "English (Canada)" },
  { value: "en_AU", label: "English (Australia)" }
] as const;

export const RECORD_COUNT_PRESETS = [
  { value: 100, label: "100" },
  { value: 1000, label: "1K" },
  { value: 10000, label: "10K" },
  { value: 100000, label: "100K" }
] as const;

export const JOB_STATUSES = {
  pending: { label: "Pending" },
  processing: { label: "Processing" },
  completed: { label: "Completed" },
  failed: { label: "Failed" },
  cancelled: { label: "Cancelled" }
} as const;
