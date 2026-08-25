import { Alert, Box, Flex, Loader } from "@mantine/core";
import { useDecks } from "../stores/decks";
import { useAccount } from "../stores/account";
import { useEffect } from "react";
import { InfoIcon, WarningCircleIcon } from "@phosphor-icons/react";
import DeckHeader from "../components/DeckHeader";

export default function DeckHome({ params: { id } }: { params: { id: string } }) {
	const currentUser = useAccount();

	const deck = useDecks(state => state.decks[id]);
	const failed = useDecks(state => state.failedDecks[id]);
	const getDeck = useDecks(state => state.getDeck);
	const loading = useDecks(state => state.loadingDecks.includes(id));
	const isDeckOwnedByYou = deck ? deck.owner.id === currentUser.accountID : false;

	useEffect(() => {
		getDeck(id);
	}, [id, getDeck]);

	return (
		<Box>
			{failed && (
				<Alert variant="light" color="red" title="Couldn't load deck" icon={<WarningCircleIcon size={32} weight="fill" />}>
					{failed}
				</Alert>
			)}
			{loading || !deck ? (
				!failed && <Loader mt="lg" />
			) : (
				<Box>
					<Flex direction="column" gap="sm">
						{!currentUser.accountID && (
							<Alert variant="light" color="blue" title="Not logged in" icon={<InfoIcon size={32} weight="fill" />}>
								You are not logged in to a Tally account. Your progress on this deck will not be saved. To save your progress, log in
								or register. This only takes a few seconds, and does not require you to share anything about you!
							</Alert>
						)}
						<DeckHeader deck={deck} isDeckOwnedByYou={isDeckOwnedByYou} authed={currentUser.accountID} />
					</Flex>
				</Box>
			)}
		</Box>
	);
}
