import Fastify from "fastify";
import { Yapper } from "./utils/Yapper.js";
import { setupAccountRoutes } from "./routes/accounts.js";
import { setupDeckRoutes } from "./routes/decks.js";
import { setupPlayRoutes } from "./routes/plays.js";
import cors from "@fastify/cors";

export const server = Fastify({
	loggerInstance: new Yapper()
});

server.register(cors, {
	origin: [(process.env.ALLOWED_CLIENT_ORIGINS ?? "").trim().split(",")],
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
	credentials: true
});

setupAccountRoutes();
setupDeckRoutes();
setupPlayRoutes();

server.listen({
	port: parseInt(process.env.PORT ?? "6969")
});
