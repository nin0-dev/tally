import { Kysely, sql, SqliteDialect } from "kysely";
import SQLite from "better-sqlite3";
import { type DB } from "kysely-codegen";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { loggerInstance } from "../index.js";

const rawDb = new SQLite(process.env.DATABASE_URL);
const dialect = new SqliteDialect({
	database: rawDb
});

export const db = new Kysely<DB>({
	dialect
});

rawDb.pragma("foreign_keys = ON;");
rawDb.pragma("journal_mode = WAL;");

export function runMigrations() {
	const ver: number = rawDb.pragma("user_version", {
		simple: true
	}) as number;
	const migrationsPath = process.env.MIGRATIONS_PATH ?? "sql/";

	const migrationRegex = /^(\d{4})_([a-z_]+)\.sql$/;
	const migrationsToApply = readdirSync(migrationsPath)
		.filter(f => migrationRegex.test(f))
		.map(f => ({
			...(() => {
				const matches = f.match(migrationRegex)!;
				return {
					id: Number(matches[1]!),
					name: matches[2]!
				};
			})(),
			content: readFileSync(join(migrationsPath, f), "utf8")
		}))
		.sort((m1, m2) => m1.id - m2.id)
		.filter(m => m.id > ver);

	for (const migration of migrationsToApply) {
		loggerInstance.debug(
			`Applying migration ${migration.id} ~ ${migration.name}`
		);
		rawDb.transaction(() => {
			rawDb.exec(migration.content);
		})();
		rawDb.pragma(`user_version = ${migration.id}`);
	}
}
