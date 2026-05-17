import { randomBytes } from "crypto";

export function generateID(length: 12 | 16) {
	return randomBytes(length / 2).toString("hex");
}
