import { server } from "../index.js";
import { getUserIDForRequest } from "../utils/auth.js";
import { db } from "../utils/db.js";
import {
	NotFoundError,
	UnauthorizedError,
	ValidationError
} from "../utils/errors.js";
import { Deck, Question, TBCDeck } from "../utils/types.js";
import { generateID, validateDeckID } from "../utils/utils.js";
import z from "zod";

function calculatePriority(history?: string) {
	const baseScore = (() => {
		if (!history) return 100;

		const [last = null, prev = null, prev2 = null] = history
			.split("")
			.toReversed();

		if ([last, prev, prev2].every(t => t === "F")) return 300; // last 3 attempts were a fail
		if ([last, prev].every(t => t === "F")) return 250; // last 2 attempts were a fail
		if (last === "F") return 200; // last attempt was a fail
		if (last === "U") return 150; // last attempt, they forgot

		let pastRight = 0; // consecutive success attempts, lower the card's priority
		for (const item of history.split("").toReversed()) {
			if (item === "S") pastRight++;
			else break;
		}

		return (
			100 -
			pastRight * 50 +
			(["F", "U"].includes(prev ?? "")
				? 30
				: 0) /* if the prev-last attempt was a failure, penalise by 30 */
		);
	})();
	return baseScore + Math.random() * 10;
}

export function setupDeckRoutes() {
	server.get("/deck/:id/queue", async (req, res) => {
		const u = await getUserIDForRequest(req);
		const deckID = validateDeckID(req);

		try {
			const deck = await db
				.selectFrom("decks")
				.select(["content", "shared", "owner"])
				.where("id", "=", deckID)
				.executeTakeFirstOrThrow();
			if (!deck.shared && u !== deck.owner) throw new NotFoundError();

			var deckQuestions = z
				.array(Question)
				.parse(JSON.parse(deck.content ?? "[]"));
		} catch {
			throw new NotFoundError();
		}

		let history: Record<string, string> = {};
		if (u) {
			const playData = await db
				.selectFrom("plays")
				.select("questions")
				.where("user", "=", u)
				.where("deck", "=", deckID)
				.executeTakeFirst();

			if (playData?.questions) {
				history = JSON.parse(playData.questions);
			}
		}

		const qsWithScore = deckQuestions.map(q => ({
			...q,
			score: calculatePriority(history[q.id ?? ""])
		}));
		qsWithScore.sort((a, b) => b.score - a.score);

		return qsWithScore;
	});

	server.get("/deck/:id", async (req, res) => {
		if (!(req.params as any).id) throw new ValidationError();
		const u = await getUserIDForRequest(req);
		const { id }: { id: string } = req.params as any;
		if (id === "@me") {
			if (!u) throw new UnauthorizedError();

			const ownedDecks = await db
				.selectFrom("decks")
				.select(["name", "id", "content"])
				.where("owner", "=", u)
				.execute();

			return {
				ownedDecks: ownedDecks.map(deck => ({
					name: deck.name,
					id: deck.id,
					questionCount: JSON.parse(deck.content ?? "[]").length
				}))
			};
		} else {
			let deck: {
				owner: string;
				content: string | null;
				id: string;
				name: string;
				owner_name: string;
				shared: number | null;
			};
			try {
				deck = await db
					.selectFrom("decks")
					.innerJoin("users", "users.id", "decks.owner")
					.select([
						"decks.id",
						"decks.name",
						"decks.owner",
						"decks.content",
						"decks.shared",
						"users.name as owner_name"
					])
					.where("decks.id", "=", id)
					.executeTakeFirstOrThrow();

				if (!deck.shared && u !== deck.owner) throw new NotFoundError();
			} catch {
				throw new NotFoundError();
			}

			return {
				id: deck.id,
				name: deck.name,
				questions: JSON.parse(deck.content ?? "[]"),
				shared: deck.shared,
				owner: {
					name: deck.owner_name,
					id: deck.owner
				}
			};
		}
	});

	server.post("/deck", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) throw new UnauthorizedError();

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
		if (!u) throw new UnauthorizedError();
		const { name, owner, questions, shared } = z
			.object({
				name: z.string().optional(),
				owner: z.string().optional(),
				questions: z.array(Question).optional(),
				shared: z.boolean().optional()
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
			throw new NotFoundError();
		}
		if (deck.owner !== u) throw new NotFoundError();

		const pendingUpdates: {
			name?: string;
			owner?: string;
			content?: string;
			shared?: number;
		} = {};
		if (name) pendingUpdates.name = name;
		if (owner) {
			const resp = await db
				.selectFrom("users")
				.select("allow_transfer")
				.where("id", "=", owner)
				.executeTakeFirst();
			if (!resp) throw new NotFoundError();
			const { allow_transfer } = resp;
			if (allow_transfer !== 1) return res.code(403).send();
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
		if (typeof shared !== "undefined") {
			pendingUpdates.shared = shared ? 1 : 0;
		}

		if (Object.keys(pendingUpdates).length > 0) {
			await db
				.updateTable("decks")
				.set(pendingUpdates)
				.where("id", "=", id)
				.execute();
		}

		return {
			name: pendingUpdates.name ?? deck.name,
			id: deck.id,
			shared: typeof shared !== "undefined" ? shared : !!deck.shared,
			questions: pendingUpdates.content
				? JSON.parse(pendingUpdates.content)
				: JSON.parse(deck.content ?? "[]")
		};
	});

	server.delete("/deck/:id", async (req, res) => {
		const u = await getUserIDForRequest(req);
		if (!u) throw new UnauthorizedError();
		const id = validateDeckID(req);

		try {
			var deck = await db
				.selectFrom("decks")
				.select("owner")
				.where("id", "=", id)
				.executeTakeFirstOrThrow();
		} catch {
			throw new NotFoundError();
		}
		if (deck.owner !== u) throw new NotFoundError();

		await db.deleteFrom("decks").where("id", "=", id).execute();
		res.status(204).send();
	});
}
