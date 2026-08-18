import { Anchor, Box, Button, Group, Input, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef, useState } from "react";
import { RestAPI } from "../utils/RestAPI";
import { closeModal, openContextModal, type ContextModalProps } from "@mantine/modals";
import { lockModal, unlockModal } from "../utils/modals";
import Spin from "./Spin";
import { showErrorNotification } from "../utils/notify";

export default function RegistrationModal({ context, id }: ContextModalProps) {
	const [spin, setSpin] = useState(false);
	const turnstileRef = useRef<TurnstileInstance | null>(null);
	const form = useForm({
		mode: "controlled",
		initialValues: {
			name: "",
			turnstile: ""
		},
		validate: {
			name: v => (v.length > 0 ? null : "Name is required"),
			turnstile: v => (window.TALLY_CLIENT_CONFIG.turnstileKey ? (v.length > 0 ? null : "Make sure that you passed the CAPTCHA") : null)
		}
	});

	return (
		<Box pos="relative">
			<Spin show={spin} />
			<form
				onSubmit={form.onSubmit(async body => {
					lockModal(id, context, setSpin);
					const req = await RestAPI.post("/accounts", {
						body,
						errors: {
							403: "CAPTCHA error"
						}
					});
					if (!req.ok) {
						unlockModal(id, context, setSpin);
						showErrorNotification({
							title: "Registration error",
							message: req.error
						});
					} else {
						closeModal(id);
						openContextModal({
							modal: "confirmRegister",
							title: "Register",
							withCloseButton: false,
							closeOnClickOutside: false,
							closeOnEscape: false,
							innerProps: {
								accountID: req.body.accountID,
								key: req.body.key,
								name: body.name
							}
						});
					}
				})}
			>
				<TextInput
					withAsterisk
					data-autofocus
					label="Account name"
					description="This does not have to be unique"
					key={form.key("name")}
					{...form.getInputProps("name")}
				/>
				{!!window.TALLY_CLIENT_CONFIG.turnstileKey && (
					<Input.Wrapper label="CAPTCHA" withAsterisk error={form.errors.turnstile} mt="sm">
						<Box pt={"xs"}>
							<Turnstile
								ref={turnstileRef}
								siteKey={window.TALLY_CLIENT_CONFIG.turnstileKey}
								onSuccess={token => form.setFieldValue("turnstile", token)}
								onExpire={() => form.setFieldValue("turnstile", "")}
								onError={() => form.setFieldValue("turnstile", "")}
							/>
						</Box>
					</Input.Wrapper>
				)}
				<Group justify="flex-end" mt="md">
					<Anchor
						component="button"
						type="button"
						onClick={() => {
							closeModal(id);
							openContextModal({
								modal: "login",
								title: "Login",
								innerProps: {}
							});
						}}
					>
						Already have an account? Login
					</Anchor>
					<Button type="submit">Register</Button>
				</Group>
			</form>
		</Box>
	);
}
