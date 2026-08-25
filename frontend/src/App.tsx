import { Switch, Route, useRoute } from "wouter";
import Home from "./pages/Home";

import { AppShell, Container, Loader, MantineProvider } from "@mantine/core";
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
import CreateDeckModal from "./components/CreateDeckModal";
import RenameDeckModal from "./components/RenameDeckModal";
import DeckHome from "./pages/DeckHome";
import { useEffect, useState } from "react";
import { RestAPI } from "./utils/RestAPI";
import ManageAccessModal from "./components/ManageAccessModal";
import TransferOwnershipModal from "./components/TransferOwnershipModal";
import DeleteDeckModal from "./components/DeleteDeckModal";

export default function App() {
	const colorScheme = useColorScheme();
	const [isMain] = useRoute("/");
	const account = useAccount();
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		(async () => {
			if (!document.cookie.includes("authed=1")) return void setLoading(false);

			const req = await RestAPI.get("/accounts", {});
			if (req.ok) {
				useAccount.getState().logIn(req.body.id, req.body.name);
			}
			setLoading(false);
		})();
	}, []);

	return (
		<>
			<MantineProvider forceColorScheme={colorScheme} theme={theme}>
				<Notifications />
				<ModalsProvider
					modals={{
						register: RegistrationModal,
						confirmRegister: ConfirmedRegModal,
						login: LoginModal,
						createDeck: CreateDeckModal,
						renameDeck: RenameDeckModal,
						manageAccess: ManageAccessModal,
						transferOwnership: TransferOwnershipModal,
						deleteDeck: DeleteDeckModal
					}}
				>
					<AppShell padding="lg" header={{ height: 60 }}>
						<AppShell.Header>
							<HeaderBar />
						</AppShell.Header>
						<AppShell.Main
							style={
								isMain && !account.accountID
									? {
											display: "flex",
											alignItems: "center",
											justifyContent: "center"
										}
									: {}
							}
						>
							<Container size={"xl"}>
								{loading ? (
									<Loader mt="lg" />
								) : (
									<Switch>
										<Route path="/" component={!account.accountID ? Home : Dashboard} />
										<Route path="/account" component={MyAccount} />
										<Route path="/deck/:id" component={DeckHome} />
									</Switch>
								)}
							</Container>
						</AppShell.Main>
					</AppShell>
				</ModalsProvider>
			</MantineProvider>
		</>
	);
}
