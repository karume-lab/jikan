import type { CocomoConfig } from "@/types/cocomo";
import type { FPAConfig } from "@/types/fpa";
import type { Risk } from "@/types/risk";
import type { StackPreset, Technology } from "@/types/stack";
import type { SprintConfig, StoryPointValue } from "@/types/storypoints";
import type { TeamMember } from "@/types/team";
import type { UCPConfig } from "@/types/ucp";

export type ProjectType = "web" | "mobile" | "full";

export type ScopeSize = "small" | "medium" | "large";

export type ScalingModel = "flat" | "cocomo";

export type EstimationModel =
  | "pert_flat"
  | "pert_cocomo"
  | "fpa"
  | "ucp"
  | "story_points"
  | "tshirt";

export type TShirtSize = "xs" | "s" | "m" | "l" | "xl";

export const TSHIRT_HOURS: Record<TShirtSize, number> = {
  xs: 2,
  s: 8,
  m: 20,
  l: 45,
  xl: 80,
};

export interface PERTInput {
  optimistic: number;
  realistic: number;
  pessimistic: number;
}

export interface Feature {
  id: string;
  label: string;
  enabled: boolean;
  isCustom: boolean;
  pert: PERTInput;
  tshirtSize: TShirtSize;
  storyPoints: StoryPointValue | null;
  fpaComplexity: "simple" | "average" | "complex" | null;
  ucpComplexity: "simple" | "average" | "complex" | null;
  pertResult?: number;
}

export interface ModelConfig {
  selectedModel: EstimationModel;
  cocomoConfig: CocomoConfig;
  fpaConfig: FPAConfig;
  ucpConfig: UCPConfig;
  sprintConfig: SprintConfig;
  planningPokerEnabled: boolean;
}

export interface ComparisonSelection {
  primaryModel: EstimationModel;
  referenceModels: EstimationModel[];
}

export interface Estimate {
  id: string;
  name: string;
  projectType: ProjectType;
  scopeSize: ScopeSize;
  features: Feature[];
  selectedTechnologies: Technology[];
  activePreset: StackPreset | null;
  team: TeamMember[];
  risks: Risk[];
  modelConfig: ModelConfig;
  comparisonSelection: ComparisonSelection;
  createdAt: string;
  updatedAt: string;
}

export interface EstimateSummary {
  id: string;
  name: string;
  projectType: ProjectType;
  scopeSize: ScopeSize;
  primaryModel: EstimationModel;
  totalHours: number;
  personMonths: number;
  calendarWeeksLow: number;
  calendarWeeksHigh: number;
  createdAt: string;
  updatedAt: string;
}
