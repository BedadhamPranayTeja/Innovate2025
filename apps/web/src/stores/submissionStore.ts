import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Submission, SubmissionStatus, Team, TeamPrivacy } from "@/types";

interface SubmissionStore {
  currentDraft: Partial<Submission> | null;
  submissions: Submission[];
  
  saveDraft: (data: Partial<Submission>) => void;
  clearDraft: () => void;
  createSubmission: (teamId: string, data: Partial<Submission>) => Promise<Submission>;
  updateSubmission: (id: string, data: Partial<Submission>) => Promise<void>;
  submitFinal: (id: string) => Promise<Submission>;
  getSubmissionsByTeam: (teamId: string) => Submission[];
}

// Seed submissions for demo
const seedSubmissions: Submission[] = [
  {
    id: "sub-1",
    teamId: "team-1",
    team: {
      id: "team-1",
      name: "Code Crusaders",
      description: "Building the future of AI-powered education",
      inviteCode: "CRSD01",
      privacy: TeamPrivacy.PUBLIC,
      leaderId: "user-1",
      maxMembers: 4,
      tags: ["AI", "EdTech"],
      createdAt: new Date(),
    },
    title: "EduAI - Personalized Learning Assistant",
    description: "An AI-powered learning assistant that adapts to each student's learning style",
    problemStatement: "Traditional education fails to cater to individual learning paces and styles",
    solution: "EduAI uses machine learning to create personalized learning paths",
    techStack: ["React", "Python", "TensorFlow", "PostgreSQL"],
    repoUrl: "https://github.com/codecrusaders/eduai",
    demoUrl: "https://eduai.demo.com",
    attachments: [],
    status: SubmissionStatus.SUBMITTED,
    createdAt: new Date(),
    submittedAt: new Date(),
  },
  {
    id: "sub-2",
    teamId: "team-2",
    team: {
      id: "team-2",
      name: "Blockchain Builders",
      description: "Decentralizing everything",
      inviteCode: "BLCK02",
      privacy: TeamPrivacy.PUBLIC,
      leaderId: "user-2",
      maxMembers: 4,
      tags: ["Web3", "DeFi"],
      createdAt: new Date(),
    },
    title: "DefiLend - Decentralized Lending Protocol",
    description: "A peer-to-peer lending platform built on blockchain",
    problemStatement: "Traditional lending is slow, expensive, and excludes many",
    solution: "DefiLend enables instant, trustless lending using smart contracts",
    techStack: ["Solidity", "React", "Hardhat", "The Graph"],
    repoUrl: "https://github.com/blockbuilders/defilend",
    attachments: [],
    status: SubmissionStatus.SCORED,
    createdAt: new Date(),
    submittedAt: new Date(),
  },
];

export const useSubmissionStore = create<SubmissionStore>()(
  persist(
    (set, get) => ({
      currentDraft: null,
      submissions: seedSubmissions,

      saveDraft: (data) => {
        set({ currentDraft: data });
      },

      clearDraft: () => {
        set({ currentDraft: null });
      },

      createSubmission: async (teamId, data) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        const newSubmission: Submission = {
          id: crypto.randomUUID(),
          teamId,
          team: data.team!,
          title: data.title || "",
          description: data.description || "",
          problemStatement: data.problemStatement || "",
          solution: data.solution || "",
          techStack: data.techStack || [],
          repoUrl: data.repoUrl || "",
          demoUrl: data.demoUrl,
          videoUrl: data.videoUrl,
          attachments: data.attachments || [],
          status: SubmissionStatus.DRAFT,
          createdAt: new Date(),
        };
        
        set((state) => ({
          submissions: [...state.submissions, newSubmission],
        }));
        
        return newSubmission;
      },

      updateSubmission: async (id, data) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === id ? { ...s, ...data } : s
          ),
        }));
      },

      submitFinal: async (id) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const submission = get().submissions.find((s) => s.id === id);
        if (!submission) throw new Error("Submission not found");
        
        const updated = {
          ...submission,
          status: SubmissionStatus.SUBMITTED,
          submittedAt: new Date(),
        };
        
        set((state) => ({
          submissions: state.submissions.map((s) =>
            s.id === id ? updated : s
          ),
          currentDraft: null,
        }));
        
        return updated;
      },

      getSubmissionsByTeam: (teamId) => {
        return get().submissions.filter((s) => s.teamId === teamId);
      },
    }),
    {
      name: "submission-storage",
    }
  )
);
