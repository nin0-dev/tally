import { server } from "../index.js";
import { getUserIDForRequest } from "../utils/auth.js";
import { db } from "../utils/db.js";
import { validateDeckID } from "../utils/utils.js";

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
}
