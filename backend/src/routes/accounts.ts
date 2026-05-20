import { hash } from "argon2";
import { server } from "../index.js";
import { getUserIDForRequest } from "../utils/auth.js";
import { db } from "../utils/db.js";
import { AuthedUser, TBCUser } from "../utils/types.js";
import { generateID } from "../utils/utils.js";
import z from "zod";
import { validateTurnstile } from "../utils/turnstile.js";

export function setupAccountRoutes() {
	server.get("/accounts", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) return void res.status(401).send();

		const user = await db
			.selectFrom("users")
			.select(["name", "id", "allow_transfer"])
			.executeTakeFirstOrThrow();

		// @ts-ignore
		user.allow_transfer = !!user.allow_transfer;

		return user;
	});

	server.post("/accounts/rotate", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) return void res.status(401).send();

		const key = generateID(16);

		await db
			.updateTable("users")
			.set("pass", await hash(key))
			.where("id", "=", u)
			.execute();

		return { key };
	});

	server.get("/accounts/export", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) return void res.status(401).send();

		const decks = await db
			.selectFrom("decks")
			.select(["id", "name", "content"])
			.where("owner", "=", u)
			.execute();
		const plays = await db
			.selectFrom("plays")
			.select(["deck", "last_played", "questions"])
			.where("user", "=", u)
			.execute();

		return { decks, plays };
	});

	server.post("/accounts", async (req, res) => {
		const [accountID, key] = [generateID(12), generateID(16)];
		const { name, turnstile } = TBCUser.parse(req.body);

		if (!(await validateTurnstile(turnstile)))
			return void res.code(403).send();

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

	server.put("/accounts", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) return void res.status(401).send();

		const { name, allow_transfer } = z
			.object({
				name: z.string().optional(),
				allow_transfer: z.boolean().optional()
			})
			.parse(req.body);

		const pendingUpdates: {
			name?: string;
			allow_transfer?: number;
		} = {};
		if (name) pendingUpdates.name = name;
		if (allow_transfer !== undefined)
			pendingUpdates.allow_transfer = Number(allow_transfer);

		if (Object.keys(pendingUpdates).length > 0) {
			await db
				.updateTable("users")
				.set(pendingUpdates)
				.where("id", "=", u)
				.execute();
		}

		res.code(204).send();
	});
}
