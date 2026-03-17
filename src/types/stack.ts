export type FamiliarityLevel = "known" | "learning";

export type TechCategory =
  | "frontend"
  | "backend"
  | "database"
  | "auth"
  | "infrastructure"
  | "other";

export interface Technology {
  id: string;
  label: string;
  category: TechCategory;
  isCustom: boolean;
  familiarity: FamiliarityLevel;
  familiarityPenaltyHours: number;
}

export interface StackPreset {
  id: string;
  name: string;
  isBuiltIn: boolean;
  technologyIds: string[];
  familiarityMap: Record<string, FamiliarityLevel>;
  createdAt: string;
  updatedAt: string;
}

export interface TechCategoryMeta {
  id: TechCategory;
  label: string;
  description: string;
}
