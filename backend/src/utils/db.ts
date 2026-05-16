import { Kysely, sql, SqliteDialect } from "kysely";
import SQLite from "better-sqlite3";
import { type DB } from "kysely-codegen";

const dialect = new SqliteDialect({
	database: new SQLite("database.db")
});

export const db = new Kysely<DB>({
	dialect
});

sql`PRAGMA foreign_keys = ON;`.execute(db);
