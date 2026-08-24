import { Box, Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeModal, type ContextModalProps } from "@mantine/modals";
import Spin from "./Spin";
import { useState } from "react";
import { lockModal, unlockModal } from "../utils/modals";
import { RestAPI } from "../utils/RestAPI";
import { showErrorNotification } from "../utils/notify";
import { useDecks } from "../stores/decks";

export default function RenameDeckModal({ context, id, innerProps }: ContextModalProps<{ deckID: string }>) {
	const decks = useDecks();
	const form = useForm({
		mode: "controlled",
		initialValues: {
			name: decks.decks[innerProps.deckID].name
		},
		validate: {
			name: v => (v.length > 0 ? null : "Name is required")
		}
	});
	const [spin, setSpin] = useState(false);

	return (
		<Box pos="relative">
			<Spin show={spin} />
			<form
				onSubmit={form.onSubmit(async data => {
					lockModal(id, context, setSpin);
					const req = await RestAPI.put(`/deck/${innerProps.deckID}`, {
						body: {
							name: data.name
						}
					});
					if (req.ok) {
						decks.getDeck(innerProps.deckID, true);
						closeModal(id);
					} else {
						unlockModal(id, context, setSpin);
						showErrorNotification({
							title: "Couldn't rename deck",
							message: req.error
						});
					}
				})}
			>
				<TextInput withAsterisk data-autofocus label="Deck name" key={form.key("name")} {...form.getInputProps("name")} />
				<Group justify="flex-end" mt="md">
					<Button type="submit">Rename</Button>
				</Group>
			</form>
		</Box>
	);
}
