import Fastify from "fastify";
import { Logger } from "./utils/Logger.js";
import { setupAccountRoutes } from "./routes/accounts.js";
import { setupDeckRoutes } from "./routes/decks.js";
import { setupPlayRoutes } from "./routes/plays.js";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import { runMigrations } from "./utils/db.js";
import { NotFoundError, UnauthorizedError, ValidationError } from "./utils/errors.js";
import { ZodError } from "zod";
import fastifyRateLimit from "@fastify/rate-limit";

export const loggerInstance = new Logger();

let allowedIPs = process.env.TRUSTED_PROXIES?.split(",").map(a => a.trim()) ?? [];
if (allowedIPs.includes("cf")) {
	const req = await fetch("https://api.cloudflare.com/client/v4/ips");
	if (req.ok) {
		const res = await req.json();
		if (res.success) {
			allowedIPs.push(...res.result.ipv4_cidrs, ...res.result.ipv6_cidrs);
		}
	}
	allowedIPs = allowedIPs.filter(c => c !== "cf");
}

export const server = Fastify({
	loggerInstance,
	trustProxy: allowedIPs
});

server.register(fastifyRateLimit, {
	max: 100,
	timeWindow: "1 minute"
});

server.register(cookie);

server.setErrorHandler(async (err, _, res) => {
	if (err instanceof UnauthorizedError) {
		await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (1500 - 500 + 1)) + 500));
		return res.status(401).send();
	} else if (err instanceof ValidationError || err instanceof ZodError) {
		return res.status(400).send();
	} else if (err instanceof NotFoundError) {
		return res.status(404).send();
	} else {
		loggerInstance.error(err);
		return res.status(500).send();
	}
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
