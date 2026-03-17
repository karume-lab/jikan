export type UseCaseComplexity = "simple" | "average" | "complex";
export type ActorType = "simple" | "average" | "complex";

export const USE_CASE_WEIGHTS: Record<UseCaseComplexity, number> = {
  simple: 5,
  average: 10,
  complex: 15,
};

export const ACTOR_WEIGHTS: Record<ActorType, number> = {
  simple: 1,
  average: 2,
  complex: 3,
};

export interface UseCase {
  id: string;
  label: string;
  complexity: UseCaseComplexity;
  transactionCount: number;
  points: number;
  isAutoSuggested: boolean;
}

export interface Actor {
  id: string;
  label: string;
  type: ActorType;
  points: number;
  isAutoSuggested: boolean;
}

export type TCFactorId =
  | "distributed_system"
  | "response_time"
  | "end_user_efficiency"
  | "complex_internal_processing"
  | "reusability"
  | "ease_of_installation"
  | "ease_of_use"
  | "portability"
  | "changeability"
  | "concurrency"
  | "security"
  | "third_party_access"
  | "special_training";

export type ECFactorId =
  | "familiarity_with_process"
  | "application_experience"
  | "oo_experience"
  | "lead_analyst_capability"
  | "motivation"
  | "stable_requirements"
  | "part_time_workers"
  | "difficult_language";

export interface TCFactor {
  id: TCFactorId;
  label: string;
  description: string;
  weight: number;
  value: number;
  autoSuggestedFrom: string | null;
}

export interface ECFactor {
  id: ECFactorId;
  label: string;
  description: string;
  weight: number;
  value: number;
  autoSuggestedFrom: string | null;
}

export interface UCPConfig {
  useCases: UseCase[];
  actors: Actor[];
  tcFactors: Record<TCFactorId, number>;
  ecFactors: Record<ECFactorId, number>;
  hoursPerUCP: number;
  uucp: number;
  tcf: number;
  ecf: number;
  ucp: number;
}

export const DEFAULT_HOURS_PER_UCP = 20;
export const TCF_BASE = 0.6;
export const TCF_MULTIPLIER = 0.01;
export const ECF_BASE = 1.4;
export const ECF_MULTIPLIER = -0.03;

export const TC_FACTOR_WEIGHTS: Record<TCFactorId, number> = {
  distributed_system: 2,
  response_time: 1,
  end_user_efficiency: 1,
  complex_internal_processing: 1,
  reusability: 1,
  ease_of_installation: 0.5,
  ease_of_use: 0.5,
  portability: 2,
  changeability: 1,
  concurrency: 1,
  security: 1,
  third_party_access: 1,
  special_training: 1,
};

export const EC_FACTOR_WEIGHTS: Record<ECFactorId, number> = {
  familiarity_with_process: 1.5,
  application_experience: 0.5,
  oo_experience: 1,
  lead_analyst_capability: 0.5,
  motivation: 1,
  stable_requirements: 2,
  part_time_workers: -1,
  difficult_language: -1,
};
