import {
	Alert,
	Box,
	Button,
	Checkbox,
	Divider,
	Flex,
	Loader,
	Text,
	TextInput,
	Title
} from "@mantine/core";
import { useEffect, useState } from "react";
import { RestAPI } from "../utils/RestAPI";
import {
	showErrorNotification,
	showSuccessNotification
} from "../utils/notify";
import { useAccount } from "../stores/account";
import { openConfirmModal } from "@mantine/modals";
import { WarningIcon } from "@phosphor-icons/react";
import { useLocation } from "wouter";

export default function MyAccount() {
	const [name, setName] = useState<string | undefined>(undefined);
	const [, setLocation] = useLocation();
	const account = useAccount();
	const [id, setId] = useState<string | undefined>(undefined);
	const [revealKey, setRevealKey] = useState(false);
	const [allowTransfer, setAllowTransfer] = useState<boolean | undefined>(
		undefined
	);

	useEffect(() => {
		RestAPI.get("/accounts", {
			errors: {}
		}).then(t => {
			if (!t.ok) {
				showErrorNotification({
					title: "Couldn't get account info",
					message: t.error
				});
			} else {
				const { name, id, allow_transfer: allowTransfer } = t.body;
				setName(name);
				setId(id);
				setAllowTransfer(allowTransfer);
			}
		});
	}, []);

	return (
		<Box style={{ height: "100%" }}>
			<Title order={1}>My account</Title>
			<Flex
				direction="column"
				mt="md"
				gap="md"
				style={id ? {} : { alignItems: "center" }}
			>
				{id ? (
					<>
						<TextInput
							data-autofocus
							label="Account ID"
							value={id}
							readOnly={true}
						/>
						<TextInput
							data-autofocus
							label="Account name"
							value={name}
							onChange={e => setName(e.currentTarget.value)}
							description="This does not have to be unique"
						/>
						<Checkbox
							checked={allowTransfer}
							onChange={e =>
								setAllowTransfer(e.currentTarget.checked)
							}
							label="Allow deck transfer"
							description="If you enable this, Cardy will allow one deck to be transferred to your account. This option is automatically disabled after a successful transfer."
						/>
						<Box>
							<Button
								variant="light"
								onClick={async () => {
									const req = await RestAPI.put("/accounts", {
										body: {
											name,
											allow_transfer: allowTransfer
										},
										errors: {
											400: "Your account must have a name"
										}
									});
									req.ok
										? showSuccessNotification({
												title: "Success",
												message:
													"Account information saved"
											})
										: showErrorNotification({
												title: "Couldn't save account info",
												message: req.error
											});
								}}
							>
								Save changes
							</Button>
						</Box>
						<Divider />
						<TextInput
							data-autofocus
							label="Secret key"
							type={revealKey ? "text" : "password"}
							value={account.key}
							readOnly={true}
						/>
						<Checkbox
							checked={revealKey}
							onChange={e =>
								setRevealKey(e.currentTarget.checked)
							}
							label="Reveal key"
						/>
						<Box>
							<Button
								variant="light"
								color="red"
								onClick={() => {
									openConfirmModal({
										title: "Rotate key",
										children:
											"This will update your account's secret key, and log out all devices but this one. Do you want to proceed?",
										labels: {
											confirm: "Yes, rotate key",
											cancel: "Cancel"
										},
										confirmProps: { color: "red" },
										async onConfirm() {
											const req = await RestAPI.post(
												"/accounts/rotate",
												{}
											);
											if (req.ok) {
												setRevealKey(true);
												account.logIn(id, req.body.key);
												openConfirmModal({
													title: "Key rotated",
													labels: {
														confirm: "OK",
														cancel: ""
													},
													withCloseButton: false,
													closeOnClickOutside: false,
													closeOnEscape: false,
													cancelProps: {
														style: {
															display: "none"
														}
													},
													children: (
														<Flex
															direction="column"
															gap="sm"
														>
															<Text>
																Your secret key
																has been
																successfully
																rotated. All
																devices but this
																one have been
																logged out.
															</Text>
															<Alert
																variant="light"
																color="yellow"
																title="Important"
																icon={
																	<WarningIcon
																		size={
																			32
																		}
																		weight="fill"
																	/>
																}
															>
																Make sure to
																save your new
																secret key. If
																you lose that
																key, you lose
																access to your
																decks.
															</Alert>
														</Flex>
													)
												});
											} else {
												showErrorNotification({
													title: "Couldn't rotate key",
													message: req.error
												});
											}
										}
									});
								}}
							>
								Rotate key
							</Button>
						</Box>
						<Divider />
						<Flex gap="sm" wrap="wrap">
							<Button
								variant="light"
								onClick={async () => {
									const req = await RestAPI.get(
										"/accounts/export",
										{}
									);
									if (!req.ok) {
										showErrorNotification({
											title: "Couldn't export data",
											message: req.error
										});
									} else {
										const url = URL.createObjectURL(
											new Blob(
												[
													JSON.stringify(
														req.body,
														null,
														"\t"
													)
												],
												{ type: "application/json" }
											)
										);
										const link =
											document.createElement("a");
										link.href = url;
										link.download = `cardy-data-export-${id}-${Math.floor(Date.now() / 1000)}.json`;
										link.click();
										URL.revokeObjectURL(url);
									}
								}}
							>
								Export account data
							</Button>
							<Button
								variant="light"
								color="red"
								onClick={() => {
									openConfirmModal({
										title: "Log out",
										children:
											"Make sure that you have saved your account credentials (account ID, secret key) before logging out. If you do not have these, you have no way of logging back in!",
										labels: {
											confirm: "Log out",
											cancel: "Cancel"
										},
										confirmProps: {
											color: "red"
										},
										onConfirm() {
											account.logOut();
											setLocation("/");
											showSuccessNotification({
												title: "Logged out",
												message:
													"You have been logged out of your account."
											});
										}
									});
								}}
							>
								Log out
							</Button>
							<Button
								color="red"
								onClick={() => {
									openConfirmModal({
										title: "Delete account",
										children:
											"This will permanently delete your Cardy account, along with any decks that you own, and your play history on all decks. This process cannot be reversed. Do you want to continue?",
										labels: {
											confirm: "Yes, delete my account",
											cancel: "No, keep it"
										},
										confirmProps: {
											color: "red"
										},
										onConfirm() {
											openConfirmModal({
												title: "Delete account",
												children:
													"This is your last chance to cancel. Are you sure?",
												labels: {
													confirm: "Yes, I'm sure!",
													cancel: "Cancel"
												},
												confirmProps: {
													color: "red"
												},
												async onConfirm() {
													const req =
														await RestAPI.delete(
															"/accounts",
															{}
														);
													if (req.ok) {
														account.logOut();
														setLocation("/");
														showSuccessNotification(
															{
																title: "Success",
																message:
																	"Your Cardy account has been deleted."
															}
														);
													} else {
														showErrorNotification({
															title: "Couldn't delete account",
															message: req.error
														});
													}
												}
											});
										}
									});
								}}
							>
								Delete account
							</Button>
						</Flex>
					</>
				) : (
					<Loader />
				)}
			</Flex>
		</Box>
	);
}
