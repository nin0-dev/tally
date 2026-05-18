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
	fontFamily: "Instrument Sans, sans-serif",
	fontFamilyMonospace: "Geist Mono, monospace",
	primaryColor: "pink",
	colors: {
		dark: [
			"#f8f9fa",
			"#bfe2ff",
			"#9fbdcf",
			"#7b8ba6",
			"#526787",
			"#4e596b",
			"#465369",
			"#363f4d",
			"#202630",
			"#161c26"
		],
		gray: [
			"#e4ecf5",
			"#dfeaf5",
			"#e9ecef",
			"#cfdce8",
			"#bacad9",
			"#95a9bd",
			"#677c91",
			"#434f5c",
			"#323940",
			"#212529"
		]
	}
});

export default function App() {
	const colorScheme = useColorScheme();

	return (
		<>
			<MantineProvider forceColorScheme={colorScheme} theme={theme}>
				<AppShell padding="lg" header={{ height: 60 }}>
					<AppShell.Header>
						<HeaderBar />
					</AppShell.Header>
					<AppShell.Main>
						<Container size={"xl"}>
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
