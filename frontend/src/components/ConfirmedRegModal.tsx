import {
	Alert,
	Box,
	Button,
	Card,
	Checkbox,
	Flex,
	Group,
	Space,
	Text
} from "@mantine/core";
import { closeModal, type ContextModalProps } from "@mantine/modals";
import { WarningIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { useAccount } from "../stores/account";
import { download } from "../utils/download";

export default function ConfirmedRegModal({
	context,
	id,
	innerProps
}: ContextModalProps) {
	const account = useAccount();
	const { accountID, key }: { accountID: string; key: string } =
		innerProps as any;
	const [showKey, setShowKey] = useState(false);
	const [hasBeenRevealedOnce, setHasBeenRevealedOnce] = useState(false);
	const [hasAcknowledged, setHasAcknowledged] = useState(false);

	return (
		<Flex gap={"md"} direction={"column"}>
			<Text>
				Your Tally account is now created, and you can now create
				flashcard decks! However, before getting started, take note of
				the following credentials. You can use them to login to your
				Tally account.
			</Text>
			<Alert
				variant="light"
				color="yellow"
				title="Important"
				icon={<WarningIcon size={32} weight="fill" />}
			>
				Accounts are fully anonymous. There is no account recovery
				process. If you lose these credentials, you lose access to your
				decks.
				<br />
				{!hasAcknowledged && (
					<>
						<Text fw="bold">
							You must download your login information to
							continue.
						</Text>
					</>
				)}
				<Button
					mt="sm"
					color="orange"
					variant="outline"
					onClick={() => {
						setHasAcknowledged(true);
						download({
							name: `tally-login-${accountID}.txt`,
							content: `Account ID: ${accountID}\nSecret key: ${key}\n\nDo not lose this, or you will lose access to your account!`,
							type: "text/plain"
						});
					}}
				>
					Download login info
				</Button>
			</Alert>
			<Card>
				<Text fw={500}>Account ID</Text>
				<Text ff={"monospace"} style={{ wordBreak: "break-all" }}>
					{accountID}
				</Text>
			</Card>
			<Card>
				<Text fw={500}>Secret key</Text>
				<Text ff={"monospace"} style={{ wordBreak: "break-all" }}>
					{showKey ? key : "*".repeat(key.length)}
				</Text>
				<Checkbox
					label="Reveal"
					mt="xs"
					checked={showKey}
					onChange={t => {
						setHasBeenRevealedOnce(true);
						setShowKey(t.currentTarget.checked);
					}}
				/>
			</Card>
			<Group justify="flex-end" mt="md">
				<Button
					disabled={!hasAcknowledged}
					onClick={() => {
						account.logIn(accountID, key);
						closeModal(id);
					}}
				>
					Continue
				</Button>
			</Group>
		</Flex>
	);
}
