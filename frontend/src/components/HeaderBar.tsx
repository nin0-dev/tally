import { Button, Group, Title } from "@mantine/core";

export default function HeaderBar() {
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
			<Button>Register</Button>
		</Group>
	);
}
