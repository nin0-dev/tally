import { Switch, Route, useRoute } from "wouter";
import Home from "./pages/Home";
import "@mantine/core/styles.css";

import { AppShell, Container, MantineProvider } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import HeaderBar from "./components/HeaderBar";
import { theme } from "./utils/theme";
import { ModalsProvider } from "@mantine/modals";

export default function App() {
	const colorScheme = useColorScheme();
	const isMain = useRoute("/");

	return (
		<>
			<MantineProvider forceColorScheme={colorScheme} theme={theme}>
				<ModalsProvider>
					<AppShell padding="lg" header={{ height: 60 }}>
						<AppShell.Header>
							<HeaderBar />
						</AppShell.Header>
						<AppShell.Main
							style={
								isMain
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
									<Route path="/" component={Home} />
								</Switch>
							</Container>
						</AppShell.Main>
					</AppShell>
				</ModalsProvider>
			</MantineProvider>
		</>
	);
}
