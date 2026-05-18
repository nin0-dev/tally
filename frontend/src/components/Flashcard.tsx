import { Box, Card, Text, useComputedColorScheme } from "@mantine/core";
import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";

interface FlashcardProps extends ComponentPropsWithoutRef<"div"> {
	question: ReactNode;
	answer: ReactNode;
	subtext?: string;
}

export default function Flashcard({
	question,
	answer,
	subtext = "Press on the card to see the answer",
	...props
}: FlashcardProps) {
	const scheme = useComputedColorScheme("light");
	const [showAnswer, setShowAnswer] = useState(false);
	const [hideAll, setHideAll] = useState(false);
	return (
		<Box
			{...props}
			onClick={() => {
				setShowAnswer(!showAnswer);
				setHideAll(true);
				setTimeout(() => setHideAll(false), 100);
			}}
			style={{
				cursor: "pointer",
				...props.style
			}}
		>
			<Box
				style={{
					transition: "transform 0.3s ease",
					transform: showAnswer ? "rotateX(180deg)" : "rotateX(0deg)",
					height: "100%"
				}}
			>
				<Card
					shadow="sm"
					style={{
						transition: "transform 0.1s ease",
						transformStyle: "preserve-3d",
						display: "grid",
						height: "100%",
						transform: showAnswer
							? "rotateX(180deg)"
							: "rotateX(0deg)",
						backgroundColor:
							scheme === "light" ? "#f6f6f6" : undefined,
						backgroundImage: `${!showAnswer && !hideAll ? `linear-gradient(to right, transparent 20px, var(--mantine-color-red-${scheme === "light" ? 9 : 2}) 20px, var(--mantine-color-red-${scheme === "light" ? 9 : 2}) 22px, transparent 22px),` : ""} linear-gradient(var(--mantine-color-${scheme === "light" ? "gray-2" : "dark-7"}) 2px, transparent 2px)`,
						backgroundSize: "100% 1rem",
						backgroundPosition: "center"
					}}
				>
					<Box
						style={{
							gridArea: "1 / 1",
							placeSelf: "center",
							visibility:
								!hideAll && !showAnswer ? "visible" : "hidden"
						}}
					>
						{question}
						<Text
							size="sm"
							style={{
								color: "var(--mantine-color-dimmed)",
								textAlign: "center",
								userSelect: "none"
							}}
						>
							{subtext}
						</Text>
					</Box>
					<Box
						style={{
							gridArea: "1 / 1",
							placeSelf: "center",
							visibility:
								!hideAll && showAnswer ? "visible" : "hidden"
						}}
					>
						{answer}
					</Box>
				</Card>
			</Box>
		</Box>
	);
}
