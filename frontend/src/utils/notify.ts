import { notifications } from "@mantine/notifications";

export function showErrorNotification({
	title,
	message
}: {
	title: string;
	message: string;
}) {
	notifications.show({ title, message, color: "red" });
}
