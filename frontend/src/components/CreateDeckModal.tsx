import { Box, Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeModal, type ContextModalProps } from "@mantine/modals";
import Spin from "./Spin";
import { useState } from "react";
import { lockModal, unlockModal } from "../utils/modals";
import { RestAPI } from "../utils/RestAPI";
import { useLocation } from "wouter";
import {
	showErrorNotification,
	showSuccessNotification
} from "../utils/notify";

export default function CreateDeckModal({ context, id }: ContextModalProps) {
	const form = useForm({
		mode: "controlled",
		initialValues: {
			name: ""
		},
		validate: {
			name: v => (v.length > 0 ? null : "Name is required")
		}
	});
	const [spin, setSpin] = useState(false);
	const [, setLocation] = useLocation();

	return (
		<Box pos="relative">
			<Spin show={spin} />
			<form
				onSubmit={form.onSubmit(async data => {
					lockModal(id, context, setSpin);
					const req = await RestAPI.post("/deck", {
						body: {
							name: data.name
						}
					});
					if (req.ok) {
						setLocation(`/deck/${req.body.id}`);
						closeModal(id);
						showSuccessNotification({
							title: "Deck created",
							message: "Your deck has been created"
						});
					} else {
						unlockModal(id, context, setSpin);
						showErrorNotification({
							title: "Couldn't create deck",
							message: req.error
						});
					}
				})}
			>
				<TextInput
					withAsterisk
					data-autofocus
					label="Deck name"
					key={form.key("name")}
					{...form.getInputProps("name")}
				/>
				<Group justify="flex-end" mt="md">
					<Button type="submit">OK</Button>
				</Group>
			</form>
		</Box>
	);
}
