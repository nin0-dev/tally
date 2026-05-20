export async function validateTurnstile(response: string) {
	try {
		if (!process.env.TURNSTILE_SECRET_KEY) return true;
		const req = await fetch(
			"https://challenges.cloudflare.com/turnstile/v0/siteverify",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					response,
					secret: process.env.TURNSTILE_SECRET_KEY
				})
			}
		);

		return (await req.json()).success;
	} catch (e) {
		console.error(e);
		return false;
	}
}
