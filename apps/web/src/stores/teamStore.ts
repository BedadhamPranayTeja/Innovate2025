import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Team, TeamMember, JoinRequest, MemberStatus, TeamPrivacy } from "@/types";

interface TeamStore {
  myTeam: Team | null;
  allTeams: Team[];
  members: TeamMember[];
  joinRequests: JoinRequest[];
  
  createTeam: (data: Omit<Team, "id" | "inviteCode" | "createdAt" | "leaderId">, leaderId?: string) => Promise<Team>;
  joinTeam: (code: string, userId: string, userName: string, message?: string) => Promise<void>;
  leaveTeam: (userId: string) => Promise<void>;
  approveRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  removeMember: (memberId: string) => Promise<void>;
  updateTeam: (data: Partial<Team>) => Promise<void>;
  setMyTeam: (team: Team | null) => void;
  loadTeams: () => void;
}

const generateInviteCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};

// Seed data for demo
const seedTeams: Team[] = [
  {
    id: "team-1",
    name: "Code Crusaders",
    description: "Building the future of AI-powered education",
    inviteCode: "CRSD01",
    privacy: TeamPrivacy.PUBLIC,
    leaderId: "user-1",
    maxMembers: 4,
    tags: ["AI", "EdTech", "Machine Learning"],
    createdAt: new Date(),
  },
  {
    id: "team-2",
    name: "Blockchain Builders",
    description: "Decentralizing everything, one block at a time",
    inviteCode: "BLCK02",
    privacy: TeamPrivacy.PUBLIC,
    leaderId: "user-2",
    maxMembers: 4,
    tags: ["Web3", "DeFi", "Solidity"],
    createdAt: new Date(),
  },
  {
    id: "team-3",
    name: "Green Tech",
    description: "Sustainable solutions for a better tomorrow",
    inviteCode: "GRNT03",
    privacy: TeamPrivacy.PRIVATE,
    leaderId: "user-3",
    maxMembers: 5,
    tags: ["Sustainability", "IoT", "CleanTech"],
    createdAt: new Date(),
  },
];

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      myTeam: null,
      allTeams: seedTeams,
      members: [],
      joinRequests: [],

      createTeam: async (data, leaderId?: string) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        const newTeam: Team = {
          ...data,
          id: crypto.randomUUID(),
          inviteCode: generateInviteCode(),
          createdAt: new Date(),
          leaderId: leaderId || "",
        };
        
        set((state) => ({
          allTeams: [...state.allTeams, newTeam],
          myTeam: newTeam,
        }));
        
        return newTeam;
      },

      joinTeam: async (code, userId, userName, message) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        
        const { allTeams } = get();
        const team = allTeams.find((t) => t.inviteCode === code);
        
        if (!team) {
          throw new Error("Team not found");
        }
        
        const request: JoinRequest = {
          id: crypto.randomUUID(),
          teamId: team.id,
          userId,
          user: { id: userId, name: userName, email: "", role: "student" as any, createdAt: new Date() },
          message,
          status: MemberStatus.PENDING,
          createdAt: new Date(),
        };
        
        set((state) => ({
          joinRequests: [...state.joinRequests, request],
        }));
      },

      leaveTeam: async (userId) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        set((state) => ({
          myTeam: null,
          members: state.members.filter((m) => m.userId !== userId),
        }));
      },

      approveRequest: async (requestId) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        set((state) => ({
          joinRequests: state.joinRequests.map((r) =>
            r.id === requestId ? { ...r, status: MemberStatus.APPROVED } : r
          ),
        }));
      },

      rejectRequest: async (requestId) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        set((state) => ({
          joinRequests: state.joinRequests.map((r) =>
            r.id === requestId ? { ...r, status: MemberStatus.REJECTED } : r
          ),
        }));
      },

      removeMember: async (memberId) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        set((state) => ({
          members: state.members.filter((m) => m.id !== memberId),
        }));
      },

      updateTeam: async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        set((state) => ({
          myTeam: state.myTeam ? { ...state.myTeam, ...data } : null,
        }));
      },

      setMyTeam: (team) => set({ myTeam: team }),
      
      loadTeams: () => {
        // Teams are already seeded
      },
    }),
    {
      name: "team-storage",
    }
  )
);
