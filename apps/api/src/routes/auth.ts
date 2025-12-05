import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { loginSchema, registerSchema } from "@innovate/validators";
import { db, users } from "@innovate/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

export async function authRoutes(app: FastifyInstance) {
    const server = app.withTypeProvider<ZodTypeProvider>();

    // LOGIN
    server.post(
        "/auth/login",
        {
            schema: {
                body: loginSchema,
                response: {
                    200: z.object({
                        token: z.string(),
                        user: z.object({
                            id: z.string(),
                            email: z.string(),
                            role: z.string(),
                            name: z.string(),
                        }),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { email, password } = request.body;

            // Find user
            const user = await db.query.users.findFirst({
                where: eq(users.email, email),
            });

            if (!user) {
                return reply.status(401).send({ message: "Invalid credentials" } as any);
            }

            // Check password
            const valid = await bcrypt.compare(password, user.passwordHash);
            if (!valid) {
                return reply.status(401).send({ message: "Invalid credentials" } as any);
            }

            // Generate Token
            const token = app.jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role,
            });

            return {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                },
            };
        }
    );

    // REGISTER
    server.post(
        "/auth/register",
        {
            schema: {
                body: registerSchema,
                response: {
                    201: z.object({
                        message: z.string(),
                    }),
                },
            },
        },
        async (request, reply) => {
            const { email, password, name } = request.body;

            // Check existing
            const existing = await db.query.users.findFirst({
                where: eq(users.email, email),
            });

            if (existing) {
                return reply.status(409).send({ message: "User already exists" } as any);
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create User
            await db.insert(users).values({
                email,
                name,
                passwordHash,
                role: "student", // Default role
            });

            return reply.code(201).send({ message: "User created successfully" });
        }
    );
}
