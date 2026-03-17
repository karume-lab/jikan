export type Seniority = "junior" | "mid" | "senior" | "lead";

export type Role = "frontend" | "backend" | "mobile" | "devops" | "fullstack";

export interface TeamMember {
  id: string;
  name: string;
  role: Role;
  seniority: Seniority;
  hoursPerDay: number;
  aiEnabled: boolean;
  isLead: boolean;
}

export interface TeamPreset {
  id: string;
  name: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMetrics {
  effectiveTeamSize: number;
  totalCapacityPerDay: number;
  communicationChannels: number;
  brooksLawOverhead: number;
  juniorCount: number;
  rampUpCost: number;
  mentorshipLoad: number;
  roleOverlaps: RoleOverlap[];
}

export interface RoleOverlap {
  role: Role;
  memberNames: string[];
}

export const SENIORITY_EFFICIENCY: Record<
  Seniority,
  { base: number; withAI: number }
> = {
  junior: { base: 0.5, withAI: 0.7 },
  mid: { base: 0.85, withAI: 0.95 },
  senior: { base: 1.1, withAI: 1.2 },
  lead: { base: 1.0, withAI: 1.15 },
};

export const RAMP_UP_HOURS: Record<"withAI" | "withoutAI", number> = {
  withAI: 8,
  withoutAI: 12,
};

export const MENTORSHIP_LOAD_PER_JUNIOR = 0.225;
