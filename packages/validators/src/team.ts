import { z } from "zod";
import { TeamPrivacy } from "@innovate/types";

export const createTeamSchema = z.object({
    name: z.string().min(3, "Team name must be at least 3 characters").max(50),
    description: z.string().min(10, "Description must be at least 10 characters").max(500),
    privacy: z.nativeEnum(TeamPrivacy),
    maxMembers: z.coerce.number().min(2).max(10),
});

export const joinTeamSchema = z.object({
    inviteCode: z.string().length(6, "Invite code must be 6 characters").toUpperCase(),
    message: z.string().max(200).optional(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type JoinTeamInput = z.infer<typeof joinTeamSchema>;
