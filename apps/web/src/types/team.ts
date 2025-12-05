import { MemberStatus, TeamPrivacy } from "./enums";
import { User } from "./user";

export interface Team {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  privacy: TeamPrivacy;
  leaderId: string;
  maxMembers: number;
  tags: string[];
  createdAt: Date;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  user: User;
  status: MemberStatus;
  role: "leader" | "member";
  joinedAt: Date;
}

export interface JoinRequest {
  id: string;
  teamId: string;
  userId: string;
  user: User;
  message?: string;
  status: MemberStatus;
  createdAt: Date;
}
