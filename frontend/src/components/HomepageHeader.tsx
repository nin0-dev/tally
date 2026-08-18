import { Button, Flex, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useMobile } from "../utils/useMobile";

export default function HomepageHeader() {
	return (
		<Flex direction="column" gap="sm" align="center" style={{ marginBottom: "var(--mantine-spacing-sm)" }}>
			<Text
				fw={700}
				style={{
					fontSize: "2.5rem",
					lineHeight: "3rem",
					textAlign: "center",
					fontFamily: "Space Grotesk, sans-serif"
				}}
			>
				A simple, yet powerful, flashcard utility
			</Text>
			<Button
				size="lg"
				style={{
					margin: "var(--mantine-spacing-sm) 0",
					marginBottom: "var(--mantine-spacing-lg)"
				}}
				onClick={() =>
					modals.openContextModal({
						modal: "register",
						title: "Register",
						innerProps: {}
					})
				}
			>
				Start studying
			</Button>
		</Flex>
	);
}
