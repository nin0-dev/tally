type Endpoint = `/${string}`;

export const RestAPI = {
	async _req(
		method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
		endpoint: Endpoint,
		body?: object
	) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const extras: any = {
			headers: {}
		};
		if (body && method !== "GET") {
			extras.headers["Content-Type"] = "application/json";
			extras.body = JSON.stringify(body);
		}
		const request = await fetch(
			`${window.CARDY_CLIENT_CONFIG.apiBaseURL}${endpoint}`,
			{
				method,
				...extras
			}
		);

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const bodyContainer: any = {};
		try {
			bodyContainer.body = await request.json();
		} catch {
			/* */
		}

		return {
			ok: request.status < 300 && request.status > 199,
			status: request.status,
			...bodyContainer
		};
	},

	async get(endpoint: Endpoint) {
		return await this._req("GET", endpoint);
	},
	async post(endpoint: Endpoint, body?: object) {
		return await this._req("POST", endpoint, body);
	},
	async put(endpoint: Endpoint, body?: object) {
		return await this._req("PUT", endpoint, body);
	},
	async patch(endpoint: Endpoint, body?: object) {
		return await this._req("PATCH", endpoint, body);
	},
	async delete(endpoint: Endpoint, body?: object) {
		return await this._req("DELETE", endpoint, body);
	}
};
