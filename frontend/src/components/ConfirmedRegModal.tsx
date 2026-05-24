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
				decks. It is suggested that you save them in a password manager,
				or similar.
				<Checkbox
					label={`I understand, let me continue${hasBeenRevealedOnce ? "" : " (reveal & save your secret key to continue)"}`}
					mt="xs"
					onChange={t => setHasAcknowledged(t.currentTarget.checked)}
					disabled={!hasBeenRevealedOnce}
				/>
			</Alert>
			<Card>
				<Text fw={500}>Account ID</Text>
				<Text ff={"monospace"}>{accountID}</Text>
			</Card>
			<Card>
				<Text fw={500}>Secret key</Text>
				<Text ff={"monospace"}>
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
