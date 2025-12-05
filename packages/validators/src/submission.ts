import { z } from "zod";

export const submissionStep1Schema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters").max(100),
    description: z.string().min(20, "Description must be at least 20 characters").max(500),
});

export const submissionStep2Schema = z.object({
    problemStatement: z.string().min(50, "Problem statement must be at least 50 characters").max(1000),
    solution: z.string().min(50, "Solution must be at least 50 characters").max(1000),
});

export const submissionStep3Schema = z.object({
    repoUrl: z.string().url("Must be a valid URL"),
    demoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    videoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export type SubmissionStep1Input = z.infer<typeof submissionStep1Schema>;
export type SubmissionStep2Input = z.infer<typeof submissionStep2Schema>;
export type SubmissionStep3Input = z.infer<typeof submissionStep3Schema>;
