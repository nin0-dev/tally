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

	server.delete("/deck/:id", async (req, res) => {
		const { id }: { id: string } = req.params as any;
		if (!id || !/^[0-9a-f]{12}$/.test(id))
			return void res.status(400).send();
		const u = await getUserIDForRequest(req);
		if (!u) return void res.status(401).send();

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
