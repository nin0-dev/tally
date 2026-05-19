import { Button, Flex, Text } from "@mantine/core";
import { showRegistrationModal } from "../utils/modals";
import { useMediaQuery } from "@mantine/hooks";

export default function HomepageHeader() {
	const isMobile = useMediaQuery("(max-width: 50em)");

	return (
		<Flex
			direction="column"
			gap="sm"
			align="center"
			style={{ marginBottom: "var(--mantine-spacing-sm)" }}
		>
			<Text
				fw={700}
				style={{
					fontSize: "2.5rem",
					lineHeight: "3rem",
					textAlign: "center",
					fontFamily: "Space Grotesk, sans-serif"
				}}
			>
				The simple, yet powerful, flashcard utility
			</Text>
			<Button
				size="lg"
				style={{
					margin: "var(--mantine-spacing-sm) 0",
					marginBottom: "var(--mantine-spacing-lg)"
				}}
				onClick={() => showRegistrationModal(isMobile)}
			>
				Start studying
			</Button>
		</Flex>
	);
}
