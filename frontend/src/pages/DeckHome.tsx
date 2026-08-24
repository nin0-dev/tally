import { ActionIcon, Alert, Badge, Box, Button, Flex, Group, Loader, Menu, Text, Title } from "@mantine/core";
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
	UserGearIcon,
	UsersIcon,
	WarningCircleIcon
} from "@phosphor-icons/react";
import { showSuccessNotification } from "../utils/notify";
import { showAlertModal } from "../utils/modals";
import { openContextModal } from "@mantine/modals";

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
						<Flex gap="sm" direction={{ base: "column", sm: "row" }}>
							<Title order={1}>{deck.name}</Title>
							<Group>
								{deck.shared ? (
									<Badge color="dark" variant="light" leftSection={<UsersIcon weight="fill" />}>
										Shared
									</Badge>
								) : (
									<></>
								)}
								<Menu shadow="md" width={200}>
									<Menu.Target>
										<Button variant="default">Manage deck</Button>
									</Menu.Target>
									<Menu.Dropdown>
										{!isDeckOwnedByYou && (
											<>
												<Menu.Item leftSection={<UserGearIcon size={14} />}>Owner information</Menu.Item>
												<Menu.Divider />
											</>
										)}
										<Menu.Item
											leftSection={<LinkIcon size={14} />}
											onClick={() => {
												navigator.clipboard.writeText(window.location.href).then(() =>
													showSuccessNotification({
														title: "Success",
														message: "Link copied to clipboard"
													})
												);
												if (!deck.shared) {
													showAlertModal({
														title: "Deck not shared",
														children: (
															<>
																This deck is not marked as shared, therefore you will need to be logged in to your
																account to use this link. To share the deck to the public, use the{" "}
																<b>Manage access</b> option.
															</>
														)
													});
												}
											}}
										>
											Copy link
										</Menu.Item>
										{isDeckOwnedByYou ? (
											<>
												<Menu.Divider />

												<Menu.Item
													leftSection={<PencilIcon size={14} />}
													onClick={() =>
														openContextModal({
															modal: "renameDeck",
															title: "Rename deck",
															innerProps: { deckID: id }
														})
													}
												>
													Rename deck
												</Menu.Item>
												<Menu.Item
													leftSection={<UsersIcon size={14} />}
													onClick={() =>
														openContextModal({
															modal: "manageAccess",
															title: "Manage access",
															innerProps: { deckID: id }
														})
													}
												>
													Manage access
												</Menu.Item>
												<Menu.Divider />
												<Menu.Item color="red" leftSection={<ArrowBendUpRightIcon size={14} />}>
													Transfer ownership
												</Menu.Item>
												<Menu.Item color="red" leftSection={<TrashIcon size={14} />}>
													Delete deck
												</Menu.Item>
											</>
										) : (
											<>{currentUser.accountID && <Menu.Item leftSection={<CopyIcon size={14} />}>Make a copy</Menu.Item>}</>
										)}
									</Menu.Dropdown>
								</Menu>
							</Group>
						</Flex>
					</Flex>
				</Box>
			)}
		</Box>
	);
}
