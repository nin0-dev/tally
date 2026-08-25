import { closeModal, type ContextModalProps } from "@mantine/modals";
import { useState } from "react";
import { useDecks } from "../stores/decks";
import { Alert, Box, Button, Flex, Group, Text, TextInput } from "@mantine/core";
import Spin from "./Spin";
import { WarningIcon } from "@phosphor-icons/react";
import { useForm } from "@mantine/form";
import { lockModal, unlockModal } from "../utils/modals";
import { RestAPI } from "../utils/RestAPI";
import { showErrorNotification, showSuccessNotification } from "../utils/notify";
import { navigate } from "wouter/use-browser-location";

export default function TransferOwnershipModal({ context, id, innerProps }: ContextModalProps<{ deckID: string }>) {
	const decks = useDecks();
	const [spin, setSpin] = useState(false);
	const deck = decks.decks[innerProps.deckID];
	const form = useForm({
		mode: "controlled",
		initialValues: {
			userID: "",
			confirmationString: ""
		},
		validate: {
			confirmationString: v => (v === deck.name ? null : "Enter the deck name, exactly as shown above")
		}
	});

	return (
		<Box pos="relative">
			<Spin show={spin} />
			<Group gap="md">
				<Alert color="yellow" variant="light" icon={<WarningIcon size={32} weight="fill" />} title="About transferring ownership">
					<Group gap="md">
						<Text size="sm">
							Transferring ownership of a deck to a user gives them sole editing rights over the deck. They may also edit the deck's
							settings, share/private it, or delete it.
						</Text>

						<Text size="sm">
							For a user to be able to accept ownership of a deck, they must enable the "Allow deck transfer" setting in their account
							settings.
						</Text>

						<Text size="sm" fw={deck.shared ? "normal" : "bold"}>
							{deck.shared
								? "As this deck is marked as shared, you will retain viewing rights over it. The new owner may unshare the deck at any time."
								: "This deck is not marked as shared. You will completely lose access, including view access, after transferring it, unless the new owner shares the deck to you."}
						</Text>
					</Group>
				</Alert>
				<Text>
					To confirm the transfer, enter the new owner's user ID (findable in account settings) and the deck's name exactly as shown here:{" "}
					<Text span fw="bold" ff="monospace">
						{deck.name}
					</Text>
				</Text>
			</Group>
			<form
				style={{
					marginTop: "var(--mantine-spacing-sm)"
				}}
				onSubmit={form.onSubmit(async data => {
					lockModal(id, context, setSpin);
					const req = await RestAPI.put(`/deck/${innerProps.deckID}`, {
						body: {
							owner: data.userID
						},
						errors: {
							403: "The new owner does not allow deck transfers in their account settings",
							404: "Specified user does not exist"
						}
					});
					if (req.ok) {
						if (deck.shared) {
							decks.getDeck(innerProps.deckID, true);
							closeModal(id);
						} else {
							closeModal(id);
							navigate("/");
							setInterval(() => decks.deleteDeck(innerProps.deckID), 2000);
						}
						showSuccessNotification({
							title: "Successfully transferred deck",
							message: "The deck has been transferred to the specified user"
						});
					} else {
						unlockModal(id, context, setSpin);
						showErrorNotification({
							title: "Couldn't transfer deck",
							message: req.error
						});
					}
				})}
			>
				<Flex direction="column" gap="xs" w="100%">
					<TextInput required data-autofocus label="New owner ID" key={form.key("userID")} {...form.getInputProps("userID")} />
					<TextInput
						withAsterisk
						data-autofocus
						label="Confirmation string"
						key={form.key("confirmationString")}
						{...form.getInputProps("confirmationString")}
					/>
					<Group justify="flex-end" mt="md">
						<Button color="red" type="submit">
							Confirm
						</Button>
					</Group>
				</Flex>
			</form>
		</Box>
	);
}
