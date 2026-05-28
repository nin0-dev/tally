import { Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { ContextModalProps } from "@mantine/modals";
import Spin from "./Spin";
import { useState } from "react";

export default function CreateDeckModal({ context, id }: ContextModalProps) {
	const form = useForm({
		mode: "controlled",
		initialValues: {
			name: ""
		},
		validate: {
			name: v => (v.length > 0 ? null : "Name is required")
		}
    });
    const [spin, setSpin] = useState(false);

	return (
		<Box pos="relative">
            <Spin show={spin} />
			
		</Box>
	);
}
