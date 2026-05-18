import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		allowedHosts: ["nin0-mac-mini.buri-roach.ts.net"]
	}
});
