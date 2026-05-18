import { Text } from "@mantine/core";

export default function Home() {
	return (
		<div>
			<Text
				fw={700}
				style={{
					fontSize: "2.5rem",
					lineHeight: "3rem",
					textAlign: "center"
				}}
				variant="gradient"
				gradient={{
					from: "rgb(255, 168, 191)",
					to: "rgb(201, 148, 255)",
					deg: 270
				}}
			>
				The simple, yet powerful, flashcard utility
			</Text>
		</div>
	);
}
