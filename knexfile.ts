import type { Knex } from "knex";
import * as dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const config: { [key: string]: Knex.Config } = {
    development: {
        client: "pg",
        connection: {
            connectionString: process.env.SUPABASE_DB_URL,
            ssl: { rejectUnauthorized: false },
        },
        searchPath: ["public"],
        migrations: {
            directory: "./migrations",
            extension: "ts",
            schemaName: "public",
        },
    },
};

module.exports = config;
