import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAccount = create<{
	accountID?: string;
	key?: string;
	name?: string;
	logIn: (accountID: string, key: string) => void;
	logOut: () => void;
}>()(
	persist(
		set => ({
			accountID: undefined,
			key: undefined,
			name: undefined,
			logIn(accountID: string, key: string) {
				set(() => ({
					accountID: accountID,
					key: key
				}));
			},
			logOut() {
				set(() => ({
					accountID: undefined,
					key: undefined,
					name: undefined
				}));
			}
		}),
		{
			name: "account",
			partialize: state => ({
				accountID: state.accountID,
				key: state.accountID
			})
		}
	)
);
