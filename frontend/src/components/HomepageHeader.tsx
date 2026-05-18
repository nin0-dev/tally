import { Button, Flex, Text, useComputedColorScheme } from "@mantine/core";

export default function HomepageHeader() {
	const scheme = useComputedColorScheme("light");

	return (
		<Flex direction="column" gap="sm" align="center">
			<Text
				fw={700}
				style={{
					fontSize: "2.5rem",
					lineHeight: "3rem",
					textAlign: "center"
				}}
				variant="gradient"
				gradient={{
					from: `red.${scheme === "light" ? 7 : 4}`,
					to: `grape.${scheme === "light" ? 7 : 2}`,
					deg: 270
				}}
			>
				The simple, yet powerful, flashcard utility
			</Text>
			<Button
				size="lg"
				variant="gradient"
				gradient={{
					from: `pink.${scheme === "light" ? 7 : 9}`,
					to: `grape.${scheme === "light" ? 7 : 9}`,
					deg: 270
				}}
			>
				Get started now
			</Button>
		</Flex>
	);
}
