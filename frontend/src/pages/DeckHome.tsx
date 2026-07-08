import {
	ActionIcon,
	Alert,
	Badge,
	Box,
	Button,
	Flex,
	Loader,
	Menu,
	Text,
	Title
} from "@mantine/core";
import { useDecks } from "../stores/decks";
import { useAccount } from "../stores/account";
import { useEffect } from "react";
import {
	ArrowBendUpRightIcon,
	CopyIcon,
	InfoIcon,
	LinkIcon,
	PencilIcon,
	TrashIcon,
	UsersIcon,
	WarningCircleIcon
} from "@phosphor-icons/react";
import { showSuccessNotification } from "../utils/notify";

export default function DeckHome({
	params: { id }
}: {
	params: { id: string };
}) {
	const currentUser = useAccount();

	const deck = useDecks(state => state.decks[id]);
	const failed = useDecks(state => state.failedDecks[id]);
	const getDeck = useDecks(state => state.getDeck);
	const loading = useDecks(state => state.loadingDecks.includes(id));
	const isDeckOwnedByYou = deck
		? deck.owner.id === currentUser.accountID
		: false;

	useEffect(() => {
		getDeck(id);
	}, [id, getDeck]);

	return (
		<Box>
			{failed && (
				<Alert
					variant="light"
					color="red"
					title="Couldn't load deck"
					icon={<WarningCircleIcon size={32} weight="fill" />}
				>
					{failed}
				</Alert>
			)}
			{loading || !deck ? (
				!failed && <Loader mt="lg" />
			) : (
				<Box>
					<Flex direction="column" gap="sm">
						{!currentUser.accountID && (
							<Alert
								variant="light"
								color="blue"
								title="Not logged in"
								icon={<InfoIcon size={32} weight="fill" />}
							>
								You are not logged in to a Tally account. Your
								progress on this deck will not be saved. To save
								your progress, log in or register. This only
								takes a few seconds, and does not require you to
								share anything about you!
							</Alert>
						)}
						<Flex gap="sm" align="center">
							<Title order={1}>{deck.name}</Title>
							{isDeckOwnedByYou ? (
								<Menu shadow="md" width={200}>
									<Menu.Target>
										<Button variant="default">
											Manage deck
										</Button>
									</Menu.Target>
									<Menu.Dropdown>
										<Menu.Item
											leftSection={<LinkIcon size={14} />}
											onClick={() =>
												navigator.clipboard
													.writeText(
														window.location.href
													)
													.then(() =>
														showSuccessNotification(
															{
																title: "Success",
																message:
																	"Link copied to clipboard"
															}
														)
													)
											}
										>
											Copy link
										</Menu.Item>
										<Menu.Divider />
										<Menu.Item
											leftSection={
												<PencilIcon size={14} />
											}
										>
											Rename deck
										</Menu.Item>
										<Menu.Item
											leftSection={
												<UsersIcon size={14} />
											}
										>
											Manage access
										</Menu.Item>
										<Menu.Divider />
										<Menu.Item
											color="red"
											leftSection={
												<ArrowBendUpRightIcon
													size={14}
												/>
											}
										>
											Transfer ownership
										</Menu.Item>
										<Menu.Item
											color="red"
											leftSection={
												<TrashIcon size={14} />
											}
										>
											Delete deck
										</Menu.Item>
									</Menu.Dropdown>
								</Menu>
							) : (
								<>
									<ActionIcon
										variant="default"
										disabled={!currentUser.accountID}
									>
										<CopyIcon weight="fill" />
									</ActionIcon>
									<Badge
										color="dark"
										variant="light"
										leftSection={
											<UsersIcon weight="fill" />
										}
									>
										Shared
									</Badge>
								</>
							)}
						</Flex>
						<Box>
							Owned by{" "}
							<Text span fw={600}>
								{isDeckOwnedByYou ? (
									"you"
								) : (
									<>
										{deck.owner.name}{" "}
										<Text span ff="monospace" size="0.8rem">
											({deck.owner.id})
										</Text>
									</>
								)}
							</Text>
						</Box>
					</Flex>
				</Box>
			)}
		</Box>
	);
}
