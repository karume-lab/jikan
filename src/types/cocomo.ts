export type ScaleFactorRating =
  | "very_low"
  | "low"
  | "nominal"
  | "high"
  | "very_high"
  | "extra_high";

export type ScaleFactorId =
  | "precedentedness"
  | "development_flexibility"
  | "architecture_risk_resolution"
  | "team_cohesion"
  | "process_maturity";

export interface ScaleFactorRatingMeta {
  rating: ScaleFactorRating;
  label: string;
  weight: number;
}

export interface ScaleFactor {
  id: ScaleFactorId;
  label: string;
  description: string;
  jikanExample: string;
  ratings: ScaleFactorRatingMeta[];
}

export interface CocomoConfig {
  scaleFactors: Record<ScaleFactorId, ScaleFactorRating>;
  calculatedExponent: number;
}

export const SCALE_FACTOR_WEIGHTS: Record<
  ScaleFactorId,
  Record<ScaleFactorRating, number>
> = {
  precedentedness: {
    very_low: 0.073,
    low: 0.054,
    nominal: 0.037,
    high: 0.02,
    very_high: 0.009,
    extra_high: 0.0,
  },
  development_flexibility: {
    very_low: 0.054,
    low: 0.041,
    nominal: 0.029,
    high: 0.018,
    very_high: 0.007,
    extra_high: 0.0,
  },
  architecture_risk_resolution: {
    very_low: 0.1,
    low: 0.073,
    nominal: 0.046,
    high: 0.027,
    very_high: 0.014,
    extra_high: 0.0,
  },
  team_cohesion: {
    very_low: 0.078,
    low: 0.054,
    nominal: 0.029,
    high: 0.015,
    very_high: 0.0,
    extra_high: 0.0,
  },
  process_maturity: {
    very_low: 0.078,
    low: 0.054,
    nominal: 0.029,
    high: 0.015,
    very_high: 0.0,
    extra_high: 0.0,
  },
};

export const COCOMO_BASE_CONSTANT = 2.94;
export const COCOMO_EXPONENT_BASE = 1.01;
