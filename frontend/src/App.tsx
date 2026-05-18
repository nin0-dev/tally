import { Switch, Route } from "wouter";
import Home from "./pages/Home";
import "@mantine/core/styles.css";

import {
	AppShell,
	Container,
	createTheme,
	MantineProvider
} from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import HeaderBar from "./components/HeaderBar";

const theme = createTheme({
	defaultRadius: "sm",
	primaryColor: "pink"
});

export default function App() {
	const colorScheme = useColorScheme();

	return (
		<>
			<MantineProvider forceColorScheme={colorScheme} theme={theme}>
				<AppShell padding="xl" header={{ height: 60 }}>
					<AppShell.Header>
						<HeaderBar />
					</AppShell.Header>
					<AppShell.Main>
						<Container>
							<Switch>
								<Route path="/" component={Home} />
							</Switch>
						</Container>
					</AppShell.Main>
				</AppShell>
			</MantineProvider>
		</>
	);
}
