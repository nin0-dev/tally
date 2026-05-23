import type { FastifyRequest } from "fastify";
import { db } from "./db.js";
import { verify } from "argon2";

export async function getUserIDForRequest(req: FastifyRequest) {
	if (!req.headers.authorization) return;
	const match = req.headers.authorization.match(
		/^([0-9a-f]{12})-([0-9a-f]{24})$/
	);
	if (!match || !match[1] || !match[2]) return;
	const [, userID, key] = match;

	try {
		const { pass } = await db
			.selectFrom("users")
			.select("pass")
			.where("id", "=", userID)
			.executeTakeFirstOrThrow();

		return (await verify(pass, key)) ? userID : undefined;
	} catch {
		return;
	}
}
