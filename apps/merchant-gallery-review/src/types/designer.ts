import { Template } from "./templates";

export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "ai_review"
  | "manual_review"
  | "approved"
  | "rejected"
  | "published";

export interface DesignerTemplate extends Template {
  submissionId: string;
  status: SubmissionStatus;
  submittedAt: string;
  aiReviewResult?: {
    score: number;
    status: "pass" | "fail" | "needs_fix";
    issues: string[];
  };
  adminFeedback?: string;
  downloads: number;
  revenue: number;
}

export interface Recommendation {
  templateId: string;
  reason: string;
  expectedImpact: string; // e.g., "+15% mobile conversion"
  score: number; // 0-100 relevance score
}
