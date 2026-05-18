import { createTheme } from "@mantine/core";

export const theme = createTheme({
	defaultRadius: "md",
	fontFamily: "Instrument Sans, sans-serif",
	fontFamilyMonospace: "Geist Mono, monospace",
	primaryColor: "pink",
	colors: {
		dark: [
			"#f8f9fa",
			"#b3c1c9",
			"#9fbdcf",
			"#9297a1",
			"#575f6b",
			"#50545c",
			"#353940",
			"#272d36",
			"#141a21",
			"#040d17"
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
