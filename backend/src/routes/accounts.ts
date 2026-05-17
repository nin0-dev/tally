import { hash } from "argon2";
import { server } from "../index.js";
import { getUserIDForRequest } from "../utils/auth.js";
import { db } from "../utils/db.js";
import { AuthedUser, TBCUser } from "../utils/types.js";
import { generateID } from "../utils/utils.js";

export function setupAccountRoutes() {
	server.post("/accounts", async req => {
		const [accountID, key] = [generateID(12), generateID(16)];
		const { name } = TBCUser.parse(req.body);

		await db
			.insertInto("users")
			.values({
				id: accountID,
				name: name,
				pass: await hash(key)
			})
			.execute();

		return { accountID, key };
	});

	server.delete("/accounts", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) return void res.status(401).send();

		await db.deleteFrom("users").where("id", "=", u).execute();
		await db.deleteFrom("decks").where("owner", "=", u).execute();
		await db.deleteFrom("plays").where("user", "=", u).execute();

		res.status(204).send();
	});
}
