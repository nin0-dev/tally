import Fastify from "fastify";
import { Logger } from "./utils/Logger.js";
import { setupAccountRoutes } from "./routes/accounts.js";
import { setupDeckRoutes } from "./routes/decks.js";
import { setupPlayRoutes } from "./routes/plays.js";
import cors from "@fastify/cors";
import { runMigrations } from "./utils/db.js";

export const loggerInstance = new Logger();

export const server = Fastify({
	loggerInstance
});

server.addHook("onSend", async (req, res, payload) => {
	if (res.statusCode === 401) {
		await new Promise(resolve =>
			setTimeout(
				resolve,
				Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000
			)
		);
	}

	return payload;
});

server.register(cors, {
	origin: [(process.env.ALLOWED_CLIENT_ORIGINS ?? "").trim().split(",")],
	methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
	credentials: true
});

runMigrations();

setupAccountRoutes();
setupDeckRoutes();
setupPlayRoutes();

server.listen({
	host: process.env.HOST || "127.0.0.1",
	port: parseInt(process.env.PORT ?? "9635")
});
