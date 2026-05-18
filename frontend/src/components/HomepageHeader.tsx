import { Button, Flex, Text, useComputedColorScheme } from "@mantine/core";

export default function HomepageHeader() {
	const scheme = useComputedColorScheme("light");

	return (
		<Flex direction="column" gap="sm" align="center">
			<Text
				ff="monospace"
				fw={700}
				style={{
					fontSize: "2.5rem",
					lineHeight: "3rem",
					textAlign: "center"
				}}
			>
				The simple, yet powerful, flashcard utility
			</Text>
			<Button size="lg">Start studying</Button>
		</Flex>
	);
}
