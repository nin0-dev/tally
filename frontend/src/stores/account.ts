import { create } from "zustand";

export const useAccount = create<{
	accountID?: string;
	name?: string;
	logIn: (accountID: string, name: string) => void;
	logOut: () => void;
}>()(set => ({
	accountID: undefined,
	name: undefined,
	logIn(accountID: string, name: string) {
		set(() => ({
			accountID,
			name
		}));
	},
	logOut() {
		set(() => ({
			accountID: undefined,
			name: undefined
		}));
	}
}));
