import z from "zod";
import { server } from "../index.js";
import { getUserIDForRequest } from "../utils/auth.js";
import { db } from "../utils/db.js";
import { validateDeckID } from "../utils/utils.js";
import { stat } from "fs/promises";

export function setupPlayRoutes() {
	server.get("/plays/:id", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) return void res.code(401).send();
		const id = validateDeckID(req);

		try {
			const { questions, last_played } = await db
				.selectFrom("plays")
				.select(["questions", "last_played"])
				.where("deck", "=", id)
				.where("user", "=", u)
				.executeTakeFirstOrThrow();

			return {
				last_played,
				questions: JSON.parse(questions ?? "{}")
			};
		} catch {
			return { questions: {}, last_played: null };
		}
	});

	server.post("/plays/:id", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) return void res.code(401).send();
		const id = validateDeckID(req);

		const body = z
			.record(z.string(), z.enum(["S", "F", "U"]))
			.parse(req.body);

		const existingHistoryEntry = await db
			.selectFrom("plays")
			.select(["questions"])
			.where("user", "=", u)
			.where("deck", "=", id)
			.executeTakeFirst();

		if (existingHistoryEntry) {
			const qs = z
				.record(z.string(), z.string())
				.parse(JSON.parse(existingHistoryEntry.questions!));
			for (const [questionID, status] of Object.entries(body)) {
				if (qs[questionID]) {
					qs[questionID] += status;
					if (qs[questionID].length > 7) {
						qs[questionID] = qs[questionID].slice(1);
					}
				} else {
					qs[questionID] = status;
				}
			}
			await db
				.updateTable("plays")
				.set({
					questions: JSON.stringify(qs),
					last_played: new Date().toISOString()
				})
				.where("user", "=", u)
				.where("deck", "=", id)
				.execute();
		} else {
			await db
				.insertInto("plays")
				.values({
					deck: id,
					user: u,
					questions: JSON.stringify(body),
					last_played: new Date().toISOString()
				})
				.execute();
		}

		res.code(204).send();
	});
}
