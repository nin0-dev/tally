import { create } from "zustand";
import { RestAPI } from "../utils/RestAPI";

export const useDecks = create<{
	decks: {
		[id: string]: {
			name: string;
			shared: boolean;
			questions: {
				id: string;
				question: string;
				answer: string;
				category?: string;
			}[];
			owner: {
				id: string;
				name: string;
			};
		};
	};
	loadingDecks: string[];
	failedDecks: {
		[id: string]: string;
	};
	getDeck: (id: string) => void;
}>()((set, get) => ({
	decks: {},
	loadingDecks: [],
	failedDecks: {},
	async getDeck(id) {
		if (get().decks[id] || get().loadingDecks.includes(id)) return;
		set(state => ({
			loadingDecks: [...get().loadingDecks, id],
			failedDecks: { ...state.failedDecks, [id]: undefined }
		}));

		const req = await RestAPI.get(`/deck/${id}`, {
			errors: {
				404: "Either this deck is private, or it does not exist."
			}
		});
		if (req.ok) {
			set(state => ({
				loadingDecks: get().loadingDecks.filter(d => d !== id),
				decks: {
					...state.decks,
					[id]: req.body
				}
			}));
		} else {
			set(state => ({
				loadingDecks: state.loadingDecks.filter(d => d !== id),
				failedDecks: {
					...state.failedDecks,
					[id]: req.error
				}
			}));
		}
	}
}));
