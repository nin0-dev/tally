export {};

declare global {
	interface Window {
		CARDY_CLIENT_CONFIG: {
			turnstileKey: string;
			apiBaseURL: string;
		};
	}
}
