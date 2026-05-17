import z from "zod";

export const AuthedUser = z.object({
	accountID: z.coerce.string(),
	key: z.coerce.string(),
	name: z.string()
});

export const TBCUser = AuthedUser.pick({
	name: true
});

export const Question = z.object({
	id: z.string().optional(),
	question: z.string(),
	answer: z.string().optional(),
	category: z.string().optional()
});

export const Deck = z.object({
	name: z.string(),
	id: z.coerce.string(),
	owner: z.coerce.string(),
	content: z.array(Question)
});

export const TBCDeck = Deck.pick({
	name: true
});
