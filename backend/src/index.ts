import Fastify from "fastify";
import { Yapper } from "./utils/Yapper.js";
import { setupAccountRoutes } from "./routes/accounts.js";

export const server = Fastify({
	loggerInstance: new Yapper()
});

setupAccountRoutes();

server.listen({
	port: parseInt(process.env.PORT ?? "6969")
});
