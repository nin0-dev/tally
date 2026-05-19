import { modals } from "@mantine/modals";
import RegistrationModal from "../components/RegistrationModal";

export function showRegistrationModal(fullScreen: boolean) {
	modals.open({
		title: "Register",
		fullScreen,
		children: <RegistrationModal />
	});
}
