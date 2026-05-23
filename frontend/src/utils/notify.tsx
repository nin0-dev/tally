import { notifications } from "@mantine/notifications";
import { CheckFatIcon, WarningCircleIcon } from "@phosphor-icons/react";

export function showErrorNotification({
	title,
	message
}: {
	title: string;
	message: string;
}) {
	notifications.show({
		title,
		message,
		color: "red",
		icon: <WarningCircleIcon weight="fill" />
	});
}

export function showSuccessNotification({
	title,
	message
}: {
	title: string;
	message: string;
}) {
	notifications.show({
		title,
		message,
		color: "green",
		icon: <CheckFatIcon weight="fill" />
	});
}
