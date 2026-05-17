import Fastify from "fastify";
import { Yapper } from "./utils/Yapper.js";
import { setupAccountRoutes } from "./routes/accounts.js";
import { setupDeckRoutes } from "./routes/decks.js";

export const server = Fastify({
	loggerInstance: new Yapper()
});

setupAccountRoutes();
setupDeckRoutes();

server.listen({
	port: parseInt(process.env.PORT ?? "6969")
});
