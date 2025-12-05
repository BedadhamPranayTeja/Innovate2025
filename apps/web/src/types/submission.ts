import { SubmissionStatus } from "./enums";
import { Team } from "./team";

export interface Submission {
  id: string;
  teamId: string;
  team: Team;
  title: string;
  description: string;
  problemStatement: string;
  solution: string;
  techStack: string[];
  repoUrl: string;
  demoUrl?: string;
  videoUrl?: string;
  attachments: Attachment[];
  status: SubmissionStatus;
  createdAt: Date;
  submittedAt?: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: "image" | "document" | "video";
  size: number;
}
