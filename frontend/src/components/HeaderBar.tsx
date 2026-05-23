import { Button, Group, Title } from "@mantine/core";
import { openContextModal } from "@mantine/modals";
import { useAccount } from "../stores/account";
import { Link } from "wouter";

export default function HeaderBar() {
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
					<Button
						style={{ marginLeft: "auto" }}
						variant="outline"
						onClick={() => {
							openContextModal({
								modal: "login",
								title: "Login",
								innerProps: {}
							});
						}}
					>
						Login
					</Button>
					<Button
						onClick={() =>
							openContextModal({
								modal: "register",
								title: "Register",
								innerProps: {}
							})
						}
					>
						Register
					</Button>
				</>
			) : (
				<Link href="/account" style={{ marginLeft: "auto" }}>
					<Button>My account</Button>
				</Link>
			)}
		</Group>
	);
}
