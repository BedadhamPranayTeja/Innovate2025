import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Phase, Event } from "@/types";

interface PhaseStore {
  currentPhase: Phase;
  event: Event | null;
  countdown: number;
  
  setPhase: (phase: Phase) => void;
  setEvent: (event: Event) => void;
  startCountdown: () => void;
  
  isRegistrationOpen: () => boolean;
  isSubmissionOpen: () => boolean;
  isJudgingOpen: () => boolean;
}

const defaultEvent: Event = {
  id: "innovate-2025",
  name: "Innovate 2025",
  description: "The Ultimate Hackathon Experience",
  phase: Phase.PRE,
  startTime: new Date("2025-01-15T09:00:00"),
  endTime: new Date("2025-01-17T18:00:00"),
  registrationDeadline: new Date("2025-01-14T23:59:59"),
  submissionDeadline: new Date("2025-01-17T15:00:00"),
  defaultPriceCents: 49900,
  dynamicPricingConfig: {
    enabled: true,
    tiers: [
      { name: "Early Bird", deadline: new Date("2025-01-01"), priceCents: 29900 },
      { name: "Regular", deadline: new Date("2025-01-10"), priceCents: 39900 },
      { name: "Late", deadline: new Date("2025-01-14"), priceCents: 49900 },
    ],
  },
};

export const usePhaseStore = create<PhaseStore>()(
  persist(
    (set, get) => ({
      currentPhase: Phase.PRE,
      event: defaultEvent,
      countdown: 0,

      setPhase: (phase) => {
        set({ currentPhase: phase });
        if (get().event) {
          set({ event: { ...get().event!, phase } });
        }
      },

      setEvent: (event) => {
        set({ event, currentPhase: event.phase });
      },

      startCountdown: () => {
        const { event } = get();
        if (event) {
          const now = new Date().getTime();
          const target = new Date(event.startTime).getTime();
          set({ countdown: Math.max(0, Math.floor((target - now) / 1000)) });
        }
      },

      isRegistrationOpen: () => get().currentPhase === Phase.PRE,
      isSubmissionOpen: () => get().currentPhase === Phase.LIVE,
      isJudgingOpen: () => get().currentPhase === Phase.LIVE || get().currentPhase === Phase.POST,
    }),
    {
      name: "phase-storage",
    }
  )
);
