type Endpoint = `/${string}`;

type Extra = {
	body?: object;
	errors: {
		[code: number]: string;
	};
};

export const RestAPI = {
	async _req(
		method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
		endpoint: Endpoint,
		extra: Extra
	): Promise<
		| {
				ok: true;
				status: number;
				body?: object;
		  }
		| { ok: false; status: number; body?: object; error: string }
	> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const extras: any = {
			headers: {}
		};
		if (extra.body && method !== "GET") {
			extras.headers["Content-Type"] = "application/json";
			extras.body = JSON.stringify(extra.body);
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

		const ok = request.status < 300 && request.status > 199;
		if (!ok) {
			extra.errors[500] = "Validation / internal error";
			bodyContainer.error =
				extra.errors[request.status] ??
				`Unknown error ${request.status}`;
		}

		return {
			ok,
			status: request.status,
			...bodyContainer
		};
	},

	async get(endpoint: Endpoint, extra: Extra) {
		return await this._req("GET", endpoint, extra);
	},
	async post(endpoint: Endpoint, extra: Extra) {
		return await this._req("POST", endpoint, extra);
	},
	async put(endpoint: Endpoint, extra: Extra) {
		return await this._req("PUT", endpoint, extra);
	},
	async patch(endpoint: Endpoint, extra: Extra) {
		return await this._req("PATCH", endpoint, extra);
	},
	async delete(endpoint: Endpoint, extra: Extra) {
		return await this._req("DELETE", endpoint, extra);
	}
};
