import { create } from "zustand";

type GeneratorState = {
  dataType: string;
  recordCount: number;
  outputFormat: string;
  locale: string;
  isGenerating: boolean;
  previewData: any[];
  jobs: any[];
  setDataType: (dataType: string) => void;
  setRecordCount: (recordCount: number) => void;
  setOutputFormat: (outputFormat: string) => void;
  setLocale: (locale: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setPreviewData: (previewData: any[]) => void;
  addJob: (job: any) => void;
  updateJob: (jobId: string, patch: any) => void;
};

export const useGeneratorStore = create<GeneratorState>((set) => ({
  dataType: "user",
  recordCount: 1000,
  outputFormat: "csv",
  locale: "en_US",
  isGenerating: false,
  previewData: [],
  jobs: [],
  setDataType: (dataType) => set({ dataType }),
  setRecordCount: (recordCount) => set({ recordCount }),
  setOutputFormat: (outputFormat) => set({ outputFormat }),
  setLocale: (locale) => set({ locale }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setPreviewData: (previewData) => set({ previewData }),
  addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
  updateJob: (jobId, patch) => set((state) => ({
    jobs: state.jobs.map((job) => (job.id === jobId || job.job_id === jobId ? { ...job, ...patch } : job))
  }))
}));
