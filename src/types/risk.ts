export type RiskCategory = "integration" | "technical" | "external" | "other";

export type ImpactLevel = "low" | "medium" | "high" | "custom";

export const IMPACT_HOURS: Record<Exclude<ImpactLevel, "custom">, number> = {
  low: 8,
  medium: 20,
  high: 40,
};

export const AI_DISCOUNT_CATEGORIES: RiskCategory[] = [
  "integration",
  "technical",
];

export const AI_DISCOUNT_RATE = 0.25;

export interface RiskItem {
  id: string;
  label: string;
  category: RiskCategory;
  enabled: boolean;
  probability: number;
  impactLevel: ImpactLevel;
  customImpactHours: number | null;
  isBuiltIn: boolean;
  isCustom: boolean;
}

export interface Risk {
  id: string;
  label: string;
  category: RiskCategory;
  enabled: boolean;
  probability: number;
  impactLevel: ImpactLevel;
  customImpactHours: number | null;
  isBuiltIn: boolean;
  isCustom: boolean;
  expectedHours: number;
  aiDiscounted: boolean;
}

export interface RiskCategoryMeta {
  id: RiskCategory;
  label: string;
  description: string;
  builtInItems: Omit<RiskItem, "id">[];
}
