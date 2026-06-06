import { navigate } from "wouter/use-browser-location";
import { useAccount } from "../stores/account";

type Endpoint = `/${string}`;

type Extra = {
	body?: object;
	headers?: {
		[name: string]: string;
	};
	errors?: {
		[code: number]: string;
	};
};

type RT = Promise<{
	ok: boolean;
	status: number;
	body?: any;
	error?: string;
}>;

export const RestAPI = {
	async _req(
		method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
		endpoint: Endpoint,
		extra: Extra
	): RT {
		const extras: any = {
			headers: {}
		};
		if (extra.headers) {
			for (const [h, v] of Object.entries(extra.headers)) {
				extras.headers[h] = v;
			}
		}
		const account = useAccount.getState();
		if (account.key) {
			extras.headers["Authorization"] =
				`${account.accountID}-${account.key}`;
		}
		if (extra.body && method !== "GET") {
			extras.headers["Content-Type"] = "application/json";
			extras.body = JSON.stringify(extra.body);
		}
		try {
			const request = await fetch(
				`${window.TALLY_CLIENT_CONFIG.apiBaseURL}${endpoint}`,
				{
					method,
					...extras
				}
			);
			const bodyContainer: any = {};
			try {
				bodyContainer.body = await request.json();
			} catch {
				/* */
			}

			const ok = request.status < 300 && request.status > 199;
			if (!ok) {
				if (request.status === 401 && account.accountID) {
					account.logOut();
					navigate("/");
				}
				extra.errors[500] = "Validation / internal error";
				extra.errors[401] = "Authentication error";
				bodyContainer.error =
					extra.errors[request.status] ??
					`Unknown error ${request.status}`;
			}

			return {
				ok,
				status: request.status,
				...bodyContainer
			};
		} catch (e) {
			return {
				ok: false,
				status: -1,
				error: e.toString()
			};
		}
	},

	async get(endpoint: Endpoint, extra: Extra): RT {
		return await this._req("GET", endpoint, extra);
	},
	async post(endpoint: Endpoint, extra: Extra): RT {
		return await this._req("POST", endpoint, extra);
	},
	async put(endpoint: Endpoint, extra: Extra): RT {
		return await this._req("PUT", endpoint, extra);
	},
	async patch(endpoint: Endpoint, extra: Extra): RT {
		return await this._req("PATCH", endpoint, extra);
	},
	async delete(endpoint: Endpoint, extra: Extra): RT {
		return await this._req("DELETE", endpoint, extra);
	}
};
