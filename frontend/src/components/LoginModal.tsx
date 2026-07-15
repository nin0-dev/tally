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
import { lockModal, showAlertModal, unlockModal } from "../utils/modals";
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
						label={
							<>
								{"Secret key "}
								<Anchor
									size="xs"
									component="button"
									type="button"
									onClick={() =>
										showAlertModal({
											title: "Forgot key?",
											children: (
												<>
													Tally does not save your
													email, or any other
													identifying information.
													Without your account ID and
													key, you cannot recover your
													account, and will have to
													make a new one.
													<br />
													The instance operator also
													cannot help you recover your
													account by contacting them,
													as there is no way to
													validate that you are who
													you claim to be.
													<br />
													<br />
													At registration time, you
													downloaded your account info
													in a file named
													"tally-login-[account_id].txt",
													you can try finding that
													file.
												</>
											)
										})
									}
								>
									(I forgot my key)
								</Anchor>
							</>
						}
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
