import { Switch, Route, useRoute } from "wouter";
import Home from "./pages/Home";

import { AppShell, Container, MantineProvider } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import HeaderBar from "./components/HeaderBar";
import { theme } from "./utils/theme";
import { ModalsProvider } from "@mantine/modals";
import RegistrationModal from "./components/RegistrationModal";
import { Notifications } from "@mantine/notifications";
import ConfirmedRegModal from "./components/ConfirmedRegModal";
import MyAccount from "./pages/MyAccount";
import LoginModal from "./components/LoginModal";
import { useAccount } from "./stores/account";
import Dashboard from "./pages/Dashboard";

export default function App() {
	const colorScheme = useColorScheme();
	const [isMain] = useRoute("/");
	const account = useAccount();

	return (
		<>
			<MantineProvider forceColorScheme={colorScheme} theme={theme}>
				<Notifications />
				<ModalsProvider
					modals={{
						register: RegistrationModal,
						confirmRegister: ConfirmedRegModal,
						login: LoginModal
					}}
				>
					<AppShell padding="lg" header={{ height: 60 }}>
						<AppShell.Header>
							<HeaderBar />
						</AppShell.Header>
						<AppShell.Main
							style={
								isMain && !account.key
									? {
											display: "flex",
											alignItems: "center",
											justifyContent: "center"
										}
									: {}
							}
						>
							<Container size={"xl"}>
								<Switch>
									<Route
										path="/"
										component={
											!account.key ? Home : Dashboard
										}
									/>
									<Route
										path="/account"
										component={MyAccount}
									/>
								</Switch>
							</Container>
						</AppShell.Main>
					</AppShell>
				</ModalsProvider>
			</MantineProvider>
		</>
	);
}
