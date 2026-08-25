import { Badge, Button, Flex, Group, Menu, Title, Text } from "@mantine/core";
import { openContextModal } from "@mantine/modals";
import { ArrowBendUpRightIcon, CopyIcon, LinkIcon, PencilIcon, TrashIcon, UserGearIcon, UsersIcon } from "@phosphor-icons/react";
import { showSuccessNotification } from "../utils/notify";
import { showAlertModal } from "../utils/modals";

export default function DeckHeader({ deck, isDeckOwnedByYou, authed }) {
	return (
		<Flex gap="sm" direction={{ base: "column", sm: "row" }}>
			<Title order={1}>{deck.name}</Title>
			<Group>
				{deck.shared ? (
					<Badge
						color="dark"
						variant="light"
						leftSection={<UsersIcon weight="fill" />}
						onClick={() =>
							isDeckOwnedByYou
								? openContextModal({
										modal: "manageAccess",
										title: "Manage access",
										innerProps: { deckID: deck.id }
									})
								: showOwnerInfoModal(deck.owner)
						}
					>
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
								<Menu.Item leftSection={<UserGearIcon size={14} />} onClick={() => showOwnerInfoModal(deck.owner)}>
									Owner information
								</Menu.Item>
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
												This deck is not marked as shared, therefore you will need to be logged in to your account to use this
												link. To share the deck to the public, use the <b>Manage access</b> option.
											</>
										)
									});
								}
							}}
						>
							Copy link
						</Menu.Item>
						{authed && <Menu.Item leftSection={<CopyIcon size={14} />}>Make a copy</Menu.Item>}
						{isDeckOwnedByYou && (
							<>
								<Menu.Divider />

								<Menu.Item
									leftSection={<PencilIcon size={14} />}
									onClick={() =>
										openContextModal({
											modal: "renameDeck",
											title: "Rename deck",
											innerProps: { deckID: deck.id }
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
											innerProps: { deckID: deck.id }
										})
									}
								>
									Manage access
								</Menu.Item>
								<Menu.Divider />
								<Menu.Item
									color="red"
									leftSection={<ArrowBendUpRightIcon size={14} />}
									onClick={() =>
										openContextModal({
											modal: "transferOwnership",
											title: "Transfer ownership",
											innerProps: { deckID: deck.id }
										})
									}
								>
									Transfer ownership
								</Menu.Item>
								<Menu.Item
									color="red"
									leftSection={<TrashIcon size={14} />}
									onClick={() =>
										openContextModal({
											modal: "deleteDeck",
											title: "Delete deck",
											innerProps: { deckID: deck.id }
										})
									}
								>
									Delete deck
								</Menu.Item>
							</>
						)}
					</Menu.Dropdown>
				</Menu>
			</Group>
		</Flex>
	);
}

function showOwnerInfoModal(owner: { name: string; id: string }) {
	showAlertModal({
		title: "Owner information",
		children: (
			<Text>
				The user <strong>{owner.name}</strong> (ID{" "}
				<Text span ff="monospace" size="0.8rem">
					{owner.id}
				</Text>
				) owns this deck, and can edit/delete it at any time.
			</Text>
		)
	});
}
