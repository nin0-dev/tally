import { Anchor, Box, Button, Flex, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
	closeModal,
	openContextModal,
	type ContextModalProps
} from "@mantine/modals";
import { useState } from "react";
import Spin from "./Spin";
import { RestAPI } from "../utils/RestAPI";
import { lockModal, unlockModal } from "../utils/modals";
import {
	showErrorNotification,
	showSuccessNotification
} from "../utils/notify";
import { useAccount } from "../stores/account";

export default function LoginModal({ context, id }: ContextModalProps) {
	const [spin, setSpin] = useState(false);
	const form = useForm({
		mode: "controlled",
		initialValues: {
			accountID: "",
			secretKey: ""
		},
		validate: {
			accountID: v => (v.length > 0 ? null : "Account ID is required"),
			secretKey: v => (v.length > 0 ? null : "Secret key is required")
		}
	});

	return (
		<Box pos="relative">
			<Spin show={spin} />
			<form
				onSubmit={form.onSubmit(async body => {
					lockModal(id, context, setSpin);
					const req = await RestAPI.get("/accounts", {
						headers: {
							Authorization: `${body.accountID}-${body.secretKey}`
						},
						errors: {
							401: "Invalid account ID/key"
						}
					});
					if (req.ok) {
						closeModal(id);
						useAccount
							.getState()
							.logIn(body.accountID, body.secretKey);
						showSuccessNotification({
							title: "Logged in",
							message: `Welcome back, ${req.body.name}!`
						});
					} else {
						unlockModal(id, context, setSpin);
						showErrorNotification({
							title: "Couldn't login",
							message: req.error
						});
					}
				})}
			>
				<Flex direction="column" gap="xs">
					<TextInput
						withAsterisk
						data-autofocus
						label="Account ID"
						key={form.key("accountID")}
						{...form.getInputProps("accountID")}
					/>
					<TextInput
						withAsterisk
						data-autofocus
						label="Secret key"
						type="password"
						key={form.key("secretKey")}
						{...form.getInputProps("secretKey")}
					/>
					<Group justify="flex-end" mt="md">
						<Anchor
							component="button"
							type="button"
							onClick={() => {
								closeModal(id);
								openContextModal({
									modal: "register",
									title: "Register",
									innerProps: {}
								});
							}}
						>
							Don't have an account? Register
						</Anchor>
						<Button type="submit">Login</Button>
					</Group>
				</Flex>
			</form>
		</Box>
	);
}
