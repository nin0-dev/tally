import { server } from "../index.js";
import { getUserIDForRequest } from "../utils/auth.js";
import { db } from "../utils/db.js";
import { TBCDeck } from "../utils/types.js";
import { generateID } from "../utils/utils.js";

export function setupDeckRoutes() {
	server.put("/deck", async (req, res) => {
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
}
