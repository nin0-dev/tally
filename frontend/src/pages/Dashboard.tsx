import { Box, Button, Flex, Grid, Loader, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { RestAPI } from "../utils/RestAPI";
import { type HomeDeck } from "../utils/types";
import { showErrorNotification } from "../utils/notify";

export default function Dashboard() {
	const [decks, setDecks] = useState<HomeDeck[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		RestAPI.get("/deck/@me", {}).then(t => {
			if (t.ok) {
				setLoading(false);
				setDecks(
					(t.body.ownedDecks as Omit<HomeDeck, "favorite">[]).map(
						d => ({
							...d,
							favorite: false
						})
					)
				);
			} else {
				showErrorNotification({
					title: "Couldn't load decks",
					message: t.error
				});
			}
		});
	}, []);
	return (
		<Box>
			<Title order={1}>My decks</Title>
			{loading ? (
				<Loader mt="lg" />
			) : decks.length > 0 ? (
				<Grid></Grid>
			) : (
				<Flex
					direction="column"
					mt="lg"
					style={{ alignItems: "center", textAlign: "center" }}
				>
					<Title order={2}>Create your first deck</Title>
					<Text>
						Get started with Tally by creating your very first
						flashcard deck.
					</Text>
					<Button mt="sm" size="lg">
						Make a deck
					</Button>
				</Flex>
			)}
		</Box>
	);
}
