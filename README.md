# Votato

A Next.js application for managing feature requests and voting.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

This project uses Knex.js for database migrations with Supabase PostgreSQL.

### Environment Variables

Create a `.env.local` file in the root directory with your Supabase connection string:

```env
SUPABASE_DB_URL=your_supabase_connection_string
```

### Migration Commands

**Create a new migration:**
```bash
npm run migrate:make <migration_name>
```

Example:
```bash
npm run migrate:make create_users_table
```

**Run all pending migrations:**
```bash
npm run migrate:latest
```

**Rollback the last batch of migrations:**
```bash
npm run migrate:rollback
```

**Check migration status:**
```bash
npm run knex -- migrate:status
```

### Migration Files

Migration files are located in the `./migrations` directory and use TypeScript.

Example migration structure:

```typescript
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('table_name', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('table_name');
}
```

### Configuration

The database configuration is in [knexfile.ts](knexfile.ts). It uses CommonJS exports to be compatible with the Knex CLI.

**Note:** When running Knex commands directly (not through npm scripts), you need to set the TypeScript compiler options:

```bash
TS_NODE_COMPILER_OPTIONS='{"module":"commonjs"}' npx knex <command>
```

However, it's recommended to use the npm scripts instead for convenience.

## Tech Stack

- **Framework:** Next.js 15 with Turbopack
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Migration Tool:** Knex.js
- **Styling:** Tailwind CSS
- **UI Library:** React 19
