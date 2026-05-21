import { Button, Group, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useAccount } from "../stores/account";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";

export default function HeaderBar() {
	const isMobile = useMediaQuery("(max-width: 50em)");
	const account = useAccount();

	return (
		<Group
			h="100%"
			style={{
				margin: "0 20px"
			}}
		>
			<Title order={2}>Cardy</Title>

			{!account.key ? (
				<>
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
				</>
			) : (
				<Button>My account</Button>
			)}
		</Group>
	);
}
