import type { EstimationModel } from "@/types/estimate";

export type ConfidenceLevel = "green" | "amber" | "red";

export interface ModelResult {
  model: EstimationModel;
  totalHours: number;
  personMonths: number;
  calendarWeeksLow: number;
  calendarWeeksHigh: number;
  confidence: ConfidenceLevel;
  confidenceReason: string | null;
  warnings: string[];
  formulaSteps: FormulaStep[];
}

export interface FormulaStep {
  id: string;
  label: string;
  value: number;
  unit: string;
  operation: "base" | "add" | "subtract" | "multiply" | "result";
  tooltip: string;
  isInternal: boolean;
}

export interface ComparisonResult {
  models: ModelResult[];
  divergenceExplanations: DivergenceExplanation[];
}

export interface DivergenceExplanation {
  modelA: EstimationModel;
  modelB: EstimationModel;
  differenceWeeks: number;
  explanation: string;
}

export interface ModelMeta {
  id: EstimationModel;
  label: string;
  shortDescription: string;
  bestFor: string;
  notSuitedFor: string;
  requiresVelocity: boolean;
  requiresUseCases: boolean;
  requiresFunctionPoints: boolean;
  isQuickMode: boolean;
}

export const MODEL_META: Record<EstimationModel, ModelMeta> = {
  pert_flat: {
    id: "pert_flat",
    label: "PERT + Flat",
    shortDescription: "Simple additive estimate with uncertainty bounds",
    bestFor: "Small projects, solo work, well-known features",
    notSuitedFor: "Large projects with significant interdependencies",
    requiresVelocity: false,
    requiresUseCases: false,
    requiresFunctionPoints: false,
    isQuickMode: false,
  },
  pert_cocomo: {
    id: "pert_cocomo",
    label: "PERT + COCOMO II",
    shortDescription: "Exponential scaling based on project complexity factors",
    bestFor: "Medium to large projects, team work, well-defined scope",
    notSuitedFor: "Quick estimates or very small projects",
    requiresVelocity: false,
    requiresUseCases: false,
    requiresFunctionPoints: false,
    isQuickMode: false,
  },
  fpa: {
    id: "fpa",
    label: "Function Point Analysis",
    shortDescription: "Size based on functional units, technology-agnostic",
    bestFor:
      "Enterprise systems, legacy modernisation, cross-project comparison",
    notSuitedFor: "Quick estimates, poorly-defined requirements",
    requiresVelocity: false,
    requiresUseCases: false,
    requiresFunctionPoints: true,
    isQuickMode: false,
  },
  ucp: {
    id: "ucp",
    label: "Use Case Points",
    shortDescription:
      "Size based on use cases and actors with complexity factors",
    bestFor: "Well-specified systems with defined user roles and use cases",
    notSuitedFor: "Projects without defined use cases or user stories",
    requiresVelocity: false,
    requiresUseCases: true,
    requiresFunctionPoints: false,
    isQuickMode: false,
  },
  story_points: {
    id: "story_points",
    label: "Story Points",
    shortDescription: "Relative sizing converted to time via team velocity",
    bestFor: "Agile teams with established sprint velocity",
    notSuitedFor: "New teams or projects without historical velocity data",
    requiresVelocity: true,
    requiresUseCases: false,
    requiresFunctionPoints: false,
    isQuickMode: false,
  },
  tshirt: {
    id: "tshirt",
    label: "T-Shirt Sizing",
    shortDescription: "Rough directional estimate using XS to XL sizing",
    bestFor: "Early discovery, client conversations, roadmap planning",
    notSuitedFor: "Binding commitments or detailed project planning",
    requiresVelocity: false,
    requiresUseCases: false,
    requiresFunctionPoints: false,
    isQuickMode: true,
  },
};
