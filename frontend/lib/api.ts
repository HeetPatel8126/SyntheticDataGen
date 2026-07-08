const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "dev-api-key-123456";

export type User = {
  id: string;
  email: string;
  full_name?: string | null;
  is_active: boolean;
  is_verified: boolean;
  total_records_generated: number;
  storage_used: number;
  created_at?: string | null;
  last_login?: string | null;
};

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
};

export type Job = {
  id: string;
  job_id?: string;
  user_id?: string | null;
  data_type: string;
  record_count: number;
  output_format?: string;
  file_format?: string;
  template_id?: string | null;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled" | string;
  progress?: number;
  error?: string | null;
  error_message?: string | null;
  file_path?: string | null;
  file_size?: number | null;
  job_metadata?: Record<string, unknown> | null;
  created_at: string;
  started_at?: string | null;
  completed_at?: string | null;
};

export type Template = {
  id: string;
  name: string;
  description?: string | null;
  schema?: Record<string, unknown>;
  data_type?: string;
  category?: string;
  fields?: unknown[];
  is_active: boolean;
  is_system: boolean;
  created_at?: string | null;
  updated_at?: string | null;
};

type RequestOptions = RequestInit & {
  auth?: boolean;
  apiKey?: boolean;
};

function getStoredToken(key: "access_token" | "refresh_token") {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(key);
}

function setStoredTokens(tokens: Pick<TokenResponse, "access_token" | "refresh_token">) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("access_token", tokens.access_token);
  window.localStorage.setItem("refresh_token", tokens.refresh_token);
}

function clearStoredTokens() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("refresh_token");
}

function normalizeApiError(body: unknown, fallback: string) {
  if (body && typeof body === "object") {
    const errorBody = body as { detail?: unknown; error?: unknown; message?: unknown };
    const message = errorBody.detail || errorBody.error || errorBody.message;
    if (typeof message === "string") return message;
  }
  return fallback;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.apiKey !== false) {
    headers.set("X-API-Key", API_KEY);
  }

  const token = getStoredToken("access_token");
  if (options.auth !== false && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: options.credentials || "include"
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(normalizeApiError(body, `Request failed with ${response.status}`));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function normalizeJob(job: Job): Job {
  return {
    ...job,
    id: job.id || job.job_id || String(Math.random()),
    file_format: job.file_format || job.output_format || "csv",
    error: job.error || job.error_message || null
  };
}

function normalizeTemplate(template: Template): Template {
  const fields = Array.isArray(template.fields)
    ? template.fields
    : Array.isArray((template.schema as { fields?: unknown[] } | undefined)?.fields)
      ? (template.schema as { fields: unknown[] }).fields
      : [];

  return {
    ...template,
    id: template.id || (template as any).template_id || (template as any)._id || String(Math.random()),
    category: template.category || template.data_type || (template.is_system ? template.name.toLowerCase() : "custom"),
    data_type: template.data_type || template.name.toLowerCase(),
    fields
  };
}

export const authApi = {
  async login(payload: { email: string; password: string }) {
    const token = await request<TokenResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      apiKey: false,
      auth: false
    });
    setStoredTokens(token);
    return token;
  },

  async register(payload: { email: string; password: string; full_name?: string }) {
    const token = await request<TokenResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
      apiKey: false,
      auth: false
    });
    setStoredTokens(token);
    return token;
  },

  async refresh(refreshToken = getStoredToken("refresh_token")) {
    if (!refreshToken) throw new Error("Missing refresh token");
    const token = await request<TokenResponse>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
      apiKey: false,
      auth: false
    });
    setStoredTokens(token);
    return token;
  },

  getMe() {
    return request<User>("/api/auth/me", { apiKey: false });
  },

  updateMe(payload: { full_name?: string; email?: string }) {
    return request<User>("/api/auth/me", {
      method: "PUT",
      body: JSON.stringify(payload),
      apiKey: false
    });
  },

  changePassword(payload: { current_password: string; new_password: string }) {
    return request<{ message: string }>("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
      apiKey: false
    });
  },

  async logout() {
    try {
      await request<{ message: string }>("/api/auth/logout", {
        method: "POST",
        apiKey: false
      });
    } finally {
      clearStoredTokens();
    }
  }
};

export const generatorApi = {
  async preview(payload: { data_type: string; record_count?: number; output_format?: string; locale?: string }) {
    return request<unknown[]>("/api/preview", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  async generate(payload: { data_type: string; record_count: number; output_format: string; template_id?: string; locale?: string }) {
    const response = await request<{ job_id: string; message: string; status: string }>("/api/generate", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return {
      ...response,
      id: response.job_id
    };
  },

  async getJob(jobId: string) {
    return normalizeJob(await request<Job>(`/api/jobs/${jobId}`));
  },

  async getJobs() {
    const response = await request<{ jobs: Job[]; total: number }>("/api/jobs?page_size=100");
    return response.jobs.map(normalizeJob);
  },

  deleteJob(jobId: string) {
    return request<{ message: string }>(`/api/jobs/${jobId}`, { method: "DELETE" });
  },

  async downloadJob(jobId: string, filename: string) {
    const headers = new Headers({ "X-API-Key": API_KEY });
    const token = getStoredToken("access_token");
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(`${API_BASE}/api/jobs/${jobId}/download`, {
      headers,
      credentials: "include"
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      throw new Error(normalizeApiError(body, "Download failed"));
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  },

  async getTemplates() {
    const response = await request<{ templates: Template[]; total: number }>("/api/templates");
    return response.templates.map(normalizeTemplate);
  },

  async createTemplate(payload: {
    name: string;
    description?: string;
    data_type?: string;
    schema?: Record<string, unknown>;
    schema_fields?: unknown[];
  }) {
    const rawFields = payload.schema_fields || (payload.schema as { fields?: unknown[] } | undefined)?.fields || [];
    const schemaFields = Array.isArray(rawFields)
      ? rawFields.map((field: any) => ({
          name: field.name,
          field_type: field.field_type || field.type || "string",
          nullable: Boolean(field.nullable),
          options: field.options || undefined
        }))
      : [];

    return normalizeTemplate(await request<Template>("/api/templates", {
      method: "POST",
      body: JSON.stringify({
        name: payload.name,
        description: payload.description,
        schema_fields: schemaFields
      })
    }));
  },

  deleteTemplate(templateId: string) {
    return request<{ message: string }>(`/api/templates/${templateId}`, { method: "DELETE" });
  },

  async getStats() {
    const response = await request<{
      jobs?: {
        total_jobs?: number;
        total_records?: number;
        active_jobs?: number;
        by_status?: Record<string, number>;
      };
      storage?: {
        total_size?: number;
        storage_used?: number;
      };
    }>("/api/stats");

    return {
      total_generations: response.jobs?.total_jobs || 0,
      total_records: response.jobs?.total_records || 0,
      active_jobs: response.jobs?.active_jobs || response.jobs?.by_status?.processing || 0,
      storage_used: response.storage?.storage_used || response.storage?.total_size || 0,
      raw: response
    };
  },

  generateSchemaFromDescription(description: string) {
    return request<unknown>("/api/schema/generate-from-description", {
      method: "POST",
      body: JSON.stringify({ description })
    });
  }
};

export function getApiBaseUrl() {
  return API_BASE;
}
