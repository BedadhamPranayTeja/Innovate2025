import { env } from "@innovate/config";
import { buildApp } from "./app";

async function main() {
    const app = buildApp();

    try {
        await app.listen({ port: env.PORT, host: "0.0.0.0" });
        console.log(`Server listening on http://localhost:${env.PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}

main();
