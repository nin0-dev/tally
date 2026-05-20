import { LoadingOverlay } from "@mantine/core";

export default function Spin({ show }: { show: boolean }) {
	return (
		<LoadingOverlay
			visible={show}
			zIndex={1000}
			overlayProps={{
				radius: "md",
				backgroundOpacity: 1,
				style: {
					backgroundColor: "var(--mantine-color-body)"
				}
			}}
		/>
	);
}
