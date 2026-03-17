export type StoryPointValue = 1 | 2 | 3 | 5 | 8 | 13 | 21 | "?";

export const FIBONACCI_SCALE: StoryPointValue[] = [1, 2, 3, 5, 8, 13, 21, "?"];

export type SprintLength = 5 | 10 | 15 | 20;

export interface SprintConfig {
  pointsPerSprint: number | null;
  sprintLengthDays: SprintLength;
  referenceFeatureId: string | null;
  referenceFeaturePoints: StoryPointValue | null;
}

export interface PokerVote {
  memberId: string;
  memberName: string;
  points: StoryPointValue | null;
  revealed: boolean;
}

export interface PokerSession {
  featureId: string;
  votes: PokerVote[];
  consensusPoints: StoryPointValue | null;
  hasOutliers: boolean;
  outlierThreshold: number;
  revealed: boolean;
}

export interface SensitivityPoint {
  velocity: number;
  calendarWeeks: number;
}

export interface SensitivityAnalysis {
  baseVelocity: number;
  points: SensitivityPoint[];
}

export const SPRINT_LENGTH_LABELS: Record<SprintLength, string> = {
  5: "1 week",
  10: "2 weeks",
  15: "3 weeks",
  20: "4 weeks",
};

export const OUTLIER_FIBONACCI_DISTANCE = 2;
