import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function healthRoutes(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get(
        "/health",
        {
            schema: {
                response: {
                    200: z.object({
                        status: z.string(),
                        timestamp: z.string(),
                    }),
                },
            },
        },
        async () => {
            return {
                status: "ok",
                timestamp: new Date().toISOString(),
            };
        }
    );
}
