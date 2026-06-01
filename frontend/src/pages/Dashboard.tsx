import {
	Box,
	Button,
	Card,
	Flex,
	Grid,
	GridCol,
	Loader,
	Text,
	Title
} from "@mantine/core";
import { useEffect, useState } from "react";
import { RestAPI } from "../utils/RestAPI";
import { type HomeDeck } from "../utils/types";
import { showErrorNotification } from "../utils/notify";
import { openContextModal } from "@mantine/modals";
import { useLocation } from "wouter";

export default function Dashboard() {
	const [decks, setDecks] = useState<HomeDeck[]>([]);
	const [loading, setLoading] = useState(true);
	const [, setLocation] = useLocation();

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
			<Flex direction="row" align="center" gap="md">
				<Title order={1}>My decks</Title>
				{!loading && decks.length > 0 && (
					<Button
						style={{
							marginLeft: "auto"
						}}
						onClick={() => {
							openContextModal({
								modal: "createDeck",
								title: "New deck",
								innerProps: {}
							});
						}}
					>
						New deck
					</Button>
				)}
			</Flex>
			{loading ? (
				<Loader mt="lg" />
			) : decks.length > 0 ? (
				<Grid gap={"sm"} mt={"md"}>
					{decks.map(d => (
						<GridCol span={{ base: 12, md: 6 }} key={d.id}>
							<Card>
								<Title order={3}>{d.name}</Title>
								<Text c="dimmed">
									{d.questionCount} question
									{d.questionCount !== 1 && "s"}
								</Text>
								<Flex gap={"sm"} mt={"sm"} justify={"flex-end"}>
									<Button
										onClick={() =>
											setLocation(`/deck/${d.id}`)
										}
									>
										Open
									</Button>
								</Flex>
							</Card>
						</GridCol>
					))}
				</Grid>
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
					<Button
						mt="sm"
						size="lg"
						onClick={() => {
							openContextModal({
								modal: "createDeck",
								title: "New deck",
								innerProps: {}
							});
						}}
					>
						Make a deck
					</Button>
				</Flex>
			)}
		</Box>
	);
}
