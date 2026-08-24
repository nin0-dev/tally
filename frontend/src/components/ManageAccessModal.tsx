import { Alert, Box, Button, Group, Switch } from "@mantine/core";
import { closeModal, type ContextModalProps } from "@mantine/modals";
import { InfoIcon } from "@phosphor-icons/react";
import { useDecks } from "../stores/decks";
import { useState } from "react";
import { lockModal, unlockModal } from "../utils/modals";
import Spin from "./Spin";
import { RestAPI } from "../utils/RestAPI";
import { showErrorNotification } from "../utils/notify";

export default function ManageAccessModal({ context, id, innerProps }: ContextModalProps<{ deckID: string }>) {
	const decks = useDecks();
	const [spin, setSpin] = useState(false);
	const [shared, setShared] = useState(!!decks.decks[innerProps.deckID].shared);

	return (
		<Box pos="relative">
			<Spin show={spin} />
			<Group gap="md">
				<Alert variant="light" color="blue" icon={<InfoIcon size={32} weight="fill" />} title="About sharing">
					If you mark a deck as shared, anyone with its URL has read-only access to it, without necessarily having an account. With an
					account their history can be tracked and they can duplicate the deck in their own library.
					<br />
					You can stop sharing a deck at any time, however this will not delete copies of it.
				</Alert>
				<Group w="100%">
					<Switch label="Share this deck" checked={shared} onChange={e => setShared(!!e.currentTarget.checked)} />
					<Button
						ml="auto"
						type="submit"
						onClick={async () => {
							lockModal(id, context, setSpin);
							const req = await RestAPI.put(`/deck/${innerProps.deckID}`, {
								body: {
									shared
								}
							});
							if (req.ok) {
								decks.getDeck(innerProps.deckID, true);
								closeModal(id);
							} else {
								unlockModal(id, context, setSpin);
								showErrorNotification({
									title: "Couldn't edit deck",
									message: req.error
								});
							}
						}}
					>
						Apply
					</Button>
				</Group>
			</Group>
		</Box>
	);
}
