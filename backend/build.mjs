import * as esbuild from "esbuild";

await esbuild.build({
	entryPoints: ["src/index.ts"],
	bundle: true,
	outfile: "dist/index.cjs",
	platform: "node",
	external: [
		"bun:sqlite",
		"kysely-bun-sqlite",
		"@libsql/kysely-libsql",
		"mysql2",
		"tarn",
		"tedious",
		"@tediousjs/connection-string",
		"better-sqlite3"
	]
});
