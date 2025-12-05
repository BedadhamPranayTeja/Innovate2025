import { create } from "zustand";
import { persist } from "zustand/middleware";
import { JudgeAssignment, Score, LeaderboardEntry, Submission, SubmissionStatus, TeamPrivacy } from "@/types";

interface JudgeStore {
  assignments: JudgeAssignment[];
  scores: Score[];
  leaderboard: LeaderboardEntry[];
  currentAssignment: JudgeAssignment | null;
  
  fetchAssignments: (judgeId: string) => Promise<void>;
  selectAssignment: (id: string) => void;
  submitScore: (data: Omit<Score, "id" | "createdAt">) => Promise<void>;
  skipAssignment: (id: string) => Promise<void>;
  getLeaderboard: () => LeaderboardEntry[];
  calculateLeaderboard: () => void;
}

// Seed data
const seedLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    teamId: "team-1",
    teamName: "Code Crusaders",
    avgScore: 92.5,
    judgeCount: 4,
    submission: {
      id: "sub-1",
      teamId: "team-1",
      team: { id: "team-1", name: "Code Crusaders", description: "", inviteCode: "", privacy: TeamPrivacy.PUBLIC, leaderId: "", maxMembers: 4, tags: [], createdAt: new Date() },
      title: "EduAI - Personalized Learning",
      description: "AI-powered education",
      problemStatement: "",
      solution: "",
      techStack: ["React", "Python"],
      repoUrl: "",
      attachments: [],
      status: SubmissionStatus.SCORED,
      createdAt: new Date(),
    },
  },
  {
    rank: 2,
    teamId: "team-2",
    teamName: "Blockchain Builders",
    avgScore: 88.3,
    judgeCount: 4,
    submission: {
      id: "sub-2",
      teamId: "team-2",
      team: { id: "team-2", name: "Blockchain Builders", description: "", inviteCode: "", privacy: TeamPrivacy.PUBLIC, leaderId: "", maxMembers: 4, tags: [], createdAt: new Date() },
      title: "DefiLend Protocol",
      description: "Decentralized lending",
      problemStatement: "",
      solution: "",
      techStack: ["Solidity", "React"],
      repoUrl: "",
      attachments: [],
      status: SubmissionStatus.SCORED,
      createdAt: new Date(),
    },
  },
  {
    rank: 3,
    teamId: "team-3",
    teamName: "Green Tech",
    avgScore: 85.0,
    judgeCount: 3,
    submission: {
      id: "sub-3",
      teamId: "team-3",
      team: { id: "team-3", name: "Green Tech", description: "", inviteCode: "", privacy: TeamPrivacy.PUBLIC, leaderId: "", maxMembers: 4, tags: [], createdAt: new Date() },
      title: "EcoTrack",
      description: "Carbon footprint tracker",
      problemStatement: "",
      solution: "",
      techStack: ["React", "Node.js"],
      repoUrl: "",
      attachments: [],
      status: SubmissionStatus.SCORED,
      createdAt: new Date(),
    },
  },
];

export const useJudgeStore = create<JudgeStore>()(
  persist(
    (set, get) => ({
      assignments: [],
      scores: [],
      leaderboard: seedLeaderboard,
      currentAssignment: null,

      fetchAssignments: async (judgeId) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        // Generate mock assignments
        const mockAssignments: JudgeAssignment[] = [
          {
            id: "assign-1",
            judgeId,
            submissionId: "sub-1",
            submission: seedLeaderboard[0].submission,
            status: "pending",
            dueAt: new Date(Date.now() + 86400000),
          },
          {
            id: "assign-2",
            judgeId,
            submissionId: "sub-2",
            submission: seedLeaderboard[1].submission,
            status: "pending",
            dueAt: new Date(Date.now() + 86400000),
          },
        ];
        set({ assignments: mockAssignments });
      },

      selectAssignment: (id) => {
        const assignment = get().assignments.find((a) => a.id === id);
        set({ currentAssignment: assignment || null });
      },

      submitScore: async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const newScore: Score = {
          ...data,
          id: crypto.randomUUID(),
          createdAt: new Date(),
        };
        
        set((state) => ({
          scores: [...state.scores, newScore],
          assignments: state.assignments.map((a) =>
            a.submissionId === data.submissionId ? { ...a, status: "completed" as const } : a
          ),
          currentAssignment: null,
        }));
        
        get().calculateLeaderboard();
      },

      skipAssignment: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        set((state) => ({
          assignments: state.assignments.filter((a) => a.id !== id),
          currentAssignment: null,
        }));
      },

      getLeaderboard: () => get().leaderboard,

      calculateLeaderboard: () => {
        // In a real app, this would aggregate scores
        // For demo, we use seed data
      },
    }),
    {
      name: "judge-storage",
    }
  )
);
