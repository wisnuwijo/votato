import knex from 'knex';
import type { Knex } from 'knex';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Get connection string
const connectionString = process.env.NEXT_PUBLIC_SUPABASE_DB_URL || process.env.SUPABASE_DB_URL || '';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false },
  },
  pool: {
    min: 0,
    max: 7,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 200,
    propagateCreateError: false,
  },
  acquireConnectionTimeout: 30000,
  searchPath: ['public'],
};

// Create and export the database instance
const db = knex(config);

// Graceful shutdown - destroy pool on process termination
if (typeof process !== 'undefined') {
  const cleanup = async () => {
    try {
      await db.destroy();
      console.log('Database pool destroyed');
    } catch (err) {
      console.error('Error destroying database pool:', err);
    }
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  process.on('beforeExit', cleanup);
}

export default db;
