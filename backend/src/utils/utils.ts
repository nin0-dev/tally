import { randomBytes } from "crypto";
import type { FastifyRequest } from "fastify";

export function validateDeckID(req: FastifyRequest) {
	const { id }: { id: string } = req.params as any;
	if (!id || !/^[0-9a-f]{12}$/.test(id)) {
		throw new Error("Invalid deck");
	}
	return id;
}

export function generateID(length: 12 | 16) {
	return randomBytes(length / 2).toString("hex");
}
