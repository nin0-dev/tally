import type { FastifyRequest } from "fastify";
import { db } from "./db.js";
import { verify } from "argon2";

export async function getUserIDForRequest(req: FastifyRequest) {
	const { account_id, token } = req.cookies;
	if (!account_id || !token) return;

	try {
		const { pass } = await db.selectFrom("users").select("pass").where("id", "=", account_id).executeTakeFirstOrThrow();
		return (await verify(pass, token)) ? account_id : undefined;
	} catch {
		return;
	}
}
