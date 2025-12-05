import { Submission } from "./submission";

export interface ScoringRubric {
  id: string;
  name: string;
  criteria: ScoringCriterion[];
  maxTotal: number;
}

export interface ScoringCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight: number;
}

export interface Score {
  id: string;
  submissionId: string;
  judgeId: string;
  scores: CriterionScore[];
  totalScore: number;
  comments: string;
  createdAt: Date;
}

export interface CriterionScore {
  criterionId: string;
  score: number;
  feedback?: string;
}

export interface JudgeAssignment {
  id: string;
  judgeId: string;
  submissionId: string;
  submission: Submission;
  status: "pending" | "completed";
  dueAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  teamId: string;
  teamName: string;
  avgScore: number;
  judgeCount: number;
  submission: Submission;
}
