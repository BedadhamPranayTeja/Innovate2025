import { FastifyInstance } from "fastify";
import fastifyJwt from "@fastify/jwt";
import fp from "fastify-plugin";
import { env } from "@innovate/config";

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: {
            id: string;
            role: string;
            email: string;
        };
    }
}

export default fp(async function authPlugin(app: FastifyInstance) {
    app.register(fastifyJwt, {
        secret: env.JWT_SECRET,
    });

    app.decorate("authenticate", async function (request, reply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
});
