export type FunctionType = "ei" | "eo" | "eq" | "ilf" | "eif";

export type FPComplexity = "simple" | "average" | "complex";

export const FP_WEIGHTS: Record<FunctionType, Record<FPComplexity, number>> = {
  ei: { simple: 3, average: 4, complex: 6 },
  eo: { simple: 4, average: 5, complex: 7 },
  eq: { simple: 3, average: 4, complex: 6 },
  ilf: { simple: 7, average: 10, complex: 15 },
  eif: { simple: 5, average: 7, complex: 10 },
};

export interface FunctionTypeMeta {
  id: FunctionType;
  label: string;
  description: string;
  examples: string[];
}

export interface FPItem {
  id: string;
  label: string;
  type: FunctionType;
  complexity: FPComplexity;
  points: number;
  isAutoSuggested: boolean;
}

export type GSCId =
  | "data_communications"
  | "distributed_processing"
  | "performance"
  | "heavily_used_config"
  | "transaction_rate"
  | "online_data_entry"
  | "end_user_efficiency"
  | "online_update"
  | "complex_processing"
  | "reusability"
  | "installation_ease"
  | "operational_ease"
  | "multiple_sites"
  | "facilitating_change";

export interface GSC {
  id: GSCId;
  label: string;
  description: string;
  value: number;
}

export interface FPAConfig {
  items: FPItem[];
  gscs: Record<GSCId, number>;
  productivityRate: number;
  rawFP: number;
  adjustedFP: number;
}

export const DEFAULT_PRODUCTIVITY_RATE = 12;
export const GSC_ADJUSTMENT_BASE = 0.65;
export const GSC_ADJUSTMENT_MULTIPLIER = 0.01;
