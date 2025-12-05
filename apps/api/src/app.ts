import fastify from "fastify";
import cors from "@fastify/cors";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { healthRoutes } from "./routes/health";
import { authRoutes } from "./routes/auth";
import authPlugin from "./plugins/auth";

export function buildApp() {
    const app = fastify({
        logger: true,
    });

    // Register plugins
    app.register(cors, {
        origin: "*", // For development
    });
    app.register(authPlugin);

    // Setup Zod validation
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    // Register routes
    app.register(healthRoutes);
    app.register(authRoutes);

    return app;
}
