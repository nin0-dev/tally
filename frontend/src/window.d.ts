export {};

declare global {
	interface Window {
		TALLY_CLIENT_CONFIG: {
			turnstileKey: string;
			apiBaseURL: string;
		};
	}
}
