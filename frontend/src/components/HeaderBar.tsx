import { Button, Group, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";

export default function HeaderBar() {
	const isMobile = useMediaQuery("(max-width: 50em)");

	return (
		<Group
			h="100%"
			style={{
				margin: "0 20px"
			}}
		>
			<Title order={2}>Cardy</Title>

			<Button style={{ marginLeft: "auto" }} variant="outline">
				Login
			</Button>
			<Button
				onClick={() =>
					modals.openContextModal({
						modal: "register",
						title: "Register",
						fullScreen: isMobile,
						innerProps: {}
					})
				}
			>
				Register
			</Button>
		</Group>
	);
}
