import { pgTable, text, timestamp, boolean, uuid, pgEnum } from "drizzle-orm/pg-core";
import { Role } from "@innovate/types";

// Enums
export const roleEnum = pgEnum("role", [Role.STUDENT, Role.JUDGE, Role.ADMIN]);

// Users Table
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").default(Role.STUDENT).notNull(),
    githubUrl: text("github_url"),
    tshirtSize: text("tshirt_size"),
    isVerified: boolean("is_verified").default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
