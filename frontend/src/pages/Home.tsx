import {
	Box,
	Divider,
	Grid,
	Text,
	Title,
	useComputedColorScheme
} from "@mantine/core";
import Flashcard from "../components/Flashcard";
import { Link } from "wouter";
import HomepageHeader from "../components/HomepageHeader";

function SellingPoint({
	main,
	desc,
	subtext
}: {
	main: string;
	desc: string;
	subtext: string;
}) {
	return (
		<Flashcard
			style={{ height: "100%" }}
			question={
				<Text
					size="xl"
					style={{
						textAlign: "center",
						fontWeight: 500,
						userSelect: "none"
					}}
				>
					{main}
				</Text>
			}
			answer={
				<Text
					style={{
						userSelect: "none"
					}}
				>
					{desc}
				</Text>
			}
			subtext={subtext}
		/>
	);
}

export default function Home() {
	return (
		<Box>
			<HomepageHeader />
			<Divider style={{ margin: "15px 0" }} />
			<Title order={2} style={{ marginBottom: "15px" }}>
				Why use Cardy?
			</Title>
			<Grid>
				<Grid.Col span={{ base: 12, md: 6 }}>
					<SellingPoint
						main="Learns from you"
						desc="Every time you study your deck, Cardy learns your pain points and your successes and adapts your future study sessions to review what you need to study."
						subtext="This is a flashcard. Click it to see more details!"
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 6 }}>
					<SellingPoint
						main="Cross-platform"
						desc="Cardy works on all your favourite devices: computer, phone, Android or iOS!"
						subtext="This is also a flashcard."
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 6 }}>
					<SellingPoint
						main="Private by design"
						desc="Cardy is private by design: you do not need to hand over your email or any personal information to use it. Instead, you use a generated key to login and sync your decks across devices."
						subtext=""
					/>
				</Grid.Col>
				<Grid.Col span={{ base: 12, md: 6 }}>
					<SellingPoint
						main="Fully customisable"
						desc="Easily add images or other formatting to your flashcards, without paying a single dollar. You can also share your decks with other people, simply by sending them a link."
						subtext=""
					/>
				</Grid.Col>
			</Grid>
			<Divider style={{ margin: "15px 0" }} />
			<Text
				style={{
					lineHeight: "1.6rem"
				}}
			>
				Not enough? Signing up will take ten seconds and you will be
				able to make a flashcard deck to see Cardy in action, and
				determine if this is the right tool for you.
				<br />
				<br />
				Accounts are only used to sync your decks across devices,
				absolutely no personal information is collected.
				<br />
				Cardy is also <Link href="/source">open-source</Link>.
			</Text>
		</Box>
	);
}
