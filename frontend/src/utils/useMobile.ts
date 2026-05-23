import { useMediaQuery } from "@mantine/hooks";

export function useMobile() {
	const isMobile = useMediaQuery("(max-width: 50em)");
	return isMobile;
}
