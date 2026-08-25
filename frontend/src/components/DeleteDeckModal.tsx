import { useForm } from "@mantine/form";
import { useState } from "react";
import { useDecks } from "../stores/decks";
import { closeModal, type ContextModalProps } from "@mantine/modals";
import { WarningIcon } from "@phosphor-icons/react";
import { Alert, Box, Button, Flex, Group, Text, TextInput } from "@mantine/core";
import Spin from "./Spin";
import { lockModal, unlockModal } from "../utils/modals";
import { RestAPI } from "../utils/RestAPI";
import { navigate } from "wouter/use-browser-location";
import { showErrorNotification, showSuccessNotification } from "../utils/notify";

export default function DeleteDeckModal({ context, id, innerProps }: ContextModalProps<{ deckID: string }>) {
	const decks = useDecks();
	const [spin, setSpin] = useState(false);
	const deck = decks.decks[innerProps.deckID];
	const form = useForm({
		mode: "controlled",
		initialValues: {
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
				<Alert color="red" variant="light" icon={<WarningIcon size={32} weight="fill" />} title="About deck deletion">
					<Text size="sm">
						Deck deletion deletes its play history for all users having played it. It does not delete duplicates made of this deck.
					</Text>
				</Alert>
				<Text>
					To confirm the deletion, enter the deck's name exactly as shown here:{" "}
					<Text span fw="bold" ff="monospace">
						{deck.name}
					</Text>
				</Text>
			</Group>
			<form
				style={{
					marginTop: "var(--mantine-spacing-sm)"
				}}
				onSubmit={form.onSubmit(async () => {
					lockModal(id, context, setSpin);
					const req = await RestAPI.delete(`/deck/${innerProps.deckID}`, {});
					if (req.ok) {
						closeModal(id);
						navigate("/");
						setInterval(() => decks.deleteDeck(innerProps.deckID), 2000);
						showSuccessNotification({
							title: "Successfully deleted deck",
							message: `Deck ${deck.name} has been deleted`
						});
					} else {
						unlockModal(id, context, setSpin);
						showErrorNotification({
							title: "Couldn't delete deck",
							message: req.error
						});
					}
				})}
			>
				<Flex direction="column" gap="xs" w="100%">
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
