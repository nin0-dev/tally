import z from "zod";

export const AuthedUser = z.object({
	accountID: z.coerce.string(),
	key: z.coerce.string()
});
