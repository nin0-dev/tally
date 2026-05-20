import { Box, Button, Group, Input, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef } from "react";
import { RestAPI } from "../utils/RestAPI";

export default function RegistrationModal() {
	const turnstileRef = useRef<TurnstileInstance | null>(null);
	const form = useForm({
		mode: "controlled",
		initialValues: {
			name: "",
			turnstile: ""
		},
		validate: {
			name: v => (v.length > 0 ? null : "Name is required"),
			turnstile: v =>
				window.CARDY_CLIENT_CONFIG.turnstileKey
					? v.length > 0
						? null
						: "Make sure that you passed the CAPTCHA"
					: null
		}
	});

	return (
		<form
			onSubmit={form.onSubmit(async vals => {
				const req = await RestAPI.post("/accounts", vals);
				console.log(req);
			})}
		>
			<TextInput
				withAsterisk
				label="Account name"
				description="This does not have to be unique"
				key={form.key("name")}
				{...form.getInputProps("name")}
			/>
			{!!window.CARDY_CLIENT_CONFIG.turnstileKey && (
				<Input.Wrapper
					label="CAPTCHA"
					withAsterisk
					error={form.errors.turnstile}
					mt="sm"
				>
					<Box pt={"xs"}>
						<Turnstile
							ref={turnstileRef}
							siteKey={window.CARDY_CLIENT_CONFIG.turnstileKey}
							onSuccess={token =>
								form.setFieldValue("turnstile", token)
							}
							onExpire={() => form.setFieldValue("turnstile", "")}
							onError={() => form.setFieldValue("turnstile", "")}
						/>
					</Box>
				</Input.Wrapper>
			)}
			<Group justify="flex-end" mt="md">
				<Button type="submit">Register</Button>
			</Group>
		</form>
	);
}
