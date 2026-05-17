import type { FastifyRequest } from "fastify";
import { server } from "../index.js";
import { getUserIDForRequest } from "../utils/auth.js";
import { db } from "../utils/db.js";
import { Question, TBCDeck } from "../utils/types.js";
import { generateID } from "../utils/utils.js";
import z from "zod";

function validateDeckID(req: FastifyRequest) {
	const { id }: { id: string } = req.params as any;
	if (!id || !/^[0-9a-f]{12}$/.test(id)) {
		throw new Error("Invalid deck");
	}
	return id;
}

export function setupDeckRoutes() {
	server.post("/deck", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) return void res.status(401).send();

		const data = TBCDeck.parse(req.body);
		const id = generateID(12);

		await db
			.insertInto("decks")
			.values({
				...data,
				id,
				owner: u
			})
			.execute();

		return { id };
	});

	server.put("/deck/:id", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) return void res.status(401).send();
		const { name, owner, questions } = z
			.object({
				name: z.string().optional(),
				owner: z.string().optional(),
				questions: z.array(Question).optional()
			})
			.parse(req.body);
		const id = validateDeckID(req);

		try {
			var deck = await db
				.selectFrom("decks")
				.selectAll()
				.where("id", "=", id)
				.executeTakeFirstOrThrow();
		} catch {
			return void res.status(404).send();
		}
		if (deck.owner !== u) return void res.status(404).send();

		const pendingUpdates: {
			name?: string;
			owner?: string;
			content?: string;
		} = {};
		if (name) pendingUpdates.name = name;
		if (owner) {
			const resp = await db
				.selectFrom("users")
				.select("allow_transfer")
				.where("id", "=", owner)
				.executeTakeFirst();
			if (!resp?.allow_transfer) return void res.code(404).send();
			const { allow_transfer } = resp;
			if (allow_transfer !== 1) return void res.code(403).send();
			await db
				.updateTable("users")
				.set({
					allow_transfer: 0
				})
				.where("id", "=", owner)
				.execute();
			pendingUpdates.owner = owner;
		}
		if (questions) {
			const existingQuestions: z.infer<typeof Question>[] =
				JSON.parse(deck.content ?? "[]") ?? [];
			const allowedIDs = new Set(
				existingQuestions.filter(t => t.id).map(t => t.id)
			);
			const usedIDs = new Set();

			const newQuestions = questions.map(q => {
				const allowOldID =
					q.id && allowedIDs.has(q.id) && !usedIDs.has(q.id);
				q.id = allowOldID ? q.id : generateID(12);
				usedIDs.add(q.id);
				return q;
			});
			pendingUpdates.content = JSON.stringify(newQuestions);
		}

		await db
			.updateTable("decks")
			.set(pendingUpdates)
			.where("id", "=", id)
			.execute();
		return {
			name: pendingUpdates.name ?? deck.name,
			id: deck.id,
			questions: pendingUpdates.content
				? JSON.parse(pendingUpdates.content)
				: JSON.parse(deck.content ?? "[]")
		};
	});

	server.delete("/deck/:id", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) return void res.status(401).send();
		const id = validateDeckID(req);

		try {
			var deck = await db
				.selectFrom("decks")
				.select("owner")
				.where("id", "=", id)
				.executeTakeFirstOrThrow();
		} catch {
			return void res.status(404).send();
		}
		if (deck.owner !== u) return void res.status(404).send();

		await db.deleteFrom("decks").where("id", "=", id).execute();
		res.status(204).send();
	});
}
