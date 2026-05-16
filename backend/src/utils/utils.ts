export function generateID() {
	return `${Date.now()}${Math.floor(1000 + Math.random() * 9000)}`;
}
