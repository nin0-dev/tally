import { server } from "../index.js";
import { db } from "../utils/db.js";
import { AuthedUser } from "../utils/types.js";
import { generateID } from "../utils/utils.js";

export function setupAccountRoutes() {
	server.post("/accounts", async () => {
		const [accountID, key] = [generateID(), generateID()];
		await db
			.insertInto("users")
			.values({
				id: accountID,
				pass: key
			})
			.execute();

		return { accountID, key };
	});

	server.delete("/accounts", async (req, res) => {
		const { accountID, key } = AuthedUser.parse(req.body);
		await db
			.deleteFrom("users")
			.where("id", "=", accountID)
			.where("pass", "=", key)
			.execute();

		res.status(204).send();
	});
}
