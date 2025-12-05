import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();


const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(3002),
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(1),
    // Add other shared env vars here
});

export const env = envSchema.parse(process.env);
