import { hash, verify } from "argon2";
import { server } from "../index.js";
import { getUserIDForRequest } from "../utils/auth.js";
import { db } from "../utils/db.js";
import { AuthedUser, TBCUser } from "../utils/types.js";
import { generateID } from "../utils/utils.js";
import z from "zod";
import { validateTurnstile } from "../utils/turnstile.js";
import { UnauthorizedError, ValidationError } from "../utils/errors.js";

export function setupAccountRoutes() {
	server.post("/accounts/login", async (req, res) => {
		const { accountID, key } = z
			.object({
				accountID: z.string(),
				key: z.string()
			})
			.parse(req.body);

		try {
			const potentialUser = await db
				.selectFrom("users")
				.select(["id", "name", "pass", "allow_transfer"])
				.where("id", "=", accountID)
				.executeTakeFirstOrThrow();
			if (await verify(potentialUser.pass, key)) {
				res.setCookie("account_id", accountID, {
					path: "/",
					httpOnly: true,
					sameSite: "lax",
					maxAge: 60 * 60 * 24 * 30
				});
				res.setCookie("token", key, {
					path: "/",
					httpOnly: true,
					sameSite: "lax",
					maxAge: 60 * 60 * 24 * 30
				});
				res.setCookie("authed", "1", {
					path: "/",
					httpOnly: false,
					sameSite: "lax",
					maxAge: 60 * 60 * 24 * 30
				});
				return {
					id: potentialUser.id,
					name: potentialUser.name,
					allow_transfer: !!potentialUser.allow_transfer
				};
			} else throw new UnauthorizedError();
		} catch {
			throw new UnauthorizedError();
		}
	});

	server.post("/accounts/logout", (_, res) => {
		res.setCookie("token", "", { path: "/", httpOnly: true, sameSite: "lax", maxAge: 0 });
		res.setCookie("account_id", "", { path: "/", httpOnly: true, sameSite: "lax", maxAge: 0 });
		res.setCookie("authed", "", {
			path: "/",
			httpOnly: false,
			sameSite: "lax",
			maxAge: 0
		});
		res.status(204).send();
	});

	server.get("/accounts", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) throw new UnauthorizedError();

		const user = await db.selectFrom("users").select(["name", "id", "allow_transfer"]).where("id", "=", u).executeTakeFirstOrThrow();

		// @ts-ignore
		user.allow_transfer = !!user.allow_transfer;

		return user;
	});

	server.post("/accounts/rotate", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) throw new UnauthorizedError();

		const key = generateID(32);

		await db
			.updateTable("users")
			.set("pass", await hash(key))
			.where("id", "=", u)
			.execute();

		res.setCookie("token", key, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 30
		});
		res.setCookie("authed", "1", {
			path: "/",
			httpOnly: false,
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 30
		});
		return {
			key
		};
	});

	server.get("/accounts/export", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) throw new UnauthorizedError();

		const user = await db.selectFrom("users").select(["id", "name"]).where("id", "=", u).executeTakeFirstOrThrow();
		const decks = await db.selectFrom("decks").select(["id", "name", "content"]).where("owner", "=", u).execute();
		const plays = await db.selectFrom("plays").select(["deck", "last_played", "questions"]).where("user", "=", u).execute();

		return { user, decks, plays };
	});

	server.post("/accounts", async (req, res) => {
		const [accountID, key] = [generateID(12), generateID(32)];
		const { name, turnstile } = TBCUser.parse(req.body);

		if (!(await validateTurnstile(turnstile))) return res.code(403).send();

		await db
			.insertInto("users")
			.values({
				id: accountID,
				name: name,
				pass: await hash(key)
			})
			.execute();

		res.setCookie("account_id", accountID, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 30
		});
		res.setCookie("token", key, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 30
		});
		res.setCookie("authed", "1", {
			path: "/",
			httpOnly: false,
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 30
		});

		return { accountID, key };
	});

	server.delete("/accounts", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) throw new UnauthorizedError();

		await db.deleteFrom("users").where("id", "=", u).execute();
		await db.deleteFrom("decks").where("owner", "=", u).execute();
		await db.deleteFrom("plays").where("user", "=", u).execute();

		res.status(204).send();
	});

	server.put("/accounts", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) throw new UnauthorizedError();

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
		if (name !== undefined) {
			if (!name?.trim().length) throw new ValidationError();
			pendingUpdates.name = name.trim();
		}
		if (allow_transfer !== undefined) pendingUpdates.allow_transfer = Number(allow_transfer);

		if (Object.keys(pendingUpdates).length > 0) {
			await db.updateTable("users").set(pendingUpdates).where("id", "=", u).execute();
		}

		res.code(204).send();
	});
}
