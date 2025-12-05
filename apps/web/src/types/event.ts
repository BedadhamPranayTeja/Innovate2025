import { Phase } from "./enums";

export interface Event {
  id: string;
  name: string;
  description: string;
  phase: Phase;
  startTime: Date;
  endTime: Date;
  registrationDeadline: Date;
  submissionDeadline: Date;
  defaultPriceCents: number;
  dynamicPricingConfig: DynamicPricingConfig;
}

export interface DynamicPricingConfig {
  enabled: boolean;
  tiers: PriceTier[];
}

export interface PriceTier {
  name: string;
  deadline: Date;
  priceCents: number;
}

export interface PhaseConfig {
  currentPhase: Phase;
  nextPhaseAt?: Date;
  countdownEnabled: boolean;
}
